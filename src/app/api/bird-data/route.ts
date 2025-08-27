import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    const newBirdData = await prisma.burung_bio.create({
      data: {
        longitude: data.longitude,
        latitude: data.latitude,
        lokasi: data.lokasi,
        titik: data.titik,
        tanggal: data.tanggal ? new Date(data.tanggal) : null,
        jam: data.jam ? new Date(data.jam) : null,
        waktu: data.waktu,
        cuaca: data.cuaca,
        jenis_burung: data.jenis_burung,
        nama_ilmiah: data.nama_ilmiah,
        jumlah_burung: data.jumlah_burung ? parseInt(data.jumlah_burung) : null,
        keterangan: data.keterangan,
      },
    });

    return NextResponse.json(
      { 
        success: true, 
        message: 'berhasil input',
        data: newBirdData 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating bird data:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Gagal menyimpan data',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const birdData = await prisma.burung_bio.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      data: birdData
    });
  } catch (error) {
    console.error('Error fetching bird data:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Gagal mengambil data',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
