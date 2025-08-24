"use client"

import { useState } from "react";

export default function Data() {
  const [selectedDataType, setSelectedDataType] = useState('bird-strike');

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
          <div className="p-6 flex justify-center space-x-8 bg-white">
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

          {/* Embed Spreadsheet Area */}
          <div className="bg-white p-6">
            <div className="h-200">
              {selectedDataType === 'bird-strike' && (
                <iframe
                  src="https://docs.google.com/spreadsheets/d/e/2PACX-1vSDMioGHSBvMY2E2QvVTik05l8A5higkD2hH5NZGc8y71T1rfyunKTsNsxS2W7JH2-t97Hnm572CaZq/pubhtml?gid=909981323&single=true&widget=true&headers=false"
                  className="w-full h-full border-0 rounded"
                  title="Bird Strike Data"
                />
              )}
              {selectedDataType === 'bird-species' && (
                <iframe
                  src="https://docs.google.com/spreadsheets/d/e/2PACX-1vSDMioGHSBvMY2E2QvVTik05l8A5higkD2hH5NZGc8y71T1rfyunKTsNsxS2W7JH2-t97Hnm572CaZq/pubhtml?gid=533811830&single=true&widget=true&headers=false"
                  className="w-full h-full border-0 rounded"
                  title="Bird Species Data"
                />
              )}
              {selectedDataType === 'traffic-flight' && (
                <iframe
                  src="https://docs.google.com/spreadsheets/d/e/2PACX-1vSDMioGHSBvMY2E2QvVTik05l8A5higkD2hH5NZGc8y71T1rfyunKTsNsxS2W7JH2-t97Hnm572CaZq/pubhtml?gid=1761942450&single=true&widget=true&headers=false"
                  className="w-full h-full border-0 rounded"
                  title="Traffic Flight Data"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
