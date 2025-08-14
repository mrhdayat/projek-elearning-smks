// src/components/dashboard/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaTachometerAlt, FaUsers, FaBook, FaFileAlt, FaNewspaper, FaChartBar, FaCalendarAlt, FaQuestionCircle, FaCog, FaHistory, FaBullhorn, FaComments } from 'react-icons/fa';
import { useUserRole } from '../../hooks/useUserRole';

// Menu navigasi berdasarkan peran
const roleBasedNavLinks = {
  'Admin': [
    { to: '/dashboard', icon: <FaTachometerAlt />, text: 'Dashboard' },
    { to: '/kelola-pengguna', icon: <FaUsers />, text: 'Kelola Pengguna' },
    { to: '/mata-pelajaran', icon: <FaBook />, text: 'Mata Pelajaran' },
    { to: '/manajemen-materi', icon: <FaFileAlt />, text: 'Manajemen Materi' },
    { to: '/tugas-ujian', icon: <FaNewspaper />, text: 'Tugas & Ujian' },
    { to: '/laporan-nilai', icon: <FaChartBar />, text: 'Laporan Nilai' },
    { to: '/pengumuman', icon: <FaBullhorn />, text: 'Pengumuman' },
    { to: '/jadwal-pelajaran', icon: <FaCalendarAlt />, text: 'Jadwal Pelajaran' },
    { to: '/audit-log', icon: <FaHistory />, text: 'Audit Log' },
    { to: '/pengaturan', icon: <FaCog />, text: 'Pengaturan' }
  ],
  'Super Admin': [
    { to: '/dashboard', icon: <FaTachometerAlt />, text: 'Dashboard' },
    { to: '/kelola-pengguna', icon: <FaUsers />, text: 'Kelola Pengguna' },
    { to: '/mata-pelajaran', icon: <FaBook />, text: 'Mata Pelajaran' },
    { to: '/manajemen-materi', icon: <FaFileAlt />, text: 'Manajemen Materi' },
    { to: '/tugas-ujian', icon: <FaNewspaper />, text: 'Tugas & Ujian' },
    { to: '/laporan-nilai', icon: <FaChartBar />, text: 'Laporan Nilai' },
    { to: '/pengumuman', icon: <FaBullhorn />, text: 'Pengumuman' },
    { to: '/jadwal-pelajaran', icon: <FaCalendarAlt />, text: 'Jadwal Pelajaran' },
    { to: '/audit-log', icon: <FaHistory />, text: 'Audit Log' },
    { to: '/pengaturan', icon: <FaCog />, text: 'Pengaturan' }
  ],
  'Kepala Sekolah': [
    { to: '/dashboard', icon: <FaTachometerAlt />, text: 'Dashboard' },
    { to: '/laporan-nilai', icon: <FaChartBar />, text: 'Laporan Nilai' },
    { to: '/jadwal-pelajaran', icon: <FaCalendarAlt />, text: 'Jadwal Pelajaran' },
    { to: '/audit-log', icon: <FaHistory />, text: 'Monitor Aktivitas' },
    { to: '/pengumuman', icon: <FaBullhorn />, text: 'Pengumuman' }
  ],
  'Wali Kelas': [
    { to: '/dashboard', icon: <FaTachometerAlt />, text: 'Dashboard' },
    { to: '/manajemen-materi', icon: <FaFileAlt />, text: 'Manajemen Materi' },
    { to: '/tugas-ujian', icon: <FaNewspaper />, text: 'Tugas & Ujian' },
    { to: '/laporan-nilai', icon: <FaChartBar />, text: 'Laporan Kelas' },
    { to: '/forum/pemrograman-web', icon: <FaComments />, text: 'Forum Diskusi' },
    { to: '/jadwal-pelajaran', icon: <FaCalendarAlt />, text: 'Jadwal Pelajaran' }
  ],
  'Guru Mapel': [
    { to: '/dashboard', icon: <FaTachometerAlt />, text: 'Dashboard' },
    { to: '/manajemen-materi', icon: <FaFileAlt />, text: 'Manajemen Materi' },
    { to: '/tugas-ujian', icon: <FaNewspaper />, text: 'Tugas & Ujian' },
    { to: '/forum/pemrograman-web', icon: <FaComments />, text: 'Forum Diskusi' },
    { to: '/jadwal-pelajaran', icon: <FaCalendarAlt />, text: 'Jadwal Pelajaran' }
  ],
  'Guru BK': [
    { to: '/dashboard', icon: <FaTachometerAlt />, text: 'Dashboard' },
    { to: '/kelola-pengguna', icon: <FaUsers />, text: 'Data Siswa' },
    { to: '/laporan-nilai', icon: <FaChartBar />, text: 'Laporan Nilai' }
  ],
  'Siswa': [
    { to: '/siswa/dashboard', icon: <FaTachometerAlt />, text: 'Dashboard' },
    { to: '/siswa/materi', icon: <FaBook />, text: 'Materi' },
    { to: '/siswa/tugas', icon: <FaNewspaper />, text: 'Tugas' },
    { to: '/siswa/nilai', icon: <FaChartBar />, text: 'Nilai' },
    { to: '/forum/pemrograman-web', icon: <FaComments />, text: 'Forum Diskusi' },
    { to: '/siswa/jadwal', icon: <FaCalendarAlt />, text: 'Jadwal' }
  ]
};

