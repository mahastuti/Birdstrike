"use client";

import { useState } from "react";

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
  tindakan_lanjut: string;
  sumber_informasi: string;
  deskripsi: string;
  dokumentasi_form: File | null;
}

export default function BirdStrikeInput() {
  const [formData, setFormData] = useState<BirdStrikeFormData>({
    tanggal: "",
    jam: "",
    waktu: "",
    fase: "",
    lokasi_perimeter: "",
    kategori_kejadian: "",
    remark: "",
    airline: "",
    runway_use: "",
    komponen_pesawat: "",
    dampak_pada_pesawat: "",
    kondisi_kerusakan: "",
    tindakan_lanjut: "",
    sumber_informasi: "",
    deskripsi: "",
    dokumentasi_form: null,
  });

  const [submitMessage, setSubmitMessage] = useState("");

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="input-group">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tanggal
          </label>
          <input
            type="date"
            value={formData.tanggal}
            onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="input-group">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Jam
          </label>
          <input
            type="time"
            value={formData.jam}
            onChange={(e) => setFormData({ ...formData, jam: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="input-group">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Waktu
          </label>
          <select
            value={formData.waktu}
            onChange={(e) => setFormData({ ...formData, waktu: e.target.value })}
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
            value={formData.fase}
            onChange={(e) => setFormData({ ...formData, fase: e.target.value })}
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
            value={formData.lokasi_perimeter}
            onChange={(e) =>
              setFormData({ ...formData, lokasi_perimeter: e.target.value })
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Masukkan lokasi perimeter"
          />
        </div>

        <div className="input-group">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kategori Kejadian
          </label>
          <select
            value={formData.kategori_kejadian}
            onChange={(e) =>
              setFormData({ ...formData, kategori_kejadian: e.target.value })
            }
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
            value={formData.airline}
            onChange={(e) => setFormData({ ...formData, airline: e.target.value })}
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
            value={formData.runway_use}
            onChange={(e) =>
              setFormData({ ...formData, runway_use: e.target.value })
            }
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
            value={formData.komponen_pesawat}
            onChange={(e) =>
              setFormData({ ...formData, komponen_pesawat: e.target.value })
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Contoh: Engine, Wing, Nose"
          />
        </div>

        <div className="input-group">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kondisi Kerusakan
          </label>
          <select
            value={formData.kondisi_kerusakan}
            onChange={(e) =>
              setFormData({ ...formData, kondisi_kerusakan: e.target.value })
            }
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
          value={formData.remark}
          onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
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
          value={formData.dampak_pada_pesawat}
          onChange={(e) =>
            setFormData({ ...formData, dampak_pada_pesawat: e.target.value })
          }
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
          value={formData.tindakan_lanjut}
          onChange={(e) =>
            setFormData({ ...formData, tindakan_lanjut: e.target.value })
          }
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
          value={formData.sumber_informasi}
          onChange={(e) =>
            setFormData({ ...formData, sumber_informasi: e.target.value })
          }
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
          value={formData.deskripsi}
          onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
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
          onChange={(e) =>
            setFormData({ ...formData, dokumentasi_form: e.target.files?.[0] || null })
          }
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {formData.dokumentasi_form && (
          <p className="text-sm text-gray-600 mt-1">
            File dipilih: {formData.dokumentasi_form.name}
          </p>
        )}
      </div>

      <div className="flex justify-center pt-6">
        <button
          onClick={() => {
            setSubmitMessage("berhasil input");
            setTimeout(() => setSubmitMessage(""), 3000);
            setFormData({
              tanggal: "",
              jam: "",
              waktu: "",
              fase: "",
              lokasi_perimeter: "",
              kategori_kejadian: "",
              remark: "",
              airline: "",
              runway_use: "",
              komponen_pesawat: "",
              dampak_pada_pesawat: "",
              kondisi_kerusakan: "",
              tindakan_lanjut: "",
              sumber_informasi: "",
              deskripsi: "",
              dokumentasi_form: null,
            });
          }}
          className="px-8 py-3 bg-gradient-to-r from-[#72BB34] to-[#40A3DC] text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
        >
          Submit
        </button>
      </div>

      {submitMessage && (
        <div className="bg-green-100 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-center font-medium">
          {submitMessage}
        </div>
      )}
    </div>
  );
}