// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // Untuk navigasi tanpa reload halaman

// Anda bisa menyimpan logo di folder src/assets dan mengimpornya
// import Logo from '../assets/logo.png'; 

function Navbar() {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        {/* Bagian Kiri: Logo */}
        <div className="flex items-center">
          {/* <img src={Logo} alt="Logo SMKS" className="h-10 w-auto" /> */}
          <span className="font-bold text-xl ml-2 text-gray-800">SMKS Muhammadiyah Satui</span>
        </div>

        {/* Bagian Kanan: Tombol Login */}
        <div>
          <Link 
            to="/login" 
            className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out"
          >
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;