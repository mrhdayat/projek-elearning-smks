import React from 'react';
import { FaEdit, FaTrash, FaFileAlt, FaLink, FaAlignLeft } from 'react-icons/fa';
import { format } from 'date-fns';

// Objek untuk memetakan tipe materi ke ikon yang sesuai
const typeIcons = {
  file: <FaFileAlt className="text-blue-500" title="File" />,
  link: <FaLink className="text-green-500" title="Link" />,
  text: <FaAlignLeft className="text-gray-500" title="Teks" />,
};

function MaterialsTable({ materials, onEdit, onDelete }) {
  // Menampilkan pesan jika tidak ada data
  if (!materials || materials.length === 0) {
    return <p className="text-center text-gray-500 py-8">Belum ada materi yang ditambahkan.</p>;
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      {/* ======================================= */}
      {/* ==      Tampilan Tabel (Desktop)     == */}
      {/* ======================================= */}
      <table className="min-w-full leading-normal hidden md:table">
        <thead>
          <tr>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Judul Materi</th>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Mata Pelajaran</th>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Pengunggah</th>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tanggal</th>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {materials.map(material => (
            <tr key={material.id}>
              <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm">
                <div className="flex items-center">
                  <span className="mr-3 flex-shrink-0">{typeIcons[material.type]}</span>
                  <p className="text-gray-900 font-semibold">{material.title}</p>
                </div>
              </td>
              <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm">
                <p className="text-gray-900">{material.course_name}</p>
              </td>
              <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm">
                <p className="text-gray-900">{material.uploader_name || 'N/A'}</p>
              </td>
              <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm">
                <p className="text-gray-900">{format(new Date(material.created_at), 'dd MMMM yyyy')}</p>
              </td>
              <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm text-center">
                <button onClick={() => onEdit(material.id)} className="text-yellow-600 hover:text-yellow-900 mr-3"><FaEdit /></button>
                <button onClick={() => onDelete(material.id)} className="text-red-600 hover:text-red-900"><FaTrash /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ======================================= */}
      {/* ==       Tampilan Kartu (Mobile)     == */}
      {/* ======================================= */}
      <div className="grid grid-cols-1 gap-4 p-4 md:hidden">
        {materials.map(material => (
          <div key={material.id} className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-start mb-2">
                <div className="flex items-center">
                    <span className="mr-3 flex-shrink-0">{typeIcons[material.type]}</span>
                    <p className="font-bold text-gray-900">{material.title}</p>
                </div>
                <div className="flex space-x-2 flex-shrink-0">
                    <button onClick={() => onEdit(material.id)} className="text-yellow-600 p-2"><FaEdit /></button>
                    <button onClick={() => onDelete(material.id)} className="text-red-600 p-2"><FaTrash /></button>
                </div>
            </div>
            <div className="text-sm text-gray-600 border-t pt-2 mt-2 space-y-1">
                <p><strong>Mata Pelajaran:</strong> {material.course_name}</p>
                <p><strong>Pengunggah:</strong> {material.uploader_name || 'N/A'}</p>
                <p><strong>Tanggal:</strong> {format(new Date(material.created_at), 'dd MMM yyyy')}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MaterialsTable;