// src/pages/ManageSchedulesPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import ScheduleView from '../components/schedules/ScheduleView';
import { FaPlus } from 'react-icons/fa';

function ManageSchedulesPage() {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.rpc('get_full_schedule');
        if (error) throw error;
        setSchedule(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSchedule();
  }, []);

   const handleEdit = (id) => {
    navigate(`/jadwal-pelajaran/edit/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus jadwal ini?')) {
      try {
        const { error } = await supabase.rpc('delete_schedule_entry', { schedule_id: id });
        if (error) throw error;
        setSchedule(current => current.filter(item => item.id !== id));
      } catch (err) {
        setError(err.message);
      }
    }
  };
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manajemen Jadwal Pelajaran</h1>
        <Link to="/jadwal-pelajaran/tambah" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center">
          <FaPlus className="mr-2" />
          Tambah Jadwal
        </Link>
      </div>
      
      {loading && <p>Memuat jadwal...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {!loading && !error && (
        <ScheduleView
          schedule={schedule} 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
        />
      )}
    </div>
  );
}

export default ManageSchedulesPage;