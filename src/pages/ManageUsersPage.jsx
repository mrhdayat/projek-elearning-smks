import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import UsersTable from '../components/users/UsersTable';
import Pagination from '../components/dashboard/Pagination'; // <-- Impor Pagination
import { FaPlus } from 'react-icons/fa';

const ITEMS_PER_PAGE = 10; // Tentukan berapa item per halaman

function ManageUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        // Panggil fungsi pagination yang baru
        const { data, error } = await supabase.rpc('get_paginated_users', {
          page_size: ITEMS_PER_PAGE,
          page_number: currentPage,
        });

        if (error) throw error;
        setUsers(data.data || []);
        setTotalPages(Math.ceil((data.total_count || 0) / ITEMS_PER_PAGE));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [currentPage]);

  // Fungsi untuk navigasi ke halaman edit
  const handleEditUser = (id) => {
    // Fungsi ini akan membawa Anda ke halaman edit saat tombol pensil diklik
    navigate(`/kelola-pengguna/edit/${id}`);
  };

  // Fungsi untuk menghapus pengguna
  const handleDeleteUser = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus pengguna ini secara permanen?')) {
      try {
        const { error } = await supabase.functions.invoke('delete-user', {
          body: { id },
        });
        if (error) throw error;
        // Hapus pengguna dari daftar di tampilan agar UI langsung update
        setUsers(currentUsers => currentUsers.filter(user => user.id !== id));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Kelola Pengguna</h1>
        <Link to="/kelola-pengguna/tambah" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center">
          <FaPlus className="mr-2" />
          Tambah Pengguna
        </Link>
      </div>
      
       {loading && <p>Memuat pengguna...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {!loading && !error && (
        <>
          <UsersTable 
            users={users} 
            onEdit={handleEditUser} 
            onDelete={handleDeleteUser} 
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

export default ManageUsersPage;