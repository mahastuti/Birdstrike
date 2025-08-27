"use client"

import { useState } from "react";

interface BirdFormData {
  titik_koordinat: string;
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

export default function BirdInputForm() {
  const [formData, setFormData] = useState<BirdFormData>({
    titik_koordinat: '',
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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const response = await fetch('/api/bird-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitMessage('berhasil input');
        setIsSuccess(true);
        // Reset form
        setFormData({
          titik_koordinat: '',
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
      } else {
        setSubmitMessage(result.message || 'Gagal menyimpan data');
        setIsSuccess(false);
      }
    } catch (error) {
      setSubmitMessage('Terjadi kesalahan saat menyimpan data');
      setIsSuccess(false);
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
      // Clear message after 3 seconds
      setTimeout(() => {
        setSubmitMessage('');
      }, 3000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg border-2 border-gray-300 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-medium text-gray-800 text-center">Input Data</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Titik Koordinat
              </label>
              <input
                type="text"
                name="titik_koordinat"
                value={formData.titik_koordinat}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Masukkan titik koordinat"
              />
            </div>

            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lokasi
              </label>
              <input
                type="text"
                name="lokasi"
                value={formData.lokasi}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Masukkan lokasi"
              />
            </div>

            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Titik
              </label>
              <input
                type="text"
                name="titik"
                value={formData.titik}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Masukkan titik"
              />
            </div>

            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal
              </label>
              <input
                type="date"
                name="tanggal"
                value={formData.tanggal}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Jam
              </label>
              <input
                type="time"
                name="jam"
                value={formData.jam}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Waktu
              </label>
              <input
                type="text"
                name="waktu"
                value={formData.waktu}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Masukkan waktu"
              />
            </div>

            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cuaca
              </label>
              <select
                name="cuaca"
                value={formData.cuaca}
                onChange={handleInputChange}
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Jenis Burung
              </label>
              <input
                type="text"
                name="jenis_burung"
                value={formData.jenis_burung}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Masukkan jenis burung"
              />
            </div>

            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Ilmiah
              </label>
              <input
                type="text"
                name="nama_ilmiah"
                value={formData.nama_ilmiah}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Masukkan nama ilmiah"
              />
            </div>

            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Jumlah Burung
              </label>
              <input
                type="number"
                name="jumlah_burung"
                value={formData.jumlah_burung}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Masukkan jumlah burung"
                min="0"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Keterangan
            </label>
            <textarea
              name="keterangan"
              value={formData.keterangan}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Masukkan keterangan tambahan"
            />
          </div>

          {submitMessage && (
            <div className={`p-3 rounded-md text-center font-medium ${
              isSuccess 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : 'bg-red-100 text-red-800 border border-red-200'
            }`}>
              {submitMessage}
            </div>
          )}

          <div className="flex justify-center pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-8 py-3 rounded-lg font-medium transition-colors ${
                isSubmitting
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#72BB34] to-[#40A3DC] text-white hover:opacity-90'
              }`}
            >
              {isSubmitting ? 'Menyimpan...' : 'Submit Data'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
