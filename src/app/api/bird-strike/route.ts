import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    const newBirdStrike = await prisma.birdStrike.create({
      data: {
        tanggal: data.tanggal ? new Date(data.tanggal) : null,
        jam: data.jam ? new Date(`1970-01-01T${data.jam}:00.000Z`) : null,
        waktu: data.waktu,
        fase: data.fase,
        lokasi_perimeter: data.lokasi_perimeter,
        kategori_kejadian: data.kategori_kejadian,
        remark: data.remark,
        airline: data.airline,
        runway_use: data.runway_use,
        komponen_pesawat: data.komponen_pesawat,
        dampak_pada_pesawat: data.dampak_pada_pesawat,
        kondisi_kerusakan: data.kondisi_kerusakan,
        tindakan_lanjut: data.tindakan_lanjut,
        sumber_informasi: data.sumber_informasi,
        deskripsi: data.deskripsi,
        dokumentasi_form: data.dokumentasi_form || null,
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
