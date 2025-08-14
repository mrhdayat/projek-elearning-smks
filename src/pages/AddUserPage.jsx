// src/pages/AddUserPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
function AddUserPage() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('Siswa'); // Default role
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Memanggil Edge Function kita yang bernama 'create-user'
      const { data, error: functionError } = await supabase.functions.invoke('create-user', {
        body: { fullName, email, password, role },
      });

      if (functionError) throw functionError;
      
      if (data.error) throw new Error(data.error);

      setSuccess('Pengguna berhasil dibuat! Mengarahkan kembali...');
      setTimeout(() => {
        navigate('/kelola-pengguna');
      }, 2000);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Tambah Pengguna Baru</h1>
      <div className="max-w-2xl bg-white p-8 rounded-lg shadow-md">
        <form onSubmit={handleSubmit}>
          {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">{error}</p>}
          {success && <p className="bg-green-100 text-green-700 p-3 rounded-lg mb-4">{success}</p>}
          
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="fullName">Nama Lengkap</label>
            <input type="text" id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full p-3 border rounded-lg" required />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="email">Email</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 border rounded-lg" required />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="password">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? 'text' : 'password'} // <-- Tipe input dinamis
                id="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full p-3 border rounded-lg" required 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="role">Peran</label>
            <select id="role" value={role} onChange={(e) => setRole(e.target.value)} className="w-full p-3 border rounded-lg bg-white">
              <option value="Siswa">Siswa</option>
              <option value="Guru Mapel">Guru Mapel</option>
              <option value="Guru BK">Guru BK</option>
              <option value="Wali Kelas">Wali Kelas</option>
              <option value="Kepala Sekolah">Kepala Sekolah</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-300">
            {loading ? 'Menyimpan...' : 'Simpan Pengguna'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddUserPage;