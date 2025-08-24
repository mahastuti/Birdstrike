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

  // values are replaced at build time
  const expectedUsername = process.env.NEXT_PUBLIC_USERNAME ?? '';
  const expectedPassword = process.env.NEXT_PUBLIC_PASSWORD ?? '';

  useEffect(() => {
    try {
      const savedAuth = localStorage.getItem('isAuthenticated');
      if (savedAuth === 'true') setIsAuthenticated(true);
    } catch (error) {
      console.warn('localStorage not available:', error);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (username === expectedUsername && password === expectedPassword) {
      setIsAuthenticated(true);
      try {
        localStorage.setItem('isAuthenticated', 'true');
      } catch (error) {
        console.warn('localStorage not available:', error);
      }
      setError('');
    } else {
      setError('Username atau password salah');
      setPassword('');
    }
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
                required
              />
            </div>

            {error && <div className="text-red-500 text-sm text-center">{error}</div>}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#72BB34] to-[#40A3DC] relative overflow-hidden text-white py-3 px-6 rounded-lg font-medium transition-all duration-500 ease-in-out hover:scale-100 hover:shadow-xl
              before:absolute before:inset-0 before:bg-white/20 before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-500">
              Masuk
            </button>
          </form>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
