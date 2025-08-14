// src/components/FeaturesSection.jsx
import React from 'react';
import FeatureCard from './FeatureCard'; // Impor komponen kartu kita

// Impor ikon-ikon yang kita butuhkan dari react-icons
import { FaBookOpen, FaVideo, FaTasks, FaComments, FaChartBar, FaGraduationCap } from 'react-icons/fa';

// Data untuk setiap fitur. Cara ini membuat kode lebih rapi.
const featuresData = [
  {
    icon: <FaBookOpen />,
    title: 'Kelas Digital',
    description: 'Akses materi pelajaran terstruktur kapan saja dan di mana saja.',
  },
  {
    icon: <FaVideo />,
    title: 'Video Pembelajaran',
    description: 'Pahami konsep sulit melalui video penjelasan yang menarik.',
  },
  {
    icon: <FaTasks />,
    title: 'Ujian & Tugas',
    description: 'Kerjakan tugas dan ujian secara online dengan penilaian otomatis.',
  },
  {
    icon: <FaComments />,
    title: 'Forum Diskusi',
    description: 'Bertanya dan berdiskusi dengan guru dan teman sekelas.',
  },
  {
    icon: <FaChartBar />,
    title: 'Laporan Perkembangan',
    description: 'Pantau kemajuan belajar Anda melalui laporan nilai yang detail.',
  },
  {
    icon: <FaGraduationCap />,
    title: 'Sertifikat Online',
    description: 'Dapatkan sertifikat digital setelah menyelesaikan sebuah kursus.',
  },
];

function FeaturesSection() {
  return (
    <section className="bg-slate-50 py-20">
      <div className="container mx-auto px-6">
        {/* Judul Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800">Fitur Unggulan</h2>
          <p className="text-gray-600 mt-2">
            Semua yang Anda butuhkan untuk pengalaman belajar digital yang lengkap.
          </p>
        </div>

        {/* Grid untuk Kartu Fitur */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuresData.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;