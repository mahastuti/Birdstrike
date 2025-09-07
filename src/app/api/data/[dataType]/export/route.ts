import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Utility to serialize values for CSV
const toCsvValue = (val: unknown): string => {
  if (val === null || val === undefined) return '';
  if (typeof val === 'bigint') return val.toString();
  if (val instanceof Date) return val.toISOString();
  const s = String(val);
  const needsQuotes = /[",\n]/.test(s);
  const escaped = s.replace(/"/g, '""');
  return needsQuotes ? `"${escaped}"` : escaped;
};

const buildResponse = (csv: string, filename: string) =>
  new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store'
    }
  });

export async function GET(request: NextRequest, context: { params: Promise<{ dataType: string }> }) {
  try {
    const { dataType } = await context.params;
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const showDeleted = searchParams.get('showDeleted') === 'true';
    const sortByParam = searchParams.get('sortBy') || '';
    const sortOrderParam = searchParams.get('sortOrder') === 'asc' ? 'asc' : 'desc';

    const ts = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const timestamp = `${ts.getFullYear()}-${pad(ts.getMonth() + 1)}-${pad(ts.getDate())}_${pad(ts.getHours())}-${pad(ts.getMinutes())}-${pad(ts.getSeconds())}`;

    if (dataType === 'bird-strike') {
      const allowedSort = new Set(['id','tanggal','jam','waktu','fase','lokasi_perimeter','kategori_kejadian','airline','runway_use','komponen_pesawat','dampak_pada_pesawat','kondisi_kerusakan','tindakan_perbaikan','sumber_informasi','remark','deskripsi','jenis_pesawat','createdAt']);
      const sortBy = allowedSort.has(sortByParam) ? sortByParam : 'createdAt';
      const orderBy = { [sortBy]: sortOrderParam } as Record<string, 'asc' | 'desc'>;

      const orFilters: Record<string, unknown>[] = [];
      if (search) {
        const s = search;
        const like = (key: string) => ({ [key]: { contains: s, mode: 'insensitive' as const } });
        for (const k of [
          'waktu','fase','lokasi_perimeter','kategori_kejadian','remark','airline','runway_use','komponen_pesawat','dampak_pada_pesawat','kondisi_kerusakan','tindakan_perbaikan','sumber_informasi','deskripsi','dokumentasi','jenis_pesawat'
        ]) {
          orFilters.push(like(k));
        }
        if (/^\d+$/.test(s)) { try { orFilters.push({ id: BigInt(s) }); } catch {}
        }
        if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
          const d = new Date(s); if (!Number.isNaN(d.getTime())) orFilters.push({ tanggal: d });
        }
        if (/^\d{2}:\d{2}$/.test(s)) {
          const t = new Date(`1970-01-01T${s}:00.000Z`); if (!Number.isNaN(t.getTime())) orFilters.push({ jam: t });
        }
      }

      const where = {
        deletedAt: showDeleted ? { not: null } : null,
        ...(search && { OR: orFilters })
      };

      const rows = await prisma.birdStrike.findMany({ where, orderBy });

      const headers = [
        'tanggal','jam','waktu','fase','lokasi_perimeter','kategori_kejadian','airline','runway_use','komponen_pesawat','dampak_pada_pesawat','kondisi_kerusakan','tindakan_perbaikan','sumber_informasi','remark','deskripsi','dokumentasi','jenis_pesawat'
      ];
      const csvRows = [headers.join(',')];
      for (const r of rows) {
        const rowVals = headers.map((h) => {
          const v = (r as unknown as Record<string, unknown>)[h];
          if (v instanceof Date && (h === 'tanggal' || h === 'jam')) return toCsvValue(v.toISOString());
          return toCsvValue(v);
        });
        csvRows.push(rowVals.join(','));
      }
      return buildResponse(csvRows.join('\n'), `bird-strike_all_${timestamp}.csv`);
    }

    if (dataType === 'bird-species') {
      const allowedSort = new Set(['id','longitude','latitude','lokasi','titik','tanggal','jam','waktu','cuaca','jenis_burung','nama_ilmiah','jumlah_burung','createdAt']);
      const sortBy = allowedSort.has(sortByParam) ? sortByParam : 'createdAt';
      const orderBy = { [sortBy]: sortOrderParam } as Record<string, 'asc' | 'desc'>;

      const orFilters: Record<string, unknown>[] = [];
      if (search) {
        const s = search;
        const like = (key: string) => ({ [key]: { contains: s, mode: 'insensitive' as const } });
        for (const k of ['longitude','latitude','lokasi','titik','waktu','cuaca','jenis_burung','nama_ilmiah','keterangan','dokumentasi']) {
          orFilters.push(like(k));
        }
        const asInt = Number.parseInt(s, 10);
        if (!Number.isNaN(asInt)) { orFilters.push({ jumlah_burung: asInt }); }
        if (/^\d+$/.test(s)) { try { orFilters.push({ id: BigInt(s) }); } catch {} }
        if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
          const d = new Date(s); if (!Number.isNaN(d.getTime())) orFilters.push({ tanggal: d });
        }
        if (/^\d{2}:\d{2}$/.test(s)) {
          const t = new Date(`1970-01-01T${s}:00.000Z`); if (!Number.isNaN(t.getTime())) orFilters.push({ jam: t });
        }
      }

      const where = {
        deletedAt: showDeleted ? { not: null } : null,
        ...(search && { OR: orFilters })
      };

      const rows = await prisma.burung_bio.findMany({ where, orderBy });

      const headers = [
        'longitude','latitude','lokasi','titik','tanggal','jam','waktu','cuaca','jenis_burung','nama_ilmiah','jumlah_burung','keterangan','dokumentasi'
      ];
      const csvRows = [headers.join(',')];
      for (const r of rows) {
        const rowVals = headers.map((h) => {
          const v = (r as unknown as Record<string, unknown>)[h];
          if (v instanceof Date && (h === 'tanggal' || h === 'jam')) return toCsvValue(v.toISOString());
          return toCsvValue(v);
        });
        csvRows.push(rowVals.join(','));
      }
      return buildResponse(csvRows.join('\n'), `bird-species_all_${timestamp}.csv`);
    }

    if (dataType === 'traffic-flight') {
      const allowedSort = new Set(['id','no','act_type','reg_no','opr','flight_number_origin','flight_number_dest','ata','block_on','block_off','atd','ground_time','org','des','ps','runway','avio_a','avio_d','f_stat','bulan','tahun']);
      const sortBy = allowedSort.has(sortByParam) ? sortByParam : 'id';
      const orderBy = { [sortBy]: sortOrderParam } as Record<string, 'asc' | 'desc'>;

      const orFilters: Record<string, unknown>[] = [];
      if (search) {
        const s = search;
        const like = (key: string) => ({ [key]: { contains: s, mode: 'insensitive' as const } });
        for (const k of ['act_type','reg_no','opr','flight_number_origin','flight_number_dest','ata','block_on','block_off','atd','ground_time','org','des','ps','runway','avio_a','avio_d','f_stat','bulan','tahun']) {
          orFilters.push(like(k));
        }
        const asInt = Number.parseInt(s, 10);
        if (!Number.isNaN(asInt)) orFilters.push({ no: asInt });
      }

      const where = {
        ...(search && { OR: orFilters })
      };

      const rows = await prisma.trafficFlight.findMany({ where, ...(sortBy === 'no' ? {} : { orderBy }) });
      if (sortBy === 'no') {
        const num = (v: unknown): number => {
          if (v == null) return Number.POSITIVE_INFINITY;
          const s = String(v).trim();
          const m = s.match(/^-?\d+/);
          const n = m ? parseInt(m[0], 10) : Number.POSITIVE_INFINITY;
          return Number.isNaN(n) ? Number.POSITIVE_INFINITY : n;
        };
        type TF = { no?: unknown } & Record<string, unknown>;
        rows.sort((a: TF, b: TF) => {
          const da = num(a.no);
          const db = num(b.no);
          if (da !== db) return sortOrderParam === 'asc' ? da - db : db - da;
          const sa = (a.no ?? '').toString();
          const sb = (b.no ?? '').toString();
          return sortOrderParam === 'asc' ? sa.localeCompare(sb) : sb.localeCompare(sa);
        });
      }

      const headers = [
        'no','act_type','reg_no','opr','flight_number_origin','flight_number_dest','ata','block_on','block_off','atd','ground_time','org','des','ps','runway','avio_a','avio_d','f_stat','bulan','tahun'
      ];
      const csvRows = [headers.join(',')];
      for (const r of rows) {
        const rowVals = headers.map((h) => toCsvValue((r as unknown as Record<string, unknown>)[h]));
        csvRows.push(rowVals.join(','));
      }
      return buildResponse(csvRows.join('\n'), `traffic-flight_all_${timestamp}.csv`);
    }

    return NextResponse.json({ success: false, message: 'Invalid data type' }, { status: 400 });
  } catch (error) {
    console.error('Error exporting CSV:', error);
    return NextResponse.json({ success: false, message: 'Failed to export data' }, { status: 500 });
  }
}
