"use client";

import { useState } from "react";
import BirdSpeciesForm, { type BirdSpeciesFormData } from "@/components/forms/BirdSpeciesForm";

export default function BirdSpeciesInput() {
  const [submitMessage, setSubmitMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (data: BirdSpeciesFormData) => {
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

  return (
    <div className="space-y-6">
      <BirdSpeciesForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />

      {submitMessage && (
        <div className={`px-4 py-3 rounded-lg text-center font-medium ${
          isSuccess
            ? 'bg-green-100 border border-green-200 text-green-800'
            : 'bg-red-100 border border-red-200 text-red-800'
        }`}>
          {submitMessage}
        </div>
      )}
    </div>
  );
}
