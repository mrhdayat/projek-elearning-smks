// src/pages/ReportsPage.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useUserRole } from '../hooks/useUserRole';
import { LuActivity, LuUsers, LuTrendingUp, LuDownload, LuFilter, LuSearch } from 'react-icons/lu';

function ReportsPage() {
  const { userRole, userProfile, loading: roleLoading } = useUserRole();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        
        // Simulasi data laporan berdasarkan peran
        let mockReports = [];
        
        if (userRole === 'Admin' || userRole === 'Super Admin' || userRole === 'Kepala Sekolah') {
          // Data lengkap untuk admin dan kepala sekolah
          mockReports = [
            {
              id: 1,
              studentName: "Ahmad Rizki Pratama",
              studentId: "2023001",
              class: "XII RPL 1",
              subjects: {
                "Pemrograman Web": { grade: 88, teacher: "Pak Budi" },
                "Basis Data": { grade: 92, teacher: "Bu Sari" },
                "Matematika": { grade: 78, teacher: "Pak Ahmad" },
                "Bahasa Indonesia": { grade: 85, teacher: "Bu Dewi" },
                "Kewirausahaan": { grade: 90, teacher: "Bu Rina" }
              },
              average: 86.6,
              rank: 3,
              attendance: 95.2
            },
            {
              id: 2,
              studentName: "Siti Nurhaliza",
              studentId: "2023002",
              class: "XII RPL 1",
              subjects: {
                "Pemrograman Web": { grade: 95, teacher: "Pak Budi" },
                "Basis Data": { grade: 98, teacher: "Bu Sari" },
                "Matematika": { grade: 89, teacher: "Pak Ahmad" },
                "Bahasa Indonesia": { grade: 92, teacher: "Bu Dewi" },
                "Kewirausahaan": { grade: 94, teacher: "Bu Rina" }
              },
              average: 93.6,
              rank: 1,
              attendance: 98.5
            },
            {
              id: 3,
              studentName: "Budi Santoso",
              studentId: "2023003",
              class: "XII RPL 2",
              subjects: {
                "Pemrograman Web": { grade: 75, teacher: "Pak Budi" },
                "Basis Data": { grade: 80, teacher: "Bu Sari" },
                "Matematika": { grade: 70, teacher: "Pak Ahmad" },
                "Bahasa Indonesia": { grade: 78, teacher: "Bu Dewi" },
                "Kewirausahaan": { grade: 82, teacher: "Bu Rina" }
              },
              average: 77.0,
              rank: 15,
              attendance: 88.3
            }
          ];
        } else if (userRole === 'Wali Kelas') {
          // Data untuk kelas yang diampu wali kelas
          mockReports = [
            {
              id: 1,
              studentName: "Ahmad Rizki Pratama",
              studentId: "2023001",
              class: "XII RPL 2", // Kelas yang diampu
              subjects: {
                "Pemrograman Web": { grade: 88, teacher: "Pak Budi" },
                "Basis Data": { grade: 92, teacher: "Bu Sari" },
                "Matematika": { grade: 78, teacher: "Pak Ahmad" }
              },
              average: 86.0,
              rank: 3,
              attendance: 95.2
            }
          ];
        } else if (userRole === 'Guru Mapel') {
          // Data untuk mata pelajaran yang diampu
          mockReports = [
            {
              id: 1,
              studentName: "Ahmad Rizki Pratama",
              studentId: "2023001",
              class: "XII RPL 1",
              subjects: {
                "Pemrograman Web": { grade: 88, teacher: "Pak Budi" } // Hanya mapel yang diampu
              },
              average: 88.0,
              attendance: 95.2
            }
          ];
        } else if (userRole === 'Guru BK') {
          // Data untuk keperluan konseling (read-only)
          mockReports = [
            {
              id: 1,
              studentName: "Ahmad Rizki Pratama",
              studentId: "2023001",
              class: "XII RPL 1",
              subjects: {
                "Pemrograman Web": { grade: 88 },
                "Basis Data": { grade: 92 },
                "Matematika": { grade: 78 }
              },
              average: 86.0,
              rank: 3,
              attendance: 95.2,
              behaviorNotes: "Siswa aktif, perlu motivasi di matematika"
            }
          ];
        }

        setReports(mockReports);
      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userRole) {
      fetchReports();
    }
  }, [userRole]);

  const getGradeColor = (grade) => {
    if (grade >= 90) return 'text-green-600';
    if (grade >= 80) return 'text-blue-600';
    if (grade >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getGradeBadgeColor = (grade) => {
    if (grade >= 90) return 'bg-green-100 text-green-800';
    if (grade >= 80) return 'bg-blue-100 text-blue-800';
    if (grade >= 70) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const handleExport = () => {
    alert('Mengexport laporan nilai...');
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.studentId.includes(searchTerm);
    const matchesClass = selectedClass === 'all' || report.class === selectedClass;
    return matchesSearch && matchesClass;
  });

  if (roleLoading || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat laporan nilai...</p>
        </div>
      </div>
    );
  }

  // Cek hak akses
  const allowedRoles = ['Admin', 'Super Admin', 'Kepala Sekolah', 'Wali Kelas', 'Guru Mapel', 'Guru BK'];
  if (!allowedRoles.includes(userRole)) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            <h3 className="font-bold">Akses Ditolak</h3>
            <p>Anda tidak memiliki akses untuk melihat laporan nilai.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Laporan Nilai
          {userRole === 'Wali Kelas' && ' - Kelas Saya'}
          {userRole === 'Guru Mapel' && ' - Mata Pelajaran Saya'}
          {userRole === 'Guru BK' && ' - Data Konseling'}
        </h1>
        <p className="text-purple-100">
          {userRole === 'Admin' || userRole === 'Super Admin' ? 
            'Kelola dan monitor nilai semua siswa di sekolah' :
            userRole === 'Kepala Sekolah' ?
            'Monitor performa akademik siswa secara keseluruhan' :
            userRole === 'Wali Kelas' ?
            'Monitor nilai dan performa siswa di kelas yang Anda ampu' :
            userRole === 'Guru Mapel' ?
            'Lihat nilai siswa untuk mata pelajaran yang Anda ajar' :
            'Akses data nilai siswa untuk keperluan bimbingan konseling'
          }
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <LuSearch size={20} className="text-gray-400" />
            <input
              type="text"
              placeholder="Cari nama atau NIS siswa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          
          {(userRole === 'Admin' || userRole === 'Super Admin' || userRole === 'Kepala Sekolah') && (
            <div className="flex items-center gap-2">
              <LuFilter size={20} className="text-gray-400" />
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="all">Semua Kelas</option>
                <option value="XII RPL 1">XII RPL 1</option>
                <option value="XII RPL 2">XII RPL 2</option>
                <option value="XI RPL 1">XI RPL 1</option>
                <option value="XI RPL 2">XI RPL 2</option>
              </select>
            </div>
          )}

          {(userRole === 'Admin' || userRole === 'Super Admin') && (
            <button
              onClick={handleExport}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <LuDownload className="mr-2" size={16} />
              Export Excel
            </button>
          )}
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Siswa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kelas
                </th>
                {userRole !== 'Guru Mapel' && (
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rata-rata
                  </th>
                )}
                {(userRole === 'Admin' || userRole === 'Super Admin' || userRole === 'Kepala Sekolah') && (
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Peringkat
                  </th>
                )}
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kehadiran
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mata Pelajaran
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredReports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{report.studentName}</div>
                      <div className="text-sm text-gray-500">NIS: {report.studentId}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {report.class}
                  </td>
                  {userRole !== 'Guru Mapel' && (
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`text-lg font-bold ${getGradeColor(report.average)}`}>
                        {report.average}
                      </span>
                    </td>
                  )}
                  {(userRole === 'Admin' || userRole === 'Super Admin' || userRole === 'Kepala Sekolah') && (
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                      #{report.rank}
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                    {report.attendance}%
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(report.subjects).map(([subject, data]) => (
                        <span
                          key={subject}
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getGradeBadgeColor(data.grade)}`}
                          title={`${subject}: ${data.grade}`}
                        >
                          {subject.split(' ')[0]}: {data.grade}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900">
                      Detail
                    </button>
                    {userRole === 'Guru BK' && (
                      <button className="ml-2 text-green-600 hover:text-green-900">
                        Konseling
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredReports.length === 0 && (
        <div className="text-center py-12">
          <LuActivity className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Tidak ada data</h3>
          <p className="text-gray-500">
            Tidak ada laporan nilai yang sesuai dengan filter yang dipilih.
          </p>
        </div>
      )}
    </div>
  );
}

export default ReportsPage;
