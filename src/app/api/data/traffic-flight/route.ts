import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const showDeleted = searchParams.get('showDeleted') === 'true';

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
        orderBy: { id: 'desc' },
        skip,
        take: limit,
      }),
      prisma.trafficFlight.count({ where })
    ]);

    const serialize = (value: unknown): any => {
      if (value === null || value === undefined) return value;
      if (typeof value === 'bigint') return value.toString();
      if (value instanceof Date) return value.toISOString();
      if (Array.isArray(value)) return value.map(serialize);
      if (typeof value === 'object') {
        const out: Record<string, any> = {};
        for (const [k, v] of Object.entries(value as Record<string, any>)) {
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
