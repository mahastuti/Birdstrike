'use client';

import { useState } from 'react';
import Image, { type StaticImageData } from 'next/image';
import { assets } from '@/assets/assets';

type Mode = 'heatmap' | 'bubble' | 'tren' | null;

export default function MapControls() {
  const [mode, setMode] = useState<Mode>('heatmap');
  const [garis, setGaris] = useState(true);
  const [area, setArea] = useState(true);
  const [points, setPoints] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [time, setTime] = useState(0);
  const [tanggal, setTanggal] = useState('');
  const [cuaca, setCuaca] = useState('');
  const [faseVal, setFaseVal] = useState('');
  const [strikeVal, setStrikeVal] = useState('');
  const [titik, setTitik] = useState('');
  const [burungPadaTitik, setBurungPadaTitik] = useState('');

  const getMapSrc = () => {
    if (mode === 'heatmap') return assets.map1; // Rule 1: initial heatmap shows map1

    const g = garis, a = area, p = points;
    if (g && !a && !p) return assets.map3; // Rule 2
    if (g && a && !p) return assets.map5;  // Rule 3
    if (g && a && p) return assets.map6;   // Rule 4
    if (!g && a && !p) return assets.map4; // Rule 5
    if (!g && a && p) return assets.map6;  // Rule 6
    if (!g && !a && p) return assets.map2; // sensible default for points only
    return assets.map5; // fallback
  };

  const src = getMapSrc() as StaticImageData;

  const zoomIn = () => setZoom((z) => Math.min(3, +(z + 0.25).toFixed(2)));
  const zoomOut = () => setZoom((z) => Math.max(0.5, +(z - 0.25).toFixed(2)));
  const formatTime = (m: number) => {
    const h = Math.floor(m / 60);
    const mm = m % 60;
    return `${String(h).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
  };

  const Pill = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
    <button onClick={onClick} className={`px-4 py-2 rounded-lg border ${active ? 'bg-[#83C8EF] text-white' : 'bg-white text-gray-700'} transition-colors`}>
      {label}
    </button>
  );

  return (
    <div className="p-8 space-y-4">
      <div className="flex gap-3">
        <Pill label="heatmap" active={mode === 'heatmap'} onClick={() => setMode(m => (m === 'heatmap' ? null : 'heatmap'))} />
        <Pill label="bubble" active={mode === 'bubble'} onClick={() => setMode(m => (m === 'bubble' ? null : 'bubble'))} />
        <Pill label="tren" active={mode === 'tren'} onClick={() => setMode(m => (m === 'tren' ? null : 'tren'))} />
      </div>

      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={garis} onChange={e => setGaris(e.target.checked)} className="rounded" /> garis perimeter</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={area} onChange={e => setArea(e.target.checked)} className="rounded" /> area dalam perimeter</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={points} onChange={e => setPoints(e.target.checked)} className="rounded" /> 8 titik potensial</label>
      </div>

      <div className="flex justify-end mb-2">
        <div className="inline-flex items-stretch rounded-full overflow-hidden border border-gray-300 shadow-sm">
          <button
            onClick={zoomOut}
            aria-label="Zoom out"
            disabled={zoom <= 0.5}
            className="px-3 py-2 bg-[#83C8EF] text-white disabled:opacity-50"
          >
            −
          </button>
          <div className="px-3 py-2 bg-white text-gray-700 border-l border-r border-gray-300 select-none">
            {(zoom * 100).toFixed(0)}%
          </div>
          <button
            onClick={zoomIn}
            aria-label="Zoom in"
            disabled={zoom >= 3}
            className="px-3 py-2 bg-[#83C8EF] text-white disabled:opacity-50"
          >
            +
          </button>
        </div>
      </div>

      <div className="relative h-96 bg-gray-100 border-2 border-gray-300 rounded-lg overflow-auto">
        <div className="w-full h-full flex items-center justify-center p-2">
          <Image
            src={src}
            alt={`Map${mode ? ' - ' + mode : ''}`}
            width={src.width}
            height={src.height}
            className="select-none"
            style={{ width: `${(zoom * 100).toFixed(0)}%`, height: 'auto' }}
            sizes="100vw"
            priority={false}
          />
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-700">Waktu: <span className="font-semibold">{formatTime(time)}</span></span>
        </div>
        <input
          type="range"
          min={0}
          max={1439}
          step={1}
          value={time}
          onChange={(e) => setTime(Number(e.target.value))}
          className="w-full accent-[#83C8EF] cursor-pointer"
          aria-label="Pilih waktu"
        />
        <div className="flex justify-between text-xs text-gray-600 mt-1">
          <span>00:00</span>
          <span>06:00</span>
          <span>12:00</span>
          <span>18:00</span>
          <span>23:59</span>
        </div>
      </div>

      <div className="mt-6 bg-white border-2 border-gray-300 rounded-lg p-4">
        <h3 className="text-lg font-medium text-center mb-4">Parameter Map</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Tanggal (ddmmyy)</label>
            <input
              type="text"
              inputMode="numeric"
              pattern="\\d{6}"
              maxLength={6}
              placeholder="250325"
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value.replace(/[^0-9]/g, '').slice(0,6))}
              className="w-full p-2 border border-gray-300 rounded-md"
              aria-label="Tanggal ddmmyy"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Cuaca</label>
            <input
              type="text"
              value={cuaca}
              onChange={(e) => setCuaca(e.target.value)}
              placeholder="Auto-fill nanti"
              className="w-full p-2 border border-gray-300 rounded-md bg-gray-50"
              readOnly
              aria-label="Cuaca"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Fase</label>
            <select
              value={faseVal}
              onChange={(e) => setFaseVal(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              aria-label="Fase penerbangan"
            >
              <option value="">Pilih fase</option>
              <option value="Takeoff">Takeoff</option>
              <option value="Landing">Landing</option>
              <option value="Taxi">Taxi</option>
              <option value="Cruise">Cruise</option>
              <option value="Approach">Approach</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Strike</label>
            <select
              value={strikeVal}
              onChange={(e) => setStrikeVal(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              aria-label="Strike"
            >
              <option value="">Pilih</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Titik</label>
            <input
              type="text"
              value={titik}
              onChange={(e) => setTitik(e.target.value)}
              placeholder="A1"
              className="w-full p-2 border border-gray-300 rounded-md"
              aria-label="Titik"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Burung pada titik</label>
            <input
              type="text"
              value={burungPadaTitik}
              onChange={(e) => setBurungPadaTitik(e.target.value)}
              placeholder="Auto-fill nanti"
              className="w-full p-2 border border-gray-300 rounded-md bg-gray-50"
              readOnly
              aria-label="Burung pada titik"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
