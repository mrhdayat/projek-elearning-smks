// src/components/dashboard/ClassTeacherDashboard.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import StatCard from './StatCard';
import QuickActions from './QuickActions';
import LatestAssignments from './LatestAssignments';
import { LuUsers, LuBookOpen, LuClipboardCheck, LuTrendingUp, LuCalendar, LuAward, LuAlertTriangle, LuActivity } from 'react-icons/lu';

function ClassTeacherDashboard({ userRole, userProfile }) {
  const [classStats, setClassStats] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [studentPerformance, setStudentPerformance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        setLoading(true);
        
        // Simulasi data kelas untuk wali kelas
        // Dalam implementasi nyata, ini akan mengambil data berdasarkan kelas yang diampu
        const mockClassStats = {
          totalStudents: 32,
          presentToday: 28,
          averageGrade: 78.5,
          completedAssignments: 24,
          pendingAssignments: 8,
          className: "XII RPL 2"
        };

        const mockStudentPerformance = [
          { name: "Ahmad Rizki", grade: 85, status: "Baik", lastActivity: "2 jam lalu" },
          { name: "Siti Nurhaliza", grade: 92, status: "Sangat Baik", lastActivity: "1 jam lalu" },
          { name: "Budi Santoso", grade: 65, status: "Perlu Perhatian", lastActivity: "1 hari lalu" },
          { name: "Dewi Sartika", grade: 88, status: "Baik", lastActivity: "3 jam lalu" },
          { name: "Eko Prasetyo", grade: 72, status: "Cukup", lastActivity: "5 jam lalu" }
        ];

        const assignmentsResponse = await supabase.rpc('get_latest_assignments');
        if (assignmentsResponse.error) throw assignmentsResponse.error;
        
        setClassStats(mockClassStats);
        setStudentPerformance(mockStudentPerformance);
        setAssignments(assignmentsResponse.data || []);

      } catch (error) {
        console.error("Gagal mengambil data kelas:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClassData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data kelas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Dashboard */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">
          Dashboard Wali Kelas - {classStats?.className}
        </h2>
        <p className="text-purple-100">
          Kelola dan monitor progres siswa di kelas Anda secara spesifik.
        </p>
      </div>

      {/* Statistik Kelas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={<LuUsers size={24} className="text-blue-600" />}
          title="Total Siswa"
          value={classStats?.totalStudents ?? 0}
          details={`${classStats?.presentToday ?? 0} hadir hari ini`}
          colorClass="bg-blue-100"
          isClickable={true}
          onClick={() => window.location.href = '/kelola-pengguna'}
        />
        <StatCard 
          icon={<LuAward size={24} className="text-green-600" />}
          title="Rata-rata Nilai"
          value={classStats?.averageGrade ?? 0}
          details="Performa kelas"
          colorClass="bg-green-100"
          trend={{
            value: "+2.5%",
            isPositive: true
          }}
        />
        <StatCard 
          icon={<LuClipboardCheck size={24} className="text-yellow-600" />}
          title="Tugas Selesai"
          value={classStats?.completedAssignments ?? 0}
          details={`${classStats?.pendingAssignments ?? 0} pending`}
          colorClass="bg-yellow-100"
        />
        <StatCard 
          icon={<LuTrendingUp size={24} className="text-purple-600" />}
          title="Tingkat Kehadiran"
          value={`${Math.round(((classStats?.presentToday ?? 0) / (classStats?.totalStudents ?? 1)) * 100)}%`}
          details="Kehadiran hari ini"
          colorClass="bg-purple-100"
          trend={{
            value: "+5.2%",
            isPositive: true
          }}
        />
      </div>

      {/* Quick Actions dan Assignments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <QuickActions userRole={userRole} />
        </div>
        <div className="lg:col-span-2">
          <LatestAssignments assignments={assignments} />
        </div>
      </div>

      {/* Performa Siswa */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <LuActivity className="mr-2 text-purple-600" />
          Performa Siswa Terkini
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama Siswa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nilai Rata-rata
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aktivitas Terakhir
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {studentPerformance.map((student, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {student.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      student.grade >= 85 ? 'bg-green-100 text-green-800' :
                      student.grade >= 75 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {student.grade}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
                      student.status === 'Sangat Baik' ? 'bg-green-100 text-green-800' :
                      student.status === 'Baik' ? 'bg-blue-100 text-blue-800' :
                      student.status === 'Cukup' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {student.status === 'Perlu Perhatian' && <LuAlertTriangle className="mr-1 h-3 w-3" />}
                      {student.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.lastActivity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ringkasan Kelas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
            <LuBookOpen className="mr-2 text-blue-600" />
            Materi Pembelajaran
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Materi</span>
              <span className="font-semibold">24</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Materi Baru Minggu Ini</span>
              <span className="font-semibold text-green-600">3</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
            <LuClipboardCheck className="mr-2 text-yellow-600" />
            Status Tugas
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Tugas Aktif</span>
              <span className="font-semibold">5</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Perlu Dinilai</span>
              <span className="font-semibold text-red-600">12</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
            <LuCalendar className="mr-2 text-purple-600" />
            Jadwal Hari Ini
          </h4>
          <div className="space-y-2">
            <div className="text-sm">
              <span className="text-gray-600">08:00 - 09:30</span>
              <p className="font-semibold">Matematika</p>
            </div>
            <div className="text-sm">
              <span className="text-gray-600">10:00 - 11:30</span>
              <p className="font-semibold">Bahasa Indonesia</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClassTeacherDashboard;
