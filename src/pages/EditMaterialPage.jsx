// src/pages/EditMaterialPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

function EditMaterialPage() {
  const { materialId } = useParams();
  const navigate = useNavigate();

  const [material, setMaterial] = useState({ title: '', course_id: '' });
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, materialRes] = await Promise.all([
          supabase.rpc('get_all_courses'),
          supabase.rpc('get_material_details_by_id', { material_id: materialId })
        ]);
        if (coursesRes.error) throw coursesRes.error;
        if (materialRes.error) throw materialRes.error;
        setCourses(coursesRes.data);
        setMaterial(materialRes.data);
      } catch (err) {
        setError("Gagal mengambil data: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [materialId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMaterial(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.rpc('update_material_details', {
        material_id: materialId,
        new_title: material.title,
        new_course_id: material.course_id,
      });
      if (error) throw error;
      setSuccess('Materi berhasil diperbarui!');
      setTimeout(() => navigate('/manajemen-materi'), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Memuat...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Materi</h1>
      <div className="max-w-2xl bg-white p-8 rounded-lg shadow-md">
        <form onSubmit={handleSubmit}>
          {success && <p className="text-green-600 mb-4">{success}</p>}
          <p className="text-sm text-gray-500 mb-4">Catatan: Mengubah file atau konten materi akan tersedia di fitur selanjutnya.</p>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="title">Judul Materi</label>
            <input type="text" id="title" name="title" value={material.title || ''} onChange={handleChange} className="w-full p-3 border rounded-lg" required />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="course_id">Mata Pelajaran</label>
            <select id="course_id" name="course_id" value={material.course_id || ''} onChange={handleChange} className="w-full p-3 border rounded-lg bg-white">
              <option value="">-- Pilih Mata Pelajaran --</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>{course.name}</option>
              ))}
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

export default EditMaterialPage;