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
    const source = (searchParams.get('source') || 'all').toLowerCase();

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

    const whereBase = search ? { OR: orFilters } : {};
    const where = ((): Record<string, unknown> => {
      if (source === 'bird-strike') return { ...whereBase, strike: '1' };
      if (source === 'traffic-flight') return { ...whereBase, strike: '0' };
      return whereBase;
    })();

    const safeCount = async (fn: () => Promise<number>) => {
      try { return await fn(); } catch (e) { console.error('prisma:error count()', e); return 0; }
    };

    const total = process.env.DATABASE_URL ? await safeCount(() => prisma.model.count({ where })) : 0;

    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ success: true, data: [], pagination: { page: 1, limit, total: 0, pages: 0 }, pageInfo: { limit, hasMore: false, nextCursor: null } });
    }

    const safeFind = async <T>(fn: () => Promise<T>, fallback: T): Promise<T> => {
      try { return await fn(); } catch (e) { console.error('prisma:error find()', e); return fallback; }
    };

    const items = await safeFind(() => prisma.model.findMany({
      where,
      orderBy,
      take: limit + 1,
      ...(cursorId ? { cursor: { id: cursorId }, skip: 1 } : {})
    }), [] as Awaited<ReturnType<typeof prisma.model.findMany>>);

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

    return NextResponse.json({ success: true, data: serialize(rows), pagination: { page: 1, limit, total, pages: Math.ceil(total / Math.max(1, limit)) }, pageInfo: { limit, hasMore, nextCursor } });
  } catch (error) {
    console.error('Error fetching modeling data:', error);
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ success: true, data: [], pagination: { page: 1, limit: 10, total: 0, pages: 0 }, pageInfo: { limit: 10, hasMore: false, nextCursor: null } });
    }
    return NextResponse.json({ success: false, message: 'Failed to fetch modeling data' }, { status: 500 });
  }
}

