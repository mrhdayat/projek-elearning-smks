// src/pages/ForgotPasswordPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });
      if (error) throw error;
      setMessage('Email untuk reset password telah dikirim! Silakan periksa kotak masuk Anda.');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Lupa Password</h1>
        <p className="text-gray-600 mb-6">Masukkan email Anda, dan kami akan mengirimkan link untuk mereset password Anda.</p>

        {message && <p className="bg-green-100 text-green-700 p-3 rounded-lg mb-4">{message}</p>}
        {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="email">Email</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 border rounded-lg" required />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-300">
            {loading ? 'Mengirim...' : 'Kirim Link Reset'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-6">
          Ingat password Anda? <Link to="/login" className="font-semibold text-blue-600 hover:underline">Kembali ke Login.</Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;