import { useState } from "react";
import type { FormEvent } from "react";

interface BirdSpeciesFormData {
  longitude: string;
  latitude: string;
  lokasi: string;
  titik: string;
  tanggal: string;
  jam: string;
  waktu: string;
  cuaca: string;
  jenis_burung: string;
  nama_ilmiah: string;
  jumlah_burung: string;
  keterangan: string;
  dokumentasi: string;
}

type BirdSpeciesFormProps = {
  onSubmit?: (data: BirdSpeciesFormData) => Promise<void>;
  isSubmitting?: boolean;
}

export default function BirdSpeciesForm({ onSubmit, isSubmitting = false }: BirdSpeciesFormProps) {
  const [formData, setFormData] = useState<BirdSpeciesFormData>({
    longitude: '',
    latitude: '',
    lokasi: '',
    titik: '',
    tanggal: '',
    jam: '',
    waktu: '',
    cuaca: '',
    jenis_burung: '',
    nama_ilmiah: '',
    jumlah_burung: '',
    keterangan: '',
    dokumentasi: '',
  });

  const mapWaktu = (time: string): string => {
    if (!time) return '';
    const hour = Number(time.split(':')[0]);
    if (hour >= 0 && hour <= 2) return 'Dini Hari';
    if (hour >= 3 && hour <= 5) return 'Subuh';
    if (hour >= 6 && hour <= 11) return 'Pagi';
    if (hour >= 12 && hour <= 15) return 'Siang';
    if (hour >= 16 && hour <= 18) return 'Sore';
    return 'Malam';
  };

  const normalizeSpaces = (s: string) => s.replace(/\s+/g, ' ').trim();
  const toTitleCaseWords = (s: string) => normalizeSpaces(s).toLowerCase().split(' ').map(w => w ? w[0].toUpperCase() + w.slice(1) : '').join(' ');
  const toScientificCase = (s: string) => {
    const words = normalizeSpaces(s).toLowerCase().split(' ');
    if (words.length === 0) return '';
    const first = words[0] ? words[0][0].toUpperCase() + words[0].slice(1) : '';
    return [first, ...words.slice(1)].join(' ');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const next = { ...prev } as BirdSpeciesFormData;
      if (name === 'jam') {
        next.jam = value;
        next.waktu = mapWaktu(value);
      } else if (name === 'jenis_burung') {
        next.jenis_burung = toTitleCaseWords(value);
      } else if (name === 'nama_ilmiah') {
        next.nama_ilmiah = toScientificCase(value);
      } else if (name in prev) {
        (next as any)[name] = value;
      }
      return next;
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setFormData(prev => ({ ...prev, dokumentasi: '' }));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      setFormData(prev => ({ ...prev, dokumentasi: result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      await onSubmit(formData);
    }
    setFormData({
      longitude: '',
      latitude: '',
      lokasi: '',
      titik: '',
      tanggal: '',
      jam: '',
      waktu: '',
      cuaca: '',
      jenis_burung: '',
      nama_ilmiah: '',
      jumlah_burung: '',
      keterangan: '',
      dokumentasi: '',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg border-2 border-gray-300 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-medium text-gray-800 text-center">Input Data</h2>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
              <input
                type="text"
                name="longitude"
                value={formData.longitude}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Masukkan longitude"
                required
              />
            </div>

            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
              <input
                type="text"
                name="latitude"
                value={formData.latitude}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Masukkan latitude"
                required
              />
            </div>

            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi</label>
              <select
                name="lokasi"
                value={formData.lokasi}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Pilih lokasi</option>
                <option value="Dalam">Dalam</option>
                <option value="Luar Barat">Luar Barat</option>
                <option value="Luar Timur">Luar Timur</option>
                <option value="Luar Selatan">Luar Selatan</option>
                <option value="Luar Utara">Luar Utara</option>
              </select>
            </div>

            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">Titik</label>
              <select
                name="titik"
                value={formData.titik}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Pilih titik</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
              </select>
            </div>

            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
              <input
                type="date"
                name="tanggal"
                value={formData.tanggal}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">Jam</label>
              <input
                type="time"
                name="jam"
                value={formData.jam}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">Waktu</label>
              <input
                type="text"
                name="waktu"
                value={formData.waktu}
                onChange={handleInputChange}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Waktu"
                required
              />
            </div>

            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">Cuaca</label>
              <select
                name="cuaca"
                value={formData.cuaca}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Pilih cuaca</option>
                <option value="Cerah">Cerah</option>
                <option value="Berawan">Cerah Berawan</option>
                <option value="Berawan">Berawan</option>
                <option value="Hujan">Hujan</option>
              </select>
            </div>

            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Burung</label>
              <input
                type="text"
                name="jenis_burung"
                value={formData.jenis_burung}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Masukkan jenis burung"
                required
              />
            </div>

            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Ilmiah</label>
              <input
                type="text"
                name="nama_ilmiah"
                value={formData.nama_ilmiah}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Masukkan nama ilmiah"
                required
              />
            </div>

            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah Burung</label>
              <input
                type="number"
                name="jumlah_burung"
                value={formData.jumlah_burung}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Masukkan jumlah burung"
                min="0"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan</label>
            <textarea
              name="keterangan"
              value={formData.keterangan}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Masukkan keterangan tambahan"
            />
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">Dokumentasi (png, jpg, jpeg, pdf)</label>
            <input
              type="file"
              accept=".png,.jpg,.jpeg,.pdf"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent file:bg-gray-700 file:text-white file:hover:bg-gray-800 file:border-0 file:rounded-md file:px-4 file:py-2 file:mr-3 bg-gray-100"
            />
          </div>

          <div className="flex justify-center pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-8 py-3 rounded-lg font-medium transition-colors ${isSubmitting
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#72BB34] to-[#40A3DC] text-white hover:opacity-90'
                }`}
            >
              {isSubmitting ? 'Menyimpan...' : 'Submit Data'}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

export type { BirdSpeciesFormData };
