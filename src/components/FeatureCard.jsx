// src/components/FeatureCard.jsx
import React from 'react';

// Komponen ini menerima 'props': icon, title, dan description
// Sehingga bisa kita gunakan berulang kali dengan isi yang berbeda
function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-2 transform transition-all duration-300">
      <div className="text-blue-600 mb-4">
        {/* Ikon akan dirender di sini, dengan ukuran yang besar */}
        {React.cloneElement(icon, { size: 40 })}
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

export default FeatureCard;