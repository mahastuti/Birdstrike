"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";

interface TrafficFlightFormData {
  csvFile: File | null;
}

type TrafficFlightFormProps = {
  onSubmit?: (data: TrafficFlightFormData) => Promise<void>;
  isSubmitting?: boolean;
}

export default function TrafficFlightForm({ onSubmit, isSubmitting = false }: TrafficFlightFormProps) {
  const [formData, setFormData] = useState<TrafficFlightFormData>({
    csvFile: null,
  });
  const [showInstructions, setShowInstructions] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.csvFile) {
      throw new Error("Silakan pilih file CSV terlebih dahulu");
    }
    if (onSubmit) {
      await onSubmit(formData);
    }
    // Reset form after successful submission
    setFormData({ csvFile: null });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-gray-100 border-2 border-gray-300 rounded-lg p-4">
        <button
          type="button"
          onClick={() => setShowInstructions(!showInstructions)}
          className="w-full text-left font-medium text-black flex items-center justify-between"
        >
          <span>Cara Upload File CSV</span>
          <span
            className={`transform transition-transform ${showInstructions ? "rotate-180" : ""
              }`}
          >
            ▼
          </span>
        </button>

        {showInstructions && (
          <div className="mt-4 space-y-3 text-black">
            <div className="font-medium">1. Siapkan CSV data "Flight Movement Flight"</div>
            <div className="font-medium">2. Kolom pada data tersebut tidak bisa langsung dibaca karena bentuknya seperti:</div>
            <div className="bg-white p-3 rounded border">
              <Image
                src={assets.map6.src}
                alt="Contoh tampilan kolom data tidak langsung terbaca"
                width={900}
                height={600}
                className="w-full h-auto rounded"
              />
            </div>
            <div className="font-medium">
              3. Susun kolom menjadi SEJAJAR semua seperti ini, dan TAMBAHKAN kolom "bulan" dan "tahun" dan HILANGKAN watermark:
            </div>
            <div className="bg-white p-3 rounded border">
              <p className="text-sm text-gray-700 mb-2">Kolom Data:</p>
              <div className="text-[11px] font-mono bg-gray-50 p-2 rounded overflow-x-auto">
                <div>
                  no|act_type|reg_no|opr|flight_number_origin|flight_number_dest|ata|block_on|block_off|atd|ground_time|org|des|ps|runway|avio_a|avio_d|f_stat|bulan|tahun
                </div>
              </div>
            </div>
            <div className="bg-white p-3 rounded border">
              <p className="text-sm text-gray-700 mb-2">Contoh data:</p>
              <div className="text-[11px] font-mono bg-gray-50 p-2 rounded overflow-x-auto">
                <div>
                  1,B738,PKLKP,LNI,LNI681,LNI878,31/15:51,31/15:56,01/04:59,01/05:07,13:02:08,PKY,AMQ,018,28,0,0,NML,1,2025
                </div>
                <div>
                  2,A320,PKAZQ,AWQ,AWQ327,AWQ320,01/00:03,01/00:07,01/05:03,01/05:13,4:56:00,KUL,KUL,A03,28,1,1,NML,1,2025
                </div>
              </div>
              <p className="mt-3 text-sm text-gray-700">
                Catatan: nilai yang mengandung koma harus dibungkus tanda kutip agar dianggap 1 kolom. Contoh ground_time:
                <span className="ml-1 font-mono">"5 days, 20:10:00"</span> atau <span className="font-mono">'1 day, 08:21:00'</span>.
                Keduanya akan terbaca sebagai satu kolom, tidak dipecah.
              </p>
              <div className="mt-3">
                <a
                  href="/assets/data_kjelek.xlsx"
                  download
                  className="inline-block text-sm font-medium text-blue-600 hover:underline"
                >
                  File Contoh Benar
                </a>
              </div>
            </div>
            <div className="font-medium">4. Upload</div>
          </div>
        )}
      </div>

      <div className="bg-gray-100 border-2 border-gray-300 rounded-lg p-8">
        <div className="text-center">
          <div className="mb-4">
            <label className="block text-lg font-medium text-black mb-4">
              Upload File CSV
            </label>
            <input
              type="file"
              accept=".csv"
              onChange={(e) =>
                setFormData({ ...formData, csvFile: e.target.files?.[0] || null })
              }
              className="hidden"
              id="csv-upload"
              required
            />
            <label
              htmlFor="csv-upload"
              className="cursor-pointer inline-block bg-gray-300 hover:bg-gray-400 text-black font-medium py-3 px-8 rounded-lg border-2 border-gray-400 transition-colors"
            >
              Pilih File CSV
            </label>
          </div>

          {formData.csvFile && (
            <div className="bg-white p-3 rounded border-2 border-gray-300 mb-4">
              <p className="text-black font-medium">
                File dipilih: {formData.csvFile.name}
              </p>
              <p className="text-sm text-gray-600">
                Ukuran: {(formData.csvFile.size / 1024).toFixed(2)} KB
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-center pt-6">
        <button
          type="submit"
          disabled={!formData.csvFile || isSubmitting}
          className={`px-8 py-3 font-medium rounded-lg transition-opacity ${formData.csvFile && !isSubmitting
            ? "bg-gradient-to-r from-[#72BB34] to-[#40A3DC] text-white hover:opacity-90"
            : "bg-gray-400 text-white cursor-not-allowed"
            }`}
        >
          {isSubmitting ? "Mengupload..." : "Upload CSV"}
        </button>
      </div>
    </form>
  );
}

export type { TrafficFlightFormData };
