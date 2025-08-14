// src/pages/UpdatePasswordPage.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function UpdatePasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validasi sederhana: pastikan password cocok
    if (password !== confirmPassword) {
      setError('Password dan konfirmasi password tidak cocok.');
      return;
    }
    if (password.length < 6) {
        setError('Password minimal harus 6 karakter.');
        return;
    }

    setLoading(true);
    setMessage('');
    setError('');

    try {
      // Supabase-js secara otomatis menggunakan token dari URL
      const { error } = await supabase.auth.updateUser({ password: password });
      
      if (error) throw error;
      
      setMessage('Password berhasil diperbarui! Anda akan diarahkan ke halaman login.');
      setTimeout(() => {
        navigate('/login');
      }, 3000);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Atur Password Baru</h1>
        <p className="text-gray-600 mb-6">Masukkan password baru Anda di bawah ini.</p>
        
        {message && <p className="bg-green-100 text-green-700 p-3 rounded-lg mb-4">{message}</p>}
        {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="password">Password Baru</label>
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 border rounded-lg" required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500">
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="confirmPassword">Konfirmasi Password Baru</label>
            <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full p-3 border rounded-lg" required />
          </div>
          <button type="submit" disabled={loading || message} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-300">
            {loading ? 'Menyimpan...' : 'Simpan Password Baru'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpdatePasswordPage;