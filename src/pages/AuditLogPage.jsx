// src/pages/AuditLogPage.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import Pagination from '../components/dashboard/Pagination';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

const LOGS_PER_PAGE = 15;

function AuditLogPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.rpc('get_paginated_activity_logs', {
          page_size: LOGS_PER_PAGE,
          page_number: currentPage,
        });
        if (error) throw error;
        setLogs(data.data || []);
        setTotalPages(Math.ceil((data.total_count || 0) / LOGS_PER_PAGE));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [currentPage]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Log Audit Aktivitas</h1>
      <div className="bg-white p-6 rounded-lg shadow-sm">
        {loading && <p>Memuat...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && (
          <ul className="space-y-4">
            {logs.map(log => (
              <li key={log.id} className="border-b pb-2">
                <p className="text-gray-800">
                  <span className="font-bold">{log.user_name || 'Sistem'}</span> {log.action_type.replace(/_/g, ' ')}
                </p>
                <p className="text-xs text-gray-500">
                  {format(new Date(log.created_at), 'dd MMMM yyyy, HH:mm:ss', { locale: id })}
                </p>
              </li>
            ))}
          </ul>
        )}
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
export default AuditLogPage;