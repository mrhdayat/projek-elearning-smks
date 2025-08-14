// src/pages/student/StudentGradesPage.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { LuAward, LuTrendingUp, LuActivity, LuCalendar } from 'react-icons/lu';

function StudentGradesPage() {
  const [grades, setGrades] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSemester, setSelectedSemester] = useState('current');

  useEffect(() => {
    const fetchStudentGrades = async () => {
      try {
        setLoading(true);
        
        // Simulasi data nilai untuk siswa
        const mockGrades = [
          {
            id: 1,
            subject: "Pemrograman Web",
            teacher: "Pak Budi Santoso",
            assignments: [
              { name: "Quiz HTML/CSS", grade: 85, maxGrade: 100, date: "2024-01-10", type: "quiz" },
              { name: "Project JavaScript", grade: 92, maxGrade: 100, date: "2024-01-15", type: "project" },
              { name: "UTS", grade: 88, maxGrade: 100, date: "2024-01-20", type: "exam" }
            ],
            average: 88.3,
            prediction: "A"
          },
          {
            id: 2,
            subject: "Basis Data",
            teacher: "Bu Sari Dewi",
            assignments: [
              { name: "ERD Design", grade: 90, maxGrade: 100, date: "2024-01-08", type: "assignment" },
              { name: "SQL Query Test", grade: 85, maxGrade: 100, date: "2024-01-12", type: "quiz" },
              { name: "Database Project", grade: 95, maxGrade: 100, date: "2024-01-18", type: "project" }
            ],
            average: 90.0,
            prediction: "A"
          },
          {
            id: 3,
            subject: "Bahasa Indonesia",
            teacher: "Bu Dewi Sartika",
            assignments: [
              { name: "Essay Writing", grade: 78, maxGrade: 100, date: "2024-01-05", type: "assignment" },
              { name: "Presentasi", grade: 82, maxGrade: 100, date: "2024-01-14", type: "presentation" },
              { name: "UTS", grade: 80, maxGrade: 100, date: "2024-01-19", type: "exam" }
            ],
            average: 80.0,
            prediction: "B+"
          },
          {
            id: 4,
            subject: "Matematika",
            teacher: "Pak Ahmad Rizki",
            assignments: [
              { name: "Integral", grade: 75, maxGrade: 100, date: "2024-01-06", type: "assignment" },
              { name: "Quiz Trigonometri", grade: 82, maxGrade: 100, date: "2024-01-13", type: "quiz" },
              { name: "UTS", grade: 78, maxGrade: 100, date: "2024-01-21", type: "exam" }
            ],
            average: 78.3,
            prediction: "B+"
          },
          {
            id: 5,
            subject: "Kewirausahaan",
            teacher: "Bu Rina Sari",
            assignments: [
              { name: "Business Plan", grade: 88, maxGrade: 100, date: "2024-01-09", type: "project" },
              { name: "Market Analysis", grade: 85, maxGrade: 100, date: "2024-01-16", type: "assignment" },
              { name: "Presentation", grade: 90, maxGrade: 100, date: "2024-01-22", type: "presentation" }
            ],
            average: 87.7,
            prediction: "A-"
          }
        ];

        const mockSummary = {
          overallAverage: 84.9,
          totalAssignments: 15,
          completedAssignments: 15,
          rank: 5,
          totalStudents: 32,
          semester: "Ganjil 2023/2024",
          gpa: 3.65
        };

        setGrades(mockGrades);
        setSummary(mockSummary);
      } catch (error) {
        console.error("Error fetching grades:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentGrades();
  }, [selectedSemester]);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat nilai...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Nilai & Rapor</h1>
        <p className="text-purple-100">
          Lihat progres akademik dan pencapaian nilai Anda
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <LuAward className="text-blue-600" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Rata-rata Keseluruhan</p>
              <p className="text-2xl font-bold text-gray-900">{summary?.overallAverage}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <LuTrendingUp className="text-green-600" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Peringkat Kelas</p>
              <p className="text-2xl font-bold text-gray-900">{summary?.rank}/{summary?.totalStudents}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <LuActivity className="text-purple-600" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">IPK</p>
              <p className="text-2xl font-bold text-gray-900">{summary?.gpa}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100">
              <LuCalendar className="text-yellow-600" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tugas Selesai</p>
              <p className="text-2xl font-bold text-gray-900">{summary?.completedAssignments}/{summary?.totalAssignments}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Semester Filter */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-4">
          <label className="font-semibold text-gray-700">Semester:</label>
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          >
            <option value="current">Semester Saat Ini (Ganjil 2023/2024)</option>
            <option value="previous">Semester Sebelumnya (Genap 2022/2023)</option>
          </select>
        </div>
      </div>

      {/* Grades by Subject */}
      <div className="space-y-6">
        {grades.map((subject) => (
          <div key={subject.id} className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{subject.subject}</h3>
                  <p className="text-sm text-gray-600">Pengajar: {subject.teacher}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Rata-rata</p>
                  <p className={`text-2xl font-bold ${getGradeColor(subject.average)}`}>
                    {subject.average}
                  </p>
                  <p className="text-sm font-medium text-gray-700">Prediksi: {subject.prediction}</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 text-sm font-medium text-gray-600">Tugas/Ujian</th>
                      <th className="text-center py-2 text-sm font-medium text-gray-600">Nilai</th>
                      <th className="text-center py-2 text-sm font-medium text-gray-600">Tanggal</th>
                      <th className="text-center py-2 text-sm font-medium text-gray-600">Jenis</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subject.assignments.map((assignment, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-3 text-sm text-gray-900">{assignment.name}</td>
                        <td className="py-3 text-center">
                          <span className={`inline-flex px-2 py-1 text-sm font-semibold rounded-full ${getGradeBadgeColor(assignment.grade)}`}>
                            {assignment.grade}/{assignment.maxGrade}
                          </span>
                        </td>
                        <td className="py-3 text-center text-sm text-gray-600">{assignment.date}</td>
                        <td className="py-3 text-center">
                          <span className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full capitalize">
                            {assignment.type}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Grade Chart Placeholder */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Grafik Perkembangan Nilai</h3>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">Grafik perkembangan nilai akan ditampilkan di sini</p>
        </div>
      </div>
    </div>
  );
}

export default StudentGradesPage;
