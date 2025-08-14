// src/pages/StudentDashboardPage.jsx
import React from 'react';
import StudentDashboard from '../components/dashboard/StudentDashboard';
import { useUserRole } from '../hooks/useUserRole';

function StudentDashboardPage() {
  const { userRole, userProfile, loading, error } = useUserRole();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            <h3 className="font-bold">Error</h3>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // Pastikan hanya siswa yang bisa mengakses halaman ini
  if (userRole !== 'Siswa') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            <h3 className="font-bold">Akses Ditolak</h3>
            <p>Halaman ini hanya untuk siswa.</p>
          </div>
        </div>
      </div>
    );
  }

  return <StudentDashboard userRole={userRole} userProfile={userProfile} />;
}

export default StudentDashboardPage;
