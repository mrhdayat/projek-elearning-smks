// src/components/AboutSection.jsx
import React from 'react';

function AboutSection() {
  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center gap-12">

          {/* Kolom Kiri: Teks Deskripsi dan Statistik */}
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Tentang Aplikasi
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Platform e-learning ini dirancang khusus untuk mendukung proses belajar mengajar di SMKS Muhammadiyah Satui. Kami menyediakan berbagai fitur untuk memudahkan siswa dalam mengakses materi, mengerjakan tugas, dan berinteraksi dengan guru secara digital.
            </p>
            
            {/* Bagian Statistik */}
            <div className="mt-8 flex justify-start space-x-12">
              <div className="text-center">
                <span className="text-4xl font-bold text-blue-600">500+</span>
                <span className="block text-sm text-gray-500 mt-1">Pengguna Aktif</span>
              </div>
              <div className="text-center">
                <span className="text-4xl font-bold text-blue-600">50+</span>
                <span className="block text-sm text-gray-500 mt-1">Mata Pelajaran</span>
              </div>
              <div className="text-center">
                <span className="text-4xl font-bold text-blue-600">100+</span>
                <span className="block text-sm text-gray-500 mt-1">Materi Video</span>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Gambar */}
          <div className="md:w-1/2 mt-10 md:mt-0">
            {/* Ganti div ini dengan gambar Anda.
                Pastikan gambar sudah dimasukkan ke folder, misal: src/assets/
                Lalu gunakan tag <img src={namaGambar} alt="Tentang Aplikasi" />
            */}
            <div className="bg-gray-200 rounded-lg shadow-lg w-full h-80 flex items-center justify-center">
              <span className="text-gray-500">Gambar akan tampil di sini</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default AboutSection;