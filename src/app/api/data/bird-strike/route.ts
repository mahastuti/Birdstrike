import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type SortOrder = 'asc' | 'desc';

type BirdStrikeUpdate = Partial<{
  tanggal: Date | null;
  jam: Date | null;
  waktu: string | null;
  fase: string | null;
  lokasi_perimeter: string | null;
  kategori_kejadian: string | null;
  remark: string | null;
  airline: string | null;
  runway_use: string | null;
  komponen_pesawat: string | null;
  dampak_pada_pesawat: string | null;
  kondisi_kerusakan: string | null;
  tindakan_perbaikan: string | null;
  sumber_informasi: string | null;
  deskripsi: string | null;
  dokumentasi: string | null;
  jenis_pesawat: string | null;
}>;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const showDeleted = searchParams.get('showDeleted') === 'true';

    const sortBy = (searchParams.get('sortBy') || 'createdAt');
    const sortOrder: SortOrder = (searchParams.get('sortOrder') === 'asc' ? 'asc' : 'desc');

    const allowedSort = new Set(['id','tanggal','jam','waktu','fase','lokasi_perimeter','kategori_kejadian','airline','runway_use','komponen_pesawat','dampak_pada_pesawat','kondisi_kerusakan','tindakan_perbaikan','sumber_informasi','remark','deskripsi','jenis_pesawat','createdAt']);
    const orderBy: Record<string, SortOrder> = allowedSort.has(sortBy) ? { [sortBy]: sortOrder } : { createdAt: 'desc' };

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
    const b = body as Record<string, unknown>;

    const data: BirdStrikeUpdate = {};
    if ('tanggal' in b) data.tanggal = b.tanggal ? new Date(String(b.tanggal)) : null;
    if ('jam' in b) data.jam = b.jam ? new Date(`1970-01-01T${String(b.jam)}:00.000Z`) : null;
    if ('waktu' in b) data.waktu = b.waktu as string | null;
    if ('fase' in b) data.fase = b.fase as string | null;
    if ('lokasi_perimeter' in b) data.lokasi_perimeter = b.lokasi_perimeter as string | null;
    if ('kategori_kejadian' in b) data.kategori_kejadian = b.kategori_kejadian as string | null;
    if ('remark' in b) data.remark = b.remark as string | null;
    if ('airline' in b) data.airline = b.airline as string | null;
    if ('runway_use' in b) data.runway_use = b.runway_use as string | null;
    if ('komponen_pesawat' in b) data.komponen_pesawat = b.komponen_pesawat as string | null;
    if ('dampak_pada_pesawat' in b) data.dampak_pada_pesawat = b.dampak_pada_pesawat as string | null;
    if ('kondisi_kerusakan' in b) data.kondisi_kerusakan = b.kondisi_kerusakan as string | null;
    if ('tindakan_perbaikan' in b) data.tindakan_perbaikan = b.tindakan_perbaikan as string | null;
    if ('sumber_informasi' in b) data.sumber_informasi = b.sumber_informasi as string | null;
    if ('deskripsi' in b) data.deskripsi = b.deskripsi as string | null;
    if ('dokumentasi' in b) data.dokumentasi = (b as Record<string, unknown>).dokumentasi as string | null ?? null;
    if ('jenis_pesawat' in b) data.jenis_pesawat = b.jenis_pesawat as string | null;

    const updated = await prisma.birdStrike.update({ where: { id: BigInt(id) }, data });

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
    console.error('Error updating bird strike:', error);
    return NextResponse.json({ success: false, message: 'Failed to update data' }, { status: 500 });
  }
}
