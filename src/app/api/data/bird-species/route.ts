import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const showDeleted = searchParams.get('showDeleted') === 'true';

    const sortBy = (searchParams.get('sortBy') || 'createdAt');
    const sortOrder = (searchParams.get('sortOrder') === 'asc' ? 'asc' : 'desc');

    const allowedSort = new Set(['id','longitude','latitude','lokasi','titik','tanggal','jam','waktu','cuaca','jenis_burung','nama_ilmiah','jumlah_burung','createdAt']);
    const orderBy: any = allowedSort.has(sortBy) ? { [sortBy]: sortOrder } : { createdAt: 'desc' };

    const skip = (page - 1) * limit;

    const where = {
      deletedAt: showDeleted ? { not: null } : null,
      ...(search && {
        OR: [
          { jenis_burung: { contains: search, mode: 'insensitive' as const } },
          { nama_ilmiah: { contains: search, mode: 'insensitive' as const } },
          { lokasi: { contains: search, mode: 'insensitive' as const } },
          { titik: { contains: search, mode: 'insensitive' as const } },
        ]
      })
    };

    const [data, total] = await Promise.all([
      prisma.burung_bio.findMany({
        where,
        orderBy,
        skip,
        take: limit,
      }),
      prisma.burung_bio.count({ where })
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
    console.error('Error fetching bird species data:', error);
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

    await prisma.burung_bio.update({
      where: { id: BigInt(id) },
      data: { deletedAt: new Date() }
    });

    return NextResponse.json({
      success: true,
      message: 'Data berhasil dihapus'
    });
  } catch (error) {
    console.error('Error deleting bird species data:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete data' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const action = searchParams.get('action');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'ID is required' },
        { status: 400 }
      );
    }

    if (action === 'restore') {
      await prisma.burung_bio.update({
        where: { id: BigInt(id) },
        data: { deletedAt: null }
      });

      return NextResponse.json({
        success: true,
        message: 'Data berhasil dipulihkan'
      });
    }

    return NextResponse.json(
      { success: false, message: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error restoring bird species data:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to restore data' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, message: 'ID is required' }, { status: 400 });
    }
    const body = await request.json();

    const mapWaktu = (time: string | null | undefined): string | null => {
      if (!time) return null;
      const hour = Number(String(time).split(':')[0]);
      if (hour >= 0 && hour <= 3) return 'Dini Hari';
      if (hour >= 3 && hour <= 8) return 'Pagi';
      if (hour >= 8 && hour <= 13) return 'Siang';
      if (hour >= 13 && hour <= 18) return 'Sore';
      return 'Malam';
    };

    const data: any = {};
    if ('longitude' in body) data.longitude = body.longitude;
    if ('latitude' in body) data.latitude = body.latitude;
    if ('lokasi' in body) data.lokasi = body.lokasi;
    if ('titik' in body) data.titik = body.titik;
    if ('tanggal' in body) data.tanggal = body.tanggal ? new Date(body.tanggal) : null;
    if ('jam' in body) data.jam = body.jam ? new Date(`1970-01-01T${body.jam}:00.000Z`) : null;
    if ('waktu' in body || 'jam' in body) data.waktu = body.waktu ?? mapWaktu(body.jam);
    if ('cuaca' in body) data.cuaca = body.cuaca;
    if ('jenis_burung' in body) data.jenis_burung = body.jenis_burung;
    if ('nama_ilmiah' in body) data.nama_ilmiah = body.nama_ilmiah;
    if ('jumlah_burung' in body) data.jumlah_burung = body.jumlah_burung ? parseInt(body.jumlah_burung) : null;
    if ('keterangan' in body) data.keterangan = body.keterangan;
    if ('dokumentasi' in body) data.dokumentasi = body.dokumentasi ?? null;

    const updated = await prisma.burung_bio.update({ where: { id: BigInt(id) }, data });

    const serialize = (value: unknown): any => {
      if (value === null || value === undefined) return value;
      if (typeof value === 'bigint') return value.toString();
      if (value instanceof Date) return value.toISOString();
      if (Array.isArray(value)) return value.map(serialize);
      if (typeof value === 'object') {
        const out: Record<string, any> = {};
        for (const [k, v] of Object.entries(value as Record<string, any>)) out[k] = serialize(v);
        return out;
      }
      return value;
    };

    return NextResponse.json({ success: true, data: serialize(updated) });
  } catch (error) {
    console.error('Error updating bird species:', error);
    return NextResponse.json({ success: false, message: 'Failed to update data' }, { status: 500 });
  }
}
