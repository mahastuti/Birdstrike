'use client';

import { useState, useEffect } from 'react';

interface AuthWrapperProps {
  children: React.ReactNode;
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      setIsAuthenticated(localStorage.getItem('isAuthenticated') === 'true');
    } catch {}
    setIsLoading(false);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // ❗️HANYA UNTUK DEMO:
    // Ganti dengan call ke /api/auth/login (lihat opsi B) untuk beneran.
    const ok = username.trim() && password.trim(); // demo rule
    if (ok) {
      setIsAuthenticated(true);
      try {
        localStorage.setItem('isAuthenticated', 'true');
      } catch {}
      setError('');
      setPassword('');
    } else {
      setError('Username atau password salah');
      setPassword('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    try {
      localStorage.removeItem('isAuthenticated');
    } catch {}
  };

  if (isLoading) return null;

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 backdrop-blur-sm bg-[#EEF5FF]/80 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg max-w-md w-full mx-4 border-2 border-gray-300">
          <h3 className="text-xl font-medium mb-6 text-center text-gray-800">Welcome!</h3>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Masukkan username"
                autoComplete="username"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-black p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Masukkan password"
                autoComplete="current-password"
                required
              />
            </div>

            {error && <div className="text-red-500 text-sm text-center">{error}</div>}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#72BB34] to-[#40A3DC] relative overflow-hidden text-white py-3 px-6 rounded-lg font-medium transition-all duration-500 ease-in-out hover:shadow-xl
              before:absolute before:inset-0 before:bg-white/20 before:-translate-x-full hover:before:translate-x-full before:transition-transform before:duration-500">
              Masuk
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="fixed top-3 right-3 z-50">
        <button
          onClick={handleLogout}
          className="px-3 py-1.5 text-sm rounded-md border bg-white hover:bg-gray-50"
          aria-label="Logout"
        >
          Logout
        </button>
      </div>
      {children}
    </>
  );
}
