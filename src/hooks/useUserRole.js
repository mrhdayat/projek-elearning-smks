// src/hooks/useUserRole.js
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { logError } from '../utils/errorHandler';

export function useUserRole() {
  const [userRole, setUserRole] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        // Ambil profil pengguna saat ini
        const { data: profileData, error: profileError } = await supabase.rpc('get_current_user_profile');

        if (profileError) {
          // Jika function tidak ada, gunakan fallback
          logError(profileError, 'RPC get_current_user_profile');
          console.warn("RPC function not found, using fallback method");

          // Fallback: ambil data dari tabel profiles langsung
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            const { data: fallbackProfile, error: fallbackError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', user.id)
              .single();

            if (fallbackError) {
              throw new Error("Gagal mengambil profil pengguna: " + fallbackError.message);
            }

            if (fallbackProfile) {
              setUserRole(fallbackProfile.role);
              setUserProfile(fallbackProfile);
            }
          }
        } else if (profileData) {
          setUserRole(profileData.role);
          setUserProfile(profileData);
        }
      } catch (err) {
        setError(err.message);
        logError(err, 'fetchUserProfile');
      } finally {
        setLoading(false);
      }
    };

    // Cek apakah user sudah login
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        fetchUserProfile();
      } else {
        setLoading(false);
      }
    };

    checkUser();

    // Listen untuk perubahan auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        fetchUserProfile();
      } else if (event === 'SIGNED_OUT') {
        setUserRole(null);
        setUserProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return { userRole, userProfile, loading, error };
}

// Helper function untuk mengecek permission berdasarkan peran
export function hasPermission(userRole, permission) {
  const permissions = {
    'Admin': ['read', 'write', 'delete', 'manage_users', 'manage_courses', 'manage_materials', 'manage_assignments', 'view_reports', 'export_data'],
    'Super Admin': ['read', 'write', 'delete', 'manage_users', 'manage_courses', 'manage_materials', 'manage_assignments', 'view_reports', 'export_data', 'system_settings'],
    'Kepala Sekolah': ['read', 'view_reports'],
    'Wali Kelas': ['read', 'write', 'manage_materials', 'manage_assignments', 'view_class_reports'],
    'Guru Mapel': ['read', 'write', 'manage_materials', 'manage_assignments', 'grade_assignments'],
    'Guru BK': ['read', 'view_student_data'],
    'Siswa': ['read', 'view_own_data']
  };

  return permissions[userRole]?.includes(permission) || false;
}

// Helper function untuk mendapatkan menu navigasi berdasarkan peran
export function getNavigationMenus(userRole) {
  const menus = {
    'Admin': [
      { to: '/dashboard', text: 'Dashboard', icon: 'FaTachometerAlt' },
      { to: '/kelola-pengguna', text: 'Kelola Pengguna', icon: 'FaUsers' },
      { to: '/mata-pelajaran', text: 'Mata Pelajaran', icon: 'FaBook' },
      { to: '/manajemen-materi', text: 'Manajemen Materi', icon: 'FaFileAlt' },
      { to: '/tugas-ujian', text: 'Tugas & Ujian', icon: 'FaNewspaper' },
      { to: '/laporan-nilai', text: 'Laporan Nilai', icon: 'FaChartBar' },
      { to: '/pengumuman', text: 'Pengumuman', icon: 'FaBullhorn' },
      { to: '/jadwal-pelajaran', text: 'Jadwal Pelajaran', icon: 'FaCalendarAlt' },
      { to: '/audit-log', text: 'Audit Log', icon: 'FaHistory' },
      { to: '/pengaturan', text: 'Pengaturan', icon: 'FaCog' }
    ],
    'Super Admin': [
      { to: '/dashboard', text: 'Dashboard', icon: 'FaTachometerAlt' },
      { to: '/kelola-pengguna', text: 'Kelola Pengguna', icon: 'FaUsers' },
      { to: '/mata-pelajaran', text: 'Mata Pelajaran', icon: 'FaBook' },
      { to: '/manajemen-materi', text: 'Manajemen Materi', icon: 'FaFileAlt' },
      { to: '/tugas-ujian', text: 'Tugas & Ujian', icon: 'FaNewspaper' },
      { to: '/laporan-nilai', text: 'Laporan Nilai', icon: 'FaChartBar' },
      { to: '/pengumuman', text: 'Pengumuman', icon: 'FaBullhorn' },
      { to: '/jadwal-pelajaran', text: 'Jadwal Pelajaran', icon: 'FaCalendarAlt' },
      { to: '/audit-log', text: 'Audit Log', icon: 'FaHistory' },
      { to: '/pengaturan', text: 'Pengaturan', icon: 'FaCog' }
    ],
    'Kepala Sekolah': [
      { to: '/dashboard', text: 'Dashboard', icon: 'FaTachometerAlt' },
      { to: '/laporan-nilai', text: 'Laporan Nilai', icon: 'FaChartBar' },
      { to: '/jadwal-pelajaran', text: 'Jadwal Pelajaran', icon: 'FaCalendarAlt' },
      { to: '/audit-log', text: 'Monitor Aktivitas', icon: 'FaHistory' },
      { to: '/pengumuman', text: 'Pengumuman', icon: 'FaBullhorn' }
    ],
    'Wali Kelas': [
      { to: '/dashboard', text: 'Dashboard', icon: 'FaTachometerAlt' },
      { to: '/manajemen-materi', text: 'Manajemen Materi', icon: 'FaFileAlt' },
      { to: '/tugas-ujian', text: 'Tugas & Ujian', icon: 'FaNewspaper' },
      { to: '/laporan-nilai', text: 'Laporan Kelas', icon: 'FaChartBar' },
      { to: '/jadwal-pelajaran', text: 'Jadwal Pelajaran', icon: 'FaCalendarAlt' }
    ],
    'Guru Mapel': [
      { to: '/dashboard', text: 'Dashboard', icon: 'FaTachometerAlt' },
      { to: '/manajemen-materi', text: 'Manajemen Materi', icon: 'FaFileAlt' },
      { to: '/tugas-ujian', text: 'Tugas & Ujian', icon: 'FaNewspaper' },
      { to: '/jadwal-pelajaran', text: 'Jadwal Pelajaran', icon: 'FaCalendarAlt' }
    ],
    'Guru BK': [
      { to: '/dashboard', text: 'Dashboard', icon: 'FaTachometerAlt' },
      { to: '/kelola-pengguna', text: 'Data Siswa', icon: 'FaUsers' },
      { to: '/laporan-nilai', text: 'Laporan Nilai', icon: 'FaChartBar' }
    ],
    'Siswa': [
      { to: '/siswa/dashboard', text: 'Dashboard', icon: 'FaTachometerAlt' },
      { to: '/siswa/materi', text: 'Materi', icon: 'FaBook' },
      { to: '/siswa/tugas', text: 'Tugas', icon: 'FaNewspaper' },
      { to: '/siswa/nilai', text: 'Nilai', icon: 'FaChartBar' },
      { to: '/siswa/jadwal', text: 'Jadwal', icon: 'FaCalendarAlt' }
    ]
  };

  return menus[userRole] || menus['Siswa'];
}
