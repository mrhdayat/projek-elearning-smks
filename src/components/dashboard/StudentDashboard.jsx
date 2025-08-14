// src/components/dashboard/StudentDashboard.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import StatCard from './StatCard';
import QuickActions from './QuickActions';
import { LuBookOpen, LuClipboardCheck, LuAward, LuCalendar, LuClock, LuTrendingUp, LuFileText, LuAlertCircle } from 'react-icons/lu';

function StudentDashboard({ userRole, userProfile }) {
  const [studentStats, setStudentStats] = useState(null);
  const [upcomingAssignments, setUpcomingAssignments] = useState([]);
  const [recentGrades, setRecentGrades] = useState([]);
  const [todaySchedule, setTodaySchedule] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setLoading(true);
        
        // Simulasi data untuk siswa
        const mockStudentStats = {
          studentName: userProfile?.full_name || "Siswa",
          className: "XII RPL 2",
          averageGrade: 84.5,
          completedAssignments: 18,
          pendingAssignments: 3,
          totalMaterials: 24,
          attendanceRate: 92.3,
          rank: 5,
          totalStudentsInClass: 32
        };

        const mockUpcomingAssignments = [
          { 
            title: "Project Laravel E-Commerce", 
            subject: "Pemrograman Web", 
            dueDate: "2024-01-20", 
            status: "Belum Dikerjakan",
            priority: "Tinggi"
          },
          { 
            title: "Essay Bahasa Indonesia", 
            subject: "Bahasa Indonesia", 
            dueDate: "2024-01-22", 
            status: "Sedang Dikerjakan",
            priority: "Sedang"
          },
          { 
            title: "Presentasi Kewirausahaan", 
            subject: "Kewirausahaan", 
            dueDate: "2024-01-25", 
            status: "Belum Dikerjakan",
            priority: "Sedang"
          },
          { 
            title: "Quiz Matematika", 
            subject: "Matematika", 
            dueDate: "2024-01-18", 
            status: "Terlambat",
            priority: "Tinggi"
          }
        ];

        const mockRecentGrades = [
          { subject: "Pemrograman Web", assignment: "Project PHP", grade: 88, date: "2024-01-15" },
          { subject: "Basis Data", assignment: "ERD Design", grade: 92, date: "2024-01-12" },
          { subject: "Bahasa Inggris", assignment: "Speaking Test", grade: 85, date: "2024-01-10" },
          { subject: "Matematika", assignment: "Integral", grade: 78, date: "2024-01-08" },
          { subject: "Kewirausahaan", assignment: "Business Plan", grade: 90, date: "2024-01-05" }
        ];

        const mockTodaySchedule = [
          { time: "07:30 - 09:00", subject: "Pemrograman Web", teacher: "Pak Budi", room: "Lab Komputer 1" },
          { time: "09:15 - 10:45", subject: "Basis Data", teacher: "Bu Sari", room: "Lab Komputer 2" },
          { time: "11:00 - 12:30", subject: "Bahasa Indonesia", teacher: "Bu Dewi", room: "Ruang 12A" },
          { time: "13:30 - 15:00", subject: "Matematika", teacher: "Pak Ahmad", room: "Ruang 12B" }
        ];
        
        setStudentStats(mockStudentStats);
        setUpcomingAssignments(mockUpcomingAssignments);
        setRecentGrades(mockRecentGrades);
        setTodaySchedule(mockTodaySchedule);

      } catch (error) {
        console.error("Gagal mengambil data siswa:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [userProfile]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data pembelajaran...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Dashboard */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">
          Selamat Datang, {studentStats?.studentName}!
        </h2>
        <p className="text-blue-100">
          Kelas {studentStats?.className} • Peringkat {studentStats?.rank} dari {studentStats?.totalStudentsInClass} siswa
        </p>
      </div>

      {/* Statistik Pembelajaran */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={<LuAward size={24} className="text-yellow-600" />}
          title="Rata-rata Nilai"
          value={studentStats?.averageGrade ?? 0}
          details={`Peringkat ${studentStats?.rank} di kelas`}
          colorClass="bg-yellow-100"
          trend={{
            value: "+2.3 dari bulan lalu",
            isPositive: true
          }}
        />
        <StatCard 
          icon={<LuClipboardCheck size={24} className="text-green-600" />}
          title="Tugas Selesai"
          value={studentStats?.completedAssignments ?? 0}
          details={`${studentStats?.pendingAssignments ?? 0} tugas pending`}
          colorClass="bg-green-100"
          isClickable={true}
          onClick={() => window.location.href = '/siswa/tugas'}
        />
        <StatCard 
          icon={<LuBookOpen size={24} className="text-blue-600" />}
          title="Materi Tersedia"
          value={studentStats?.totalMaterials ?? 0}
          details="Materi pembelajaran"
          colorClass="bg-blue-100"
          isClickable={true}
          onClick={() => window.location.href = '/siswa/materi'}
        />
        <StatCard 
          icon={<LuTrendingUp size={24} className="text-purple-600" />}
          title="Tingkat Kehadiran"
          value={`${studentStats?.attendanceRate ?? 0}%`}
          details="Kehadiran semester ini"
          colorClass="bg-purple-100"
          trend={{
            value: "+1.5%",
            isPositive: true
          }}
        />
      </div>

      {/* Quick Actions dan Jadwal Hari Ini */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <QuickActions userRole={userRole} />
        </div>
        
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <LuCalendar className="mr-2 text-blue-600" />
              Jadwal Pelajaran Hari Ini
            </h3>
            <div className="space-y-3">
              {todaySchedule.map((schedule, index) => (
                <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0 w-24 text-sm font-medium text-gray-600">
                    {schedule.time}
                  </div>
                  <div className="flex-1 ml-4">
                    <h4 className="font-semibold text-gray-900">{schedule.subject}</h4>
                    <p className="text-sm text-gray-600">{schedule.teacher} • {schedule.room}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Aktif
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tugas yang Akan Datang */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <LuClock className="mr-2 text-orange-600" />
          Tugas & Ujian yang Akan Datang
          <span className="ml-2 bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {upcomingAssignments.length}
          </span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {upcomingAssignments.map((assignment, index) => (
            <div key={index} className={`p-4 rounded-lg border-l-4 ${
              assignment.status === 'Terlambat' ? 'border-red-400 bg-red-50' :
              assignment.priority === 'Tinggi' ? 'border-orange-400 bg-orange-50' :
              'border-blue-400 bg-blue-50'
            }`}>
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-gray-900">{assignment.title}</h4>
                {assignment.status === 'Terlambat' && (
                  <LuAlertCircle className="text-red-500 flex-shrink-0 ml-2" size={16} />
                )}
              </div>
              <p className="text-sm text-gray-600 mb-2">{assignment.subject}</p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Deadline: {assignment.dueDate}</span>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  assignment.status === 'Terlambat' ? 'bg-red-100 text-red-800' :
                  assignment.status === 'Sedang Dikerjakan' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {assignment.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Nilai Terbaru */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <LuFileText className="mr-2 text-green-600" />
          Nilai Terbaru
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mata Pelajaran
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tugas/Ujian
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nilai
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentGrades.map((grade, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {grade.subject}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {grade.assignment}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      grade.grade >= 85 ? 'bg-green-100 text-green-800' :
                      grade.grade >= 75 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {grade.grade}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {grade.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Progres Pembelajaran */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h4 className="font-semibold text-gray-700 mb-3">Progres Semester</h4>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Tugas Selesai</span>
                <span>85%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{width: '85%'}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Kehadiran</span>
                <span>92%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{width: '92%'}}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h4 className="font-semibold text-gray-700 mb-3">Mata Pelajaran Favorit</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Pemrograman Web</span>
              <span className="font-semibold text-blue-600">92</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Basis Data</span>
              <span className="font-semibold text-green-600">89</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Kewirausahaan</span>
              <span className="font-semibold text-purple-600">87</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h4 className="font-semibold text-gray-700 mb-3">Target Semester</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Target Rata-rata</span>
              <span className="font-semibold">85</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Saat Ini</span>
              <span className="font-semibold text-green-600">84.5</span>
            </div>
            <div className="text-xs text-gray-500 mt-2">
              Hampir mencapai target! 💪
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
