// src/pages/LoginPage.jsx

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const loginImageUrl = 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop';

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      // Langkah 1: Lakukan proses sign in. Hasilnya kita namai 'loginData'.
      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      if (loginError) throw loginError;

      // Langkah 2: Jika login berhasil, ambil profil pengguna. Hasilnya kita namai 'profileData'.
      const { data: profileData, error: profileError } = await supabase.rpc('get_current_user_profile');
      if (profileError) throw new Error("Gagal mengambil profil pengguna setelah login.");

      // Langkah 3: Catat aktivitas login menggunakan data dari Langkah 1.
      if (loginData.user) {
        const { error: logError } = await supabase
          .from('activity_log')
          .insert({ user_id: loginData.user.id, action_type: 'pengguna login' });
        
        if (logError) {
          // Jika gagal, tampilkan di console tapi jangan hentikan login.
          console.error("Gagal mencatat aktivitas login:", logError);
        }
      }
      
      // Langkah 4: Arahkan pengguna berdasarkan peran dari Langkah 2.
      const userRole = profileData.role;

      // Routing berdasarkan peran yang lebih spesifik
      switch (userRole) {
        case 'Siswa':
          navigate('/siswa/dashboard');
          break;
        case 'Admin':
        case 'Super Admin':
        case 'Kepala Sekolah':
        case 'Wali Kelas':
        case 'Guru Mapel':
        case 'Guru BK':
          navigate('/dashboard');
          break;
        default:
          // Jika peran tidak dikenali, arahkan ke dashboard umum
          navigate('/dashboard');
      }

    } catch (error) {
      setErrorMessage(error.message || 'Terjadi kesalahan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <motion.div 
        className="hidden lg:flex w-1/2 bg-cover bg-center"
        style={{ backgroundImage: `url(${loginImageUrl})` }}
        initial={{ x: '-100%' }}
        animate={{ x: '0%' }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
      >
         <div className="flex flex-col justify-between p-12 bg-gray-900 bg-opacity-60 text-white w-full">
            <div>
                <h2 className="text-2xl font-bold">SMKS Muhammadiyah Satui</h2>
                <p className="text-sm">Platform E-Learning</p>
            </div>
            <div className="max-w-md">
                <p className="text-3xl font-semibold leading-tight">
                    "Pendidikan bukan hanya tentang belajar, tapi juga tentang membentuk karakter."
                </p>
            </div>
            <div></div>
        </div>
      </motion.div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12">
        <motion.div 
          className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Login ke E-Learning</h1>
          <p className="text-gray-600 mb-6">Silakan masuk menggunakan akun yang telah diberikan.</p>
          {errorMessage && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4" role="alert">
              <span className="block sm:inline">{errorMessage}</span>
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2" htmlFor="email">Email / Username</label>
              <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors duration-300" placeholder="Masukkan email atau username" required />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2" htmlFor="password">Password</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors duration-300" placeholder="Masukkan password" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500">
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
                <label className="flex items-center text-gray-600">
                    <input type="checkbox" className="mr-2" />
                    Ingat saya
                </label>
                <Link to="/lupa-password" className="font-semibold text-blue-600 hover:underline">Lupa password?</Link>
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-300 disabled:bg-blue-300" disabled={loading}>
              {loading ? 'Memproses...' : 'Masuk'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-600 mt-6">
            Belum punya akun?{' '}
            <Link to="/registrasi" className="font-semibold text-blue-600 hover:underline">
              Daftar di sini dengan kode registrasi.
            </Link>
          </p>
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
            <h4 className="font-bold mb-2">Informasi Login:</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Gunakan akun yang diberikan oleh sekolah atau daftar mandiri.</li>
              <li>Hubungi wali kelas jika mengalami masalah atau belum memiliki kode registrasi.</li>
              <li>Pastikan koneksi internet stabil</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default LoginPage;