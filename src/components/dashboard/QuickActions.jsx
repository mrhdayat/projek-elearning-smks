import React from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaTasks, FaUserPlus, FaBullhorn, FaFileExport, FaBook, FaChartBar, FaCalendarAlt, FaEye, FaUsers } from 'react-icons/fa';

// Definisi aksi berdasarkan peran
const roleBasedActions = {
  'Admin': [
    { text: 'Tambah Pengguna', to: '/kelola-pengguna/tambah', icon: <FaUserPlus />, color: 'bg-blue-500 hover:bg-blue-600' },
    { text: 'Tambah Mata Pelajaran', to: '/mata-pelajaran/tambah', icon: <FaBook />, color: 'bg-green-500 hover:bg-green-600' },
    { text: 'Tambah Materi', to: '/manajemen-materi/tambah', icon: <FaPlus />, color: 'bg-yellow-500 hover:bg-yellow-600' },
    { text: 'Buat Tugas', to: '/tugas-ujian/tambah', icon: <FaTasks />, color: 'bg-red-500 hover:bg-red-600' },
    { text: 'Export Data Pengguna', action: 'export', icon: <FaFileExport />, color: 'bg-purple-500 hover:bg-purple-600' }
  ],
  'Super Admin': [
    { text: 'Tambah Pengguna', to: '/kelola-pengguna/tambah', icon: <FaUserPlus />, color: 'bg-blue-500 hover:bg-blue-600' },
    { text: 'Tambah Mata Pelajaran', to: '/mata-pelajaran/tambah', icon: <FaBook />, color: 'bg-green-500 hover:bg-green-600' },
    { text: 'Tambah Materi', to: '/manajemen-materi/tambah', icon: <FaPlus />, color: 'bg-yellow-500 hover:bg-yellow-600' },
    { text: 'Buat Tugas', to: '/tugas-ujian/tambah', icon: <FaTasks />, color: 'bg-red-500 hover:bg-red-600' },
    { text: 'Export Data Pengguna', action: 'export', icon: <FaFileExport />, color: 'bg-purple-500 hover:bg-purple-600' }
  ],
  'Kepala Sekolah': [
    { text: 'Lihat Laporan Nilai', to: '/laporan-nilai', icon: <FaChartBar />, color: 'bg-blue-500 hover:bg-blue-600' },
    { text: 'Lihat Jadwal', to: '/jadwal-pelajaran', icon: <FaCalendarAlt />, color: 'bg-green-500 hover:bg-green-600' },
    { text: 'Monitor Aktivitas', to: '/audit-log', icon: <FaEye />, color: 'bg-yellow-500 hover:bg-yellow-600' }
  ],
  'Wali Kelas': [
    { text: 'Laporan Kelas Saya', to: '/laporan-nilai', icon: <FaChartBar />, color: 'bg-blue-500 hover:bg-blue-600' },
    { text: 'Tambah Materi', to: '/manajemen-materi/tambah', icon: <FaPlus />, color: 'bg-green-500 hover:bg-green-600' },
    { text: 'Buat Tugas', to: '/tugas-ujian/tambah', icon: <FaTasks />, color: 'bg-red-500 hover:bg-red-600' }
  ],
  'Guru Mapel': [
    { text: 'Tambah Materi', to: '/manajemen-materi/tambah', icon: <FaPlus />, color: 'bg-green-500 hover:bg-green-600' },
    { text: 'Buat Tugas', to: '/tugas-ujian/tambah', icon: <FaTasks />, color: 'bg-red-500 hover:bg-red-600' },
    { text: 'Nilai Tugas', to: '/tugas-ujian', icon: <FaEye />, color: 'bg-blue-500 hover:bg-blue-600' }
  ],
  'Guru BK': [
    { text: 'Lihat Data Siswa', to: '/laporan-nilai', icon: <FaChartBar />, color: 'bg-blue-500 hover:bg-blue-600' },
    { text: 'Data Siswa', to: '/kelola-pengguna', icon: <FaUsers />, color: 'bg-green-500 hover:bg-green-600' }
  ],
  'Siswa': [
    { text: 'Lihat Materi', to: '/materi', icon: <FaBook />, color: 'bg-blue-500 hover:bg-blue-600' },
    { text: 'Tugas Saya', to: '/tugas', icon: <FaTasks />, color: 'bg-green-500 hover:bg-green-600' },
    { text: 'Nilai Saya', to: '/nilai', icon: <FaChartBar />, color: 'bg-yellow-500 hover:bg-yellow-600' }
  ]
};

function QuickActions({ userRole = 'Admin', onExportUsers, customActions = [] }) {
  // Gabungkan aksi default berdasarkan peran dengan aksi kustom
  const defaultActions = roleBasedActions[userRole] || roleBasedActions['Admin'];
  const actions = [...defaultActions, ...customActions];

  const handleActionClick = (action) => {
    if (action.action === 'export' && onExportUsers) {
      onExportUsers();
    } else if (action.onClick) {
      action.onClick();
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm h-full">
      <h3 className="font-bold text-lg text-gray-800 mb-4">Aksi Cepat</h3>
      <div className="space-y-3">
        {actions.map((action, index) => {
          if (action.to) {
            return (
              <Link
                key={index}
                to={action.to}
                className={`flex items-center justify-center w-full p-3 rounded-lg text-white font-semibold transition-colors duration-200 ${action.color}`}
              >
                <span className="mr-2">{action.icon}</span>
                {action.text}
              </Link>
            );
          } else {
            return (
              <button
                key={index}
                onClick={() => handleActionClick(action)}
                className={`flex items-center justify-center w-full p-3 rounded-lg text-white font-semibold transition-colors duration-200 ${action.color}`}
              >
                <span className="mr-2">{action.icon}</span>
                {action.text}
              </button>
            );
          }
        })}
      </div>
    </div>
  );
}

export default QuickActions;