import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const waktuFromHour = (hour: number): string => {
  if (hour >= 0 && hour <= 3) return 'Dini Hari';
  if (hour > 3 && hour <= 8) return 'Pagi';
  if (hour > 8 && hour <= 13) return 'Siang';
  if (hour > 13 && hour <= 18) return 'Sore';
  return 'Malam';
};

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
        titik: getStr('titik'),
      };
    } else {
      payload = await request.json();
    }

    const data = payload as Record<string, unknown>;

    const jamDate = data.jam ? new Date(`1970-01-01T${String(data.jam)}:00.000Z`) : null;
    const waktuAuto = jamDate ? waktuFromHour(jamDate.getUTCHours()) : null;

    const tanggalDate = data.tanggal ? new Date(String(data.tanggal)) : null;
    const defaultDoc = (() => {
      if (!tanggalDate) return null;
      const y = tanggalDate.getUTCFullYear();
      const m = String(tanggalDate.getUTCMonth() + 1).padStart(2, '0');
      const d = String(tanggalDate.getUTCDate()).padStart(2, '0');
      return `https://odjhvlqvbnqrjlowjywq.supabase.co/storage/v1/object/public/bird-strike/${y}${m}${d}.png`;
    })();

    const created = await prisma.birdStrike.create({
      data: {
        tanggal: tanggalDate,
        jam: jamDate,
        waktu: (data.waktu as string) ?? waktuAuto,
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
        dokumentasi: (data.dokumentasi as string) ?? defaultDoc,
        jenis_pesawat: (data.jenis_pesawat as string) ?? null,
        titik: (data.titik as string) ?? null,
      },
    });

    // Auto-generate modeling row when criteria met
    try {
      const since = new Date('2025-01-01T00:00:00.000Z');
      const fase = (created.fase || '').toLowerCase();
      const kategori = (created.kategori_kejadian || '').toLowerCase();
      const remark = (created.remark || '').toLowerCase();
      const eligible = (!!created.tanggal && created.tanggal >= since) &&
        (kategori.includes('bird strike')) &&
        (remark.includes('terkonfirmasi')) &&
        (fase.includes('landing') || fase.includes('take off') || fase.includes('take-off'));

      if (eligible) {
        const normTitik = (s: string | null | undefined) => {
          if (!s) return null;
          const m = String(s).match(/-?\d+(?:[\.,]\d+)?/);
          if (!m) return null;
          const f = parseFloat(m[0].replace(',', '.'));
          if (!Number.isFinite(f)) return null;
          return Math.round(f);
        };
        const tInt = normTitik(created.titik || '')
        if (tInt != null) {
          const candidates = [String(created.titik || ''), String(tInt), `${tInt}.0`, `${tInt}.00`, `${tInt},0`, `${tInt},00`];
          const loc = await prisma.burung_bio.findFirst({
            where: { OR: candidates.map(c => ({ titik: c })), longitude: { not: null }, latitude: { not: null } },
            orderBy: { tanggal: 'desc' }
          });

          const hour = created.jam ? new Date(created.jam).getUTCHours() : 12;
          const waktu = created.waktu || waktuFromHour(hour);

          let cuaca: string | null = null;
          if (loc && created.tanggal) {
            try {
              const dateStr = created.tanggal.toISOString().slice(0, 10);
              const url = new URL('https://archive-api.open-meteo.com/v1/era5');
              url.searchParams.set('latitude', String(parseFloat(String(loc.latitude))));
              url.searchParams.set('longitude', String(parseFloat(String(loc.longitude))));
              url.searchParams.set('start_date', dateStr);
              url.searchParams.set('end_date', dateStr);
              url.searchParams.set('hourly', 'precipitation,cloudcover');
              url.searchParams.set('timezone', 'Asia/Jakarta');
              const res = await fetch(url.toString(), { cache: 'no-store' });
              if (res.ok) {
                const json = await res.json();
                const times: string[] = json?.hourly?.time || [];
                const prec: number[] = json?.hourly?.precipitation || [];
                const cloud: number[] = json?.hourly?.cloudcover || [];
                let idx = times.findIndex((t: string) => t === `${dateStr}T${String(hour).padStart(2,'0')}:00`);
                if (idx >= 0) {
                  const p = Number(prec[idx] ?? 0);
                  const c = Number(cloud[idx] ?? 0);
                  if (p > 0.2) cuaca = 'Hujan'; else if (c >= 70) cuaca = 'Berawan'; else if (c >= 30) cuaca = 'Cerah Berawan'; else cuaca = 'Cerah';
                }
              }
            } catch {}
          }

          const exists = await prisma.model.findFirst({ where: { tanggal: created.tanggal ?? undefined, titik: BigInt(tInt) } });
          if (!exists) {
            await prisma.model.create({ data: { tanggal: created.tanggal!, jam: created.jam ?? null, waktu, cuaca, jumlah_burung_pada_titik_x: null, titik: BigInt(tInt), fase: created.fase ?? null, strike: '1' } });
          }
        }
      }
    } catch (e) { console.error('Auto-modeling error:', e); }

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
