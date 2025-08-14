// src/pages/ManageAssignmentsPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import AssignmentsTable from '../components/assignments/AssignmentsTable';
import Pagination from '../components/dashboard/Pagination';
import { FaPlus } from 'react-icons/fa';

const ITEMS_PER_PAGE = 10;

function ManageAssignmentsPage() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State baru untuk pagination dan filter
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showExpired, setShowExpired] = useState(false); // State untuk saklar

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.rpc('get_paginated_assignments', {
          page_size: ITEMS_PER_PAGE,
          page_number: currentPage,
          show_expired: showExpired // Kirim status saklar ke fungsi SQL
        });
        if (error) throw error;
        setAssignments(data.data || []);
        setTotalPages(Math.ceil((data.total_count || 0) / ITEMS_PER_PAGE));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAssignments();
  }, [currentPage, showExpired]);

  const handleEdit = (id) => {
    navigate(`/tugas-ujian/edit/${id}`); // <-- Logika Edit
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus item ini?')) {
      try {
        const { error } = await supabase.rpc('delete_assignment', { assignment_id: id });
        if (error) throw error;
        setAssignments(current => current.filter(item => item.id !== id));
      } catch (err) {
        setError(err.message);
      }
    }
  };
  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Manajemen Tugas & Ujian</h1>
        <div className="flex items-center space-x-4">
          {/* Saklar untuk menampilkan/menyembunyikan tugas kedaluwarsa */}
          <label className="flex items-center space-x-2 text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              checked={showExpired}
              onChange={(e) => {
                setShowExpired(e.target.checked);
                setCurrentPage(1); // Reset ke halaman 1 saat filter berubah
              }}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <span>Tampilkan Kedaluwarsa</span>
          </label>
          <Link to="/tugas-ujian/tambah" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center flex-shrink-0">
            <FaPlus className="mr-2" />
            Buat Baru
          </Link>
        </div>
      </div>
      
      {loading && <p>Memuat data...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {!loading && !error && (
        <>
          <AssignmentsTable 
            assignments={assignments} 
            onEdit={handleEdit} 
            onDelete={handleDelete} 
          />
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
}


export default ManageAssignmentsPage;