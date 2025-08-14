// src/components/common/UnderDevelopment.jsx
import React from 'react';
import { LuConstruction, LuArrowLeft } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';

function UnderDevelopment({ 
  title = "Halaman Dalam Pengembangan", 
  description = "Fitur ini sedang dalam tahap pengembangan dan akan segera tersedia.",
  showBackButton = true 
}) {
  const navigate = useNavigate();

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-yellow-100 rounded-full">
            <LuConstruction className="text-yellow-600" size={48} />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {title}
        </h2>
        
        <p className="text-gray-600 mb-8">
          {description}
        </p>
        
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Yang Akan Datang:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Interface yang user-friendly</li>
              <li>• Fitur lengkap sesuai kebutuhan</li>
              <li>• Integrasi dengan sistem yang ada</li>
            </ul>
          </div>
          
          {showBackButton && (
            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <LuArrowLeft className="mr-2" size={16} />
              Kembali
            </button>
          )}
        </div>
        
        <div className="mt-8 text-xs text-gray-500">
          <p>Jika Anda membutuhkan fitur ini segera, silakan hubungi administrator.</p>
        </div>
      </div>
    </div>
  );
}

export default UnderDevelopment;
