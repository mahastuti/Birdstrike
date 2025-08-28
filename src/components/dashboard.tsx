'use client';

import { useState } from 'react';
import { BarChart3, LayoutDashboard, Map, Image as ImageIcon, FileBarChart } from 'lucide-react';

export default function Dashboard() {
  const [selectedSidebarOption, setSelectedSidebarOption] = useState('dashboard');
  const [showPopup, setShowPopup] = useState(false);
  const [predictionResult, setPredictionResult] = useState('0.98674');
  
  const [formData, setFormData] = useState({
    tahun: '',
    tanggal: '',
    bulan: '',
    jam: '',
    waktu: '',
    cuaca: '',
    jumlahBurung: '',
    titik: '',
    fase: '',
    strike: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePredict = () => {
    const randomResult = (Math.random() * 0.3 + 0.7).toFixed(5);
    setPredictionResult(randomResult);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

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
            onClick={() => setSelectedSidebarOption('gambar')}
            className={`w-full text-left p-3 rounded-lg border-2 transition-colors flex items-center gap-3 ${selectedSidebarOption === 'gambar'
                ? "bg-gradient-to-r from-[#72BB34] to-[#40A3DC] border border-gray-300 text-white hover:opacity-80"
                : 'bg-[#83C8EF] font-medium text-white'
              }`}
          >
            <ImageIcon className="w-5 h-5" />
            Gambar
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
                  src="https://lookerstudio.google.com/embed/reporting/68b199fa-f042-46cd-8001-d24d9408f410/page/bpxSF"
                  className="w-full max-w-4xl h-[750px] border-0 rounded "
                  allowFullScreen
                />
              </div>
            </div>



            {/* Logout Button */}
            <div className="mt-8 mb-25 flex justify-center">
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
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Prediction Result Section */}
            <div className="bg-white border-2 border-gray-300 rounded-lg p-8">
              <h2 className="text-xl font-medium text-center mb-6">Peluang Terjadinya bird strike</h2>

              <div className="bg-gray-100 border-2 border-gray-300 rounded-lg p-8 mb-6">
                <div className="text-4xl font-bold text-center mb-2">{predictionResult}</div>
              </div>

              <p className="text-center text-gray-700 mb-6">berbasi prediksi</p>

              <div className="text-center">
                <button
                  onClick={handlePredict}
                  className="bg-gray-300 hover:bg-gray-400 border-2 border-gray-300 px-8 py-3 rounded-lg font-medium transition-colors"
                >
                  predict
                </button>
              </div>
            </div>

            {/* Input Form Section */}
            <div className="bg-white border-2 border-gray-300 rounded-lg p-6">
              <h3 className="text-lg font-medium text-center mb-6">Input Data Prediksi</h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Tahun</label>
                  <input
                    type="text"
                    value={formData.tahun}
                    onChange={(e) => handleInputChange('tahun', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="2024"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Tanggal</label>
                  <input
                    type="text"
                    value={formData.tanggal}
                    onChange={(e) => handleInputChange('tanggal', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="15"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Bulan</label>
                  <input
                    type="text"
                    value={formData.bulan}
                    onChange={(e) => handleInputChange('bulan', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="January"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Jam</label>
                  <input
                    type="text"
                    value={formData.jam}
                    onChange={(e) => handleInputChange('jam', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="14:30"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Waktu</label>
                  <input
                    type="text"
                    value={formData.waktu}
                    onChange={(e) => handleInputChange('waktu', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Siang"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Cuaca</label>
                  <input
                    type="text"
                    value={formData.cuaca}
                    onChange={(e) => handleInputChange('cuaca', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Cerah"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Jumlah Burung pada Titik X</label>
                  <input
                    type="text"
                    value={formData.jumlahBurung}
                    onChange={(e) => handleInputChange('jumlahBurung', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="25"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Titik</label>
                  <input
                    type="text"
                    value={formData.titik}
                    onChange={(e) => handleInputChange('titik', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="A1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Fase</label>
                  <input
                    type="text"
                    value={formData.fase}
                    onChange={(e) => handleInputChange('fase', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Takeoff"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Strike</label>
                  <input
                    type="text"
                    value={formData.strike}
                    onChange={(e) => handleInputChange('strike', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Yes/No"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedSidebarOption === 'map' && (
          <div className="space-y-6">
            <div className="bg-white border-2 border-gray-300 rounded-lg">
              <div className="p-3 bg-[#40A3DC] border-b border-gray-300 rounded-t-lg">
                <h2 className="text-2xl font-medium text-center text-white">MAP</h2>
              </div>
              <div className="p-8">
                <div className="h-96 bg-gray-100 border-2 border-gray-300 rounded-lg flex items-center justify-center">
                  <p className="text-gray-700 text-lg">Map content will be displayed here</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedSidebarOption === 'gambar' && (
          <div className="space-y-6">
            <div className="bg-white border-2 border-gray-300 rounded-lg">
              <div className="p-3 bg-[#40A3DC] border-b border-gray-300 rounded-t-lg">
                <h2 className="text-2xl font-medium text-center text-white">GAMBAR</h2>
              </div>
              <div className="p-8">
                <div className="h-96 bg-gray-100 border-2 border-gray-300 rounded-lg flex items-center justify-center">
                  <p className="text-gray-700 text-lg">Image gallery will be displayed here</p>
                </div>
              </div>
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

      {/* Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg max-w-md w-full mx-4 text-center">
            <h3 className="text-lg font-medium mb-4">Hasil Prediksi</h3>
            <p className="text-gray-700 mb-6">
              Peluang terjadinya birdstrike pada titik {formData.titik || 'X'} tahun {formData.tahun || '2024'} adalah {predictionResult}
            </p>
            <button
              onClick={closePopup}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
