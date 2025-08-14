// src/components/auth/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUserRole } from '../../hooks/useUserRole';

function ProtectedRoute({ children, allowedRoles = [], redirectTo = '/login' }) {
  const { userRole, loading, error } = useUserRole();

  // Tampilkan loading saat mengambil data peran
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memverifikasi akses...</p>
        </div>
      </div>
    );
  }

  // Jika ada error atau tidak ada peran, redirect ke login
  if (error || !userRole) {
    return <Navigate to="/login" replace />;
  }

  // Jika allowedRoles kosong, berarti semua peran diizinkan
  if (allowedRoles.length === 0) {
    return children;
  }

  // Cek apakah peran pengguna diizinkan
  if (!allowedRoles.includes(userRole)) {
    // Redirect berdasarkan peran pengguna
    const redirectPath = userRole === 'Siswa' ? '/siswa/dashboard' : '/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
}

export default ProtectedRoute;
