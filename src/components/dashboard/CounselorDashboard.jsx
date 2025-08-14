// src/components/dashboard/CounselorDashboard.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import StatCard from './StatCard';
import QuickActions from './QuickActions';
import { LuUsers, LuAlertTriangle, LuTrendingDown, LuHeart, LuCalendar, LuMessageCircle, LuActivity, LuClock } from 'react-icons/lu';

function CounselorDashboard({ userRole, userProfile }) {
  const [counselingStats, setCounselingStats] = useState(null);
  const [studentsNeedingAttention, setStudentsNeedingAttention] = useState([]);
  const [recentConsultations, setRecentConsultations] = useState([]);
  const [classPerformance, setClassPerformance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounselingData = async () => {
      try {
        setLoading(true);
        
        // Simulasi data untuk guru BK
        const mockCounselingStats = {
          totalStudents: 320,
          studentsNeedingAttention: 15,
          consultationsThisWeek: 8,
          averageGradeAllClasses: 79.2,
          attendanceRate: 92.5,
          behaviorIssues: 3
        };

        const mockStudentsNeedingAttention = [
          { 
            name: "Ahmad Rizki", 
            class: "XII RPL 1", 
            issue: "Nilai menurun drastis", 
            lastGrade: 45, 
            previousGrade: 78,
            priority: "Tinggi"
          },
          { 
            name: "Siti Nurhaliza", 
            class: "XI RPL 2", 
            issue: "Sering tidak hadir", 
            attendance: "65%", 
            priority: "Sedang"
          },
          { 
            name: "Budi Santoso", 
            class: "X RPL 1", 
            issue: "Masalah perilaku", 
            reports: 3, 
            priority: "Tinggi"
          },
          { 
            name: "Dewi Sartika", 
            class: "XII RPL 2", 
            issue: "Stress akademik", 
            lastConsultation: "3 hari lalu", 
            priority: "Sedang"
          }
        ];

        const mockRecentConsultations = [
          { 
            studentName: "Eko Prasetyo", 
            class: "XI RPL 1", 
            topic: "Kesulitan belajar matematika", 
            date: "Hari ini, 10:00",
            status: "Selesai"
          },
          { 
            studentName: "Fatimah Zahra", 
            class: "XII RPL 1", 
            topic: "Konsultasi karir", 
            date: "Kemarin, 14:00",
            status: "Follow-up"
          },
          { 
            studentName: "Galih Pratama", 
            class: "X RPL 2", 
            topic: "Adaptasi lingkungan sekolah", 
            date: "2 hari lalu, 11:00",
            status: "Selesai"
          }
        ];

        const mockClassPerformance = [
          { className: "XII RPL 1", averageGrade: 82.5, attendanceRate: 94.2, issues: 1 },
          { className: "XII RPL 2", averageGrade: 79.8, attendanceRate: 91.5, issues: 2 },
          { className: "XI RPL 1", averageGrade: 77.3, attendanceRate: 89.7, issues: 3 },
          { className: "XI RPL 2", averageGrade: 81.1, attendanceRate: 93.8, issues: 0 },
          { className: "X RPL 1", averageGrade: 75.6, attendanceRate: 88.2, issues: 4 },
          { className: "X RPL 2", averageGrade: 78.9, attendanceRate: 92.1, issues: 1 }
        ];
        
        setCounselingStats(mockCounselingStats);
        setStudentsNeedingAttention(mockStudentsNeedingAttention);
        setRecentConsultations(mockRecentConsultations);
        setClassPerformance(mockClassPerformance);

      } catch (error) {
        console.error("Gagal mengambil data konseling:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCounselingData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data konseling...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Dashboard */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-800 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">
          Dashboard Guru BK
        </h2>
        <p className="text-teal-100">
          Monitor kesejahteraan dan memberikan bimbingan kepada siswa di seluruh sekolah.
        </p>
      </div>

      {/* Statistik Konseling */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={<LuUsers size={24} className="text-blue-600" />}
          title="Total Siswa"
          value={counselingStats?.totalStudents ?? 0}
          details="Siswa di bawah bimbingan"
          colorClass="bg-blue-100"
          isClickable={true}
          onClick={() => window.location.href = '/kelola-pengguna'}
        />
        <StatCard 
          icon={<LuAlertTriangle size={24} className="text-red-600" />}
          title="Perlu Perhatian"
          value={counselingStats?.studentsNeedingAttention ?? 0}
          details="Siswa memerlukan konseling"
          colorClass="bg-red-100"
          trend={{
            value: "-2 dari minggu lalu",
            isPositive: true
          }}
        />
        <StatCard 
          icon={<LuMessageCircle size={24} className="text-green-600" />}
          title="Konsultasi Minggu Ini"
          value={counselingStats?.consultationsThisWeek ?? 0}
          details="Sesi konseling"
          colorClass="bg-green-100"
        />
        <StatCard 
          icon={<LuHeart size={24} className="text-purple-600" />}
          title="Tingkat Kehadiran"
          value={`${counselingStats?.attendanceRate ?? 0}%`}
          details="Rata-rata seluruh kelas"
          colorClass="bg-purple-100"
          trend={{
            value: "+1.2%",
            isPositive: true
          }}
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <QuickActions userRole={userRole} />
        </div>
        
        {/* Siswa yang Perlu Perhatian */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <LuAlertTriangle className="mr-2 text-red-600" />
              Siswa yang Perlu Perhatian Khusus
              <span className="ml-2 bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {studentsNeedingAttention.length}
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
                      Kelas
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Masalah
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Prioritas
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {studentsNeedingAttention.map((student, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {student.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.class}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.issue}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          student.priority === 'Tinggi' ? 'bg-red-100 text-red-800' :
                          student.priority === 'Sedang' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {student.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-teal-600 hover:text-teal-900 mr-3">
                          Konseling
                        </button>
                        <button className="text-blue-600 hover:text-blue-900">
                          Lihat Detail
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Konsultasi Terbaru dan Performa Kelas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <LuClock className="mr-2 text-green-600" />
            Konsultasi Terbaru
          </h3>
          <div className="space-y-4">
            {recentConsultations.map((consultation, index) => (
              <div key={index} className="border-l-4 border-teal-400 pl-4 py-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-900">{consultation.studentName}</h4>
                    <p className="text-sm text-gray-600">{consultation.class}</p>
                    <p className="text-sm text-gray-500">{consultation.topic}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">{consultation.date}</p>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      consultation.status === 'Selesai' ? 'bg-green-100 text-green-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {consultation.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <LuActivity className="mr-2 text-purple-600" />
            Performa Per Kelas
          </h3>
          <div className="space-y-3">
            {classPerformance.map((classData, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-gray-900">{classData.className}</h4>
                  {classData.issues > 0 && (
                    <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                      {classData.issues} masalah
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-600">Rata-rata nilai: </span>
                    <span className="font-semibold">{classData.averageGrade}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Kehadiran: </span>
                    <span className="font-semibold">{classData.attendanceRate}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Jadwal Konseling Hari Ini */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <LuCalendar className="mr-2 text-teal-600" />
          Jadwal Konseling Hari Ini
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-teal-50 rounded-lg">
            <h4 className="font-semibold text-teal-700">09:00 - 10:00</h4>
            <p className="text-teal-600">Ahmad Rizki (XII RPL 1)</p>
            <p className="text-sm text-teal-500">Konseling akademik</p>
          </div>
          <div className="p-4 bg-teal-50 rounded-lg">
            <h4 className="font-semibold text-teal-700">11:00 - 12:00</h4>
            <p className="text-teal-600">Siti Nurhaliza (XI RPL 2)</p>
            <p className="text-sm text-teal-500">Konseling kehadiran</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-700">14:00 - 15:00</h4>
            <p className="text-gray-600">Slot tersedia</p>
            <p className="text-sm text-gray-500">Konseling walk-in</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CounselorDashboard;
