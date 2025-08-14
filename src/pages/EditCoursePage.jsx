// src/pages/EditCoursePage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

function EditCoursePage() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState({ name: '', description: '', teacher_id: '' });
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Ambil data guru dan data mata pelajaran secara bersamaan
        const [teachersRes, courseRes] = await Promise.all([
          supabase.rpc('get_all_teachers'),
          supabase.rpc('get_course_details_by_id', { course_id: courseId })
        ]);

        if (teachersRes.error) throw teachersRes.error;
        if (courseRes.error) throw courseRes.error;

        setTeachers(teachersRes.data);
        setCourse(courseRes.data);
      } catch (err) {
        setError("Gagal mengambil data: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [courseId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourse(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.rpc('update_course', {
        course_id: courseId,
        new_name: course.name,
        new_description: course.description,
        new_teacher_id: course.teacher_id || null,
      });
      if (error) throw error;
      setSuccess('Mata pelajaran berhasil diperbarui!');
      setTimeout(() => navigate('/mata-pelajaran'), 1500);
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
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Mata Pelajaran</h1>
      <div className="max-w-2xl bg-white p-8 rounded-lg shadow-md">
        <form onSubmit={handleSubmit}>
          {/* Form fields are similar to AddCoursePage, but pre-filled with 'course' state */}
          {success && <p className="text-green-600 mb-4">{success}</p>}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="name">Nama Mata Pelajaran</label>
            <input type="text" id="name" name="name" value={course.name || ''} onChange={handleChange} className="w-full p-3 border rounded-lg" required />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="description">Deskripsi</label>
            <textarea id="description" name="description" value={course.description || ''} onChange={handleChange} rows="4" className="w-full p-3 border rounded-lg"></textarea>
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="teacher_id">Guru Pengampu</label>
            <select id="teacher_id" name="teacher_id" value={course.teacher_id || ''} onChange={handleChange} className="w-full p-3 border rounded-lg bg-white">
              <option value="">-- Pilih Guru (Opsional) --</option>
              {teachers.map(teacher => (
                <option key={teacher.id} value={teacher.id}>{teacher.full_name}</option>
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

export default EditCoursePage;