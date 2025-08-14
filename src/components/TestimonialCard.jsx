// src/components/TestimonialCard.jsx
import React from 'react';

function TestimonialCard({ text, avatar, name, role }) {
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <p className="text-gray-600 italic mb-6">"{text}"</p>
      <div className="flex items-center">
        <img 
          src={avatar} 
          alt={`Foto ${name}`} 
          className="w-12 h-12 rounded-full mr-4 object-cover"
        />
        <div>
          <h4 className="font-bold text-gray-800">{name}</h4>
          <span className="text-sm text-gray-500">{role}</span>
        </div>
      </div>
    </div>
  );
}

export default TestimonialCard;