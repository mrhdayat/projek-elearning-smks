// src/pages/ManageCoursesPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import CoursesTable from '../components/courses/CoursesTable';
import Pagination from '../components/dashboard/Pagination';
import { FaPlus } from 'react-icons/fa';

const ITEMS_PER_PAGE = 10;

function ManageCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.rpc('get_paginated_courses', {
          page_size: ITEMS_PER_PAGE,
          page_number: currentPage,
        });
        if (error) throw error;
        setCourses(data.data || []);
        setTotalPages(Math.ceil((data.total_count || 0) / ITEMS_PER_PAGE));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [currentPage]);

  const handleEditCourse = (id) => {
    navigate(`/mata-pelajaran/edit/${id}`); // <-- Logika Edit
  };

  const handleDeleteCourse = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus mata pelajaran ini?')) {
      try {
        const { error } = await supabase.rpc('delete_course', { course_id: id });
        if (error) throw error;
        // Update UI secara langsung setelah berhasil hapus
        setCourses(currentCourses => currentCourses.filter(course => course.id !== id));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manajemen Mata Pelajaran</h1>
        <Link to="/mata-pelajaran/tambah" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center">
          <FaPlus className="mr-2" />
          Tambah Mata Pelajaran
        </Link>
      </div>
      
      {loading && <p>Memuat data mata pelajaran...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {!loading && !error && (
        <>
          <CoursesTable 
            courses={courses} 
            onEdit={handleEditCourse} 
            onDelete={handleDeleteCourse} 
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

export default ManageCoursesPage;