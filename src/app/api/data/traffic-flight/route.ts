import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type SortOrder = 'asc' | 'desc';

type TrafficFlightUpdate = Partial<{
  no: string | null;
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
}>;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';

    const sortBy = (searchParams.get('sortBy') || 'id');
    const sortOrder: SortOrder = (searchParams.get('sortOrder') === 'asc' ? 'asc' : 'desc');

    const allowedSort = new Set(['id','no','act_type','reg_no','opr','flight_number_origin','flight_number_dest','ata','block_on','block_off','atd','ground_time','org','des','ps','runway','avio_a','avio_d','f_stat','bulan','tahun']);
    const orderBy: Record<string, SortOrder> = allowedSort.has(sortBy) ? { [sortBy]: sortOrder } : { id: 'desc' };

    const skip = (page - 1) * limit;

    const where = {
      ...(search && {
        OR: [
          { no: { contains: search, mode: 'insensitive' as const } },
          { act_type: { contains: search, mode: 'insensitive' as const } },
          { reg_no: { contains: search, mode: 'insensitive' as const } },
          { opr: { contains: search, mode: 'insensitive' as const } },
          { flight_number_origin: { contains: search, mode: 'insensitive' as const } },
          { flight_number_dest: { contains: search, mode: 'insensitive' as const } },
          { org: { contains: search, mode: 'insensitive' as const } },
          { des: { contains: search, mode: 'insensitive' as const } },
          { runway: { contains: search, mode: 'insensitive' as const } },
          { f_stat: { contains: search, mode: 'insensitive' as const } },
          { bulan: { contains: search, mode: 'insensitive' as const } },
          { tahun: { contains: search, mode: 'insensitive' as const } },
        ]
      })
    };

    const [data, total] = await Promise.all([
      prisma.trafficFlight.findMany({
        where,
        orderBy,
        skip,
        take: limit,
      }),
      prisma.trafficFlight.count({ where })
    ]);

    const serialize = (value: unknown): unknown => {
      if (value === null || value === undefined) return value;
      if (typeof value === 'bigint') return value.toString();
      if (value instanceof Date) return value.toISOString();
      if (Array.isArray(value)) return value.map(serialize);
      if (typeof value === 'object') {
        const out: Record<string, unknown> = {};
        for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
          out[k] = serialize(v);
        }
        return out;
      }
      return value;
    };

    const safeData = serialize(data);

    return NextResponse.json({
      success: true,
      data: safeData,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching traffic flight data:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'ID is required' },
        { status: 400 }
      );
    }

    await prisma.trafficFlight.delete({
      where: { id: BigInt(id) }
    });

    return NextResponse.json({
      success: true,
      message: 'Data berhasil dihapus'
    });
  } catch (error) {
    console.error('Error deleting traffic flight data:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete data' },
      { status: 500 }
    );
  }
}

export async function PATCH() {
  return NextResponse.json(
    { success: false, message: 'Restore tidak didukung untuk data Traffic Flight' },
    { status: 400 }
  );
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, message: 'ID is required' }, { status: 400 });
    }
    const body = await request.json();
    const b = body as Record<string, unknown>;

    const fields = ['no','act_type','reg_no','opr','flight_number_origin','flight_number_dest','ata','block_on','block_off','atd','ground_time','org','des','ps','runway','avio_a','avio_d','f_stat','bulan','tahun'] as const;
    const data: TrafficFlightUpdate = {};
    for (const f of fields) {
      if (!(f in b)) continue;
      const v = (b as Record<string, unknown>)[f];
      if (f === 'block_on' || f === 'block_off') {
        if (typeof v === 'string') data[f] = v;
        else if (v != null) data[f] = String(v);
        // if null/undefined, skip to avoid assigning null to non-nullable fields
      } else {
        data[f] = v == null ? null : String(v);
      }
    }

    const updated = await prisma.trafficFlight.update({ where: { id: BigInt(id) }, data });

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

    return NextResponse.json({ success: true, data: serialize(updated) });
  } catch (error) {
    console.error('Error updating traffic flight:', error);
    return NextResponse.json({ success: false, message: 'Failed to update data' }, { status: 500 });
  }
}
