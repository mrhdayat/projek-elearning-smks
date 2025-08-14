// src/pages/student/StudentAssignmentsPage.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { LuClipboardCheck, LuClock, LuUpload, LuAlertCircle, LuCheckCircle } from 'react-icons/lu';

function StudentAssignmentsPage() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchStudentAssignments = async () => {
      try {
        setLoading(true);
        
        // Simulasi data tugas untuk siswa
        const mockAssignments = [
          {
            id: 1,
            title: "Project Laravel E-Commerce",
            subject: "Pemrograman Web",
            teacher: "Pak Budi Santoso",
            description: "Membuat aplikasi e-commerce sederhana menggunakan Laravel dengan fitur CRUD produk, keranjang belanja, dan checkout.",
            dueDate: "2024-01-25",
            submittedAt: null,
            status: "pending",
            grade: null,
            maxGrade: 100,
            type: "project"
          },
          {
            id: 2,
            title: "Database Design Assignment",
            subject: "Basis Data",
            teacher: "Bu Sari Dewi",
            description: "Merancang ERD untuk sistem perpustakaan dengan minimal 8 entitas dan relasi yang tepat.",
            dueDate: "2024-01-22",
            submittedAt: "2024-01-20",
            status: "submitted",
            grade: null,
            maxGrade: 100,
            type: "assignment"
          },
          {
            id: 3,
            title: "Business Plan Presentation",
            subject: "Kewirausahaan",
            teacher: "Bu Rina Sari",
            description: "Presentasi rencana bisnis untuk produk/jasa inovatif dengan analisis pasar dan proyeksi keuangan.",
            dueDate: "2024-01-18",
            submittedAt: "2024-01-17",
            status: "graded",
            grade: 88,
            maxGrade: 100,
            type: "presentation"
          },
          {
            id: 4,
            title: "Quiz JavaScript Fundamentals",
            subject: "Pemrograman Web",
            teacher: "Pak Budi Santoso",
            description: "Quiz online tentang konsep dasar JavaScript, variabel, function, dan DOM manipulation.",
            dueDate: "2024-01-15",
            submittedAt: "2024-01-14",
            status: "graded",
            grade: 92,
            maxGrade: 100,
            type: "quiz"
          }
        ];

        setAssignments(mockAssignments);
      } catch (error) {
        console.error("Error fetching assignments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentAssignments();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'submitted':
        return 'bg-blue-100 text-blue-800';
      case 'graded':
        return 'bg-green-100 text-green-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <LuClock size={16} />;
      case 'submitted':
        return <LuUpload size={16} />;
      case 'graded':
        return <LuCheckCircle size={16} />;
      case 'overdue':
        return <LuAlertCircle size={16} />;
      default:
        return <LuClipboardCheck size={16} />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Belum Dikerjakan';
      case 'submitted':
        return 'Sudah Dikumpulkan';
      case 'graded':
        return 'Sudah Dinilai';
      case 'overdue':
        return 'Terlambat';
      default:
        return status;
    }
  };

  const filteredAssignments = filter === 'all' 
    ? assignments 
    : assignments.filter(assignment => assignment.status === filter);

  const handleSubmit = (assignmentId) => {
    // Simulasi submit tugas
    alert(`Mengumpulkan tugas ID: ${assignmentId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat tugas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Tugas & Ujian</h1>
        <p className="text-green-100">
          Kelola dan kumpulkan tugas dari semua mata pelajaran
        </p>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-wrap items-center gap-4">
          <label className="font-semibold text-gray-700">Filter Status:</label>
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'all', label: 'Semua' },
              { value: 'pending', label: 'Belum Dikerjakan' },
              { value: 'submitted', label: 'Sudah Dikumpulkan' },
              { value: 'graded', label: 'Sudah Dinilai' }
            ].map(option => (
              <button
                key={option.value}
                onClick={() => setFilter(option.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === option.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Assignments List */}
      <div className="space-y-4">
        {filteredAssignments.map((assignment) => (
          <div key={assignment.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900">{assignment.title}</h3>
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(assignment.status)}`}>
                      {getStatusIcon(assignment.status)}
                      <span className="ml-1">{getStatusText(assignment.status)}</span>
                    </span>
                  </div>
                  <p className="text-sm text-blue-600 font-medium">{assignment.subject}</p>
                  <p className="text-sm text-gray-500">oleh {assignment.teacher}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    Deadline: {assignment.dueDate}
                  </p>
                  {assignment.grade !== null && (
                    <p className="text-lg font-bold text-green-600">
                      {assignment.grade}/{assignment.maxGrade}
                    </p>
                  )}
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4">{assignment.description}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="capitalize">{assignment.type}</span>
                  {assignment.submittedAt && (
                    <span>Dikumpulkan: {assignment.submittedAt}</span>
                  )}
                </div>
                
                <div className="flex gap-2">
                  {assignment.status === 'pending' && (
                    <button
                      onClick={() => handleSubmit(assignment.id)}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <LuUpload className="mr-2" size={16} />
                      Kumpulkan Tugas
                    </button>
                  )}
                  
                  <button
                    onClick={() => window.location.href = `/siswa/tugas/${assignment.id}`}
                    className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Lihat Detail
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredAssignments.length === 0 && (
        <div className="text-center py-12">
          <LuClipboardCheck className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Tidak ada tugas</h3>
          <p className="text-gray-500">
            {filter === 'all' 
              ? 'Belum ada tugas yang tersedia'
              : `Tidak ada tugas dengan status "${getStatusText(filter)}"`
            }
          </p>
        </div>
      )}
    </div>
  );
}

export default StudentAssignmentsPage;
