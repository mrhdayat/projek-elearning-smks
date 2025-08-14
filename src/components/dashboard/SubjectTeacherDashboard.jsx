// src/components/dashboard/SubjectTeacherDashboard.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import StatCard from './StatCard';
import QuickActions from './QuickActions';
import LatestAssignments from './LatestAssignments';
import { LuBookOpen, LuClipboardCheck, LuUsers, LuCalendar, LuFileText, LuTrendingUp, LuClock, LuAward } from 'react-icons/lu';

function SubjectTeacherDashboard({ userRole, userProfile }) {
  const [subjectStats, setSubjectStats] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [pendingGrades, setPendingGrades] = useState([]);
  const [recentMaterials, setRecentMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubjectData = async () => {
      try {
        setLoading(true);
        
        // Simulasi data mata pelajaran untuk guru mapel
        // Dalam implementasi nyata, ini akan mengambil data berdasarkan mata pelajaran yang diampu
        const mockSubjectStats = {
          subjectName: "Pemrograman Web",
          totalStudents: 96, // Total siswa di semua kelas yang mengambil mata pelajaran ini
          totalMaterials: 18,
          totalAssignments: 12,
          pendingGrades: 8,
          averageGrade: 81.2,
          completionRate: 87.5
        };

        const mockPendingGrades = [
          { studentName: "Ahmad Rizki", assignment: "Project Laravel", class: "XII RPL 1", submittedAt: "2 hari lalu" },
          { studentName: "Siti Nurhaliza", assignment: "Tugas HTML/CSS", class: "XII RPL 2", submittedAt: "1 hari lalu" },
          { studentName: "Budi Santoso", assignment: "Project Laravel", class: "XII RPL 1", submittedAt: "3 hari lalu" },
          { studentName: "Dewi Sartika", assignment: "JavaScript Quiz", class: "XII RPL 2", submittedAt: "1 hari lalu" }
        ];

        const mockRecentMaterials = [
          { title: "Pengenalan Framework Laravel", uploadedAt: "3 hari lalu", downloads: 45 },
          { title: "CSS Grid dan Flexbox", uploadedAt: "1 minggu lalu", downloads: 67 },
          { title: "JavaScript ES6 Features", uploadedAt: "2 minggu lalu", downloads: 52 }
        ];

        const assignmentsResponse = await supabase.rpc('get_latest_assignments');
        if (assignmentsResponse.error) throw assignmentsResponse.error;
        
        setSubjectStats(mockSubjectStats);
        setPendingGrades(mockPendingGrades);
        setRecentMaterials(mockRecentMaterials);
        setAssignments(assignmentsResponse.data || []);

      } catch (error) {
        console.error("Gagal mengambil data mata pelajaran:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjectData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data mata pelajaran...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Dashboard */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">
          Dashboard Guru Mapel - {subjectStats?.subjectName}
        </h2>
        <p className="text-indigo-100">
          Kelola materi, tugas, dan penilaian untuk mata pelajaran yang Anda ampu.
        </p>
      </div>

      {/* Statistik Mata Pelajaran */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={<LuUsers size={24} className="text-blue-600" />}
          title="Total Siswa"
          value={subjectStats?.totalStudents ?? 0}
          details="Mengambil mata pelajaran"
          colorClass="bg-blue-100"
        />
        <StatCard 
          icon={<LuBookOpen size={24} className="text-green-600" />}
          title="Materi Pembelajaran"
          value={subjectStats?.totalMaterials ?? 0}
          details="Materi tersedia"
          colorClass="bg-green-100"
          isClickable={true}
          onClick={() => window.location.href = '/manajemen-materi'}
        />
        <StatCard 
          icon={<LuClipboardCheck size={24} className="text-yellow-600" />}
          title="Tugas & Ujian"
          value={subjectStats?.totalAssignments ?? 0}
          details={`${subjectStats?.pendingGrades ?? 0} perlu dinilai`}
          colorClass="bg-yellow-100"
          isClickable={true}
          onClick={() => window.location.href = '/tugas-ujian'}
        />
        <StatCard 
          icon={<LuAward size={24} className="text-purple-600" />}
          title="Rata-rata Nilai"
          value={subjectStats?.averageGrade ?? 0}
          details={`${subjectStats?.completionRate ?? 0}% completion rate`}
          colorClass="bg-purple-100"
          trend={{
            value: "+3.2%",
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

      {/* Tugas yang Perlu Dinilai */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <LuClock className="mr-2 text-red-600" />
          Tugas Menunggu Penilaian
          <span className="ml-2 bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {pendingGrades.length}
          </span>
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama Siswa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tugas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kelas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dikumpulkan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pendingGrades.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.studentName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.assignment}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.class}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.submittedAt}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-indigo-600 hover:text-indigo-900">
                      Nilai Sekarang
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Materi Terbaru dan Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <LuFileText className="mr-2 text-green-600" />
            Materi Terbaru
          </h3>
          <div className="space-y-4">
            {recentMaterials.map((material, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">{material.title}</h4>
                  <p className="text-sm text-gray-500">Diupload {material.uploadedAt}</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold text-blue-600">{material.downloads}</span>
                  <p className="text-xs text-gray-500">downloads</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <LuTrendingUp className="mr-2 text-purple-600" />
            Statistik Pembelajaran
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Tingkat Penyelesaian Tugas</span>
              <span className="font-semibold text-green-600">{subjectStats?.completionRate}%</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Rata-rata Waktu Pengerjaan</span>
              <span className="font-semibold text-blue-600">2.5 hari</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Materi Paling Populer</span>
              <span className="font-semibold text-purple-600">CSS Grid</span>
            </div>
          </div>
        </div>
      </div>

      {/* Jadwal Mengajar Hari Ini */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <LuCalendar className="mr-2 text-indigo-600" />
          Jadwal Mengajar Hari Ini
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-indigo-50 rounded-lg">
            <h4 className="font-semibold text-indigo-700">08:00 - 09:30</h4>
            <p className="text-indigo-600">XII RPL 1</p>
            <p className="text-sm text-indigo-500">Ruang Lab Komputer 1</p>
          </div>
          <div className="p-4 bg-indigo-50 rounded-lg">
            <h4 className="font-semibold text-indigo-700">10:00 - 11:30</h4>
            <p className="text-indigo-600">XII RPL 2</p>
            <p className="text-sm text-indigo-500">Ruang Lab Komputer 2</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-700">13:00 - 14:30</h4>
            <p className="text-gray-600">XI RPL 1</p>
            <p className="text-sm text-gray-500">Ruang Lab Komputer 1</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SubjectTeacherDashboard;
