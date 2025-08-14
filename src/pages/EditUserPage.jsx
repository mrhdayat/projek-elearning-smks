// src/pages/EditUserPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // <-- Import penting
import { supabase } from '../lib/supabaseClient';

function EditUserPage() {
  const { userId } = useParams();
  const navigate = useNavigate(); // <-- Inisialisasi penting
  
  const [user, setUser] = useState(null); // Mulai dari null
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Mengambil data pengguna saat halaman dimuat
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data, error } = await supabase.rpc('get_user_details_by_id', { user_id: userId });
        if (error) throw error;
        if (data) {
          setUser(data);
        } else {
          throw new Error("Pengguna tidak ditemukan.");
        }
      } catch (err) {
        setError("Gagal mengambil data pengguna: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

  // Menangani perubahan pada input form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

  // Menangani submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const { error: rpcError } = await supabase.rpc('update_user_profile', {
        user_id: userId,
        new_full_name: user.full_name,
        new_role: user.role,
      });
      if (rpcError) throw rpcError;
      setSuccess('Data pengguna berhasil diperbarui! Mengarahkan kembali...');
      setTimeout(() => navigate('/kelola-pengguna'), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center">Memuat data pengguna...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!user) return <p className="text-center">Pengguna tidak ditemukan.</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Pengguna: {user.full_name}</h1>
      <div className="max-w-2xl bg-white p-8 rounded-lg shadow-md">
        <form onSubmit={handleSubmit}>
          {success && <p className="bg-green-100 text-green-700 p-3 rounded-lg mb-4">{success}</p>}
          
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="full_name">Nama Lengkap</label>
            <input type="text" id="full_name" name="full_name" value={user.full_name || ''} onChange={handleChange} className="w-full p-3 border rounded-lg" required />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="role">Peran</label>
            <select id="role" name="role" value={user.role} onChange={handleChange} className="w-full p-3 border rounded-lg bg-white">
              <option value="Siswa">Siswa</option>
              <option value="Guru Mapel">Guru Mapel</option>
              <option value="Guru BK">Guru BK</option>
              <option value="Wali Kelas">Wali Kelas</option>
              <option value="Kepala Sekolah">Kepala Sekolah</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-300">
            {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditUserPage;