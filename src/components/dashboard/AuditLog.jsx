// src/components/dashboard/AuditLog.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';

function AuditLog({ logs }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg text-gray-800">Log Audit Aktivitas</h3>
        <Link to="/audit-log" className="text-sm font-semibold text-blue-600 hover:underline">Lihat Semua</Link>
      </div>
      <ul className="space-y-4">
        {logs.map(log => (
          <li key={log.id} className="flex items-start space-x-3">
            <FaUserCircle className="text-gray-400 flex-shrink-0 mt-1" size={20} />
            <div className="flex-1">
              <p className="text-sm text-gray-800">
                <span className="font-bold">{log.user_name || 'Sistem'}</span> {log.action_type.replace(/_/g, ' ')}
              </p>
              <p className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(log.created_at), { addSuffix: true, locale: id })}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AuditLog;