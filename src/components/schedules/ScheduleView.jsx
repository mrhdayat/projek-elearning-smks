// src/components/schedules/ScheduleView.jsx
import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

// Helper untuk mengubah '08:00:00' menjadi '08:00'
const formatTime = (timeStr) => timeStr.substring(0, 5);

function ScheduleView({ schedule, onEdit, onDelete }) {
  const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  
  if (!schedule || schedule.length === 0) {
    return <p className="text-center text-gray-500 py-8">Jadwal pelajaran masih kosong.</p>;
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm overflow-x-auto">
      <div className="grid grid-cols-6 min-w-[700px]">
        {/* Headers Hari */}
        {days.map(day => (
          <div key={day} className="text-center font-bold p-2 border-b-2">{day}</div>
        ))}

        {/* Isi Jadwal */}
        {days.map(day => (
          <div key={day} className="border-l border-r p-2 space-y-2">
            {schedule
              .filter(item => item.day_of_week === day)
              .sort((a, b) => a.start_time.localeCompare(b.start_time))
              .map(item => (
                <div key={item.id} className="bg-blue-100 p-3 rounded-lg text-sm text-blue-800 relative group">
                  <p className="font-bold">{item.course_name}</p>
                  <p className="text-xs">{item.teacher_name || 'N/A'}</p>
                  <p className="text-xs mt-1">{formatTime(item.start_time)} - {formatTime(item.end_time)}</p>
                  {item.class_group && <p className="text-xs mt-1 font-semibold">{item.class_group}</p>}
                  
                  {/* Tombol Aksi yang muncul saat hover */}
                  <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => onEdit(item.id)} className="text-yellow-600 hover:text-yellow-800 p-1"><FaEdit size={14}/></button>
                    <button onClick={() => onDelete(item.id)} className="text-red-600 hover:text-red-800 p-1"><FaTrash size={14}/></button>
                  </div>
                </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ScheduleView;