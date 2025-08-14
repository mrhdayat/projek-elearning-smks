// src/components/CTASection.jsx
import React from 'react';

function CTASection() {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-indigo-800">
      <div className="container mx-auto px-6 py-16 text-center text-white">
        <h2 className="text-3xl font-bold mb-2">
          Siap Memulai Pembelajaran Digital?
        </h2>
        <p className="mb-8">
          Buat akun dan jelajahi semua fitur yang kami tawarkan.
        </p>
        <button className="bg-white text-blue-700 font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-gray-100 hover:scale-105 transform transition duration-300 ease-in-out">
          Daftar Sekarang
        </button>
      </div>
    </section>
  );
}

export default CTASection;