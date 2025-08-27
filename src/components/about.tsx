"use client"

import Image from "next/image";
import { assets } from "@/assets/assets";

export default function About() {
  return (
    <div className="min-h-screen bg-[#EEF5FF] p-8">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Tentang Proyek Section */}
        <div>
          <h2 className="text-3xl font-medium text-center mb-5 text-black">Tentang Proyek</h2>
          <div className="bg-white border-2 border-gray-400 rounded-lg p-8">
            <div className="flex items-center gap-8">
              {/* Photo and info */}
              <div className="flex flex-col items-center flex-shrink-0">
                <div className="w-64 h-64 bg-yellow-200 rounded-full flex items-center justify-center text-gray-700 font-medium">
                  <Image src={assets.pakbagus.src} alt="Pak Bagus" width={256} height={256} className="w-full h-full object-cover rounded-full" />
                </div>
              </div>
              {/* Text area */}
              <div className="flex-1 bg-white p-2 rounded">
                <div className="text-black text-justify">
                  Proyek ini menggabungkan dashboard interaktif dan model prediksi <i>machine learning</i> agar terintegrasi secara <i>real-time </i>
                  dengan data terbaru yang diinput. <br/><br/>
                  Di bawah bimbingan dan arahan <b>Bapak Bagus Yuliono</b> sebagai Senior Manager Divisi Safety, proyek ini dikerjakan pada program 
                  magang mandiri dari Departemen Statistika ITS oleh
                  <a href="https://www.linkedin.com/in/alifmuhmahrus/" target="_blank" rel="noopener noreferrer"> Mahrus Alif </a>
                  dan <a href="https://www.linkedin.com/in/mahastuti/" target="_blank" rel="noopener noreferrer">Nalini Mahastuti</a>.

                </div>
                <div className="flex gap-10 mt-5">
                  <div className="flex-1 text-black text-justify">
                    <h3 className="text-l font-medium mb-2">Tech Stack & Tools:</h3>
                    <ul className="list-disc list-inside">
                      <li>Next.js</li>
                      <li>PostgreSQL & Prisma</li>
                      <li>Supabase & TablePlus</li>
                      <li>Python & Flask</li>
                      <li>Github & Vercel</li>
                      <li>Google Looker Studio</li>
                      <li>Figma</li>
                    </ul>
                  </div>
                  <div className="flex-1 text-black text-left">
                    <h3 className="text-l font-medium mb-2">Fitur Utama:</h3>
                    <ul className="list-disc list-inside">
                      <li>Input data terintegrasi</li>
                      <li>Dashboard real-time</li>
                      <li>Visualisasi interaktif</li>
                      <li>Model prediksi bird strike</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Saran dan Evaluasi + Versi Section */}
        <div className="flex gap-6 mb-16">
          <div className="flex-2 h-auto">
            <h2 className="text-3xl font-medium text-center mb-5 text-black">Saran Pengembangan</h2>
            <div className="text-black text-justify bg-white border-2 border-gray-400 rounded-lg p-8">
              <p className="mb-3">Proyek ini masih berada pada tahap pengembangan awal. Kedepannya, diharapkan dapat terus dikembangkan, dengan evaluasi:</p>
              <ul className="list-disc list-inside space-y-1 text-left">
                <li>Data burung terbatas, sehingga model juga didasarkan pada burung2 itu </li>
              </ul>
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-medium text-center mb-5 text-black">Versi</h2>
            <div className="text-gray-400 text-justify bg-white border-2 border-gray-400 rounded-lg p-8">
              1.0.0 Rilis awal<br/>
              1.1.0 &nbsp;Integrasi Database
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
