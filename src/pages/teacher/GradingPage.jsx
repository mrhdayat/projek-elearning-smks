// src/pages/teacher/GradingPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { useUserRole } from '../../hooks/useUserRole';
import { LuDownload, LuSave, LuArrowLeft, LuFileText, LuUser, LuCalendar, LuClock } from 'react-icons/lu';

function GradingPage() {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const { userRole } = useUserRole();
  const [assignment, setAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [grade, setGrade] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchGradingData = async () => {
      try {
        setLoading(true);
        
        // Simulasi data tugas
        const mockAssignment = {
          id: assignmentId,
          title: "Project Laravel E-Commerce",
          subject: "Pemrograman Web",
          teacher: "Pak Budi Santoso",
          dueDate: "2024-01-25",
          maxGrade: 100,
          totalSubmissions: 28,
          gradedSubmissions: 15
        };

        // Simulasi data pengumpulan siswa
        const mockSubmissions = [
          {
            id: 1,
            studentId: "2023001",
            studentName: "Ahmad Rizki Pratama",
            studentClass: "XII RPL 1",
            submissionText: "Saya telah membuat aplikasi e-commerce menggunakan Laravel dengan fitur-fitur yang diminta...",
            fileName: "ecommerce-ahmad.zip",
            fileSize: "15.2 MB",
            submittedAt: "2024-01-24 14:30:00",
            grade: null,
            feedback: null,
            status: "submitted"
          },
          {
            id: 2,
            studentId: "2023002",
            studentName: "Siti Nurhaliza",
            studentClass: "XII RPL 1",
            submissionText: "",
            fileName: "laravel-ecommerce-siti.zip",
            fileSize: "22.8 MB",
            submittedAt: "2024-01-23 16:45:00",
            grade: 95,
            feedback: "Excellent work! Aplikasi berjalan dengan baik, code structure rapi, dan UI sangat menarik. Dokumentasi juga lengkap.",
            status: "graded"
          },
          {
            id: 3,
            studentId: "2023003",
            studentName: "Budi Santoso",
            studentClass: "XII RPL 1",
            submissionText: "Aplikasi e-commerce dengan Laravel telah selesai dibuat. Fitur yang diimplementasikan meliputi autentikasi, CRUD produk, keranjang belanja, dan checkout.",
            fileName: "project-budi.zip",
            fileSize: "18.5 MB",
            submittedAt: "2024-01-25 10:15:00",
            grade: null,
            feedback: null,
            status: "submitted"
          },
          {
            id: 4,
            studentId: "2023004",
            studentName: "Dewi Sartika",
            studentClass: "XII RPL 1",
            submissionText: "",
            fileName: "ecommerce-dewi.zip",
            fileSize: "12.3 MB",
            submittedAt: "2024-01-22 20:30:00",
            grade: 88,
            feedback: "Good work! Fungsionalitas sudah lengkap, namun perlu perbaikan pada tampilan UI dan penambahan validasi form.",
            status: "graded"
          }
        ];

        setAssignment(mockAssignment);
        setSubmissions(mockSubmissions);
        
        // Set submission pertama yang belum dinilai sebagai default
        const ungraded = mockSubmissions.find(s => s.status === 'submitted');
        if (ungraded) {
          setSelectedSubmission(ungraded);
          setGrade(ungraded.grade || '');
          setFeedback(ungraded.feedback || '');
        }
      } catch (error) {
        console.error("Error fetching grading data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGradingData();
  }, [assignmentId]);

  const handleSubmissionSelect = (submission) => {
    setSelectedSubmission(submission);
    setGrade(submission.grade || '');
    setFeedback(submission.feedback || '');
  };

  const handleSaveGrade = async () => {
    if (!selectedSubmission) return;
    
    if (!grade || grade < 0 || grade > assignment.maxGrade) {
      alert(`Nilai harus antara 0 dan ${assignment.maxGrade}`);
      return;
    }

    try {
      setSaving(true);
      
      // Simulasi save grade
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update submission in state
      setSubmissions(prev => prev.map(sub => 
        sub.id === selectedSubmission.id 
          ? { ...sub, grade: parseInt(grade), feedback, status: 'graded' }
          : sub
      ));
      
      // Update selected submission
      setSelectedSubmission(prev => ({
        ...prev,
        grade: parseInt(grade),
        feedback,
        status: 'graded'
      }));

      alert('Nilai berhasil disimpan!');
    } catch (error) {
      console.error('Error saving grade:', error);
      alert('Gagal menyimpan nilai. Silakan coba lagi.');
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadFile = (submission) => {
    // Simulasi download file
    alert(`Mengunduh file: ${submission.fileName}`);
  };

  const getSubmissionStatusColor = (status) => {
    switch (status) {
      case 'submitted':
        return 'bg-yellow-100 text-yellow-800';
      case 'graded':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data penilaian...</p>
        </div>
      </div>
    );
  }

  // Cek hak akses
  const allowedRoles = ['Admin', 'Super Admin', 'Wali Kelas', 'Guru Mapel'];
  if (!allowedRoles.includes(userRole)) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            <h3 className="font-bold">Akses Ditolak</h3>
            <p>Anda tidak memiliki akses untuk menilai tugas.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/tugas-ujian')}
          className="flex items-center text-gray-600 hover:text-gray-800"
        >
          <LuArrowLeft className="mr-2" size={20} />
          Kembali ke Tugas
        </button>
        <div className="text-right">
          <p className="text-sm text-gray-600">
            {assignment?.gradedSubmissions || 0} dari {assignment?.totalSubmissions || 0} dinilai
          </p>
        </div>
      </div>

      {/* Assignment Info */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{assignment?.title}</h1>
        <div className="flex items-center gap-6 text-sm text-gray-600">
          <span>{assignment?.subject}</span>
          <span>Deadline: {assignment?.dueDate}</span>
          <span>Nilai Maksimal: {assignment?.maxGrade}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Submissions List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-4 border-b">
              <h3 className="font-semibold text-gray-900">Daftar Pengumpulan</h3>
              <p className="text-sm text-gray-600">{submissions.length} pengumpulan</p>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {submissions.map((submission) => (
                <div
                  key={submission.id}
                  onClick={() => handleSubmissionSelect(submission)}
                  className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                    selectedSubmission?.id === submission.id ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{submission.studentName}</h4>
                      <p className="text-sm text-gray-600">{submission.studentClass}</p>
                      <div className="flex items-center mt-2 text-xs text-gray-500">
                        <LuCalendar className="mr-1" size={12} />
                        {new Date(submission.submittedAt).toLocaleDateString('id-ID')}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getSubmissionStatusColor(submission.status)}`}>
                        {submission.status === 'submitted' ? 'Belum Dinilai' : 'Sudah Dinilai'}
                      </span>
                      {submission.grade !== null && (
                        <span className="text-sm font-bold text-green-600">
                          {submission.grade}/{assignment.maxGrade}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Grading Panel */}
        <div className="lg:col-span-2">
          {selectedSubmission ? (
            <div className="space-y-6">
              {/* Student Info */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{selectedSubmission.studentName}</h3>
                    <p className="text-gray-600">{selectedSubmission.studentClass} • NIS: {selectedSubmission.studentId}</p>
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    <div className="flex items-center">
                      <LuClock className="mr-1" size={14} />
                      Dikumpulkan: {new Date(selectedSubmission.submittedAt).toLocaleString('id-ID')}
                    </div>
                  </div>
                </div>

                {/* Submission Content */}
                {selectedSubmission.submissionText && (
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Jawaban Tertulis:</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                        {selectedSubmission.submissionText}
                      </pre>
                    </div>
                  </div>
                )}

                {selectedSubmission.fileName && (
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">File Pengumpulan:</h4>
                    <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center">
                        <LuFileText className="mr-3 text-gray-400" size={20} />
                        <div>
                          <p className="font-medium text-gray-900">{selectedSubmission.fileName}</p>
                          <p className="text-sm text-gray-600">{selectedSubmission.fileSize}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDownloadFile(selectedSubmission)}
                        className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <LuDownload className="mr-2" size={16} />
                        Download
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Grading Form */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Penilaian</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nilai (0 - {assignment.maxGrade})
                    </label>
                    <input
                      type="number"
                      min="0"
                      max={assignment.maxGrade}
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="Masukkan nilai"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Feedback untuk Siswa
                    </label>
                    <textarea
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="Berikan feedback konstruktif untuk siswa..."
                    />
                  </div>

                  <button
                    onClick={handleSaveGrade}
                    disabled={saving || !grade}
                    className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <LuSave className="mr-2" size={16} />
                    {saving ? 'Menyimpan...' : 'Simpan Nilai'}
                  </button>
                </div>
              </div>

              {/* Previous Grade (if exists) */}
              {selectedSubmission.status === 'graded' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-medium text-green-800 mb-2">Nilai Tersimpan</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-green-700">Nilai: {selectedSubmission.grade}/{assignment.maxGrade}</span>
                    <span className="text-sm text-green-600">Sudah dinilai</span>
                  </div>
                  {selectedSubmission.feedback && (
                    <div className="mt-2">
                      <p className="text-sm text-green-700">{selectedSubmission.feedback}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
              <LuUser className="mx-auto text-gray-400 mb-4" size={48} />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Pilih Pengumpulan</h3>
              <p className="text-gray-500">Pilih pengumpulan siswa dari daftar di sebelah kiri untuk mulai menilai.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GradingPage;