export async function POST() {
  try {
    const since = new Date('1970-01-01T00:00:00.000Z');

    const results: { created: number; skipped: number } = { created: 0, skipped: 0 };

    const waktuFromHourLocal = (h: number) => waktuFromHour(h);
    const parseIntSafe = (s: string | null | undefined) => {
      if (!s) return null;
      const n = Number.parseInt(String(s), 10);
      return Number.isNaN(n) ? null : n;
    };
    const daysInMonth = (y: number, m: number) => new Date(Date.UTC(y, m, 0)).getUTCDate();

    const normTitik = (s: string) => {
      const m = String(s).match(/-?\d+(?:[\.,]\d+)?/);
      if (!m) return null;
      const f = parseFloat(m[0].replace(',', '.'));
      if (!Number.isFinite(f)) return null;
      return Math.round(f);
    };

    // 1) From Bird Strike: also compute avg jumlah burung sampai tanggal
    const birdStrikes = await prisma.birdStrike.findMany({
      where: {
        tanggal: { gte: since },
        kategori_kejadian: { contains: 'bird strike', mode: 'insensitive' },
        remark: { contains: 'terkonfirmasi', mode: 'insensitive' },
        fase: { in: ['landing', 'take off', 'Landing', 'Take Off', 'TAKE OFF', 'LANDING'] }
      },
      orderBy: { tanggal: 'asc' }
    });

    for (const bs of birdStrikes) {
      const titikStr = (bs.titik ?? '').toString().trim();
      const titikInt = normTitik(titikStr);
      if (titikInt == null) { results.skipped++; continue; }
      const titikNum = BigInt(titikInt);

      const candidates = [titikStr, String(titikInt), `${titikInt}.0`, `${titikInt}.00`, `${titikInt},0`, `${titikInt},00`];

      const jamDate = bs.jam ? new Date(bs.jam) : null;
      const hourLocal = jamDate ? jamDate.getUTCHours() : 12;
      const waktu = waktuFromHourLocal(hourLocal);

      let avg: bigint | null = null;
      if (bs.tanggal) {
        const species = await prisma.burung_bio.findMany({
          where: { titik: { in: candidates }, tanggal: { lte: bs.tanggal } },
          select: { jumlah_burung: true }
        });
        const vals = species.map(s => Number(s.jumlah_burung ?? 0)).filter(n => Number.isFinite(n));
        if (vals.length) avg = BigInt(Math.round(vals.reduce((a, b) => a + b, 0) / vals.length));
      }

      const exists = await prisma.model.findFirst({ where: { tanggal: bs.tanggal ?? undefined, titik: titikNum, fase: bs.fase ?? undefined, strike: '1' } });
      if (exists) { results.skipped++; continue; }

      await prisma.model.create({
        data: {
          tanggal: bs.tanggal ?? new Date(),
          jam: bs.jam ?? null,
          waktu,
          cuaca: null,
          jumlah_burung_pada_titik_x: avg,
          titik: titikNum,
          fase: bs.fase ?? null,
          strike: '1'
        }
      });
      results.created++;
    }

    // 2) From Traffic Flight: split ATA/ATD into rows
    const tfRows = await prisma.trafficFlight.findMany({
      where: { tahun: { not: null }, bulan: { not: null } },
      orderBy: [{ tahun: 'asc' }, { bulan: 'asc' }, { id: 'asc' }]
    });

    const parseDayTime = (s: string | null | undefined) => {
      if (!s) return null;
      const m = String(s).match(/^(\d{1,2})\/(\d{2}):?(\d{2})?$/);
      if (!m) return null;
      const day = Number.parseInt(m[1], 10);
      const hh = Number.parseInt(m[2], 10);
      const mm = Number.parseInt((m[3] ?? '0'), 10);
      if (Number.isNaN(day) || Number.isNaN(hh) || Number.isNaN(mm)) return null;
      return { day, hh, mm };
    };

    for (const r of tfRows) {
      const y = parseIntSafe(r.tahun);
      const m0 = parseIntSafe(r.bulan);
      if (!y || !m0) { results.skipped++; continue; }
      const mth = Math.min(Math.max(m0, 1), 12);
      const dim = daysInMonth(y, mth);

      const avioAOk = r.avio_a == null || r.avio_a === '0' || r.avio_a === '1';
      const avioDOk = r.avio_d == null || r.avio_d === '0' || r.avio_d === '1';

      const ata = parseDayTime(r.ata || null);
      const atd = parseDayTime(r.atd || null);

      const makeDate = (baseY: number, baseM: number, day: number, dir: 'same' | 'next' | 'prev') => {
        let y2 = baseY; let m2 = baseM; let d2 = day;
        if (dir === 'next') { m2++; if (m2 > 12) { m2 = 1; y2++; } }
        if (dir === 'prev') { m2--; if (m2 < 1) { m2 = 12; y2--; } }
        return { y2, m2, d2 };
      };

      // Decide offside for ATA vs ATD
      const offsideNext = (day: number) => day > dim;

      // ATA row
      if (ata && avioAOk && !(String(r.ata).includes('--:--'))) {
        let dir: 'same' | 'next' | 'prev' = offsideNext(ata.day) ? 'next' : 'same';
        if (atd && ata.day > atd.day) dir = 'prev';
        const { y2, m2, d2 } = makeDate(y, mth, Math.min(ata.day, 28) + (ata.day > 28 ? ata.day - 28 : 0), dir);
        if (y2 >= y) { // skip if moved to previous year
          const tanggal = new Date(Date.UTC(y2, m2 - 1, d2));
          const jam = new Date(`1970-01-01T${String(ata.hh).padStart(2,'0')}:${String(ata.mm).padStart(2,'0')}:00.000Z`);
          const exists = await prisma.model.findFirst({ where: { tanggal, jam, fase: 'landing', strike: '0' } });
          if (!exists) {
            await prisma.model.create({ data: { tanggal, jam, waktu: waktuFromHourLocal(ata.hh), cuaca: null, jumlah_burung_pada_titik_x: null, titik: BigInt(1), fase: 'landing', strike: '0' } });
            results.created++;
          } else { results.skipped++; }
        }
      }

      // ATD row
      if (atd && avioDOk && !(String(r.atd).includes('--:--'))) {
        const dir: 'same' | 'next' = offsideNext(atd.day) ? 'next' : 'same';
        const { y2, m2, d2 } = makeDate(y, mth, Math.min(atd.day, 28) + (atd.day > 28 ? atd.day - 28 : 0), dir);
        const tanggal = new Date(Date.UTC(y2, m2 - 1, d2));
        const jam = new Date(`1970-01-01T${String(atd.hh).padStart(2,'0')}:${String(atd.mm).padStart(2,'0')}:00.000Z`);
        const exists = await prisma.model.findFirst({ where: { tanggal, jam, fase: 'take off', strike: '0' } });
        if (!exists) {
          await prisma.model.create({ data: { tanggal, jam, waktu: waktuFromHourLocal(atd.hh), cuaca: null, jumlah_burung_pada_titik_x: null, titik: BigInt(1), fase: 'take off', strike: '0' } });
          results.created++;
        } else { results.skipped++; }
      }
    }

    return NextResponse.json({ success: true, ...results });
  } catch (error) {
    console.error('Error generating modeling data:', error);
    return NextResponse.json({ success: false, message: 'Failed to generate modeling data' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const source = (searchParams.get('source') || 'all').toLowerCase();
    const sinceStr = searchParams.get('since');
    const untilStr = searchParams.get('until');

    const where: Record<string, unknown> = {};
    if (source === 'bird-strike') where.strike = '1';
    if (source === 'traffic-flight') where.strike = '0';

    const andConds: Record<string, unknown>[] = [];
    if (sinceStr) {
      const d = new Date(sinceStr);
      if (!Number.isNaN(d.getTime())) andConds.push({ tanggal: { gte: d } });
    }
    if (untilStr) {
      const d = new Date(untilStr);
      if (!Number.isNaN(d.getTime())) andConds.push({ tanggal: { lte: d } });
    }
    if (andConds.length) (where as any).AND = andConds;

    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ success: true, deleted: 0 });
    }

    const result = await prisma.model.deleteMany({ where });
    return NextResponse.json({ success: true, deleted: result.count });
  } catch (error) {
    console.error('Error deleting modeling data:', error);
    return NextResponse.json({ success: false, message: 'Failed to delete modeling data' }, { status: 500 });
  }
}
