// src/components/dashboard/RoleBasedDashboard.jsx
import React from 'react';
import { useUserRole } from '../../hooks/useUserRole';
import AdminDashboard from './AdminDashboard';
import PrincipalDashboard from './PrincipalDashboard';
import ClassTeacherDashboard from './ClassTeacherDashboard';
import SubjectTeacherDashboard from './SubjectTeacherDashboard';
import CounselorDashboard from './CounselorDashboard';
import StudentDashboard from './StudentDashboard';

function RoleBasedDashboard() {
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

  if (!userRole) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg">
            <h3 className="font-bold">Peran Tidak Ditemukan</h3>
            <p>Silakan hubungi administrator untuk mengatur peran Anda.</p>
          </div>
        </div>
      </div>
    );
  }

  // Render dashboard berdasarkan peran pengguna
  switch (userRole) {
    case 'Admin':
    case 'Super Admin':
      return <AdminDashboard userRole={userRole} userProfile={userProfile} />;
    
    case 'Kepala Sekolah':
      return <PrincipalDashboard userRole={userRole} userProfile={userProfile} />;
    
    case 'Wali Kelas':
      return <ClassTeacherDashboard userRole={userRole} userProfile={userProfile} />;
    
    case 'Guru Mapel':
      return <SubjectTeacherDashboard userRole={userRole} userProfile={userProfile} />;
    
    case 'Guru BK':
      return <CounselorDashboard userRole={userRole} userProfile={userProfile} />;
    
    case 'Siswa':
      return <StudentDashboard userRole={userRole} userProfile={userProfile} />;
    
    default:
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
              <h3 className="font-bold">Peran Tidak Dikenali</h3>
              <p>Peran "{userRole}" tidak dikenali oleh sistem.</p>
              <p className="text-sm mt-2">Silakan hubungi administrator.</p>
            </div>
          </div>
        </div>
      );
  }
}

export default RoleBasedDashboard;
