'use client';

import { useState } from 'react';
import { BarChart3, LayoutDashboard, Map, Image as ImageIcon, FileBarChart } from 'lucide-react';

export default function Dashboard() {
  const [selectedSidebarOption, setSelectedSidebarOption] = useState('dashboard');
  const [selectedDataOption, setSelectedDataOption] = useState('bird-strike');
  const [showPopup, setShowPopup] = useState(false);
  const [predictionResult, setPredictionResult] = useState('0.98674');
  const [inputFormData, setInputFormData] = useState({
    location: '',
    time: '',
    description: '',
    quantity: ''
  });
  const [birdStrikeData, setBirdStrikeData] = useState({
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
    tindakan_lanjut: '',
    sumber_informasi: '',
    deskripsi: '',
    dokumentasi_form: null as File | null
  });
  const [birdSpeciesData, setBirdSpeciesData] = useState({
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
  const [trafficFlightData, setTrafficFlightData] = useState({
    csvFile: null as File | null,
    showInstructions: false
  });
  const [submitMessage, setSubmitMessage] = useState('');
  const [formData, setFormData] = useState({
    tahun: '',
    tanggal: '',
    bulan: '',
    jam: '',
    waktu: '',
    cuaca: '',
    jumlahBurung: '',
    titik: '',
    fase: '',
    strike: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePredict = () => {
    const randomResult = (Math.random() * 0.3 + 0.7).toFixed(5);
    setPredictionResult(randomResult);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="min-h-screen flex bg-[#EEF5FF]">

      {/* Sidebar */}
      <div className="w-64 bg-white p-6 border-r border-gray-300">
        <div className="space-y-4">

          <button
            onClick={() => setSelectedSidebarOption('dashboard')}
            className={`w-full text-left p-3 rounded-lg border-2 transition-colors flex items-center gap-3 ${selectedSidebarOption === 'dashboard'
                ? "bg-gradient-to-r from-[#72BB34] to-[#40A3DC] border border-gray-300 text-white hover:opacity-80"
                : 'bg-[#83C8EF] font-medium text-white'
              }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </button>

          <button
            onClick={() => setSelectedSidebarOption('predict')}
            className={`w-full text-left p-3 rounded-lg border-2 transition-colors flex items-center gap-3 ${selectedSidebarOption === 'predict'
                ? "bg-gradient-to-r from-[#72BB34] to-[#40A3DC] border border-gray-300 text-white hover:opacity-80"
                : 'bg-[#83C8EF] font-medium text-white'
              }`}
          >
            <BarChart3 className="w-5 h-5" />
            Predict
          </button>

          <button
            onClick={() => setSelectedSidebarOption('map')}
            className={`w-full text-left p-3 rounded-lg border-2 transition-colors flex items-center gap-3 ${selectedSidebarOption === 'map'
                ? "bg-gradient-to-r from-[#72BB34] to-[#40A3DC] border border-gray-300 text-white hover:opacity-80"
                : 'bg-[#83C8EF] font-medium text-white'
              }`}
          >
            <Map className="w-5 h-5" />
            Map
          </button>
          <button
            onClick={() => setSelectedSidebarOption('gambar')}
            className={`w-full text-left p-3 rounded-lg border-2 transition-colors flex items-center gap-3 ${selectedSidebarOption === 'gambar'
                ? "bg-gradient-to-r from-[#72BB34] to-[#40A3DC] border border-gray-300 text-white hover:opacity-80"
                : 'bg-[#83C8EF] font-medium text-white'
              }`}
          >
            <ImageIcon className="w-5 h-5" />
            Gambar
          </button>
          <button
            onClick={() => setSelectedSidebarOption('analisis')}
            className={`w-full text-left p-3 rounded-lg border-2 transition-colors flex items-center gap-3 ${selectedSidebarOption === 'analisis'
                ? "bg-gradient-to-r from-[#72BB34] to-[#40A3DC] border border-white text-white hover:opacity-80"
                : 'bg-[#83C8EF] font-medium text-white'
              }`}
          >
            <FileBarChart className="w-5 h-5" />
            Analisis
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">

        {selectedSidebarOption === 'dashboard' && (
          <div className="space-y-6">

            {/* Dashboard Looker Section */}
            <div className="bg-white border-2 border-gray-300 rounded-lg">
              <div className="p-3 bg-[#40A3DC] border-b border-gray-300 rounded-t-lg">
                <h2 className="text-2xl font-medium text-center text-white">DASHBOARD</h2>
              </div>
              <div className="p-2 flex justify-center ">
                <iframe
                  title="Looker Studio Dashboard"
                  src="https://lookerstudio.google.com/embed/reporting/68b199fa-f042-46cd-8001-d24d9408f410/page/bpxSF"
                  className="w-full max-w-4xl h-[750px] border-0 rounded "
                  allowFullScreen
                />
              </div>
            </div>

            {/* Input Data Section */}
            <div className="bg-white border-2 border-gray-300 rounded-lg">
              <div className="p-4 bg-gray-200 border-b border-gray-300 rounded-t-lg">
                <h2 className="text-lg font-medium text-center">input data</h2>
              </div>
              <div className="p-6">
                <div className="flex justify-center space-x-6 mb-8">
                  <button
                    onClick={() => setSelectedDataOption('bird-strike')}
                    className={`px-6 py-3 rounded-lg border-2 transition-colors ${selectedDataOption === 'bird-strike'
                        ? 'bg-gray-200 border-gray-400 font-medium'
                        : 'bg-white border-gray-300 hover:bg-gray-100'
                      }`}
                  >
                    bird strike
                  </button>
                  <button
                    onClick={() => setSelectedDataOption('bird-species')}
                    className={`px-6 py-3 rounded-lg border-2 transition-colors ${selectedDataOption === 'bird-species'
                        ? 'bg-gray-200 border-gray-400 font-medium'
                        : 'bg-white border-gray-300 hover:bg-gray-100'
                      }`}
                  >
                    bird species
                  </button>
                  <button
                    onClick={() => setSelectedDataOption('traffic-flight')}
                    className={`px-6 py-3 rounded-lg border-2 transition-colors ${selectedDataOption === 'traffic-flight'
                        ? 'bg-gray-200 border-gray-400 font-medium'
                        : 'bg-white border-gray-300 hover:bg-gray-100'
                      }`}
                  >
                    traffic flight
                  </button>
                </div>

                {/* Input Form */}
                {selectedDataOption === 'bird-strike' ? (
                  <div className="space-y-6 max-w-4xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="input-group">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tanggal
                        </label>
                        <input
                          type="date"
                          value={birdStrikeData.tanggal}
                          onChange={(e) => setBirdStrikeData({...birdStrikeData, tanggal: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div className="input-group">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Jam
                        </label>
                        <input
                          type="time"
                          value={birdStrikeData.jam}
                          onChange={(e) => setBirdStrikeData({...birdStrikeData, jam: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div className="input-group">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Waktu
                        </label>
                        <select
                          value={birdStrikeData.waktu}
                          onChange={(e) => setBirdStrikeData({...birdStrikeData, waktu: e.target.value})}
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
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Fase
                        </label>
                        <select
                          value={birdStrikeData.fase}
                          onChange={(e) => setBirdStrikeData({...birdStrikeData, fase: e.target.value})}
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
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Lokasi Perimeter
                        </label>
                        <input
                          type="text"
                          value={birdStrikeData.lokasi_perimeter}
                          onChange={(e) => setBirdStrikeData({...birdStrikeData, lokasi_perimeter: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Masukkan lokasi perimeter"
                        />
                      </div>

                      <div className="input-group">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Kategori Kejadian
                        </label>
                        <select
                          value={birdStrikeData.kategori_kejadian}
                          onChange={(e) => setBirdStrikeData({...birdStrikeData, kategori_kejadian: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Pilih Kategori</option>
                          <option value="Strike">Strike</option>
                          <option value="Near Miss">Near Miss</option>
                          <option value="Multiple Strike">Multiple Strike</option>
                        </select>
                      </div>

                      <div className="input-group">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Airline
                        </label>
                        <input
                          type="text"
                          value={birdStrikeData.airline}
                          onChange={(e) => setBirdStrikeData({...birdStrikeData, airline: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Masukkan airline"
                        />
                      </div>

                      <div className="input-group">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Runway Use
                        </label>
                        <input
                          type="text"
                          value={birdStrikeData.runway_use}
                          onChange={(e) => setBirdStrikeData({...birdStrikeData, runway_use: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Contoh: 10/28"
                        />
                      </div>

                      <div className="input-group">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Komponen Pesawat
                        </label>
                        <input
                          type="text"
                          value={birdStrikeData.komponen_pesawat}
                          onChange={(e) => setBirdStrikeData({...birdStrikeData, komponen_pesawat: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Contoh: Engine, Wing, Nose"
                        />
                      </div>

                      <div className="input-group">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Kondisi Kerusakan
                        </label>
                        <select
                          value={birdStrikeData.kondisi_kerusakan}
                          onChange={(e) => setBirdStrikeData({...birdStrikeData, kondisi_kerusakan: e.target.value})}
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Remark
                      </label>
                      <textarea
                        value={birdStrikeData.remark}
                        onChange={(e) => setBirdStrikeData({...birdStrikeData, remark: e.target.value})}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Masukkan remark"
                      />
                    </div>

                    <div className="input-group">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dampak Pada Pesawat
                      </label>
                      <textarea
                        value={birdStrikeData.dampak_pada_pesawat}
                        onChange={(e) => setBirdStrikeData({...birdStrikeData, dampak_pada_pesawat: e.target.value})}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Deskripsikan dampak pada pesawat"
                      />
                    </div>

                    <div className="input-group">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tindakan Lanjut
                      </label>
                      <textarea
                        value={birdStrikeData.tindakan_lanjut}
                        onChange={(e) => setBirdStrikeData({...birdStrikeData, tindakan_lanjut: e.target.value})}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Masukkan tindakan lanjut yang dilakukan"
                      />
                    </div>

                    <div className="input-group">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sumber Informasi
                      </label>
                      <textarea
                        value={birdStrikeData.sumber_informasi}
                        onChange={(e) => setBirdStrikeData({...birdStrikeData, sumber_informasi: e.target.value})}
                        rows={2}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Masukkan sumber informasi"
                      />
                    </div>

                    <div className="input-group">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Deskripsi
                      </label>
                      <textarea
                        value={birdStrikeData.deskripsi}
                        onChange={(e) => setBirdStrikeData({...birdStrikeData, deskripsi: e.target.value})}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Masukkan deskripsi lengkap kejadian"
                      />
                    </div>

                    <div className="input-group">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dokumentasi Form (Upload Image)
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setBirdStrikeData({...birdStrikeData, dokumentasi_form: e.target.files?.[0] || null})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      {birdStrikeData.dokumentasi_form && (
                        <p className="text-sm text-gray-600 mt-1">
                          File dipilih: {birdStrikeData.dokumentasi_form.name}
                        </p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-center pt-6">
                      <button
                        onClick={() => {
                          // Handle submit logic here
                          setSubmitMessage('berhasil input');
                          setTimeout(() => setSubmitMessage(''), 3000);
                          // Reset form
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
                            tindakan_lanjut: '',
                            sumber_informasi: '',
                            deskripsi: '',
                            dokumentasi_form: null
                          });
                        }}
                        className="px-8 py-3 bg-gradient-to-r from-[#72BB34] to-[#40A3DC] text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
                      >
                        Submit
                      </button>
                    </div>

                    {/* Success Message */}
                    {submitMessage && (
                      <div className="bg-green-100 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-center font-medium">
                        {submitMessage}
                      </div>
                    )}
                  </div>
                ) : selectedDataOption === 'bird-species' ? (
                  <div className="space-y-6 max-w-4xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="input-group">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Latitude
                        </label>
                        <input
                          type="text"
                          value={birdSpeciesData.latitude}
                          onChange={(e) => setBirdSpeciesData({...birdSpeciesData, latitude: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Contoh: -6.1234567"
                        />
                      </div>

                      <div className="input-group">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Longitude
                        </label>
                        <input
                          type="text"
                          value={birdSpeciesData.longitude}
                          onChange={(e) => setBirdSpeciesData({...birdSpeciesData, longitude: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Contoh: 106.1234567"
                        />
                      </div>

                      <div className="input-group">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Lokasi
                        </label>
                        <input
                          type="text"
                          value={birdSpeciesData.lokasi}
                          onChange={(e) => setBirdSpeciesData({...birdSpeciesData, lokasi: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Masukkan lokasi pengamatan"
                        />
                      </div>

                      <div className="input-group">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Titik
                        </label>
                        <input
                          type="text"
                          value={birdSpeciesData.titik}
                          onChange={(e) => setBirdSpeciesData({...birdSpeciesData, titik: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Contoh: A1, B2, C3"
                        />
                      </div>

                      <div className="input-group">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tanggal
                        </label>
                        <input
                          type="date"
                          value={birdSpeciesData.tanggal}
                          onChange={(e) => setBirdSpeciesData({...birdSpeciesData, tanggal: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div className="input-group">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Jam
                        </label>
                        <input
                          type="time"
                          value={birdSpeciesData.jam}
                          onChange={(e) => setBirdSpeciesData({...birdSpeciesData, jam: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div className="input-group">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Waktu
                        </label>
                        <select
                          value={birdSpeciesData.waktu}
                          onChange={(e) => setBirdSpeciesData({...birdSpeciesData, waktu: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Pilih Waktu</option>
                          <option value="Pagi">Pagi (06:00 - 11:59)</option>
                          <option value="Siang">Siang (12:00 - 17:59)</option>
                          <option value="Sore">Sore (18:00 - 18:59)</option>
                          <option value="Malam">Malam (19:00 - 05:59)</option>
                        </select>
                      </div>

                      <div className="input-group">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Cuaca
                        </label>
                        <select
                          value={birdSpeciesData.cuaca}
                          onChange={(e) => setBirdSpeciesData({...birdSpeciesData, cuaca: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Pilih Cuaca</option>
                          <option value="Cerah">Cerah</option>
                          <option value="Berawan">Berawan</option>
                          <option value="Mendung">Mendung</option>
                          <option value="Hujan Ringan">Hujan Ringan</option>
                          <option value="Hujan Lebat">Hujan Lebat</option>
                          <option value="Berkabut">Berkabut</option>
                        </select>
                      </div>

                      <div className="input-group">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Jenis Burung
                        </label>
                        <input
                          type="text"
                          value={birdSpeciesData.jenis_burung}
                          onChange={(e) => setBirdSpeciesData({...birdSpeciesData, jenis_burung: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Contoh: Elang Jawa, Burung Gereja"
                        />
                      </div>

                      <div className="input-group">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nama Ilmiah
                        </label>
                        <input
                          type="text"
                          value={birdSpeciesData.nama_ilmiah}
                          onChange={(e) => setBirdSpeciesData({...birdSpeciesData, nama_ilmiah: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Contoh: Nisaetus bartelsi"
                        />
                      </div>

                      <div className="input-group">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Jumlah Burung
                        </label>
                        <input
                          type="number"
                          value={birdSpeciesData.jumlah_burung}
                          onChange={(e) => setBirdSpeciesData({...birdSpeciesData, jumlah_burung: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Masukkan jumlah burung yang diamati"
                          min="0"
                        />
                      </div>
                    </div>

                    <div className="input-group">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Keterangan
                      </label>
                      <textarea
                        value={birdSpeciesData.keterangan}
                        onChange={(e) => setBirdSpeciesData({...birdSpeciesData, keterangan: e.target.value})}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Masukkan keterangan tambahan mengenai pengamatan burung"
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-center pt-6">
                      <button
                        onClick={() => {
                          // Handle submit logic here
                          setSubmitMessage('berhasil input');
                          setTimeout(() => setSubmitMessage(''), 3000);
                          // Reset form
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
                        }}
                        className="px-8 py-3 bg-gradient-to-r from-[#72BB34] to-[#40A3DC] text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
                      >
                        Submit
                      </button>
                    </div>

                    {/* Success Message */}
                    {submitMessage && (
                      <div className="bg-green-100 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-center font-medium">
                        {submitMessage}
                      </div>
                    )}
                  </div>
                ) : selectedDataOption === 'traffic-flight' ? (
                  <div className="space-y-6 max-w-4xl mx-auto">
                    {/* CSV Upload Instructions Dropdown */}
                    <div className="bg-red-100 border-2 border-red-300 rounded-lg p-4">
                      <button
                        onClick={() => setTrafficFlightData({...trafficFlightData, showInstructions: !trafficFlightData.showInstructions})}
                        className="w-full text-left font-medium text-red-800 flex items-center justify-between"
                      >
                        <span>Dropdown to show cara upload csv</span>
                        <span className={`transform transition-transform ${trafficFlightData.showInstructions ? 'rotate-180' : ''}`}>
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

                    {/* CSV File Upload */}
                    <div className="bg-red-100 border-2 border-red-300 rounded-lg p-8">
                      <div className="text-center">
                        <div className="mb-4">
                          <label className="block text-lg font-medium text-red-800 mb-4">
                            Upload File CSV
                          </label>
                          <input
                            type="file"
                            accept=".csv"
                            onChange={(e) => setTrafficFlightData({...trafficFlightData, csvFile: e.target.files?.[0] || null})}
                            className="hidden"
                            id="csv-upload"
                          />
                          <label
                            htmlFor="csv-upload"
                            className="cursor-pointer inline-block bg-red-300 hover:bg-red-400 text-red-800 font-medium py-3 px-8 rounded-lg border-2 border-red-400 transition-colors"
                          >
                            Pilih File CSV
                          </label>
                        </div>

                        {trafficFlightData.csvFile && (
                          <div className="bg-white p-3 rounded border-2 border-red-300 mb-4">
                            <p className="text-red-800 font-medium">
                              File dipilih: {trafficFlightData.csvFile.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              Ukuran: {(trafficFlightData.csvFile.size / 1024).toFixed(2)} KB
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-center pt-6">
                      <button
                        onClick={() => {
                          if (trafficFlightData.csvFile) {
                            // Handle CSV upload logic here
                            setSubmitMessage('berhasil input');
                            setTimeout(() => setSubmitMessage(''), 3000);
                            // Reset form
                            setTrafficFlightData({csvFile: null, showInstructions: false});
                          } else {
                            setSubmitMessage('Silakan pilih file CSV terlebih dahulu');
                            setTimeout(() => setSubmitMessage(''), 3000);
                          }
                        }}
                        disabled={!trafficFlightData.csvFile}
                        className={`px-8 py-3 font-medium rounded-lg transition-opacity ${
                          trafficFlightData.csvFile
                            ? 'bg-gradient-to-r from-[#72BB34] to-[#40A3DC] text-white hover:opacity-90'
                            : 'bg-gray-400 text-white cursor-not-allowed'
                        }`}
                      >
                        Upload CSV
                      </button>
                    </div>

                    {/* Success/Error Message */}
                    {submitMessage && (
                      <div className={`px-4 py-3 rounded-lg text-center font-medium ${
                        submitMessage.includes('berhasil')
                          ? 'bg-green-100 border border-green-200 text-green-800'
                          : 'bg-red-100 border border-red-200 text-red-800'
                      }`}>
                        {submitMessage}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-6 max-w-2xl mx-auto">
                    <div className="input-group">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        value={inputFormData.location}
                        onChange={(e) => setInputFormData({...inputFormData, location: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter location"
                      />
                    </div>

                    <div className="input-group">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Time
                      </label>
                      <input
                        type="datetime-local"
                        value={inputFormData.time}
                        onChange={(e) => setInputFormData({...inputFormData, time: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div className="input-group">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        value={inputFormData.description}
                        onChange={(e) => setInputFormData({...inputFormData, description: e.target.value})}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter description"
                      />
                    </div>

                    <div className="input-group">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quantity
                      </label>
                      <input
                        type="number"
                        value={inputFormData.quantity}
                        onChange={(e) => setInputFormData({...inputFormData, quantity: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter quantity"
                        min="0"
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-center pt-6">
                      <button
                        onClick={() => {
                          // Handle submit logic here
                          setSubmitMessage('berhasil input');
                          setTimeout(() => setSubmitMessage(''), 3000);
                          // Reset form
                          setInputFormData({location: '', time: '', description: '', quantity: ''});
                        }}
                        className="px-8 py-3 bg-gradient-to-r from-[#72BB34] to-[#40A3DC] text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
                      >
                        Submit
                      </button>
                    </div>

                    {/* Success Message */}
                    {submitMessage && (
                      <div className="bg-green-100 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-center font-medium">
                        {submitMessage}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Logout Button */}
            <div className="mt-8 mb-25 flex justify-center">
              <button
                onClick={() => {
                  try {
                    localStorage.removeItem('isAuthenticated');
                    window.location.reload();
                  } catch (error) {
                    console.warn('localStorage not available:', error);
                  }
                }}
                className="w-full relative bg-red-500 text-white px-6 py-3
                rounded-lg font-medium transition-all duration-300 ease-in-out shadow-sm
                hover:scale-100 hover:shadow-xl before:absolute before:inset-0
                before:bg-white/20 before:translate-x-[-100%] hover:before:translate-x-[100%]
                before:transition-transform before:duration-500"
              >
                Logout
              </button>
            </div>
          </div>
        )}

        {selectedSidebarOption === 'predict' && (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Prediction Result Section */}
            <div className="bg-white border-2 border-gray-300 rounded-lg p-8">
              <h2 className="text-xl font-medium text-center mb-6">Peluang Terjadinya bird strike</h2>

              <div className="bg-gray-100 border-2 border-gray-300 rounded-lg p-8 mb-6">
                <div className="text-4xl font-bold text-center mb-2">{predictionResult}</div>
              </div>

              <p className="text-center text-gray-700 mb-6">berbasi prediksi</p>

              <div className="text-center">
                <button
                  onClick={handlePredict}
                  className="bg-gray-300 hover:bg-gray-400 border-2 border-gray-300 px-8 py-3 rounded-lg font-medium transition-colors"
                >
                  predict
                </button>
              </div>
            </div>

            {/* Input Form Section */}
            <div className="bg-white border-2 border-gray-300 rounded-lg p-6">
              <h3 className="text-lg font-medium text-center mb-6">Input Data Prediksi</h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Tahun</label>
                  <input
                    type="text"
                    value={formData.tahun}
                    onChange={(e) => handleInputChange('tahun', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="2024"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Tanggal</label>
                  <input
                    type="text"
                    value={formData.tanggal}
                    onChange={(e) => handleInputChange('tanggal', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="15"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Bulan</label>
                  <input
                    type="text"
                    value={formData.bulan}
                    onChange={(e) => handleInputChange('bulan', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="January"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Jam</label>
                  <input
                    type="text"
                    value={formData.jam}
                    onChange={(e) => handleInputChange('jam', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="14:30"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Waktu</label>
                  <input
                    type="text"
                    value={formData.waktu}
                    onChange={(e) => handleInputChange('waktu', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Siang"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Cuaca</label>
                  <input
                    type="text"
                    value={formData.cuaca}
                    onChange={(e) => handleInputChange('cuaca', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Cerah"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Jumlah Burung pada Titik X</label>
                  <input
                    type="text"
                    value={formData.jumlahBurung}
                    onChange={(e) => handleInputChange('jumlahBurung', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="25"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Titik</label>
                  <input
                    type="text"
                    value={formData.titik}
                    onChange={(e) => handleInputChange('titik', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="A1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Fase</label>
                  <input
                    type="text"
                    value={formData.fase}
                    onChange={(e) => handleInputChange('fase', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Takeoff"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Strike</label>
                  <input
                    type="text"
                    value={formData.strike}
                    onChange={(e) => handleInputChange('strike', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Yes/No"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedSidebarOption === 'map' && (
          <div className="space-y-6">
            <div className="bg-white border-2 border-gray-300 rounded-lg">
              <div className="p-3 bg-[#40A3DC] border-b border-gray-300 rounded-t-lg">
                <h2 className="text-2xl font-medium text-center text-white">MAP</h2>
              </div>
              <div className="p-8">
                <div className="h-96 bg-gray-100 border-2 border-gray-300 rounded-lg flex items-center justify-center">
                  <p className="text-gray-700 text-lg">Map content will be displayed here</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedSidebarOption === 'gambar' && (
          <div className="space-y-6">
            <div className="bg-white border-2 border-gray-300 rounded-lg">
              <div className="p-3 bg-[#40A3DC] border-b border-gray-300 rounded-t-lg">
                <h2 className="text-2xl font-medium text-center text-white">GAMBAR</h2>
              </div>
              <div className="p-8">
                <div className="h-96 bg-gray-100 border-2 border-gray-300 rounded-lg flex items-center justify-center">
                  <p className="text-gray-700 text-lg">Image gallery will be displayed here</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedSidebarOption === 'analisis' && (
          <div className="space-y-6">
            <div className="bg-white border-2 border-gray-300 rounded-lg">
              <div className="p-3 bg-[#40A3DC] border-b border-gray-300 rounded-t-lg">
                <h2 className="text-2xl font-medium text-center text-white">ANALISIS</h2>
              </div>
              <div className="p-8">
                <div className="h-96 bg-gray-100 border-2 border-gray-300 rounded-lg flex items-center justify-center">
                  <p className="text-gray-700 text-lg">Analysis content will be displayed here</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg max-w-md w-full mx-4 text-center">
            <h3 className="text-lg font-medium mb-4">Hasil Prediksi</h3>
            <p className="text-gray-700 mb-6">
              Peluang terjadinya birdstrike pada titik {formData.titik || 'X'} tahun {formData.tahun || '2024'} adalah {predictionResult}
            </p>
            <button
              onClick={closePopup}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
