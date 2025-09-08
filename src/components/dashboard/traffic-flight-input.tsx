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

      let response = await fetch('/api/traffic-flight', {
        method: 'POST',
        body: formData,
      });

      let result = await response.json();

      if (response.status === 409 && result?.needsConfirm) {
        const list = (result.conflicts as Array<{bulan:string; tahun:string; existing:number}>).map(c => `• Bulan ${c.bulan ?? '-'} Tahun ${c.tahun ?? '-'} (${c.existing} baris)`).join('\n');
        const ok = typeof window !== 'undefined' ? window.confirm(`Data untuk kombinasi berikut sudah ada:\n${list}\n\nGanti (replace) data lama dengan data baru?`) : false;
        if (!ok) {
          setSubmitMessage('Upload dibatalkan. Data lama dipertahankan.');
          setIsSuccess(false);
          return;
        }
        response = await fetch('/api/traffic-flight?replace=true', { method: 'POST', body: formData });
        result = await response.json();
      }

      if (result.success) {
        let msg = `Berhasil import ${result.count} baris`;
        if (typeof result.skipped === 'number' && result.skipped > 0) {
          msg += ` (lewati duplikat: ${result.skipped})`;
        }
        if (Array.isArray(result.replaced) && result.replaced.length > 0) {
          const det = result.replaced.map((r: { bulan: string | null; tahun: string | null; deleted: number }) => `Bulan ${r.bulan ?? '-'} Tahun ${r.tahun ?? '-'} (${r.deleted} dihapus)`).join(', ');
          msg += `. Replace: ${det}`;
        }
        setSubmitMessage(msg);
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
