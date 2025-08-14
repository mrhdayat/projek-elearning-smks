// src/components/HeroSection.jsx
import React from 'react';

function HeroSection() {
  return (
    // Latar belakang utama dengan gradient biru sesuai desain
    <div className="bg-gradient-to-r from-blue-600 to-indigo-800 text-white">
      <div className="container mx-auto px-6 py-20 md:py-28">
        <div className="flex flex-col md:flex-row items-center">
          
          {/* Bagian Kiri: Teks & Tombol */}
          <div className="md:w-1/2 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Belajar Mudah, Kapan Saja dan Di Mana Saja
            </h1>
            <p className="mt-4 text-lg text-blue-100">
              Tingkatkan potensi akademik dan karakter Anda bersama platform e-learning SMKS Muhammadiyah Satui.
            </p>
            <button className="mt-8 bg-white text-blue-700 font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-gray-100 hover:scale-105 transform transition duration-300 ease-in-out">
              Mulai Belajar Sekarang
            </button>
          </div>

          {/* Bagian Kanan: Ilustrasi */}
          <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center">
            {/* Nantinya kita akan ganti div ini dengan file gambar (SVG/PNG) 
              sesuai dengan desain Anda. Untuk sekarang, kita buat placeholder.
            */}
            <div className="bg-blue-400 bg-opacity-30 rounded-lg w-full max-w-md h-80 flex items-center justify-center">
              <span className="text-blue-200">Ilustrasi akan tampil di sini</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default HeroSection;