'use client';

import { useState } from 'react';
import { Bird, Plane, Zap } from 'lucide-react';

// =====================================================================================================================

// Bird Strike Form Data Interface
interface BirdStrikeFormData {
  tanggal: string;
  jam: string;
  waktu: string;
  fase: string;
  lokasi_perimeter: string;
  kategori_kejadian: string;
  remark: string;
  airline: string;
  runway_use: string;
  komponen_pesawat: string; 
  dampak_pada_pesawat: string;
  kondisi_kerusakan: string;
  tindakan_perbaikan: string;
  sumber_informasi: string;
  deskripsi: string;
  dokumentasi_form: File | null;
}

// Bird Species Form Data Interface
interface BirdSpeciesFormData {
  latitude: string;
  longitude: string;
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
}

// Traffic Flight Form Data Interface
interface TrafficFlightFormData {
  csvFile: File | null;
  showInstructions: boolean;
}

// =====================================================================================================================
// =====================================================================================================================

export default function DashboardInputData() {
  const [selectedForm, setSelectedForm] = useState<'bird-strike' | 'bird-species' | 'traffic-flight'>('bird-strike');
  const [submitMessage, setSubmitMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Bird Strike Form State
  const [birdStrikeData, setBirdStrikeData] = useState<BirdStrikeFormData>({
    tanggal: '',
    jam: '',
    waktu: '',
    fase: '',
    lokasi_perimeter: '',
    kategori_kejadian: '',
    remark: '',
    airline: '',
    runway_use: '',
    komponen_pesawat: '',
    dampak_pada_pesawat: '',
    kondisi_kerusakan: '',
    tindakan_perbaikan: '',
    sumber_informasi: '',
    deskripsi: '',
    dokumentasi_form: null,
  });

  // Bird Species Form State
  const [birdSpeciesData, setBirdSpeciesData] = useState<BirdSpeciesFormData>({
    latitude: '',
    longitude: '',
    lokasi: '',
    titik: '',
    tanggal: '',
    jam: '',
    waktu: '',
    cuaca: '',
    jenis_burung: '',
    nama_ilmiah: '',
    jumlah_burung: '',
    keterangan: ''
  });

  // Traffic Flight Form State
  const [trafficFlightData, setTrafficFlightData] = useState<TrafficFlightFormData>({
    csvFile: null,
    showInstructions: false,
  });

// =====================================================================================================================
// =====================================================================================================================
  
const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      let response;

      if (selectedForm === 'bird-strike') {
        response = await fetch('/api/bird-strike', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(birdStrikeData),
        });
      } else if (selectedForm === 'bird-species') {
        response = await fetch('/api/bird-data', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(birdSpeciesData),
        });
      } else if (selectedForm === 'traffic-flight') {
        if (!trafficFlightData.csvFile) {
          setSubmitMessage('Silakan pilih file CSV terlebih dahulu');
          setIsSuccess(false);
          setIsSubmitting(false);
          setTimeout(() => setSubmitMessage(''), 3000);
          return;
        }

        const formData = new FormData();
        formData.append('csvFile', trafficFlightData.csvFile);

        response = await fetch('/api/traffic-flight', {
          method: 'POST',
          body: formData,
        });
      }

      if (response) {
        const result = await response.json();

        if (result.success) {
          setSubmitMessage(result.message || 'berhasil input');
          setIsSuccess(true);

          // Reset forms based on selected form
          if (selectedForm === 'bird-strike') {
            setBirdStrikeData({
              tanggal: '',
              jam: '',
              waktu: '',
              fase: '',
              lokasi_perimeter: '',
              kategori_kejadian: '',
              remark: '',
              airline: '',
              runway_use: '',
              komponen_pesawat: '',
              dampak_pada_pesawat: '',
              kondisi_kerusakan: '',
              tindakan_perbaikan: '',
              sumber_informasi: '',
              deskripsi: '',
              dokumentasi_form: null,
            });
          } else if (selectedForm === 'bird-species') {
            setBirdSpeciesData({
              latitude: '',
              longitude: '',
              lokasi: '',
              titik: '',
              tanggal: '',
              jam: '',
              waktu: '',
              cuaca: '',
              jenis_burung: '',
              nama_ilmiah: '',
              jumlah_burung: '',
              keterangan: ''
            });
          } else if (selectedForm === 'traffic-flight') {
            setTrafficFlightData({
              csvFile: null,
              showInstructions: false,
            });
          }
        } else {
          setSubmitMessage(result.message || 'Gagal menyimpan data');
          setIsSuccess(false);
        }
      }
    } catch (error) {
      console.error('Error submitting data:', error);
      setSubmitMessage('Terjadi kesalahan saat menyimpan data');
      setIsSuccess(false);
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitMessage(''), 3000);
    }
  };

  return (
    <div className="bg-white border-2 border-gray-300 rounded-lg mt-6">
      <div className="p-3 bg-[#40A3DC] border-b border-gray-300 rounded-t-lg">
        <h2 className="text-2xl font-medium text-center text-white">INPUT DATA</h2>
      </div>
      
      <div className="p-6">
        {/* Form Selection Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-8">
          <button
            onClick={() => setSelectedForm('bird-strike')}
            className={`group relative p-6 rounded-lg font-medium text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl border-2 ${
              selectedForm === 'bird-strike'
                ? 'bg-gradient-to-r from-[#72BB34] to-[#40A3DC] text-white border-transparent'
                : 'bg-[#83C8EF] text-white border-transparent hover:border-gray-300'
            }`}
          >
            <div className="flex flex-col items-center gap-3">
              <Zap className="w-8 h-8 group-hover:animate-pulse" />
              <span>bird strike</span>
            </div>
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
          </button>

          <button
            onClick={() => setSelectedForm('bird-species')}
            className={`group relative p-6 rounded-lg font-medium text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl border-2 ${
              selectedForm === 'bird-species'
                ? 'bg-gradient-to-r from-[#72BB34] to-[#40A3DC] text-white border-transparent'
                : 'bg-[#83C8EF] text-white border-transparent hover:border-gray-300'
            }`}
          >
            <div className="flex flex-col items-center gap-3">
              <Bird className="w-8 h-8 group-hover:animate-pulse" />
              <span>bird species</span>
            </div>
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
          </button>

          <button
            onClick={() => setSelectedForm('traffic-flight')}
            className={`group relative p-6 rounded-lg font-medium text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl border-2 ${
              selectedForm === 'traffic-flight'
                ? 'bg-gradient-to-r from-[#72BB34] to-[#40A3DC] text-white border-transparent'
                : 'bg-[#83C8EF] text-white border-transparent hover:border-gray-300'
            }`}
          >
            <div className="flex flex-col items-center gap-3">
              <Plane className="w-8 h-8 group-hover:animate-pulse" />
              <span>traffic flight</span>
            </div>
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
          </button>
        </div>

        {/* Form Content */}
        <div className="max-w-4xl mx-auto">
          {selectedForm === 'bird-strike' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="input-group">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal</label>
                  <input
                    type="date"
                    value={birdStrikeData.tanggal}
                    onChange={(e) => setBirdStrikeData({ ...birdStrikeData, tanggal: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="input-group">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Jam</label>
                  <input
                    type="time"
                    value={birdStrikeData.jam}
                    onChange={(e) => setBirdStrikeData({ ...birdStrikeData, jam: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="input-group">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Waktu</label>
                  <select
                    value={birdStrikeData.waktu}
                    onChange={(e) => setBirdStrikeData({ ...birdStrikeData, waktu: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Pilih Waktu</option>
                    <option value="Pagi">Pagi</option>
                    <option value="Siang">Siang</option>
                    <option value="Sore">Sore</option>
                    <option value="Malam">Malam</option>
                  </select>
                </div>

                <div className="input-group">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fase</label>
                  <select
                    value={birdStrikeData.fase}
                    onChange={(e) => setBirdStrikeData({ ...birdStrikeData, fase: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Pilih Fase</option>
                    <option value="Takeoff">Takeoff</option>
                    <option value="Landing">Landing</option>
                    <option value="Approach">Approach</option>
                    <option value="Taxiing">Taxiing</option>
                  </select>
                </div>

                <div className="input-group">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Lokasi Perimeter</label>
                  <input
                    type="text"
                    value={birdStrikeData.lokasi_perimeter}
                    onChange={(e) => setBirdStrikeData({ ...birdStrikeData, lokasi_perimeter: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Masukkan lokasi perimeter"
                  />
                </div>

                <div className="input-group">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kategori Kejadian</label>
                  <select
                    value={birdStrikeData.kategori_kejadian}
                    onChange={(e) => setBirdStrikeData({ ...birdStrikeData, kategori_kejadian: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Pilih Kategori</option>
                    <option value="Strike">Strike</option>
                    <option value="Near Miss">Near Miss</option>
                    <option value="Multiple Strike">Multiple Strike</option>
                  </select>
                </div>

                <div className="input-group">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Airline</label>
                  <input
                    type="text"
                    value={birdStrikeData.airline}
                    onChange={(e) => setBirdStrikeData({ ...birdStrikeData, airline: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Masukkan airline"
                  />
                </div>

                <div className="input-group">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Runway Use</label>
                  <input
                    type="text"
                    value={birdStrikeData.runway_use}
                    onChange={(e) => setBirdStrikeData({ ...birdStrikeData, runway_use: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Contoh: 10/28"
                  />
                </div>

                <div className="input-group">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Komponen Pesawat</label>
                  <input
                    type="text"
                    value={birdStrikeData.komponen_pesawat}
                    onChange={(e) => setBirdStrikeData({ ...birdStrikeData, komponen_pesawat: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Contoh: Engine, Wing, Nose"
                  />
                </div>

                <div className="input-group">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kondisi Kerusakan</label>
                  <select
                    value={birdStrikeData.kondisi_kerusakan}
                    onChange={(e) => setBirdStrikeData({ ...birdStrikeData, kondisi_kerusakan: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Pilih Kondisi</option>
                    <option value="Tidak Ada Kerusakan">Tidak Ada Kerusakan</option>
                    <option value="Kerusakan Ringan">Kerusakan Ringan</option>
                    <option value="Kerusakan Sedang">Kerusakan Sedang</option>
                    <option value="Kerusakan Berat">Kerusakan Berat</option>
                  </select>
                </div>
              </div>

              <div className="input-group">
                <label className="block text-sm font-medium text-gray-700 mb-2">Remark</label>
                <textarea
                  value={birdStrikeData.remark}
                  onChange={(e) => setBirdStrikeData({ ...birdStrikeData, remark: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Masukkan remark"
                />
              </div>

              <div className="input-group">
                <label className="block text-sm font-medium text-gray-700 mb-2">Dampak Pada Pesawat</label>
                <textarea
                  value={birdStrikeData.dampak_pada_pesawat}
                  onChange={(e) => setBirdStrikeData({ ...birdStrikeData, dampak_pada_pesawat: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Deskripsikan dampak pada pesawat"
                />
              </div>

              <div className="input-group">
                <label className="block text-sm font-medium text-gray-700 mb-2">Tindakan Lanjut</label>
                <textarea
                  value={birdStrikeData.tindakan_lanjut}
                  onChange={(e) => setBirdStrikeData({ ...birdStrikeData, tindakan_lanjut: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Masukkan tindakan lanjut yang dilakukan"
                />
              </div>

              <div className="input-group">
                <label className="block text-sm font-medium text-gray-700 mb-2">Sumber Informasi</label>
                <textarea
                  value={birdStrikeData.sumber_informasi}
                  onChange={(e) => setBirdStrikeData({ ...birdStrikeData, sumber_informasi: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Masukkan sumber informasi"
                />
              </div>

              <div className="input-group">
                <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi</label>
                <textarea
                  value={birdStrikeData.deskripsi}
                  onChange={(e) => setBirdStrikeData({ ...birdStrikeData, deskripsi: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Masukkan deskripsi lengkap kejadian"
                />
              </div>

              <div className="input-group">
                <label className="block text-sm font-medium text-gray-700 mb-2">Dokumentasi Form (Upload Image)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setBirdStrikeData({ ...birdStrikeData, dokumentasi_form: e.target.files?.[0] || null })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {birdStrikeData.dokumentasi_form && (
                  <p className="text-sm text-gray-600 mt-1">File dipilih: {birdStrikeData.dokumentasi_form.name}</p>
                )}
              </div>
            </div>
          )}

          {selectedForm === 'bird-species' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Titik Koordinat</label>
                  <input
                    type="text"
                    value={birdSpeciesData.titik_koordinat}
                    onChange={(e) => setBirdSpeciesData({ ...birdSpeciesData, titik_koordinat: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Masukkan titik koordinat"
                  />
                </div>

                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi</label>
                  <input
                    type="text"
                    value={birdSpeciesData.lokasi}
                    onChange={(e) => setBirdSpeciesData({ ...birdSpeciesData, lokasi: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Masukkan lokasi"
                  />
                </div>

                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Titik</label>
                  <input
                    type="text"
                    value={birdSpeciesData.titik}
                    onChange={(e) => setBirdSpeciesData({ ...birdSpeciesData, titik: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Masukkan titik"
                  />
                </div>

                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
                  <input
                    type="date"
                    value={birdSpeciesData.tanggal}
                    onChange={(e) => setBirdSpeciesData({ ...birdSpeciesData, tanggal: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Jam</label>
                  <input
                    type="time"
                    value={birdSpeciesData.jam}
                    onChange={(e) => setBirdSpeciesData({ ...birdSpeciesData, jam: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Waktu</label>
                  <input
                    type="text"
                    value={birdSpeciesData.waktu}
                    onChange={(e) => setBirdSpeciesData({ ...birdSpeciesData, waktu: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Masukkan waktu"
                  />
                </div>

                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cuaca</label>
                  <select
                    value={birdSpeciesData.cuaca}
                    onChange={(e) => setBirdSpeciesData({ ...birdSpeciesData, cuaca: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Pilih cuaca</option>
                    <option value="Cerah">Cerah</option>
                    <option value="Berawan">Berawan</option>
                    <option value="Hujan">Hujan</option>
                    <option value="Berkabut">Berkabut</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Burung</label>
                  <input
                    type="text"
                    value={birdSpeciesData.jenis_burung}
                    onChange={(e) => setBirdSpeciesData({ ...birdSpeciesData, jenis_burung: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Masukkan jenis burung"
                  />
                </div>

                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Ilmiah</label>
                  <input
                    type="text"
                    value={birdSpeciesData.nama_ilmiah}
                    onChange={(e) => setBirdSpeciesData({ ...birdSpeciesData, nama_ilmiah: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Masukkan nama ilmiah"
                  />
                </div>

                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah Burung</label>
                  <input
                    type="number"
                    value={birdSpeciesData.jumlah_burung}
                    onChange={(e) => setBirdSpeciesData({ ...birdSpeciesData, jumlah_burung: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Masukkan jumlah burung"
                    min="0"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan</label>
                <textarea
                  value={birdSpeciesData.keterangan}
                  onChange={(e) => setBirdSpeciesData({ ...birdSpeciesData, keterangan: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Masukkan keterangan tambahan"
                />
              </div>
            </div>
          )}

          {selectedForm === 'traffic-flight' && (
            <div className="space-y-6">
              <div className="bg-red-100 border-2 border-red-300 rounded-lg p-4">
                <button
                  onClick={() => setTrafficFlightData({ ...trafficFlightData, showInstructions: !trafficFlightData.showInstructions })}
                  className="w-full text-left font-medium text-red-800 flex items-center justify-between"
                >
                  <span>Dropdown to show cara upload csv</span>
                  <span className={`transform transition-transform ${trafficFlightData.showInstructions ? "rotate-180" : ""}`}>
                    ▼
                  </span>
                </button>

                {trafficFlightData.showInstructions && (
                  <div className="mt-4 space-y-3 text-red-800">
                    <div className="font-medium">1. Siapkan CSV</div>
                    <div className="font-medium">2. Contoh kolom yang benar (insert gambar)</div>
                    <div className="bg-white p-3 rounded border">
                      <p className="text-sm text-gray-700 mb-2">Format CSV yang benar:</p>
                      <div className="text-xs font-mono bg-gray-50 p-2 rounded">
                        <div>flight_number,airline,departure_time,arrival_time,aircraft_type</div>
                        <div>GA123,Garuda Indonesia,08:00,10:30,Boeing 737</div>
                        <div>QZ456,AirAsia,14:15,16:45,Airbus A320</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-red-100 border-2 border-red-300 rounded-lg p-8">
                <div className="text-center">
                  <div className="mb-4">
                    <label className="block text-lg font-medium text-red-800 mb-4">Upload File CSV</label>
                    <input
                      type="file"
                      accept=".csv"
                      onChange={(e) => setTrafficFlightData({ ...trafficFlightData, csvFile: e.target.files?.[0] || null })}
                      className="hidden"
                      id="csv-upload-dashboard"
                    />
                    <label
                      htmlFor="csv-upload-dashboard"
                      className="cursor-pointer inline-block bg-red-300 hover:bg-red-400 text-red-800 font-medium py-3 px-8 rounded-lg border-2 border-red-400 transition-colors"
                    >
                      Pilih File CSV
                    </label>
                  </div>

                  {trafficFlightData.csvFile && (
                    <div className="bg-white p-3 rounded border-2 border-red-300 mb-4">
                      <p className="text-red-800 font-medium">File dipilih: {trafficFlightData.csvFile.name}</p>
                      <p className="text-sm text-gray-600">Ukuran: {(trafficFlightData.csvFile.size / 1024).toFixed(2)} KB</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-center pt-6">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`px-8 py-3 rounded-lg font-medium transition-opacity ${
                isSubmitting
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#72BB34] to-[#40A3DC] text-white hover:opacity-90'
              }`}
            >
              {isSubmitting ? 'Menyimpan...' : 'Submit'}
            </button>
          </div>

          {/* Success/Error Message */}
          {submitMessage && (
            <div className={`px-4 py-3 rounded-lg text-center font-medium mt-4 ${
              isSuccess
                ? 'bg-green-100 border border-green-200 text-green-800'
                : 'bg-red-100 border border-red-200 text-red-800'
            }`}>
              {submitMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
