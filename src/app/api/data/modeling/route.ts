import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type SortOrder = 'asc' | 'desc';

const waktuFromHour = (hour: number): string => {
  if (hour >= 0 && hour <= 3) return 'Dini Hari';
  if (hour > 3 && hour <= 8) return 'Pagi';
  if (hour > 8 && hour <= 13) return 'Siang';
  if (hour > 13 && hour <= 18) return 'Sore';
  return 'Malam';
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const search = searchParams.get('search') || '';

    const sortOrderParam: SortOrder = (searchParams.get('sortOrder') === 'asc' ? 'asc' : 'desc');
    const cursorParam = searchParams.get('cursor');
    const cursorId = cursorParam && /^\d+$/.test(cursorParam) ? BigInt(cursorParam) : null;

    const orderBy: Record<string, SortOrder> = { id: sortOrderParam };

    const orFilters: Record<string, unknown>[] = [];
    if (search) {
      const s = search.trim();
      const like = (key: string) => ({ [key]: { contains: s, mode: 'insensitive' as const } });
      for (const k of ['waktu','cuaca','fase','strike']) { orFilters.push(like(k)); }
      if (/^\d+$/.test(s)) {
        try { orFilters.push({ id: BigInt(s) }); } catch {}
        const asInt = Number.parseInt(s, 10);
        if (!Number.isNaN(asInt)) { orFilters.push({ titik: BigInt(asInt) }); orFilters.push({ jumlah_burung_pada_titik_x: BigInt(asInt) }); }
      }
      if (/^\d{4}-\d{2}-\d{2}$/.test(s)) { const d = new Date(s); if (!Number.isNaN(d.getTime())) orFilters.push({ tanggal: d }); }
      if (/^\d{2}:\d{2}$/.test(s)) { const t = new Date(`1970-01-01T${s}:00.000Z`); if (!Number.isNaN(t.getTime())) orFilters.push({ jam: t }); }
    }

    const where = search ? { OR: orFilters } : {};

    const items = await prisma.model.findMany({
      where,
      orderBy,
      take: limit + 1,
      ...(cursorId ? { cursor: { id: cursorId }, skip: 1 } : {})
    });

    const hasMore = items.length > limit;
    const rows = hasMore ? items.slice(0, limit) : items;
    const nextCursor = hasMore ? String(rows[rows.length - 1].id) : null;

    const serialize = (value: unknown): unknown => {
      if (value === null || value === undefined) return value;
      if (typeof value === 'bigint') return value.toString();
      if (value instanceof Date) return value.toISOString();
      if (Array.isArray(value)) return value.map(serialize);
      if (typeof value === 'object') { const out: Record<string, unknown> = {}; for (const [k, v] of Object.entries(value as Record<string, unknown>)) out[k] = serialize(v); return out; }
      return value;
    };

    return NextResponse.json({ success: true, data: serialize(rows), pageInfo: { limit, hasMore, nextCursor } });
  } catch (error) {
    console.error('Error fetching modeling data:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch modeling data' }, { status: 500 });
  }
}

export async function POST() {
  try {
    const since = new Date('2025-01-01T00:00:00.000Z');
    const birdStrikes = await prisma.birdStrike.findMany({
      where: {
        tanggal: { gte: since },
        kategori_kejadian: { contains: 'bird strike', mode: 'insensitive' },
        remark: { contains: 'terkonfirmasi', mode: 'insensitive' },
        fase: { in: ['landing', 'take off', 'Landing', 'Take Off', 'TAKE OFF', 'LANDING'] }
      },
      orderBy: { tanggal: 'asc' }
    });

    const results: { created: number; skipped: number } = { created: 0, skipped: 0 };

    const normTitik = (s: string) => {
      const m = String(s).match(/-?\d+(?:[\.,]\d+)?/);
      if (!m) return null;
      const f = parseFloat(m[0].replace(',', '.'));
      if (!Number.isFinite(f)) return null;
      return Math.round(f); // nearest integer
    };

    for (const bs of birdStrikes) {
      const titikStr = (bs.titik ?? '').toString().trim();
      const titikInt = normTitik(titikStr);
      if (titikInt == null) { results.skipped++; continue; }
      const titikNum = BigInt(titikInt);

      const candidates = [
        titikStr,
        String(titikInt),
        `${titikInt}.0`, `${titikInt}.00`,
        `${titikInt},0`, `${titikInt},00`
      ];

      const loc = await prisma.burung_bio.findFirst({
        where: {
          OR: candidates.map((c) => ({ titik: c })),
          longitude: { not: null },
          latitude: { not: null }
        },
        orderBy: { tanggal: 'desc' }
      });
      if (!loc || !loc.longitude || !loc.latitude) { results.skipped++; continue; }

      const jamDate = bs.jam ? new Date(bs.jam) : null;
      const hourLocal = jamDate ? jamDate.getUTCHours() : 12;
      const waktu = waktuFromHour(hourLocal);

      const dateStr = bs.tanggal ? new Date(bs.tanggal).toISOString().slice(0, 10) : null;
      let cuaca: string | null = null;
      if (dateStr) {
        try {
          const url = new URL('https://archive-api.open-meteo.com/v1/era5');
          url.searchParams.set('latitude', String(parseFloat(loc.latitude)));
          url.searchParams.set('longitude', String(parseFloat(loc.longitude)));
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
            let idx = -1;
            const target = `${dateStr}T${String(hourLocal).padStart(2,'0')}:00`;
            for (let i = 0; i < times.length; i++) { if (times[i] === target) { idx = i; break; } }
            if (idx >= 0) {
              const p = Number(prec[idx] ?? 0);
              const c = Number(cloud[idx] ?? 0);
              if (p > 0.2) cuaca = 'Hujan';
              else if (c >= 70) cuaca = 'Berawan';
              else if (c >= 30) cuaca = 'Cerah Berawan';
              else cuaca = 'Cerah';
            }
          }
        } catch { cuaca = null; }
      }

      const exists = await prisma.model.findFirst({ where: { tanggal: bs.tanggal ?? undefined, titik: titikNum } });
      if (exists) { results.skipped++; continue; }

      await prisma.model.create({
        data: {
          tanggal: bs.tanggal ?? new Date(dateStr || Date.now()),
          jam: bs.jam ?? null,
          waktu,
          cuaca,
          jumlah_burung_pada_titik_x: null,
          titik: titikNum,
          fase: bs.fase ?? null,
          strike: '1'
        }
      });
      results.created++;
    }

    return NextResponse.json({ success: true, ...results });
  } catch (error) {
    console.error('Error generating modeling data:', error);
    return NextResponse.json({ success: false, message: 'Failed to generate modeling data' }, { status: 500 });
  }
}
