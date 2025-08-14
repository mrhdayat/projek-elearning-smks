import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { format } from 'date-fns';

function EditAssignmentPage() {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  
  // State untuk menampung data form. Dimulai dari null.
  const [formData, setFormData] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Ambil data guru dan data tugas secara bersamaan
        const [coursesRes, assignmentRes] = await Promise.all([
          supabase.rpc('get_all_courses'),
          supabase.rpc('get_assignment_details_by_id', { assignment_id: assignmentId })
        ]);

        if (coursesRes.error) throw coursesRes.error;
        if (assignmentRes.error) throw assignmentRes.error;
        if (!assignmentRes.data) throw new Error("Data tugas tidak ditemukan.");

        setCourses(coursesRes.data);
        
        // Format tanggal agar cocok dengan input <input type="datetime-local">
        const assignmentData = assignmentRes.data;
        if (assignmentData.due_date) {
            // Formatnya harus YYYY-MM-DDTHH:mm
            assignmentData.due_date = format(new Date(assignmentData.due_date), "yyyy-MM-dd'T'HH:mm");
        }
        setFormData(assignmentData);

      } catch (err) {
        setError("Gagal mengambil data: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [assignmentId]);

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
      const { error } = await supabase.rpc('update_assignment', {
        assignment_id: assignmentId,
        new_title: formData.title,
        new_description: formData.description,
        new_type: formData.type,
        new_course_id: Number(formData.course_id),
        new_due_date: formData.due_date,
      });
      if (error) throw error;
      setSuccess('Tugas/ujian berhasil diperbarui!');
      setTimeout(() => navigate('/tugas-ujian'), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center">Memuat data tugas...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!formData) return <p className="text-center">Data tidak ditemukan.</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Tugas atau Ujian</h1>
      <form onSubmit={handleSubmit} className="max-w-2xl bg-white p-8 rounded-lg shadow-md">
        {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">{error}</p>}
        {success && <p className="bg-green-100 text-green-700 p-3 rounded-lg mb-4">{success}</p>}
        
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="title">Judul</label>
          <input type="text" name="title" id="title" value={formData.title || ''} onChange={handleChange} className="w-full p-3 border rounded-lg" required />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="description">Deskripsi / Instruksi</label>
          <textarea name="description" id="description" value={formData.description || ''} onChange={handleChange} rows="5" className="w-full p-3 border rounded-lg"></textarea>
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
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="course_id">Mata Pelajaran</label>
            <select name="course_id" id="course_id" value={formData.course_id} onChange={handleChange} className="w-full p-3 border rounded-lg bg-white" required>
              <option value="">-- Pilih Mata Pelajaran --</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>{course.name}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="due_date">Batas Waktu Pengumpulan</label>
          <input type="datetime-local" name="due_date" id="due_date" value={formData.due_date || ''} onChange={handleChange} className="w-full p-3 border rounded-lg" required />
        </div>
        
        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-300">
            {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
      </form>
    </div>
  );
}

export default EditAssignmentPage;