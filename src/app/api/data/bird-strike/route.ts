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

    const allowedSort = new Set(['id','tanggal','jam','waktu','fase','lokasi_perimeter','kategori_kejadian','airline','runway_use','komponen_pesawat','dampak_pada_pesawat','kondisi_kerusakan','tindakan_perbaikan','sumber_informasi','remark','deskripsi','jenis_pesawat','createdAt']);
    const orderBy: any = allowedSort.has(sortBy) ? { [sortBy]: sortOrder } : { createdAt: 'desc' };

    const skip = (page - 1) * limit;

    const where = {
      deletedAt: showDeleted ? { not: null } : null,
      ...(search && {
        OR: [
          { airline: { contains: search, mode: 'insensitive' as const } },
          { lokasi_perimeter: { contains: search, mode: 'insensitive' as const } },
          { kategori_kejadian: { contains: search, mode: 'insensitive' as const } },
          { komponen_pesawat: { contains: search, mode: 'insensitive' as const } },
        ]
      })
    };

    const [data, total] = await Promise.all([
      prisma.birdStrike.findMany({
        where,
        orderBy,
        skip,
        take: limit,
      }),
      prisma.birdStrike.count({ where })
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
    console.error('Error fetching bird strike data:', error);
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

    await prisma.birdStrike.update({
      where: { id: BigInt(id) },
      data: { deletedAt: new Date() }
    });

    return NextResponse.json({
      success: true,
      message: 'Data berhasil dihapus'
    });
  } catch (error) {
    console.error('Error deleting bird strike data:', error);
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
      await prisma.birdStrike.update({
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
    console.error('Error restoring bird strike data:', error);
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

    const data: any = {};
    if ('tanggal' in body) data.tanggal = body.tanggal ? new Date(body.tanggal) : null;
    if ('jam' in body) data.jam = body.jam ? new Date(`1970-01-01T${body.jam}:00.000Z`) : null;
    if ('waktu' in body) data.waktu = body.waktu;
    if ('fase' in body) data.fase = body.fase;
    if ('lokasi_perimeter' in body) data.lokasi_perimeter = body.lokasi_perimeter;
    if ('kategori_kejadian' in body) data.kategori_kejadian = body.kategori_kejadian;
    if ('remark' in body) data.remark = body.remark;
    if ('airline' in body) data.airline = body.airline;
    if ('runway_use' in body) data.runway_use = body.runway_use;
    if ('komponen_pesawat' in body) data.komponen_pesawat = body.komponen_pesawat;
    if ('dampak_pada_pesawat' in body) data.dampak_pada_pesawat = body.dampak_pada_pesawat;
    if ('kondisi_kerusakan' in body) data.kondisi_kerusakan = body.kondisi_kerusakan;
    if ('tindakan_perbaikan' in body) data.tindakan_perbaikan = body.tindakan_perbaikan;
    if ('sumber_informasi' in body) data.sumber_informasi = body.sumber_informasi;
    if ('deskripsi' in body) data.deskripsi = body.deskripsi;
    if ('dokumentasi' in body) data.dokumentasi = body.dokumentasi ?? null;
    if ('jenis_pesawat' in body) data.jenis_pesawat = body.jenis_pesawat;

    const updated = await prisma.birdStrike.update({ where: { id: BigInt(id) }, data });

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
    console.error('Error updating bird strike:', error);
    return NextResponse.json({ success: false, message: 'Failed to update data' }, { status: 500 });
  }
}
