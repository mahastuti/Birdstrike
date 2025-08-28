"use client";

import { useState } from "react";
import BirdStrikeForm, { type BirdStrikeFormData } from "@/components/forms/BirdStrikeForm";

export default function BirdStrikeInput() {
  const [submitMessage, setSubmitMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (data: BirdStrikeFormData) => {
    setIsSubmitting(true);
    setSubmitMessage("");

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
      setTimeout(() => setSubmitMessage(""), 3000);
    }
  };

  return (
    <div className="space-y-6">
      <BirdStrikeForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />

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
