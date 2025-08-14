// src/pages/AddAssignmentPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

function AddAssignmentPage() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'Tugas',
    courseId: '',
    dueDate: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Mengambil daftar mata pelajaran untuk dropdown
    const fetchCourses = async () => {
      const { data, error } = await supabase.rpc('get_all_courses');
      if (error) console.error("Gagal mengambil data mata pelajaran:", error);
      else setCourses(data);
    };
    fetchCourses();
  }, []);

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
      const { error: rpcError } = await supabase.rpc('create_assignment', {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        course_id: Number(formData.courseId),
        due_date: formData.dueDate,
      });

      if (rpcError) throw rpcError;

      setSuccess('Tugas/ujian baru berhasil dibuat! Mengarahkan kembali...');
      setTimeout(() => navigate('/tugas-ujian'), 2000);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Buat Tugas atau Ujian Baru</h1>
      <form onSubmit={handleSubmit} className="max-w-2xl bg-white p-8 rounded-lg shadow-md">
        {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">{error}</p>}
        {success && <p className="bg-green-100 text-green-700 p-3 rounded-lg mb-4">{success}</p>}
        
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="title">Judul</label>
          <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} className="w-full p-3 border rounded-lg" required />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="description">Deskripsi / Instruksi</label>
          <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows="5" className="w-full p-3 border rounded-lg"></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="type">Tipe</label>
            <select name="type" id="type" value={formData.type} onChange={handleChange} className="w-full p-3 border rounded-lg bg-white">
              <option value="Tugas">Tugas</option>
              <option value="Ujian">Ujian</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="courseId">Mata Pelajaran</label>
            <select name="courseId" id="courseId" value={formData.courseId} onChange={handleChange} className="w-full p-3 border rounded-lg bg-white" required>
              <option value="">-- Pilih Mata Pelajaran --</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>{course.name}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="dueDate">Batas Waktu Pengumpulan</label>
          <input type="datetime-local" name="dueDate" id="dueDate" value={formData.dueDate} onChange={handleChange} className="w-full p-3 border rounded-lg" required />
        </div>
        
        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-300">
          {loading ? 'Menyimpan...' : 'Simpan Tugas'}
        </button>
      </form>
    </div>
  );
}

export default AddAssignmentPage;