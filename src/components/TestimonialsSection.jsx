// src/components/TestimonialsSection.jsx
import React from 'react';
import TestimonialCard from './TestimonialCard';

const testimonialsData = [
  {
    text: 'Platform ini sangat membantu saya dalam memahami materi pelajaran. Video pembelajarannya mudah diikuti!',
    // Kita gunakan placeholder gambar dari pravatar.cc, ganti dengan gambar asli nanti
    avatar: 'https://i.pravatar.cc/150?img=11', 
    name: 'Ahmad Maulana',
    role: 'Siswa Kelas XII RPL',
  },
  {
    text: 'Sebagai guru, fitur ujian online sangat memudahkan saya dalam memberikan penilaian. Menghemat banyak waktu.',
    avatar: 'https://i.pravatar.cc/150?img=5',
    name: 'Budi Hartono, S.Pd.',
    role: 'Guru Produktif',
  },
  {
    text: 'Forum diskusinya aktif, saya bisa bertanya jika ada materi yang kurang saya pahami dan langsung dijawab oleh guru.',
    avatar: 'https://i.pravatar.cc/150?img=32',
    name: 'Siti Nurhaliza',
    role: 'Siswa Kelas XI AKL',
  },
];

function TestimonialsSection() {
  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800">Testimoni Pengguna</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonialsData.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              text={testimonial.text}
              avatar={testimonial.avatar}
              name={testimonial.name}
              role={testimonial.role}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default TestimonialsSection;