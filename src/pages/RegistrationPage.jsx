// src/pages/RegistrationPage.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function RegistrationPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    registrationCode: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Memanggil Edge Function 'signup-student'
      const { data, error: functionError } = await supabase.functions.invoke('signup-student', {
        body: formData,
      });

      if (functionError) throw functionError;
      if (data.error) throw new Error(data.error);

      setSuccess('Pendaftaran berhasil! Anda akan diarahkan ke halaman login...');
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
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Registrasi Akun Siswa</h1>
        <p className="text-gray-600 mb-6">Masukkan data diri dan kode registrasi dari sekolah.</p>

        {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">{error}</p>}
        {success && <p className="bg-green-100 text-green-700 p-3 rounded-lg mb-4">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="fullName">Nama Lengkap</label>
            <input type="text" name="fullName" id="fullName" value={formData.fullName} onChange={handleChange} className="w-full p-3 border rounded-lg" required />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="email">Email</label>
            <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className="w-full p-3 border rounded-lg" required />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="password">Password</label>
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} name="password" id="password" value={formData.password} onChange={handleChange} className="w-full p-3 border rounded-lg" required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500">
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
           <div>
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="registrationCode">Kode Registrasi</label>
            <input type="text" name="registrationCode" id="registrationCode" value={formData.registrationCode} onChange={handleChange} className="w-full p-3 border rounded-lg" required />
          </div>
          
          <button type="submit" disabled={loading || success} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-300">
            {loading ? 'Memproses...' : 'Daftar'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-6">
          Sudah punya akun? <Link to="/login" className="font-semibold text-blue-600 hover:underline">Login di sini.</Link>
        </p>
      </div>
    </div>
  );
}

export default RegistrationPage;