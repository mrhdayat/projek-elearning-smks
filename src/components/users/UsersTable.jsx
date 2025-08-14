// src/components/users/UsersTable.jsx
import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { format } from 'date-fns';

function UsersTable({ users, onEdit, onDelete }) {
  if (users.length === 0) {
    return <p className="text-center text-gray-500">Tidak ada data pengguna.</p>;
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      {/* Tampilan Tabel untuk Desktop (Mobile First: disembunyikan di layar kecil) */}
      <table className="min-w-full leading-normal hidden md:table">
        <thead>
          <tr>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Nama</th>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Peran</th>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tanggal Bergabung</th>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm">
                <p className="text-gray-900 whitespace-no-wrap font-semibold">{user.full_name}</p>
                <p className="text-gray-600 whitespace-no-wrap">{user.email}</p>
              </td>
              <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm">
                <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                  <span aria-hidden className="absolute inset-0 bg-green-200 opacity-50 rounded-full"></span>
                  <span className="relative">{user.role}</span>
                </span>
              </td>
              <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm">
                <p className="text-gray-900 whitespace-no-wrap">{format(new Date(user.created_at), 'dd MMMM yyyy')}</p>
              </td>
              <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm text-center">
                <button onClick={() => onEdit(user.id)} className="text-yellow-600 hover:text-yellow-900 mr-3"><FaEdit /></button>
                <button onClick={() => onDelete(user.id)} className="text-red-600 hover:text-red-900"><FaTrash /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Tampilan Kartu untuk Mobile (Mobile First: ditampilkan di layar kecil, disembunyikan di medium ke atas) */}
      <div className="grid grid-cols-1 gap-4 p-4 md:hidden">
        {users.map(user => (
          <div key={user.id} className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-center mb-2">
                <div>
                    <p className="font-bold text-gray-900">{user.full_name}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                </div>
                <div className="flex space-x-2">
                    <button onClick={() => onEdit(user.id)} className="text-yellow-600 p-2"><FaEdit /></button>
                    <button onClick={() => onDelete(user.id)} className="text-red-600 p-2"><FaTrash /></button>
                </div>
            </div>
            <div className="text-sm text-gray-600 border-t pt-2">
                <p><strong>Peran:</strong> {user.role}</p>
                <p><strong>Bergabung:</strong> {format(new Date(user.created_at), 'dd/MM/yy')}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UsersTable;