// src/pages/EditSchedulePage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const daysOfWeek = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

function EditSchedulePage() {
  const { scheduleId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, scheduleRes] = await Promise.all([
          supabase.rpc('get_all_courses'),
          supabase.rpc('get_schedule_details_by_id', { schedule_id: scheduleId })
        ]);
        if (coursesRes.error) throw coursesRes.error;
        if (scheduleRes.error) throw scheduleRes.error;
        
        setCourses(coursesRes.data);
        setFormData(scheduleRes.data);
      } catch (err) {
        setError("Gagal mengambil data: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [scheduleId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.rpc('update_schedule_entry', {
        schedule_id: scheduleId,
        new_course_id: Number(formData.course_id),
        new_day_of_week: formData.day_of_week,
        new_start_time: formData.start_time,
        new_end_time: formData.end_time,
        new_class_group: formData.class_group || null,
      });
      if (error) throw error;
      setSuccess('Jadwal berhasil diperbarui!');
      setTimeout(() => navigate('/jadwal-pelajaran'), 1500);
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
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Entri Jadwal</h1>
      <form onSubmit={handleSubmit} className="max-w-2xl bg-white p-8 rounded-lg shadow-md">
        {success && <p className="text-green-600 mb-4">{success}</p>}
        {/* Formnya sama persis dengan AddSchedulePage, hanya value-nya dari formData */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="course_id">Mata Pelajaran</label>
          <select name="course_id" id="course_id" value={formData.course_id || ''} onChange={handleChange} className="w-full p-3 border rounded-lg bg-white" required>
            <option value="">-- Pilih Mata Pelajaran --</option>
            {courses.map(course => ( <option key={course.id} value={course.id}>{course.name}</option> ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="day_of_week">Hari</label>
          <select name="day_of_week" id="day_of_week" value={formData.day_of_week || 'Senin'} onChange={handleChange} className="w-full p-3 border rounded-lg bg-white">
            {daysOfWeek.map(day => <option key={day} value={day}>{day}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="start_time">Jam Mulai</label>
            <input type="time" name="start_time" id="start_time" value={formData.start_time || ''} onChange={handleChange} className="w-full p-3 border rounded-lg" required />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="end_time">Jam Selesai</label>
            <input type="time" name="end_time" id="end_time" value={formData.end_time || ''} onChange={handleChange} className="w-full p-3 border rounded-lg" required />
          </div>
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="class_group">Grup Kelas (Opsional)</label>
          <input type="text" name="class_group" id="class_group" value={formData.class_group || ''} onChange={handleChange} className="w-full p-3 border rounded-lg" placeholder="Contoh: XII RPL 1" />
        </div>
        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-300">
          {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
      </form>
    </div>
  );
}

export default EditSchedulePage;