function Sidebar({ isOpen, toggleSidebar }) {
  const { userRole, loading } = useUserRole();

  // Kelas CSS untuk transisi dan posisi
  const sidebarBaseClass = "fixed inset-y-0 left-0 bg-white shadow-md z-30 transform transition-transform duration-300 ease-in-out";

  // Kelas CSS untuk posisi di layar besar (desktop)
  const desktopClass = "lg:translate-x-0 lg:static lg:w-64";

  // Menggabungkan kelas berdasarkan state 'isOpen'
  const sidebarClass = `${sidebarBaseClass} ${isOpen ? 'translate-x-0' : '-translate-x-full'} ${desktopClass}`;

  // Dapatkan menu berdasarkan peran pengguna
  const navLinks = roleBasedNavLinks[userRole] || roleBasedNavLinks['Siswa'];

  // Tentukan judul panel berdasarkan peran
  const getPanelTitle = (role) => {
    switch (role) {
      case 'Admin':
      case 'Super Admin':
        return 'Admin Panel';
      case 'Kepala Sekolah':
        return 'Panel Kepala Sekolah';
      case 'Wali Kelas':
        return 'Panel Wali Kelas';
      case 'Guru Mapel':
        return 'Panel Guru Mapel';
      case 'Guru BK':
        return 'Panel Guru BK';
      case 'Siswa':
        return 'Portal Siswa';
      default:
        return 'E-Learning Panel';
    }
  };

  if (loading) {
    return (
      <>
        {isOpen && (
          <div
            className="fixed inset-0 bg-black opacity-50 z-20 lg:hidden"
            onClick={toggleSidebar}
          ></div>
        )}
        <div className={sidebarClass}>
          <div className="p-4 border-b">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Overlay yang hanya muncul di mobile saat sidebar terbuka */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-20 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      <div className={sidebarClass}>
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold text-gray-800">{getPanelTitle(userRole)}</h1>
          <p className="text-sm text-gray-500">E-Learning SMKS</p>
        </div>
        <nav className="mt-4">
          <ul>
            {navLinks.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  onClick={toggleSidebar} // Tutup sidebar saat link diklik di mobile
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 w-full text-sm font-semibold transition-colors duration-200 ${
                      isActive ? "bg-blue-100 text-blue-600 border-r-4 border-blue-600" : "text-gray-600 hover:bg-gray-200"
                    }`
                  }
                >
                  <span className="mr-3 text-lg">{link.icon}</span>
                  {link.text}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}

export default Sidebar;