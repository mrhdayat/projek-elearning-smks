// src/pages/student/AssignmentDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { LuCalendar, LuClock, LuFileText, LuUpload, LuDownload, LuAlertCircle, LuCheckCircle, LuArrowLeft } from 'react-icons/lu';

function AssignmentDetailPage() {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submissionText, setSubmissionText] = useState('');
  const [submissionFile, setSubmissionFile] = useState(null);
  const [submissionType, setSubmissionType] = useState('text'); // 'text' or 'file'

  useEffect(() => {
    const fetchAssignmentDetail = async () => {
      try {
        setLoading(true);
        
        // Simulasi data detail tugas
        const mockAssignment = {
          id: assignmentId,
          title: "Project Laravel E-Commerce",
          subject: "Pemrograman Web",
          teacher: "Pak Budi Santoso",
          description: `Buatlah aplikasi e-commerce sederhana menggunakan Laravel dengan fitur-fitur berikut:

1. **Autentikasi Pengguna**
   - Login dan Register
   - Role: Admin dan Customer

2. **Manajemen Produk (Admin)**
   - CRUD Produk (Create, Read, Update, Delete)
   - Upload gambar produk
   - Kategori produk

3. **Fitur Customer**
   - Melihat daftar produk
   - Detail produk
   - Keranjang belanja
   - Checkout sederhana

4. **Database**
   - Minimal 4 tabel: users, products, categories, cart
   - Relasi yang tepat antar tabel
   - Migration dan Seeder

5. **Tampilan**
   - Responsive design
   - Bootstrap atau Tailwind CSS
   - UI yang user-friendly

**Deliverables:**
- Source code dalam format ZIP
- Database dump (.sql)
- Screenshot aplikasi
- Dokumentasi singkat (README.md)

**Kriteria Penilaian:**
- Fungsionalitas (40%)
- Kualitas Code (30%)
- UI/UX (20%)
- Dokumentasi (10%)`,
          dueDate: "2024-01-25",
          dueTime: "23:59",
          maxGrade: 100,
          submissionType: "file", // "text", "file", or "both"
          allowedFileTypes: [".zip", ".rar", ".pdf"],
          maxFileSize: "50MB",
          instructions: "Upload file dalam format ZIP yang berisi source code lengkap beserta dokumentasi.",
          createdAt: "2024-01-10",
          status: "active"
        };

        // Simulasi data pengumpulan siswa
        const mockSubmission = {
          id: 1,
          assignmentId: assignmentId,
          studentId: "current-student",
          submissionText: "",
          submissionFile: null,
          fileName: null,
          submittedAt: null,
          grade: null,
          feedback: null,
          status: "not_submitted" // "not_submitted", "submitted", "graded", "late"
        };

        setAssignment(mockAssignment);
        setSubmission(mockSubmission);
      } catch (error) {
        console.error("Error fetching assignment:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignmentDetail();
  }, [assignmentId]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validasi ukuran file (50MB = 50 * 1024 * 1024 bytes)
      const maxSize = 50 * 1024 * 1024;
      if (file.size > maxSize) {
        alert('Ukuran file terlalu besar. Maksimal 50MB.');
        return;
      }

      // Validasi tipe file
      const allowedTypes = assignment.allowedFileTypes;
      const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
      if (!allowedTypes.includes(fileExtension)) {
        alert(`Tipe file tidak diizinkan. Hanya ${allowedTypes.join(', ')}`);
        return;
      }

      setSubmissionFile(file);
    }
  };

  const handleSubmit = async () => {
    if (submissionType === 'text' && !submissionText.trim()) {
      alert('Silakan isi jawaban Anda.');
      return;
    }

    if (submissionType === 'file' && !submissionFile) {
      alert('Silakan pilih file untuk diupload.');
      return;
    }

    try {
      setSubmitting(true);

      // Simulasi upload file dan submit
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update submission state
      setSubmission(prev => ({
        ...prev,
        submissionText: submissionType === 'text' ? submissionText : '',
        fileName: submissionType === 'file' ? submissionFile?.name : null,
        submittedAt: new Date().toISOString(),
        status: 'submitted'
      }));

      alert('Tugas berhasil dikumpulkan!');
    } catch (error) {
      console.error('Error submitting assignment:', error);
      alert('Gagal mengumpulkan tugas. Silakan coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  const isOverdue = () => {
    const now = new Date();
    const dueDateTime = new Date(`${assignment.dueDate} ${assignment.dueTime}`);
    return now > dueDateTime;
  };

  const getStatusBadge = () => {
    if (!submission) return null;

    switch (submission.status) {
      case 'not_submitted':
        return isOverdue() ? 
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
            <LuAlertCircle className="mr-1" size={14} />
            Terlambat
          </span> :
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
            <LuClock className="mr-1" size={14} />
            Belum Dikumpulkan
          </span>;
      case 'submitted':
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
          <LuUpload className="mr-1" size={14} />
          Sudah Dikumpulkan
        </span>;
      case 'graded':
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
          <LuCheckCircle className="mr-1" size={14} />
          Sudah Dinilai
        </span>;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat detail tugas...</p>
        </div>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold text-gray-600 mb-2">Tugas tidak ditemukan</h3>
        <button
          onClick={() => navigate('/siswa/tugas')}
          className="text-blue-600 hover:text-blue-800"
        >
          Kembali ke daftar tugas
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/siswa/tugas')}
          className="flex items-center text-gray-600 hover:text-gray-800"
        >
          <LuArrowLeft className="mr-2" size={20} />
          Kembali ke Tugas
        </button>
        {getStatusBadge()}
      </div>

      {/* Assignment Info */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{assignment.title}</h1>
            <p className="text-blue-600 font-medium">{assignment.subject}</p>
            <p className="text-gray-600">oleh {assignment.teacher}</p>
          </div>
          <div className="text-right">
            <div className="flex items-center text-sm text-gray-600 mb-1">
              <LuCalendar className="mr-1" size={14} />
              Deadline: {assignment.dueDate}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <LuClock className="mr-1" size={14} />
              Pukul: {assignment.dueTime}
            </div>
          </div>
        </div>

        {/* Assignment Description */}
        <div className="border-t pt-4">
          <h3 className="font-semibold text-gray-900 mb-3">Deskripsi Tugas</h3>
          <div className="prose max-w-none">
            <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
              {assignment.description}
            </pre>
          </div>
        </div>

        {/* Instructions */}
        {assignment.instructions && (
          <div className="border-t pt-4 mt-4">
            <h3 className="font-semibold text-gray-900 mb-3">Petunjuk Pengumpulan</h3>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 text-sm">{assignment.instructions}</p>
              {assignment.submissionType === 'file' && (
                <div className="mt-2 text-xs text-blue-600">
                  <p>Tipe file yang diizinkan: {assignment.allowedFileTypes.join(', ')}</p>
                  <p>Ukuran maksimal: {assignment.maxFileSize}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Submission Section */}
      {submission && submission.status === 'not_submitted' && !isOverdue() && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Kumpulkan Tugas</h3>
          
          {assignment.submissionType === 'both' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jenis Pengumpulan
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="text"
                    checked={submissionType === 'text'}
                    onChange={(e) => setSubmissionType(e.target.value)}
                    className="mr-2"
                  />
                  Ketik Jawaban
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="file"
                    checked={submissionType === 'file'}
                    onChange={(e) => setSubmissionType(e.target.value)}
                    className="mr-2"
                  />
                  Upload File
                </label>
              </div>
            </div>
          )}

          {(submissionType === 'text' || assignment.submissionType === 'text') && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jawaban Anda
              </label>
              <textarea
                value={submissionText}
                onChange={(e) => setSubmissionText(e.target.value)}
                rows={10}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="Ketik jawaban Anda di sini..."
              />
            </div>
          )}

          {(submissionType === 'file' || assignment.submissionType === 'file') && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload File
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <LuUpload className="mx-auto text-gray-400 mb-2" size={32} />
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                  accept={assignment.allowedFileTypes.join(',')}
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer text-blue-600 hover:text-blue-800"
                >
                  Klik untuk memilih file
                </label>
                {submissionFile && (
                  <p className="mt-2 text-sm text-gray-600">
                    File dipilih: {submissionFile.name}
                  </p>
                )}
              </div>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Mengumpulkan...' : 'Kumpulkan Tugas'}
          </button>
        </div>
      )}

      {/* Submitted Work */}
      {submission && submission.status !== 'not_submitted' && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Tugas yang Dikumpulkan</h3>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Dikumpulkan pada:</span>
              <span className="text-sm text-gray-600">
                {new Date(submission.submittedAt).toLocaleString('id-ID')}
              </span>
            </div>
            
            {submission.submissionText && (
              <div className="mt-3">
                <p className="text-sm font-medium text-gray-700 mb-2">Jawaban:</p>
                <div className="bg-white p-3 rounded border">
                  <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                    {submission.submissionText}
                  </pre>
                </div>
              </div>
            )}
            
            {submission.fileName && (
              <div className="mt-3">
                <p className="text-sm font-medium text-gray-700 mb-2">File:</p>
                <div className="flex items-center bg-white p-3 rounded border">
                  <LuFileText className="mr-2 text-gray-400" size={16} />
                  <span className="text-sm text-gray-700">{submission.fileName}</span>
                  <button className="ml-auto text-blue-600 hover:text-blue-800 text-sm">
                    <LuDownload size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {submission.status === 'graded' && (
            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-900">Penilaian</h4>
                <span className="text-2xl font-bold text-green-600">
                  {submission.grade}/{assignment.maxGrade}
                </span>
              </div>
              
              {submission.feedback && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-green-800 mb-2">Feedback Guru:</p>
                  <p className="text-sm text-green-700">{submission.feedback}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Overdue Message */}
      {isOverdue() && submission?.status === 'not_submitted' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <LuAlertCircle className="text-red-500 mr-2" size={20} />
            <div>
              <h4 className="font-semibold text-red-800">Tugas Terlambat</h4>
              <p className="text-sm text-red-700">
                Batas waktu pengumpulan telah berakhir. Silakan hubungi guru untuk informasi lebih lanjut.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AssignmentDetailPage;
