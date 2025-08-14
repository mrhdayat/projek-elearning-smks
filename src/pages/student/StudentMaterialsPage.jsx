// src/pages/student/StudentMaterialsPage.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { LuBookOpen, LuDownload, LuEye, LuCalendar } from 'react-icons/lu';

function StudentMaterialsPage() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState('all');

  useEffect(() => {
    const fetchStudentMaterials = async () => {
      try {
        setLoading(true);
        
        // Simulasi data materi untuk siswa
        const mockMaterials = [
          {
            id: 1,
            title: "Pengenalan HTML & CSS",
            subject: "Pemrograman Web",
            teacher: "Pak Budi Santoso",
            uploadDate: "2024-01-15",
            fileType: "PDF",
            fileSize: "2.5 MB",
            description: "Materi dasar tentang HTML dan CSS untuk pemula",
            downloadCount: 45
          },
          {
            id: 2,
            title: "Database Design Fundamentals",
            subject: "Basis Data",
            teacher: "Bu Sari Dewi",
            uploadDate: "2024-01-12",
            fileType: "PDF",
            fileSize: "3.2 MB",
            description: "Konsep dasar perancangan database dan ERD",
            downloadCount: 38
          },
          {
            id: 3,
            title: "JavaScript ES6 Features",
            subject: "Pemrograman Web",
            teacher: "Pak Budi Santoso",
            uploadDate: "2024-01-10",
            fileType: "PDF",
            fileSize: "1.8 MB",
            description: "Fitur-fitur terbaru JavaScript ES6",
            downloadCount: 52
          },
          {
            id: 4,
            title: "Business Plan Template",
            subject: "Kewirausahaan",
            teacher: "Bu Rina Sari",
            uploadDate: "2024-01-08",
            fileType: "DOCX",
            fileSize: "1.2 MB",
            description: "Template untuk membuat rencana bisnis",
            downloadCount: 29
          }
        ];

        setMaterials(mockMaterials);
      } catch (error) {
        console.error("Error fetching materials:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentMaterials();
  }, []);

  const subjects = ['all', ...new Set(materials.map(material => material.subject))];
  const filteredMaterials = selectedSubject === 'all' 
    ? materials 
    : materials.filter(material => material.subject === selectedSubject);

  const handleDownload = (material) => {
    // Simulasi download
    alert(`Mengunduh: ${material.title}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat materi pembelajaran...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Materi Pembelajaran</h1>
        <p className="text-blue-100">
          Akses semua materi pembelajaran yang telah disiapkan oleh guru
        </p>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-wrap items-center gap-4">
          <label className="font-semibold text-gray-700">Filter Mata Pelajaran:</label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          >
            <option value="all">Semua Mata Pelajaran</option>
            {subjects.filter(subject => subject !== 'all').map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMaterials.map((material) => (
          <div key={material.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">{material.title}</h3>
                  <p className="text-sm text-blue-600 font-medium">{material.subject}</p>
                  <p className="text-sm text-gray-500">oleh {material.teacher}</p>
                </div>
                <div className="flex-shrink-0">
                  <LuBookOpen className="text-blue-500" size={24} />
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4">{material.description}</p>

              <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                <div className="flex items-center">
                  <LuCalendar className="mr-1" size={12} />
                  {material.uploadDate}
                </div>
                <div>{material.fileType} • {material.fileSize}</div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  {material.downloadCount} downloads
                </span>
                <div className="flex gap-2">
                  <button className="flex items-center px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <LuEye className="mr-1" size={14} />
                    Lihat
                  </button>
                  <button
                    onClick={() => handleDownload(material)}
                    className="flex items-center px-3 py-1 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
                  >
                    <LuDownload className="mr-1" size={14} />
                    Unduh
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredMaterials.length === 0 && (
        <div className="text-center py-12">
          <LuBookOpen className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Tidak ada materi</h3>
          <p className="text-gray-500">
            {selectedSubject === 'all' 
              ? 'Belum ada materi pembelajaran yang tersedia'
              : `Belum ada materi untuk mata pelajaran ${selectedSubject}`
            }
          </p>
        </div>
      )}
    </div>
  );
}

export default StudentMaterialsPage;
