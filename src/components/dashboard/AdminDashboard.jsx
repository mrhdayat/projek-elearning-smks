// src/components/dashboard/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import StatCard from './StatCard';
import ActivityChart from './ActivityChart';
import QuickActions from './QuickActions';
import LatestAssignments from './LatestAssignments';
import AuditLog from './AuditLog';
import { LuUsers, LuGraduationCap, LuBookOpen, LuFileText, LuTrendingUp, LuActivity } from 'react-icons/lu';
import Papa from 'papaparse';

function AdminDashboard({ userRole }) {
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        const [statsResponse, chartResponse, assignmentsResponse, logsResponse] = await Promise.all([
          supabase.rpc('get_dashboard_stats'),
          supabase.rpc('get_weekly_activity'),
          supabase.rpc('get_latest_assignments'),
          supabase.rpc('get_latest_activity_logs')
        ]);

        if (statsResponse.error) throw statsResponse.error;
        if (chartResponse.error) throw chartResponse.error;
        if (assignmentsResponse.error) throw assignmentsResponse.error;
        if (logsResponse.error) throw logsResponse.error;
        
        setStats(statsResponse.data);
        setChartData(chartResponse.data);
        setAssignments(assignmentsResponse.data);
        setLogs(logsResponse.data);

      } catch (error) {
        console.error("Gagal mengambil data dashboard:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleExportUsers = async () => {
    try {
      const { data, error } = await supabase.rpc('get_all_users_with_details');
      if (error) throw error;

      if (!data || data.length === 0) {
        alert("Tidak ada data pengguna untuk di-export.");
        return;
      }

      const csv = Papa.unparse(data);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.setAttribute('download', 'laporan_pengguna.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      alert('Gagal meng-export data: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Dashboard */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">
          Selamat Datang, {userRole}!
        </h2>
        <p className="text-blue-100">
          Kelola platform e-learning dengan akses penuh untuk semua fitur dan pengaturan sistem.
        </p>
      </div>

      {/* Statistik Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={<LuUsers size={24} className="text-blue-600" />}
          title="Total Siswa"
          value={stats?.siswa.total ?? 0}
          details={`+${stats?.siswa.growth ?? 0} dalam 30 hari`}
          colorClass="bg-blue-100"
          trend={{
            value: `${stats?.siswa.growth ?? 0}%`,
            isPositive: (stats?.siswa.growth ?? 0) >= 0
          }}
        />
        <StatCard 
          icon={<LuGraduationCap size={24} className="text-green-600" />}
          title="Total Guru"
          value={stats?.guru.total ?? 0}
          details={`+${stats?.guru.growth ?? 0} dalam 30 hari`}
          colorClass="bg-green-100"
          trend={{
            value: `${stats?.guru.growth ?? 0}%`,
            isPositive: (stats?.guru.growth ?? 0) >= 0
          }}
        />
        <StatCard 
          icon={<LuBookOpen size={24} className="text-yellow-600" />}
          title="Kelas Aktif"
          value={stats?.kelas.total ?? 0}
          details={`+${stats?.kelas.growth ?? 0} dalam 30 hari`}
          colorClass="bg-yellow-100"
          trend={{
            value: `${stats?.kelas.growth ?? 0}%`,
            isPositive: (stats?.kelas.growth ?? 0) >= 0
          }}
        />
        <StatCard 
          icon={<LuFileText size={24} className="text-red-600" />}
          title="Total Materi"
          value={stats?.materi.total ?? 0}
          details={`+${stats?.materi.growth ?? 0} dalam 30 hari`}
          colorClass="bg-red-100"
          trend={{
            value: `${stats?.materi.growth ?? 0}%`,
            isPositive: (stats?.materi.growth ?? 0) >= 0
          }}
        />
      </div>

      {/* Statistik Tambahan untuk Admin */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
          icon={<LuTrendingUp size={24} className="text-purple-600" />}
          title="Tugas Aktif"
          value={stats?.tugas?.total ?? 0}
          details="Tugas yang sedang berjalan"
          colorClass="bg-purple-100"
        />
        <StatCard 
          icon={<LuActivity size={24} className="text-indigo-600" />}
          title="Login Hari Ini"
          value={stats?.login_today ?? 0}
          details="Pengguna aktif hari ini"
          colorClass="bg-indigo-100"
        />
        <StatCard 
          icon={<LuFileText size={24} className="text-pink-600" />}
          title="Pengumuman"
          value={stats?.pengumuman?.total ?? 0}
          details="Pengumuman aktif"
          colorClass="bg-pink-100"
        />
      </div>

      {/* Chart dan Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ActivityChart data={chartData} />
        </div>
        <div>
          <QuickActions 
            userRole={userRole} 
            onExportUsers={handleExportUsers}
          />
        </div>
      </div>

      {/* Latest Assignments dan Audit Log */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <LatestAssignments assignments={assignments} />
        </div>
        <div>
          <AuditLog logs={logs} />
        </div>
      </div>

      {/* Management Overview untuk Admin */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Ringkasan Manajemen</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-700">Pengguna Terdaftar</h4>
            <p className="text-2xl font-bold text-blue-600">{(stats?.siswa.total ?? 0) + (stats?.guru.total ?? 0)}</p>
            <p className="text-sm text-gray-500">Total semua pengguna</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-700">Konten Pembelajaran</h4>
            <p className="text-2xl font-bold text-green-600">{(stats?.materi.total ?? 0) + (stats?.tugas?.total ?? 0)}</p>
            <p className="text-sm text-gray-500">Materi + Tugas</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-700">Aktivitas Sistem</h4>
            <p className="text-2xl font-bold text-purple-600">{stats?.total_activities ?? 0}</p>
            <p className="text-sm text-gray-500">Total aktivitas</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
