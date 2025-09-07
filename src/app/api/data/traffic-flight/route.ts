import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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

    // Robust CSV parser (supports quoted commas and newlines)
    const parseCsv = (input: string): string[][] => {
      const rows: string[][] = [];
      let cur: string[] = [];
      let field = '';
      let i = 0;
      let inQuotes = false;
      while (i < input.length) {
        const ch = input[i];
        if (inQuotes) {
          if (ch === '"') {
            if (input[i + 1] === '"') { field += '"'; i += 2; continue; }
            inQuotes = false; i++; continue;
          }
          field += ch; i++; continue;
        } else {
          if (ch === '"') { inQuotes = true; i++; continue; }
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

    const headers = rows[0].map(h => h.replace(/"/g, ''));
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
      if (!raw || raw.length < headers.length) continue;
      const row: Row = {};
      headers.forEach((h, idx) => { row[h] = (raw[idx] ?? '').replace(/\uFEFF/g, '') || null; });
      if (!row.block_on || !row.block_off) continue; // required by schema
      inputRows.push(row);
    }

    if (!inputRows.length) {
      return NextResponse.json(
        { success: false, message: 'Tidak ada baris valid untuk diimport' },
        { status: 400 }
      );
    }

    // Group by (bulan,tahun)
    const groupKey = (r: Row) => `${r.bulan ?? ''}__${r.tahun ?? ''}`;
    const groups = new Map<string, Row[]>();
    for (const r of inputRows) {
      const key = groupKey(r);
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(r);
    }

    // Check existing per group
    const groupStats: { key: string; bulan: string | null; tahun: string | null; existing: number; incoming: number }[] = [];
    for (const [key, arr] of groups) {
      const [bulan, tahun] = key.split('__');
      const existing = await prisma.trafficFlight.count({ where: { bulan: bulan || null, tahun: tahun || null } });
      groupStats.push({ key, bulan: bulan || null, tahun: tahun || null, existing, incoming: arr.length });
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
        await prisma.trafficFlight.deleteMany({ where: { bulan: g.bulan, tahun: g.tahun } });
      }
    }

    // Reindex "no" per group starting from 1
    const data: TrafficFlightCreate[] = [];
    for (const [key, arr] of groups) {
      let idx = 1;
      for (const r of arr) {
        data.push({
          no: idx++,
          act_type: r.act_type ?? null,
          reg_no: r.reg_no ?? null,
          opr: r.opr ?? null,
          flight_number_origin: r.flight_number_origin ?? null,
          flight_number_dest: r.flight_number_dest ?? null,
          ata: r.ata ?? null,
          block_on: r.block_on as string,
          block_off: r.block_off as string,
          atd: r.atd ?? null,
          ground_time: r.ground_time ?? null,
          org: r.org ?? null,
          des: r.des ?? null,
          ps: r.ps ?? null,
          runway: r.runway ?? null,
          avio_a: r.avio_a ?? null,
          avio_d: r.avio_d ?? null,
          f_stat: r.f_stat ?? null,
          bulan: (key.split('__')[0] || null),
          tahun: (key.split('__')[1] || null),
        });
      }
    }

    if (!data.length) {
      return NextResponse.json(
        { success: false, message: 'Tidak ada baris setelah diproses' },
        { status: 400 }
      );
    }

    const result = await prisma.trafficFlight.createMany({ data, skipDuplicates: false });
    return NextResponse.json({ success: true, message: `Berhasil import ${result.count} baris`, count: result.count, replaced: replace && conflicts.length ? conflicts.map(c => ({ bulan: c.bulan, tahun: c.tahun, deleted: c.existing })) : [] }, { status: 201 });
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
