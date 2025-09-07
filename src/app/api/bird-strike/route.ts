import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function serialize(value: unknown): unknown {
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
}

export async function POST(request: NextRequest) {
  try {
    const ct = request.headers.get('content-type') || '';
    let payload: Record<string, unknown> = {};

    if (ct.includes('multipart/form-data')) {
      const form = await request.formData();
      const getStr = (k: string) => {
        const v = form.get(k);
        return typeof v === 'string' ? v : null;
      };
      const getFileB64 = async (k: string) => {
        const v = form.get(k);
        if (v instanceof File) {
          const ab = await v.arrayBuffer();
          const b64 = Buffer.from(ab).toString('base64');
          const type = v.type || 'application/octet-stream';
          return `data:${type};base64,${b64}`;
        }
        return null;
      };

      payload = {
        tanggal: getStr('tanggal'),
        jam: getStr('jam'),
        waktu: getStr('waktu'),
        fase: getStr('fase'),
        lokasi_perimeter: getStr('lokasi_perimeter'),
        kategori_kejadian: getStr('kategori_kejadian'),
        remark: getStr('remark'),
        airline: getStr('airline'),
        runway_use: getStr('runway_use'),
        komponen_pesawat: getStr('komponen_pesawat'),
        dampak_pada_pesawat: getStr('dampak_pada_pesawat'),
        kondisi_kerusakan: getStr('kondisi_kerusakan'),
        tindakan_perbaikan: getStr('tindakan_perbaikan'),
        sumber_informasi: getStr('sumber_informasi'),
        deskripsi: getStr('deskripsi'),
        dokumentasi: getStr('dokumentasi') || await getFileB64('dokumentasi') || await getFileB64('dokumentasi_form'),
        jenis_pesawat: getStr('jenis_pesawat'),
      };
    } else {
      payload = await request.json();
    }

    const data = payload as Record<string, unknown>;

    const created = await prisma.birdStrike.create({
      data: {
        tanggal: data.tanggal ? new Date(String(data.tanggal)) : null,
        jam: data.jam ? new Date(`1970-01-01T${String(data.jam)}:00.000Z`) : null,
        waktu: (data.waktu as string) ?? null,
        fase: (data.fase as string) ?? null,
        lokasi_perimeter: (data.lokasi_perimeter as string) ?? null,
        kategori_kejadian: (data.kategori_kejadian as string) ?? null,
        remark: (data.remark as string) ?? null,
        airline: (data.airline as string) ?? null,
        runway_use: (data.runway_use as string) ?? null,
        komponen_pesawat: (data.komponen_pesawat as string) ?? null,
        dampak_pada_pesawat: (data.dampak_pada_pesawat as string) ?? null,
        kondisi_kerusakan: (data.kondisi_kerusakan as string) ?? null,
        tindakan_perbaikan: (data.tindakan_perbaikan as string) ?? null,
        sumber_informasi: (data.sumber_informasi as string) ?? null,
        deskripsi: (data.deskripsi as string) ?? null,
        dokumentasi: (data.dokumentasi as string) ?? null,
        jenis_pesawat: (data.jenis_pesawat as string) ?? null,
      },
    });

    return NextResponse.json(
      { success: true, message: 'berhasil input', data: serialize(created) },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating bird strike data:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal menyimpan data bird strike', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const birdStrikeData = await prisma.birdStrike.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, data: serialize(birdStrikeData) });
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
