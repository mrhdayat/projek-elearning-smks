// src/components/dashboard/PrincipalDashboard.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import StatCard from './StatCard';
import ActivityChart from './ActivityChart';
import QuickActions from './QuickActions';
import AuditLog from './AuditLog';
import { LuUsers, LuGraduationCap, LuBookOpen, LuTrendingUp, LuActivity, LuAward, LuCalendar } from 'react-icons/lu';

function PrincipalDashboard({ userRole }) {
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [logs, setLogs] = useState([]);
  const [performanceData, setPerformanceData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        const [statsResponse, chartResponse, logsResponse] = await Promise.all([
          supabase.rpc('get_dashboard_stats'),
          supabase.rpc('get_weekly_activity'),
          supabase.rpc('get_latest_activity_logs')
        ]);

        if (statsResponse.error) throw statsResponse.error;
        if (chartResponse.error) throw chartResponse.error;
        if (logsResponse.error) throw logsResponse.error;
        
        setStats(statsResponse.data);
        setChartData(chartResponse.data);
        setLogs(logsResponse.data);

        // Simulasi data performa untuk kepala sekolah
        setPerformanceData({
          averageGrade: 82.5,
          completionRate: 89.2,
          activeStudents: 95.8,
          teacherEngagement: 92.1
        });

      } catch (error) {
        console.error("Gagal mengambil data dashboard:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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
      <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">
          Dashboard Kepala Sekolah
        </h2>
        <p className="text-green-100">
          Monitor kesehatan dan progres akademik sekolah secara keseluruhan.
        </p>
      </div>

      {/* Statistik Utama */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={<LuUsers size={24} className="text-blue-600" />}
          title="Total Siswa"
          value={stats?.siswa.total ?? 0}
          details="Siswa terdaftar"
          colorClass="bg-blue-100"
          isClickable={true}
          onClick={() => window.location.href = '/laporan-nilai'}
        />
        <StatCard 
          icon={<LuGraduationCap size={24} className="text-green-600" />}
          title="Total Guru"
          value={stats?.guru.total ?? 0}
          details="Tenaga pengajar"
          colorClass="bg-green-100"
          isClickable={true}
          onClick={() => window.location.href = '/audit-log'}
        />
        <StatCard 
          icon={<LuBookOpen size={24} className="text-yellow-600" />}
          title="Kelas Aktif"
          value={stats?.kelas.total ?? 0}
          details="Kelas berjalan"
          colorClass="bg-yellow-100"
          isClickable={true}
          onClick={() => window.location.href = '/jadwal-pelajaran'}
        />
        <StatCard 
          icon={<LuActivity size={24} className="text-purple-600" />}
          title="Aktivitas Hari Ini"
          value={stats?.login_today ?? 0}
          details="Pengguna aktif"
          colorClass="bg-purple-100"
        />
      </div>

      {/* Indikator Performa Sekolah */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={<LuAward size={24} className="text-yellow-600" />}
          title="Rata-rata Nilai"
          value={performanceData?.averageGrade ?? 0}
          details="Performa akademik"
          colorClass="bg-yellow-100"
          trend={{
            value: "+2.3%",
            isPositive: true
          }}
        />
        <StatCard 
          icon={<LuTrendingUp size={24} className="text-green-600" />}
          title="Tingkat Penyelesaian"
          value={`${performanceData?.completionRate ?? 0}%`}
          details="Tugas diselesaikan"
          colorClass="bg-green-100"
          trend={{
            value: "+5.1%",
            isPositive: true
          }}
        />
        <StatCard 
          icon={<LuUsers size={24} className="text-blue-600" />}
          title="Siswa Aktif"
          value={`${performanceData?.activeStudents ?? 0}%`}
          details="Kehadiran online"
          colorClass="bg-blue-100"
          trend={{
            value: "+1.8%",
            isPositive: true
          }}
        />
        <StatCard 
          icon={<LuTrendingUp size={24} className="text-purple-600" />}
          title="Engagement Guru"
          value={`${performanceData?.teacherEngagement ?? 0}%`}
          details="Aktivitas mengajar"
          colorClass="bg-purple-100"
          trend={{
            value: "+3.2%",
            isPositive: true
          }}
        />
      </div>

      {/* Chart dan Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ActivityChart data={chartData} />
        </div>
        <div>
          <QuickActions userRole={userRole} />
        </div>
      </div>

      {/* Ringkasan Akademik */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <LuActivity className="mr-2 text-blue-600" />
            Ringkasan Akademik
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Total Materi Pembelajaran</span>
              <span className="font-semibold text-blue-600">{stats?.materi.total ?? 0}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Tugas Aktif</span>
              <span className="font-semibold text-green-600">{stats?.tugas?.total ?? 0}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Pengumuman Aktif</span>
              <span className="font-semibold text-yellow-600">{stats?.pengumuman?.total ?? 0}</span>
            </div>
          </div>
        </div>
        
        <div>
          <AuditLog logs={logs} title="Aktivitas Terkini" />
        </div>
      </div>

      {/* Laporan Bulanan */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <LuCalendar className="mr-2 text-green-600" />
          Laporan Bulanan
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
            <h4 className="font-semibold text-blue-700">Pertumbuhan Siswa</h4>
            <p className="text-2xl font-bold text-blue-600">+{stats?.siswa.growth ?? 0}</p>
            <p className="text-sm text-blue-500">Siswa baru bulan ini</p>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
            <h4 className="font-semibold text-green-700">Materi Ditambahkan</h4>
            <p className="text-2xl font-bold text-green-600">+{stats?.materi.growth ?? 0}</p>
            <p className="text-sm text-green-500">Konten baru bulan ini</p>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
            <h4 className="font-semibold text-purple-700">Aktivitas Sistem</h4>
            <p className="text-2xl font-bold text-purple-600">{stats?.total_activities ?? 0}</p>
            <p className="text-sm text-purple-500">Total aktivitas</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PrincipalDashboard;
