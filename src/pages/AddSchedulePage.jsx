// src/pages/AddSchedulePage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const daysOfWeek = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

function AddSchedulePage() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    course_id: '',
    day_of_week: 'Senin',
    start_time: '07:00',
    end_time: '09:00',
    class_group: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
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
      const { error: rpcError } = await supabase.rpc('create_schedule_entry', {
        course_id: Number(formData.course_id),
        day_of_week: formData.day_of_week,
        start_time: formData.start_time,
        end_time: formData.end_time,
        class_group: formData.class_group || null,
      });

      if (rpcError) throw rpcError;

      setSuccess('Jadwal baru berhasil dibuat! Mengarahkan kembali...');
      setTimeout(() => navigate('/jadwal-pelajaran'), 2000);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Tambah Entri Jadwal Baru</h1>
      <form onSubmit={handleSubmit} className="max-w-2xl bg-white p-8 rounded-lg shadow-md">
        {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">{error}</p>}
        {success && <p className="bg-green-100 text-green-700 p-3 rounded-lg mb-4">{success}</p>}
        
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="course_id">Mata Pelajaran</label>
          <select name="course_id" id="course_id" value={formData.course_id} onChange={handleChange} className="w-full p-3 border rounded-lg bg-white" required>
            <option value="">-- Pilih Mata Pelajaran --</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>{course.name}</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="day_of_week">Hari</label>
          <select name="day_of_week" id="day_of_week" value={formData.day_of_week} onChange={handleChange} className="w-full p-3 border rounded-lg bg-white">
            {daysOfWeek.map(day => <option key={day} value={day}>{day}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="start_time">Jam Mulai</label>
            <input type="time" name="start_time" id="start_time" value={formData.start_time} onChange={handleChange} className="w-full p-3 border rounded-lg" required />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="end_time">Jam Selesai</label>
            <input type="time" name="end_time" id="end_time" value={formData.end_time} onChange={handleChange} className="w-full p-3 border rounded-lg" required />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="class_group">Grup Kelas (Opsional)</label>
          <input type="text" name="class_group" id="class_group" value={formData.class_group} onChange={handleChange} className="w-full p-3 border rounded-lg" placeholder="Contoh: XII RPL 1" />
        </div>
        
        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-300">
          {loading ? 'Menyimpan...' : 'Simpan Jadwal'}
        </button>
      </form>
    </div>
  );
}

export default AddSchedulePage;