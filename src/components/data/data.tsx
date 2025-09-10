"use client"

import { useState } from "react";
import DataTable from "@/components/data/data-table";

export default function Data() {
  const [selectedDataType, setSelectedDataType] = useState('bird-strike');
  const [exportScope, setExportScope] = useState<'all' | 'filtered'>('all');

  return (
    <div className="min-h-screen bg-[#EEF5FF] p-8 mb-22">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-medium text-gray-800">Data</h1>
      </div>

      {/* Main Content Card */}
      <div className="max-w-6xl mx-auto">
        <div className="bg-white border-2 border-gray-300 rounded-lg overflow-hidden">

          {/* Navigation Buttons */}
          <div className="p-6 flex justify-center space-x-4 bg-white flex-wrap">
            <button
              onClick={() => setSelectedDataType('bird-strike')}
              className={`px-6 py-3 rounded-lg border-2 transition-colors ${
                selectedDataType === 'bird-strike'
                  ? 'bg-gradient-to-r from-[#72BB34] to-[#40A3DC] border border-gray-300 text-white hover:opacity-80'
                  : 'bg-[#83C8EF] font-medium text-white'
              }`}
            >
              Bird Strike
            </button>
            <button
              onClick={() => setSelectedDataType('bird-species')}
              className={`px-6 py-3 rounded-lg border-2 transition-colors ${
                selectedDataType === 'bird-species'
                  ? 'bg-gradient-to-r from-[#72BB34] to-[#40A3DC] border border-gray-300 text-white hover:opacity-80'
                  : 'bg-[#83C8EF] font-medium text-white'
              }`}
            >
              Bird Species
            </button>
            <button
              onClick={() => setSelectedDataType('traffic-flight')}
              className={`px-6 py-3 rounded-lg border-2 transition-colors ${
                selectedDataType === 'traffic-flight'
                  ? 'bg-gradient-to-r from-[#72BB34] to-[#40A3DC] border border-gray-300 text-white hover:opacity-80'
                  : 'bg-[#83C8EF] font-medium text-white'
              }`}
            >
              Traffic Flight
            </button>
            <button
              onClick={() => setSelectedDataType('modeling')}
              className={`px-6 py-3 rounded-lg border-2 transition-colors ${
                selectedDataType === 'modeling'
                  ? 'bg-gradient-to-r from-[#72BB34] to-[#40A3DC] border border-gray-300 text-white hover:opacity-80'
                  : 'bg-[#83C8EF] font-medium text-white'
              }`}
            >
              Modeling
            </button>
          </div>

          {/* Dropdown area */}
          <div className="px-6 pb-2">
            <div className="max-w-6xl mx-auto flex justify-end">
              <label className="flex items-center gap-2 text-sm">
                <span className="text-gray-700">Download:</span>
                <select
                  value={exportScope}
                  onChange={(e) => setExportScope(e.target.value as 'all' | 'filtered')}
                  className="border border-gray-300 rounded px-3 py-2 text-sm bg-white"
                >
                  <option value="all">Semua baris</option>
                  <option value="filtered">Hasil filter saat ini</option>
                </select>
              </label>
            </div>
          </div>

          {/* Content Area */}
          <div className="bg-white p-6">
            <div className="min-h-[500px]">
              {selectedDataType === 'bird-strike' && (
                <DataTable dataType="bird-strike" exportScope={exportScope} />
              )}
              {selectedDataType === 'bird-species' && (
                <DataTable dataType="bird-species" exportScope={exportScope} />
              )}
              {selectedDataType === 'traffic-flight' && (
                <DataTable dataType="traffic-flight" exportScope={exportScope} />
              )}
              {selectedDataType === 'modeling' && (
                <DataTable dataType="modeling" exportScope={exportScope} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
