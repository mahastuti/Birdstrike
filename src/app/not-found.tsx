import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#EEF5FF]">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-gray-600 mb-4">Halaman tidak ditemukan</p>
        <Link
          href="/"
          className="px-6 py-2 bg-gradient-to-r from-[#72BB34] to-[#40A3DC] text-white rounded-lg hover:opacity-90 transition-opacity inline-block"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}