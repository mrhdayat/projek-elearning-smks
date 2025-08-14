// src/components/dashboard/LatestAssignments.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaFileAlt } from 'react-icons/fa';
import { formatDistanceToNow, differenceInDays } from 'date-fns';
import { id } from 'date-fns/locale';

// Fungsi helper untuk format deadline
const getDeadlineInfo = (dueDate) => {
  const now = new Date();
  const due = new Date(dueDate);
  const daysRemaining = differenceInDays(due, now);

  if (daysRemaining < 1) {
    return { text: 'Deadline Besok', color: 'bg-red-100 text-red-700' };
  }
  if (daysRemaining < 7) {
    return { text: `${daysRemaining} hari lagi`, color: 'bg-amber-100 text-amber-700' };
  }
  return { text: `${Math.floor(daysRemaining / 7)} minggu lagi`, color: 'bg-green-100 text-green-700' };
};

function LatestAssignments({ assignments }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg text-gray-800">Tugas Terbaru</h3>
        <Link to="/tugas-ujian" className="text-sm font-semibold text-blue-600 hover:underline">Lihat Semua</Link>
      </div>
      <ul className="space-y-4">
        {assignments.map(task => {
          const deadline = getDeadlineInfo(task.due_date);
          return (
            <li key={task.id} className="flex items-center space-x-4">
              <FaFileAlt className="text-red-500 flex-shrink-0" size={20} />
              <div className="flex-1">
                <p className="font-semibold text-gray-800 text-sm">{task.title}</p>
                <p className="text-xs text-gray-500">{task.course_name} • {task.teacher_name}</p>
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${deadline.color}`}>
                {deadline.text}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default LatestAssignments;