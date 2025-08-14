// src/layouts/PublicLayout.jsx

import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar'; // Impor Navbar yang sudah kita buat
import Footer from '../components/Footer'; // Impor Footer yang sudah kita buat

function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {/* Konten halaman publik (misal: LandingPage) akan muncul di sini */}
        <Outlet /> 
      </main>
      <Footer />
    </div>
  );
}

export default PublicLayout;