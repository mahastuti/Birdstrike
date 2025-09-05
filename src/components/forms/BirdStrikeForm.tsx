"use client";

import { useState } from "react";
import type { FormEvent } from "react";

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
  dokumentasi: string;
  jenis_pesawat: string;
}

type BirdStrikeFormProps = {
  onSubmit?: (data: BirdStrikeFormData) => Promise<void>;
  isSubmitting?: boolean;
}

export default function BirdStrikeForm({ onSubmit, isSubmitting = false }: BirdStrikeFormProps) {
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
    tindakan_perbaikan: "",
    sumber_informasi: "",
    deskripsi: "",
    dokumentasi: "",
    jenis_pesawat: "",
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      await onSubmit(formData);
    }
    // Reset form after successful submission
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
      tindakan_perbaikan: "",
      sumber_informasi: "",
      deskripsi: "",
      dokumentasi: "",
      jenis_pesawat: "",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
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
            required
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
            required
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
            required
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
            required
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
            required
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
            required
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
            required
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
            required
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
            required
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
            required
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
          required
        />
      </div>

      <div className="input-group">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tindakan Perbaikan
        </label>
        <textarea
          value={formData.tindakan_perbaikan}
          onChange={(e) =>
            setFormData({ ...formData, tindakan_perbaikan: e.target.value })
          }
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Masukkan tindakan perbaikan yang dilakukan"
          required
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
          required
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
          required
        />
      </div>

      <div className="input-group">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Dokumentasi
        </label>
        <input
          type="text"
          value={formData.dokumentasi}
          onChange={(e) =>
            setFormData({ ...formData, dokumentasi: e.target.value })
          }
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Masukkan URL atau path dokumentasi"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="input-group">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Jenis Pesawat
          </label>
          <input
            type="text"
            value={formData.jenis_pesawat}
            onChange={(e) => setFormData({ ...formData, jenis_pesawat: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Masukkan jenis pesawat"
          />
        </div>
      </div>

      <div className="flex justify-center pt-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-8 py-3 font-medium rounded-lg transition-opacity ${
            isSubmitting
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-gradient-to-r from-[#72BB34] to-[#40A3DC] text-white hover:opacity-90"
          }`}
        >
          {isSubmitting ? "Menyimpan..." : "Submit"}
        </button>
      </div>
    </form>
  );
}

export type { BirdStrikeFormData };
