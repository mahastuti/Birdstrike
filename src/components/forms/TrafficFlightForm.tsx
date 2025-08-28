"use client";

import { useState } from "react";

interface TrafficFlightFormData {
  csvFile: File | null;
}

interface TrafficFlightFormProps {
  onSubmit: (data: TrafficFlightFormData) => Promise<void>;
  isSubmitting?: boolean;
}

export default function TrafficFlightForm({ onSubmit, isSubmitting = false }: TrafficFlightFormProps) {
  const [formData, setFormData] = useState<TrafficFlightFormData>({
    csvFile: null,
  });
  const [showInstructions, setShowInstructions] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.csvFile) {
      throw new Error("Silakan pilih file CSV terlebih dahulu");
    }
    await onSubmit(formData);
    // Reset form after successful submission
    setFormData({ csvFile: null });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-red-100 border-2 border-red-300 rounded-lg p-4">
        <button
          type="button"
          onClick={() => setShowInstructions(!showInstructions)}
          className="w-full text-left font-medium text-red-800 flex items-center justify-between"
        >
          <span>Dropdown to show cara upload csv</span>
          <span
            className={`transform transition-transform ${
              showInstructions ? "rotate-180" : ""
            }`}
          >
            ▼
          </span>
        </button>

        {showInstructions && (
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
            <label className="block text-lg font-medium text-red-800 mb-4">
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
              className="cursor-pointer inline-block bg-red-300 hover:bg-red-400 text-red-800 font-medium py-3 px-8 rounded-lg border-2 border-red-400 transition-colors"
            >
              Pilih File CSV
            </label>
          </div>

          {formData.csvFile && (
            <div className="bg-white p-3 rounded border-2 border-red-300 mb-4">
              <p className="text-red-800 font-medium">
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
          className={`px-8 py-3 font-medium rounded-lg transition-opacity ${
            formData.csvFile && !isSubmitting
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
