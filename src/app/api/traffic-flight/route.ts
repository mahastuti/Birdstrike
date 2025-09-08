import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { Prisma } from '@prisma/client';


interface TrafficFlightCreate {
  no: number | null;
  act_type: string | null;
  reg_no: string | null;
  opr: string | null;
  flight_number_origin: string | null;
  flight_number_dest: string | null;
  ata: string | null;
  block_on: string;
  block_off: string;
  atd: string | null;
  ground_time: string | null;
  org: string | null;
  des: string | null;
  ps: string | null;
  runway: string | null;
  avio_a: string | null;
  avio_d: string | null;
  f_stat: string | null;
  bulan: string | null;
  tahun: string | null;
}

export async function POST(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const replace = url.searchParams.get('replace') === 'true';

    const form = await request.formData();
    const csvFile = form.get('csvFile') as File | null;

    if (!csvFile) {
      return NextResponse.json(
        { success: false, message: 'File CSV diperlukan' },
        { status: 400 }
      );
    }

    const text = await csvFile.text();

    // Normalizers
    const normalizeMonth = (v: string | null): string | null => {
      if (!v) return null;
      const n = Number.parseInt(String(v).trim(), 10);
      if (Number.isNaN(n)) return String(v).trim();
      if (n < 1 || n > 12) return String(n);
      return String(n).padStart(2, '0');
    };
    const normalizeYear = (v: string | null): string | null => {
      if (!v) return null;
      const n = Number.parseInt(String(v).trim(), 10);
      if (Number.isNaN(n)) return String(v).trim();
      return String(n);
    };

    // Robust CSV parser (supports quoted commas and newlines)
    const parseCsv = (input: string): string[][] => {
      const rows: string[][] = [];
      let cur: string[] = [];
      let field = '';
      let i = 0;
      let inQuotes = false;
      let quoteChar: '"' | "'" | null = null;
      while (i < input.length) {
        const ch = input[i];
        if (inQuotes) {
          if (ch === quoteChar) {
            if (input[i + 1] === quoteChar) { field += quoteChar; i += 2; continue; }
            inQuotes = false; quoteChar = null; i++; continue;
          }
          field += ch; i++; continue;
        } else {
          if (ch === '"' || ch === "'") { inQuotes = true; quoteChar = ch as '"' | "'"; i++; continue; }
          if (ch === ',') { cur.push(field.trim()); field = ''; i++; continue; }
          if (ch === '\n') { cur.push(field.trim()); rows.push(cur); cur = []; field = ''; i++; continue; }
          if (ch === '\r') { i++; continue; }
          field += ch; i++;
        }
      }
      cur.push(field.trim());
      rows.push(cur);
      return rows.filter(r => r.some(c => c !== ''));
    };

    const rows = parseCsv(text);
    if (rows.length < 2) {
      return NextResponse.json(
        { success: false, message: 'CSV harus memiliki header dan minimal 1 baris data' },
        { status: 400 }
      );
    }

    const headers = rows[0].map(h => h.replace(/\uFEFF/g, '').replace(/"/g, '').trim());
    const required = [
      'no','act_type','reg_no','opr','flight_number_origin','flight_number_dest','ata','block_on','block_off','atd','ground_time','org','des','ps','runway','avio_a','avio_d','f_stat','bulan','tahun'
    ];
    const missing = required.filter(h => !headers.includes(h));
    if (missing.length) {
      return NextResponse.json(
        { success: false, message: `Header wajib hilang: ${missing.join(', ')}` },
        { status: 400 }
      );
    }

    type Row = Record<string, string | null>;
    const inputRows: Row[] = [];
    for (let i = 1; i < rows.length; i++) {
      const raw = rows[i];
      if (!raw) continue;
      // Fix for unquoted comma in ground_time like: "1 day, 8:21:00"
      const gtIdx = headers.indexOf('ground_time');
      const adj = raw.slice();
      if (gtIdx >= 0 && adj.length > headers.length) {
        while (adj.length > headers.length && gtIdx + 1 < adj.length) {
          adj[gtIdx] = `${(adj[gtIdx] ?? '').trim()}${adj[gtIdx] !== undefined ? ', ' : ','}${(adj[gtIdx + 1] ?? '').trim()}`;
          adj.splice(gtIdx + 1, 1);
        }
      }
      const row: Row = {};
      if (headers.length === required.length) {
        for (let j = 0; j < required.length; j++) {
          const key = required[j];
          row[key] = (adj[j] ?? '').toString().replace(/\uFEFF/g, '');
        }
      } else {
        headers.forEach((h, idx) => { row[h] = (adj[idx] ?? '').toString().replace(/\uFEFF/g, ''); });
      }
      row.bulan = normalizeMonth(row.bulan);
      row.tahun = normalizeYear(row.tahun);
      if (!row.block_on || !row.block_off) {
        // Ensure non-null strings for prisma schema
        row.block_on = (row.block_on ?? '') as string;
        row.block_off = (row.block_off ?? '') as string;
      }
      inputRows.push(row);
    }

    if (!inputRows.length) {
      return NextResponse.json(
        { success: false, message: 'Tidak ada baris valid untuk diimport' },
        { status: 400 }
      );
    }

    // Keep all rows; do not deduplicate within the same file
    const deduped: Row[] = inputRows;

    if (!deduped.length) {
      return NextResponse.json(
        { success: false, message: 'Tidak ada baris valid untuk diimport' },
        { status: 400 }
      );
    }

    // Group by (bulan,tahun)
    const groupKey = (r: Row) => `${r.bulan ?? ''}__${r.tahun ?? ''}`;
    const groups = new Map<string, Row[]>();
    for (const r of deduped) {
      const key = groupKey(r);
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(r);
    }

    // Check existing per group, tolerant to bulan format (e.g., "1" vs "01")
    const groupStats: { key: string; bulan: string | null; tahun: string | null; existing: number; incoming: number }[] = [];
    for (const [key, arr] of groups) {
      const [bulan, tahun] = key.split('__');
      const tn = tahun || null;
      const bn = bulan || null;
      const bulanAlt = bn ? String(Number.parseInt(bn, 10)) : null;
      const where: Prisma.TrafficFlightWhereInput = bn
        ? { tahun: tn, OR: [{ bulan: bn }, { bulan: bulanAlt }] }
        : { tahun: tn, bulan: null };
      const existing = await prisma.trafficFlight.count({ where });
      groupStats.push({ key, bulan: bn, tahun: tn, existing, incoming: arr.length });
    }

    const conflicts = groupStats.filter(g => g.existing > 0);
    if (conflicts.length && !replace) {
      return NextResponse.json(
        { success: false, needsConfirm: true, message: 'Data bulan/tahun sudah ada', conflicts },
        { status: 409 }
      );
    }

    // If replace, clear existing per group
    if (conflicts.length && replace) {
      for (const g of conflicts) {
        const alt = g.bulan ? String(Number.parseInt(String(g.bulan), 10)) : null;
        const where = g.bulan ? { tahun: g.tahun, OR: [{ bulan: g.bulan }, { bulan: alt }] } : { tahun: g.tahun, bulan: null };
        await prisma.trafficFlight.deleteMany({ where });
      }
    }

    // Build existing signatures per (bulan,tahun) to skip duplicates

    // No duplicate check against existing DB; import all rows

    // Concatenate all groups in order (tahun, then bulan), then reset and assign global ascending "no", skipping duplicates against existing
    const data: TrafficFlightCreate[] = [];
    const entries = Array.from(groups.entries()).sort(([ka], [kb]) => {
      const [ba, ta] = ka.split('__');
      const [bb, tb] = kb.split('__');
      const toNum = (s: string | undefined) => {
        const n = Number.parseInt(String(s ?? ''), 10);
        return Number.isFinite(n) && !Number.isNaN(n) ? n : Number.MAX_SAFE_INTEGER;
      };
      const tcmp = toNum(ta) - toNum(tb);
      if (tcmp !== 0) return tcmp;
      return toNum(ba) - toNum(bb);
    });
    let idx = 1;
    const skipped = 0;
    for (const [key, arr] of entries) {
      const [bulanKey, tahunKey] = key.split('__');
      for (const r of arr) {
        const sigObj: Record<string, string | null> = {
          act_type: r.act_type ?? null,
          reg_no: r.reg_no ?? null,
          opr: r.opr ?? null,
          flight_number_origin: r.flight_number_origin ?? null,
          flight_number_dest: r.flight_number_dest ?? null,
          ata: r.ata ?? null,
          block_on: (r.block_on ?? '') as string,
          block_off: (r.block_off ?? '') as string,
          atd: r.atd ?? null,
          ground_time: r.ground_time ?? null,
          org: r.org ?? null,
          des: r.des ?? null,
          ps: r.ps ?? null,
          runway: r.runway ?? null,
          avio_a: r.avio_a ?? null,
          avio_d: r.avio_d ?? null,
          f_stat: r.f_stat ?? null,
          bulan: bulanKey || null,
          tahun: tahunKey || null,
        };
        data.push({
          no: idx++,
          ...(sigObj as unknown as Omit<TrafficFlightCreate,'no'>)
        });
      }
    }

    if (!data.length) {
      return NextResponse.json(
        { success: true, message: `Tidak ada baris baru ditambahkan${skipped ? ` (lewati duplikat: ${skipped})` : ''}`, count: 0, skipped },
        { status: 201 }
      );
    }

    const result = await prisma.trafficFlight.createMany({ data, skipDuplicates: false });

    // Renumber ALL rows globally: order by tahun asc, bulan asc, then id asc
    const all = await prisma.trafficFlight.findMany({ select: { id: true, bulan: true, tahun: true }, orderBy: { id: 'asc' } });
    const toNum = (v: string | null | undefined) => {
      const n = Number.parseInt(String(v ?? ''), 10);
      return Number.isFinite(n) && !Number.isNaN(n) ? n : Number.MAX_SAFE_INTEGER;
    };
    const sorted = all.sort((a, b) => {
      const ty = toNum(a.tahun) - toNum(b.tahun);
      if (ty !== 0) return ty;
      const tm = toNum(a.bulan) - toNum(b.bulan);
      if (tm !== 0) return tm;
      return Number(a.id) - Number(b.id);
    });
    const batchSize = 200;
    for (let i = 0; i < sorted.length; i += batchSize) {
      const chunk = sorted.slice(i, i + batchSize);
      await prisma.$transaction(
        chunk.map((row, idx) => prisma.trafficFlight.update({ where: { id: row.id as unknown as bigint }, data: { no: i + idx + 1 } }))
      );
    }

    return NextResponse.json({ success: true, message: `Berhasil import ${result.count} baris${skipped ? ` (lewati duplikat: ${skipped})` : ''}`, count: result.count, skipped, replaced: replace && conflicts.length ? conflicts.map(c => ({ bulan: c.bulan, tahun: c.tahun, deleted: c.existing })) : [] }, { status: 201 });
  } catch (error) {
    console.error('Error processing CSV:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memproses CSV', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const data = await prisma.trafficFlight.findMany({ orderBy: { id: 'desc' } });
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching traffic flight data:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal mengambil data traffic flight', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
