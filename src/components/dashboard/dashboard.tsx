'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { BarChart3, LayoutDashboard, Map, FileBarChart } from 'lucide-react';
import DashboardInputData from '@/components/dashboard/dashboard-input-data';
import PredictSection from '@/components/dashboard/predict-section';

const MapControls = dynamic(() => import('./map-controls'), { ssr: false });

export default function Dashboard() {
  const [selectedSidebarOption, setSelectedSidebarOption] = useState('dashboard');


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
                  src="https://lookerstudio.google.com/embed/reporting/527a0a62-796f-4889-85e2-14c548a217b6/page/p_e6wi3mstud"
                  className="w-full max-w-4xl h-[750px] border-0 rounded "
                  loading="lazy"
                  allowFullScreen
                />
              </div>
            </div>

            {/* Input Data Section */}
            <DashboardInputData />

            {/* Logout Button */}
            <div className="mt-8 mb-17 flex justify-center">
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
          <PredictSection />
        )}

        {selectedSidebarOption === 'map' && (
          <div className="space-y-6">
            <div className="bg-white border-2 border-gray-300 rounded-lg">
              <div className="p-3 bg-[#40A3DC] border-b border-gray-300 rounded-t-lg">
                <h2 className="text-2xl font-medium text-center text-white">MAP</h2>
              </div>
              <MapControls />
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

    </div>
  );
}
