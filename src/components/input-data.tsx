'use client';

import { useRouter } from 'next/navigation';
import { BarChart3, LayoutDashboard, Map, Image as ImageIcon, FileBarChart, Bird, Plane, Zap } from 'lucide-react';

export default function InputData() {
  const router = useRouter();

  const handleNavigateToInput = (inputType: string) => {
    router.push(`/${inputType}`);
  };

  return (
    <div className="min-h-screen flex bg-[#EEF5FF]">
      {/* Sidebar */}
      <div className="w-64 bg-white p-6 border-r border-gray-300">
        <div className="space-y-4">
          <button
            onClick={() => router.push('/dashboard')}
            className="w-full text-left p-3 rounded-lg border-2 transition-colors flex items-center gap-3 bg-[#83C8EF] font-medium text-white"
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </button>

          <button
            className="w-full text-left p-3 rounded-lg border-2 transition-colors flex items-center gap-3 bg-gradient-to-r from-[#72BB34] to-[#40A3DC] border-gray-300 text-white hover:opacity-80"
          >
            <BarChart3 className="w-5 h-5" />
            Input Data
          </button>

          <button
            onClick={() => router.push('/data')}
            className="w-full text-left p-3 rounded-lg border-2 transition-colors flex items-center gap-3 bg-[#83C8EF] font-medium text-white"
          >
            <Map className="w-5 h-5" />
            Data
          </button>

          <button
            className="w-full text-left p-3 rounded-lg border-2 transition-colors flex items-center gap-3 bg-[#83C8EF] font-medium text-white"
          >
            <ImageIcon className="w-5 h-5" />
            Gambar
          </button>

          <button
            className="w-full text-left p-3 rounded-lg border-2 transition-colors flex items-center gap-3 bg-[#83C8EF] font-medium text-white"
          >
            <FileBarChart className="w-5 h-5" />
            Analisis
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Input Data Section */}
          <div className="bg-white border-2 border-gray-300 rounded-lg">
            <div className="p-3 bg-[#40A3DC] border-b border-gray-300 rounded-t-lg">
              <h2 className="text-2xl font-medium text-center text-white">INPUT DATA</h2>
            </div>
            
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                {/* Bird Strike Button */}
                <button
                  onClick={() => handleNavigateToInput('bird-strike-input')}
                  className="group relative bg-gradient-to-r from-[#72BB34] to-[#40A3DC] text-white p-6 rounded-lg font-medium text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl border-2 border-transparent hover:border-gray-300"
                >
                  <div className="flex flex-col items-center gap-3">
                    <Zap className="w-8 h-8 group-hover:animate-pulse" />
                    <span>bird strike</span>
                  </div>
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                </button>

                {/* Bird Species Button */}
                <button
                  onClick={() => handleNavigateToInput('bird-species-input')}
                  className="group relative bg-gradient-to-r from-[#72BB34] to-[#40A3DC] text-white p-6 rounded-lg font-medium text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl border-2 border-transparent hover:border-gray-300"
                >
                  <div className="flex flex-col items-center gap-3">
                    <Bird className="w-8 h-8 group-hover:animate-pulse" />
                    <span>bird species</span>
                  </div>
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                </button>

                {/* Traffic Flight Button */}
                <button
                  onClick={() => handleNavigateToInput('traffic-flight-input')}
                  className="group relative bg-gradient-to-r from-[#72BB34] to-[#40A3DC] text-white p-6 rounded-lg font-medium text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl border-2 border-transparent hover:border-gray-300"
                >
                  <div className="flex flex-col items-center gap-3">
                    <Plane className="w-8 h-8 group-hover:animate-pulse" />
                    <span>traffic flight</span>
                  </div>
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                </button>
              </div>

              {/* Description */}
              <div className="mt-8 text-center">
                <p className="text-gray-600 text-sm">
                  Pilih jenis data yang ingin Anda input untuk sistem monitoring bird strike
                </p>
              </div>
            </div>
          </div>

          {/* Quick Stats Section */}
          <div className="bg-white border-2 border-gray-300 rounded-lg p-6">
            <h3 className="text-lg font-medium text-center mb-4">Status Input Data</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="text-2xl font-bold text-blue-600">0</div>
                <div className="text-sm text-gray-600">Bird Strike Records</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="text-2xl font-bold text-green-600">0</div>
                <div className="text-sm text-gray-600">Bird Species Records</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <div className="text-2xl font-bold text-purple-600">0</div>
                <div className="text-sm text-gray-600">Traffic Flight Records</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
