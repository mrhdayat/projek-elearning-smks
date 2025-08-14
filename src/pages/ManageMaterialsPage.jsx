// src/pages/ManageMaterialsPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import MaterialsTable from '../components/materials/MaterialsTable';
import Pagination from '../components/dashboard/Pagination';
import { FaPlus } from 'react-icons/fa';

const ITEMS_PER_PAGE = 10;

function ManageMaterialsPage() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.rpc('get_paginated_materials', {
          page_size: ITEMS_PER_PAGE,
          page_number: currentPage,
        });
        if (error) throw error;
        setMaterials(data.data || []);
        setTotalPages(Math.ceil((data.total_count || 0) / ITEMS_PER_PAGE));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMaterials();
  }, [currentPage]);

  const handleEditMaterial = (id) => {
    navigate(`/manajemen-materi/edit/${id}`); // <-- Logika Edit
  };

  const handleDeleteMaterial = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus materi ini? Jika ini file, file juga akan terhapus permanen.')) {
      try {
        const { error } = await supabase.functions.invoke('delete-material', {
          body: { materialId: id },
        });
        if (error) throw error;
        // Update UI secara langsung
        setMaterials(current => current.filter(material => material.id !== id));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manajemen Materi</h1>
        <Link to="/manajemen-materi/tambah" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center">
          <FaPlus className="mr-2" />
          Tambah Materi
        </Link>
      </div>
      
      {loading && <p>Memuat data materi...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {!loading && !error && (
        <>
          <MaterialsTable 
            materials={materials} 
            onEdit={handleEditMaterial} 
            onDelete={handleDeleteMaterial} 
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

export default ManageMaterialsPage;