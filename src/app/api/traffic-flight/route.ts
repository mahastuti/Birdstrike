import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { Prisma } from '@prisma/client';

export async function POST(request: NextRequest) {
  try {
    const form = await request.formData();
    const csvFile = form.get('csvFile') as File | null;

    if (!csvFile) {
      return NextResponse.json(
        { success: false, message: 'File CSV diperlukan' },
        { status: 400 }
      );
    }

    const text = await csvFile.text();
    const lines = text.split(/\r?\n/).filter(l => l.trim() !== '');
    if (lines.length < 2) {
      return NextResponse.json(
        { success: false, message: 'CSV harus memiliki header dan minimal 1 baris data' },
        { status: 400 }
      );
    }

    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
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

    const data: Prisma.TrafficFlightCreateManyInput[] = [];
    for (let i = 1; i < lines.length; i++) {
      const raw = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
      if (raw.length < headers.length) continue;
      const row: Record<string, string | null> = {};
      headers.forEach((h, idx) => { row[h] = raw[idx] ?? null; });

      if (!row.block_on || !row.block_off) continue; // required by schema

      const noParsed = row.no != null && row.no.trim() !== '' ? Number.parseInt(row.no, 10) : null;
      data.push({
        no: Number.isNaN(noParsed as number) ? null : noParsed,
        act_type: row.act_type ?? null,
        reg_no: row.reg_no ?? null,
        opr: row.opr ?? null,
        flight_number_origin: row.flight_number_origin ?? null,
        flight_number_dest: row.flight_number_dest ?? null,
        ata: row.ata ?? null,
        block_on: row.block_on as string,
        block_off: row.block_off as string,
        atd: row.atd ?? null,
        ground_time: row.ground_time ?? null,
        org: row.org ?? null,
        des: row.des ?? null,
        ps: row.ps ?? null,
        runway: row.runway ?? null,
        avio_a: row.avio_a ?? null,
        avio_d: row.avio_d ?? null,
        f_stat: row.f_stat ?? null,
        bulan: row.bulan ?? null,
        tahun: row.tahun ?? null,
      });
    }

    if (!data.length) {
      return NextResponse.json(
        { success: false, message: 'Tidak ada baris valid untuk diimport' },
        { status: 400 }
      );
    }

    const result = await prisma.trafficFlight.createMany({ data, skipDuplicates: true });
    return NextResponse.json({ success: true, message: `Berhasil import ${result.count} baris`, count: result.count }, { status: 201 });
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
