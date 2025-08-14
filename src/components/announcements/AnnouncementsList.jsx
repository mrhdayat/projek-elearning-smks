// src/components/announcements/AnnouncementsList.jsx
import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

function AnnouncementsList({ announcements, onEdit, onDelete }) {
  if (!announcements || announcements.length === 0) {
    return <p className="text-center text-gray-500 py-8">Belum ada pengumuman yang dibuat.</p>;
  }

  return (
    <div className="space-y-4">
      {announcements.map(item => (
        <div key={item.id} className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-lg text-gray-900">{item.title}</h3>
              <p className="text-xs text-gray-500 mt-1">
                Dibuat oleh {item.creator_name || 'N/A'} • {format(new Date(item.created_at), 'dd MMMM yyyy, HH:mm', { locale: id })}
              </p>
            </div>
            <div className="flex space-x-2 flex-shrink-0 ml-4">
              <button onClick={() => onEdit(item.id)} className="text-yellow-600 hover:text-yellow-900 p-2"><FaEdit /></button>
              <button onClick={() => onDelete(item.id)} className="text-red-600 hover:text-red-900 p-2"><FaTrash /></button>
            </div>
          </div>
          <p className="text-gray-700 mt-4 text-sm whitespace-pre-wrap">{item.content}</p>
        </div>
      ))}
    </div>
  );
}

export default AnnouncementsList;