// src/pages/AddCoursePage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

function AddCoursePage() {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState([]);
  const [courseName, setCourseName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Mengambil daftar guru saat halaman dimuat
  useEffect(() => {
    const fetchTeachers = async () => {
      const { data, error } = await supabase.rpc('get_all_teachers');
      if (error) {
        console.error("Gagal mengambil data guru:", error);
      } else {
        setTeachers(data);
      }
    };
    fetchTeachers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { error: rpcError } = await supabase.rpc('create_course', {
        name: courseName,
        description: description,
        // Kirim null jika tidak ada guru yang dipilih
        teacher_id: selectedTeacher || null,
      });

      if (rpcError) throw rpcError;

      setSuccess('Mata pelajaran baru berhasil dibuat! Mengarahkan kembali...');
      setTimeout(() => navigate('/mata-pelajaran'), 2000);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Tambah Mata Pelajaran Baru</h1>
      <div className="max-w-2xl bg-white p-8 rounded-lg shadow-md">
        <form onSubmit={handleSubmit}>
          {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">{error}</p>}
          {success && <p className="bg-green-100 text-green-700 p-3 rounded-lg mb-4">{success}</p>}
          
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="courseName">Nama Mata Pelajaran</label>
            <input type="text" id="courseName" value={courseName} onChange={(e) => setCourseName(e.target.value)} className="w-full p-3 border rounded-lg" required />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="description">Deskripsi</label>
            <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows="4" className="w-full p-3 border rounded-lg"></textarea>
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="teacher">Guru Pengampu</label>
            <select id="teacher" value={selectedTeacher} onChange={(e) => setSelectedTeacher(e.target.value)} className="w-full p-3 border rounded-lg bg-white">
              <option value="">-- Pilih Guru (Opsional) --</option>
              {teachers.map(teacher => (
                <option key={teacher.id} value={teacher.id}>{teacher.full_name}</option>
              ))}
            </select>
          </div>
          
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-300">
            {loading ? 'Menyimpan...' : 'Simpan Mata Pelajaran'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddCoursePage;