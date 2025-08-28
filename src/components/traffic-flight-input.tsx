"use client";

import { useState } from "react";

interface TrafficFlightData {
  csvFile: File | null;
  showInstructions: boolean;
}

export default function TrafficFlightInput() {
  const [data, setData] = useState<TrafficFlightData>({
    csvFile: null,
    showInstructions: false,
  });
  const [submitMessage, setSubmitMessage] = useState("");

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-red-100 border-2 border-red-300 rounded-lg p-4">
        <button
          onClick={() =>
            setData({ ...data, showInstructions: !data.showInstructions })
          }
          className="w-full text-left font-medium text-red-800 flex items-center justify-between"
        >
          <span>Dropdown to show cara upload csv</span>
          <span
            className={`transform transition-transform ${
              data.showInstructions ? "rotate-180" : ""
            }`}
          >
            ▼
          </span>
        </button>

        {data.showInstructions && (
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
                setData({ ...data, csvFile: e.target.files?.[0] || null })
              }
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

          {data.csvFile && (
            <div className="bg-white p-3 rounded border-2 border-red-300 mb-4">
              <p className="text-red-800 font-medium">
                File dipilih: {data.csvFile.name}
              </p>
              <p className="text-sm text-gray-600">
                Ukuran: {(data.csvFile.size / 1024).toFixed(2)} KB
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-center pt-6">
        <button
          onClick={() => {
            if (data.csvFile) {
              setSubmitMessage("berhasil input");
              setTimeout(() => setSubmitMessage(""), 3000);
              setData({ csvFile: null, showInstructions: false });
            } else {
              setSubmitMessage("Silakan pilih file CSV terlebih dahulu");
              setTimeout(() => setSubmitMessage(""), 3000);
            }
          }}
          disabled={!data.csvFile}
          className={`px-8 py-3 font-medium rounded-lg transition-opacity ${
            data.csvFile
              ? "bg-gradient-to-r from-[#72BB34] to-[#40A3DC] text-white hover:opacity-90"
              : "bg-gray-400 text-white cursor-not-allowed"
          }`}
        >
          Upload CSV
        </button>
      </div>

      {submitMessage && (
        <div
          className={`px-4 py-3 rounded-lg text-center font-medium ${
            submitMessage.includes("berhasil")
              ? "bg-green-100 border border-green-200 text-green-800"
              : "bg-red-100 border border-red-200 text-red-800"
          }`}
        >
          {submitMessage}
        </div>
      )}
    </div>
  );
}