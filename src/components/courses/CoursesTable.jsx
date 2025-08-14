// src/components/courses/CoursesTable.jsx
import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { format } from 'date-fns';

function CoursesTable({ courses, onEdit, onDelete }) {
  if (!courses || courses.length === 0) {
    return <p className="text-center text-gray-500 py-8">Tidak ada data mata pelajaran.</p>;
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      {/* Tampilan Tabel untuk Desktop */}
      <table className="min-w-full leading-normal hidden md:table">
        <thead>
          <tr>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Nama Mata Pelajaran</th>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Pengampu</th>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tanggal Dibuat</th>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {courses.map(course => (
            <tr key={course.id}>
              <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm">
                <p className="text-gray-900 whitespace-no-wrap font-semibold">{course.name}</p>
                <p className="text-gray-600 whitespace-no-wrap">{course.description || '-'}</p>
              </td>
              <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm">
                <p className="text-gray-900 whitespace-no-wrap">{course.teacher_name || 'Belum ada pengampu'}</p>
              </td>
              <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm">
                <p className="text-gray-900 whitespace-no-wrap">{format(new Date(course.created_at), 'dd MMMM yyyy')}</p>
              </td>
              <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm text-center">
                <button onClick={() => onEdit(course.id)} className="text-yellow-600 hover:text-yellow-900 mr-3"><FaEdit /></button>
                <button onClick={() => onDelete(course.id)} className="text-red-600 hover:text-red-900"><FaTrash /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Tampilan Kartu untuk Mobile */}
      <div className="grid grid-cols-1 gap-4 p-4 md:hidden">
        {courses.map(course => (
          <div key={course.id} className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-start mb-2">
                <div>
                    <p className="font-bold text-gray-900">{course.name}</p>
                    <p className="text-sm text-gray-600">{course.description || 'Tidak ada deskripsi.'}</p>
                </div>
                <div className="flex space-x-2">
                    <button onClick={() => onEdit(course.id)} className="text-yellow-600 p-2"><FaEdit /></button>
                    <button onClick={() => onDelete(course.id)} className="text-red-600 p-2"><FaTrash /></button>
                </div>
            </div>
            <div className="text-sm text-gray-600 border-t pt-2">
                <p><strong>Pengampu:</strong> {course.teacher_name || 'Belum ada'}</p>
                <p><strong>Dibuat:</strong> {format(new Date(course.created_at), 'dd/MM/yy')}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CoursesTable;