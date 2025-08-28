'use client';

import { useState } from 'react';
import { Bird, Plane, Zap } from 'lucide-react';
import BirdStrikeForm, { type BirdStrikeFormData } from '@/components//forms/BirdStrikeForm';
import TrafficFlightForm, { type TrafficFlightFormData } from '@/components/forms/TrafficFlightForm';
import BirdSpeciesForm, { type BirdSpeciesFormData } from '@/components/forms/BirdSpeciesForm';

// =====================================================================================================================
// =====================================================================================================================

export default function DashboardInputData() {
  const [selectedForm, setSelectedForm] = useState<'bird-strike' | 'bird-species' | 'traffic-flight'>('bird-strike');
  const [submitMessage, setSubmitMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleBirdStrikeSubmit = async (data: BirdStrikeFormData) => {
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const formData = new FormData();

      // Add all form fields to FormData
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'dokumentasi_form' && value instanceof File) {
          formData.append(key, value);
        } else if (value !== null) {
          formData.append(key, value.toString());
        }
      });

      const response = await fetch('/api/bird-strike', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setSubmitMessage('Data bird strike berhasil disimpan');
        setIsSuccess(true);
      } else {
        throw new Error(result.message || 'Gagal menyimpan data bird strike');
      }
    } catch (error) {
      console.error('Error submitting bird strike data:', error);
      setSubmitMessage(error instanceof Error ? error.message : 'Terjadi kesalahan saat menyimpan data');
      setIsSuccess(false);
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitMessage(''), 3000);
    }
  };

  const handleBirdSpeciesSubmit = async (data: BirdSpeciesFormData) => {
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const response = await fetch('/api/bird-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitMessage('Data bird species berhasil disimpan');
        setIsSuccess(true);
      } else {
        throw new Error(result.message || 'Gagal menyimpan data bird species');
      }
    } catch (error) {
      console.error('Error submitting bird species data:', error);
      setSubmitMessage(error instanceof Error ? error.message : 'Terjadi kesalahan saat menyimpan data');
      setIsSuccess(false);
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitMessage(''), 3000);
    }
  };

  const handleTrafficFlightSubmit = async (data: TrafficFlightFormData) => {
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      if (!data.csvFile) {
        throw new Error('Silakan pilih file CSV terlebih dahulu');
      }

      const formData = new FormData();
      formData.append('csvFile', data.csvFile);

      const response = await fetch('/api/traffic-flight', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setSubmitMessage('File traffic flight berhasil diupload');
        setIsSuccess(true);
      } else {
        throw new Error(result.message || 'Gagal mengupload file traffic flight');
      }
    } catch (error) {
      console.error('Error submitting traffic flight data:', error);
      setSubmitMessage(error instanceof Error ? error.message : 'Terjadi kesalahan saat mengupload file');
      setIsSuccess(false);
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitMessage(''), 3000);
    }
  };

  return (
    <div className="bg-white border-2 border-gray-300 rounded-lg mt-6">
      <div className="p-3 bg-[#40A3DC] border-b border-gray-300 rounded-t-lg">
        <h2 className="text-2xl font-medium text-center text-white">INPUT DATA</h2>
      </div>
      
      <div className="p-6">
        {/* Form Selection Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-8">
          <button
            onClick={() => setSelectedForm('bird-strike')}
            className={`group relative p-6 rounded-lg font-medium text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl border-2 ${
              selectedForm === 'bird-strike'
                ? 'bg-gradient-to-r from-[#72BB34] to-[#40A3DC] text-white border-transparent'
                : 'bg-[#83C8EF] text-white border-transparent hover:border-gray-300'
            }`}
          >
            <div className="flex flex-col items-center gap-3">
              <Zap className="w-8 h-8 group-hover:animate-pulse" />
              <span>bird strike</span>
            </div>
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
          </button>

          <button
            onClick={() => setSelectedForm('bird-species')}
            className={`group relative p-6 rounded-lg font-medium text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl border-2 ${
              selectedForm === 'bird-species'
                ? 'bg-gradient-to-r from-[#72BB34] to-[#40A3DC] text-white border-transparent'
                : 'bg-[#83C8EF] text-white border-transparent hover:border-gray-300'
            }`}
          >
            <div className="flex flex-col items-center gap-3">
              <Bird className="w-8 h-8 group-hover:animate-pulse" />
              <span>bird species</span>
            </div>
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
          </button>

          <button
            onClick={() => setSelectedForm('traffic-flight')}
            className={`group relative p-6 rounded-lg font-medium text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl border-2 ${
              selectedForm === 'traffic-flight'
                ? 'bg-gradient-to-r from-[#72BB34] to-[#40A3DC] text-white border-transparent'
                : 'bg-[#83C8EF] text-white border-transparent hover:border-gray-300'
            }`}
          >
            <div className="flex flex-col items-center gap-3">
              <Plane className="w-8 h-8 group-hover:animate-pulse" />
              <span>traffic flight</span>
            </div>
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
          </button>
        </div>

        {/* Form Content */}
        <div className="max-w-4xl mx-auto">
          {selectedForm === 'bird-strike' && (
            <BirdStrikeForm onSubmit={handleBirdStrikeSubmit} isSubmitting={isSubmitting} />
          )}

          {selectedForm === 'bird-species' && (
            <BirdSpeciesForm onSubmit={handleBirdSpeciesSubmit} isSubmitting={isSubmitting} />
          )}

          {selectedForm === 'traffic-flight' && (
            <TrafficFlightForm onSubmit={handleTrafficFlightSubmit} isSubmitting={isSubmitting} />
          )}

          {/* Success/Error Message */}
          {submitMessage && (
            <div className={`px-4 py-3 rounded-lg text-center font-medium mt-4 ${
              isSuccess
                ? 'bg-green-100 border border-green-200 text-green-800'
                : 'bg-red-100 border border-red-200 text-red-800'
            }`}>
              {submitMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
