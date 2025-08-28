"use client";

import { useState } from "react";
import TrafficFlightForm, { type TrafficFlightFormData } from "@/components/forms/TrafficFlightForm";

export default function TrafficFlightInput() {
  const [submitMessage, setSubmitMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (data: TrafficFlightFormData) => {
    setIsSubmitting(true);
    setSubmitMessage("");

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
      setTimeout(() => setSubmitMessage(""), 3000);
    }
  };

  return (
    <div className="space-y-6">
      <TrafficFlightForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />

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
