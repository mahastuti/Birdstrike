import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const newBirdStrike = await prisma.birdStrike.create({
      data: {
        tanggal: data.tanggal ? new Date(data.tanggal) : null,
        jam: data.jam ? new Date(`1970-01-01T${data.jam}:00.000Z`) : null,
        waktu: data.waktu ?? null,
        fase: data.fase ?? null,
        lokasi_perimeter: data.lokasi_perimeter ?? null,
        kategori_kejadian: data.kategori_kejadian ?? null,
        remark: data.remark ?? null,
        airline: data.airline ?? null,
        runway_use: data.runway_use ?? null,
        komponen_pesawat: data.komponen_pesawat ?? null,
        dampak_pada_pesawat: data.dampak_pada_pesawat ?? null,
        kondisi_kerusakan: data.kondisi_kerusakan ?? null,
        tindakan_perbaikan: data.tindakan_perbaikan ?? null,
        sumber_informasi: data.sumber_informasi ?? null,
        deskripsi: data.deskripsi ?? null,
        dokumentasi: data.dokumentasi ?? null,
        jenis_pesawat: data.jenis_pesawat ?? null,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'berhasil input',
        data: newBirdStrike
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating bird strike data:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Gagal menyimpan data bird strike',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const birdStrikeData = await prisma.birdStrike.findMany({
      where: {
        deletedAt: null
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      data: birdStrikeData
    });
  } catch (error) {
    console.error('Error fetching bird strike data:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Gagal mengambil data bird strike',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
