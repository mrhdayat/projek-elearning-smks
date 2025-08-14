import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { LuSearch, LuChevronDown, LuUser, LuLogOut } from 'react-icons/lu';
import { FaBars } from 'react-icons/fa';
import { useUserRole } from '../../hooks/useUserRole';
import NotificationCenter from '../notifications/NotificationCenter';

const getAvatarUrl = (role) => {
  const avatarMap = {
    'Admin': 'https://i.pravatar.cc/150?img=60',
    'Super Admin': 'https://i.pravatar.cc/150?img=61',
    'Kepala Sekolah': 'https://i.pravatar.cc/150?img=62',
    'Wali Kelas': 'https://i.pravatar.cc/150?img=63',
    'Guru Mapel': 'https://i.pravatar.cc/150?img=64',
    'Guru BK': 'https://i.pravatar.cc/150?img=65',
    'Siswa': 'https://i.pravatar.cc/150?img=66'
  };
  return avatarMap[role] || 'https://i.pravatar.cc/150?img=1';
};

function Header({ pageTitle, toggleSidebar }) {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const { userRole, userProfile, loading } = useUserRole();

  // Fungsi untuk Logout
  const handleLogout = async () => {
    setDropdownOpen(false);
    await supabase.auth.signOut();
    navigate('/login');
  };

  // Tentukan judul halaman berdasarkan peran jika tidak diberikan
  const getPageTitle = () => {
    if (pageTitle) return pageTitle;

    switch (userRole) {
      case 'Admin':
      case 'Super Admin':
        return 'Dashboard Admin';
      case 'Kepala Sekolah':
        return 'Dashboard Kepala Sekolah';
      case 'Wali Kelas':
        return 'Dashboard Wali Kelas';
      case 'Guru Mapel':
        return 'Dashboard Guru Mapel';
      case 'Guru BK':
        return 'Dashboard Guru BK';
      case 'Siswa':
        return 'Dashboard Siswa';
      default:
        return 'Dashboard';
    }
  };

  // Efek untuk menutup dropdown saat klik di luar area menu
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    // Tambahkan event listener saat komponen dimuat
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Hapus event listener saat komponen dibongkar
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  if (loading) {
    return (
      <header className="flex-shrink-0 flex items-center justify-between p-4 bg-white shadow-sm z-10 relative">
        <div className="flex items-center">
          <button onClick={toggleSidebar} className="text-gray-600 mr-4 lg:hidden" aria-label="Buka menu">
            <FaBars size={24} />
          </button>
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-48"></div>
          </div>
        </div>
        <div className="animate-pulse">
          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
        </div>
      </header>
    );
  }

  return (
    <header className="flex-shrink-0 flex items-center justify-between p-4 bg-white shadow-sm z-10 relative">
      <div className="flex items-center">
        <button onClick={toggleSidebar} className="text-gray-600 mr-4 lg:hidden" aria-label="Buka menu">
          <FaBars size={24} />
        </button>
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">{getPageTitle()}</h1>
      </div>

      <div className="flex items-center space-x-2 md:space-x-4">
        {/* Search bar - hanya untuk admin dan guru */}
        {(userRole === 'Admin' || userRole === 'Super Admin' || userRole?.includes('Guru')) && (
          <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-2">
            <LuSearch className="text-gray-400 mr-2" size={16} />
            <input
              type="text"
              placeholder="Cari..."
              className="bg-transparent text-sm focus:outline-none w-32 lg:w-48"
            />
          </div>
        )}

        {/* Notifikasi - untuk semua peran */}
        <NotificationCenter />

        {/* --- Bagian Profil Dropdown --- */}
        <div className="relative" ref={dropdownRef}>
          {/* Tombol pemicu dropdown */}
          <button
            onClick={() => setDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-gray-100"
          >
            <img
              src={getAvatarUrl(userRole)}
              alt={userRole}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className='hidden md:block text-left'>
              <p className="font-semibold text-sm text-gray-800">
                {userProfile?.full_name || 'Pengguna'}
              </p>
              <p className="text-xs text-gray-500">{userRole}</p>
            </div>
            <LuChevronDown className={`text-gray-500 hidden md:block transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Menu Dropdown dengan Animasi */}
          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-1 z-50"
              >
                <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <LuUser className="mr-3" />
                  Profil Saya
                </a>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <LuLogOut className="mr-3 text-red-500" />
                  <span className="text-red-500">Logout</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}

export default Header;