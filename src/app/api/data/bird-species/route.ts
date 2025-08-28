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
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.burung_bio.count({ where })
    ]);

    return NextResponse.json({
      success: true,
      data,
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
