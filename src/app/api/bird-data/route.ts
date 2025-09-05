import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    const mapWaktu = (time: string | null | undefined): string | null => {
      if (!time) return null;
      const hour = Number(time.split(':')[0]);
      if (hour >= 0 && hour <= 3) return 'Dini Hari';
      if (hour >=  3 && hour <= 8) return 'Pagi';
      if (hour >= 8 && hour <= 13) return 'Siang';
      if (hour >= 13 && hour <= 18) return 'Sore';
      return 'Malam';
    };

    const normalizeSpaces = (s: string | null | undefined) => (s ?? '').replace(/\s+/g, ' ').trim();
    const toTitleCaseWords = (s: string | null | undefined) => normalizeSpaces(String(s)).toLowerCase().split(' ').map(w => w ? w[0].toUpperCase() + w.slice(1) : '').join(' ');
    const toScientificCase = (s: string | null | undefined) => {
      const words = normalizeSpaces(String(s)).toLowerCase().split(' ');
      if (words.length === 0) return '';
      const first = words[0] ? words[0][0].toUpperCase() + words[0].slice(1) : '';
      return [first, ...words.slice(1)].join(' ');
    };

    const newBirdData = await prisma.burung_bio.create({
      data: {
        longitude: data.longitude,
        latitude: data.latitude,
        lokasi: data.lokasi,
        titik: data.titik,
        tanggal: data.tanggal ? new Date(data.tanggal) : null,
        jam: data.jam ? new Date(`1970-01-01T${data.jam}:00.000Z`) : null,
        waktu: data.waktu ?? mapWaktu(data.jam),
        cuaca: data.cuaca,
        jenis_burung: toTitleCaseWords(data.jenis_burung),
        nama_ilmiah: toScientificCase(data.nama_ilmiah),
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
