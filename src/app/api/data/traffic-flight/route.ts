import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { Prisma } from '@prisma/client';

type SortOrder = 'asc' | 'desc';

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

    const headers = rows[0].map(h => h.replace(/\uFEFF/g, '').replace(/\"/g, '').trim());
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
          row[key] = (((adj[j] ?? '') as string).replace(/\uFEFF/g, '')) || null;
        }
      } else {
        headers.forEach((h, idx) => { row[h] = (((adj[idx] ?? '') as string).replace(/\uFEFF/g, '')) || null; });
      }
      row.bulan = normalizeMonth(row.bulan);
      row.tahun = normalizeYear(row.tahun);
      // Keep all rows; ensure non-null strings for required fields
      if (!row.block_on) (row as Record<string,string|null>).block_on = '';
      if (!row.block_off) (row as Record<string,string|null>).block_off = '';
      inputRows.push(row);
    }

    // Deduplicate incoming rows based on all columns except "no"
    const seen = new Set<string>();
    const deduped: Row[] = [];
    for (const r of inputRows) {
      const key = headers
        .filter(h => h !== 'no')
        .map(h => `${h}:${r[h] ?? ''}`)
        .join('|');
      if (!seen.has(key)) { seen.add(key); deduped.push(r); }
    }

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
    const sigFields = ['act_type','reg_no','opr','flight_number_origin','flight_number_dest','ata','block_on','block_off','atd','ground_time','org','des','ps','runway','avio_a','avio_d','f_stat','bulan','tahun'] as const;
    const makeSig = (obj: Record<string, string | null>): string => sigFields.map(f => `${f}:${(obj[f] ?? '').toString().trim()}`).join('|');

    const existingMap = new Map<string, Set<string>>();
    for (const key of groups.keys()) {
      const [bulanKey, tahunKey] = key.split('__');
      const alt = bulanKey ? String(Number.parseInt(bulanKey, 10)) : null;
      const where = bulanKey ? { tahun: tahunKey || null, OR: [{ bulan: bulanKey || null }, { bulan: alt }] } : { tahun: tahunKey || null, bulan: null };
      const exist = await prisma.trafficFlight.findMany({ where, select: {
        act_type: true, reg_no: true, opr: true, flight_number_origin: true, flight_number_dest: true, ata: true, block_on: true, block_off: true, atd: true,
        ground_time: true, org: true, des: true, ps: true, runway: true, avio_a: true, avio_d: true, f_stat: true, bulan: true, tahun: true
      }});
      const set = new Set<string>();
      for (const e of exist) set.add(makeSig(e as unknown as Record<string, string | null>));
      existingMap.set(key, set);
    }

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
    let skipped = 0;
    for (const [key, arr] of entries) {
      const [bulanKey, tahunKey] = key.split('__');
      const set = existingMap.get(key) ?? new Set<string>();
      for (const r of arr) {
        const sigObj: Record<string, string | null> = {
          act_type: r.act_type ?? null,
          reg_no: r.reg_no ?? null,
          opr: r.opr ?? null,
          flight_number_origin: r.flight_number_origin ?? null,
          flight_number_dest: r.flight_number_dest ?? null,
          ata: r.ata ?? null,
          block_on: r.block_on ?? null,
          block_off: r.block_off ?? null,
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
        const sig = makeSig(sigObj);
        if (set.has(sig)) { skipped++; continue; }
        set.add(sig);
        data.push({
          no: idx++,
          ...(sigObj as unknown as Omit<TrafficFlightCreate,'no'>)
        });
      }
      existingMap.set(key, set);
    }

    if (!data.length) {
      return NextResponse.json(
        { success: false, message: 'Tidak ada baris setelah diproses' },
        { status: 400 }
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const bulanFilter = (searchParams.get('bulan') || '').trim();
    const tahunFilter = (searchParams.get('tahun') || '').trim();

    const sortByParam = searchParams.get('sortBy') || '';
    const sortOrderParam: SortOrder = (searchParams.get('sortOrder') === 'asc' ? 'asc' : 'desc');

    const allowedSort = new Set(['id','no','act_type','reg_no','opr','flight_number_origin','flight_number_dest','ata','block_on','block_off','atd','ground_time','org','des','ps','runway','avio_a','avio_d','f_stat','bulan','tahun']);
    const orderBy: Record<string, SortOrder> = allowedSort.has(sortByParam) ? { [sortByParam]: sortOrderParam } : { no: 'asc' };

    const skip = (page - 1) * limit;

    const orFilters: Record<string, unknown>[] = [];
    if (search) {
      const s = search;
      const like = (key: string) => ({ [key]: { contains: s, mode: 'insensitive' as const } });
      for (const k of ['act_type','reg_no','opr','flight_number_origin','flight_number_dest','ata','block_on','block_off','atd','ground_time','org','des','ps','runway','avio_a','avio_d','f_stat','bulan','tahun']) {
        orFilters.push(like(k));
      }
      if (/^\d+$/.test(s)) {
        const asInt = Number.parseInt(s, 10);
        if (!Number.isNaN(asInt)) orFilters.push({ no: asInt });
        try { orFilters.push({ id: BigInt(s) }); } catch {}
      }
    }

    const andConds: Prisma.TrafficFlightWhereInput[] = [];
    if (search && orFilters.length) andConds.push({ OR: orFilters as unknown as Prisma.TrafficFlightWhereInput[] } as unknown as Prisma.TrafficFlightWhereInput);
    if (tahunFilter) andConds.push({ tahun: tahunFilter });
    if (bulanFilter) {
      const bulanAlt = String(Number.parseInt(bulanFilter, 10));
      andConds.push({ OR: [{ bulan: bulanFilter }, { bulan: bulanAlt }] });
    }
    const where: Prisma.TrafficFlightWhereInput = andConds.length ? { AND: andConds } : {};

    const [rows, total, distinct] = await Promise.all([
      prisma.trafficFlight.findMany({ where, orderBy, skip, take: limit }),
      prisma.trafficFlight.count({ where }),
      prisma.trafficFlight.findMany({ select: { bulan: true, tahun: true } })
    ]);

    const monthsSet = new Set<string>();
    const yearsSet = new Set<string>();
    for (const r of distinct) {
      if (r.bulan) monthsSet.add(String(r.bulan).padStart(2, '0'));
      if (r.tahun) yearsSet.add(String(r.tahun));
    }
    const months = Array.from(monthsSet).sort((a, b) => Number(a) - Number(b));
    const years = Array.from(yearsSet).sort((a, b) => Number(a) - Number(b));

    const serialize = (value: unknown): unknown => {
      if (value === null || value === undefined) return value;
      if (typeof value === 'bigint') return value.toString();
      if (value instanceof Date) return value.toISOString();
      if (Array.isArray(value)) return value.map(serialize);
      if (typeof value === 'object') {
        const out: Record<string, unknown> = {};
        for (const [k, v] of Object.entries(value as Record<string, unknown>)) out[k] = serialize(v);
        return out;
      }
      return value;
    };

    return NextResponse.json({
      success: true,
      data: serialize(rows),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      filters: { months, years }
    });
  } catch (error) {
    console.error('Error fetching traffic flight data:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal mengambil data traffic flight', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
