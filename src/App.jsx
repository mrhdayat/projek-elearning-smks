// src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { logError } from './utils/errorHandler';

// Layouts
import PublicLayout from './layouts/PublicLayout'; // <-- 1. Impor layout baru
import AppLayout from './layouts/AppLayout';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ManageUsersPage from './pages/ManageUsersPage'; // <-- Impor halaman baru
import AddUserPage from './pages/AddUserPage'; // Impor halaman baru
import EditUserPage from './pages/EditUserPage';

import ManageCoursesPage from './pages/ManageCoursesPage'; // <-- Impor halaman baru
import AddCoursePage from './pages/AddCoursePage'; // <-- Impor halaman baru
import EditCoursePage from './pages/EditCoursePage'; // <-- Impor halaman baru

import ManageMaterialsPage from './pages/ManageMaterialsPage'; // <-- Impor halaman baru
import AddMaterialPage from './pages/AddMaterialPage'; // <-- Impor halaman baru
import EditMaterialPage from './pages/EditMaterialPage'; // <-- Impor halaman baru

import ManageAssignmentsPage from './pages/ManageAssignmentsPage'; // <-- Impor halaman baru
import AddAssignmentPage from './pages/AddAssignmentPage'; // <-- Impor halaman baru
import EditAssignmentPage from './pages/EditAssignmentPage'; // <-- Impor halaman baru

import ManageAnnouncementsPage from './pages/ManageAnnouncementsPage'; // <-- Impor halaman baru
import AddAnnouncementPage from './pages/AddAnnouncementPage';     // <-- Impor
import EditAnnouncementPage from './pages/EditAnnouncementPage';  // <-- Impor

import AuditLogPage from './pages/AuditLogPage';

import ManageSchedulesPage from './pages/ManageSchedulesPage'; // <-- Impor halaman baru
import AddSchedulePage from './pages/AddSchedulePage'; // <-- Impor halaman baru
import EditSchedulePage from './pages/EditSchedulePage'; // <-- Impor halaman baru

import SettingsPage from './pages/SettingsPage'; // <-- Impor halaman baru
import RegistrationPage from './pages/RegistrationPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import UpdatePasswordPage from './pages/UpdatePasswordPage';
import StudentDashboardPage from './pages/StudentDashboardPage';
import ReportsPage from './pages/ReportsPage';

// Import halaman siswa
import StudentMaterialsPage from './pages/student/StudentMaterialsPage';
import StudentAssignmentsPage from './pages/student/StudentAssignmentsPage';
import StudentGradesPage from './pages/student/StudentGradesPage';
import StudentSchedulePage from './pages/student/StudentSchedulePage';
import AssignmentDetailPage from './pages/student/AssignmentDetailPage';
import QuizPage from './pages/student/QuizPage';

// Import halaman guru
import GradingPage from './pages/teacher/GradingPage';

// Import halaman forum
import ForumPage from './pages/ForumPage';

// Import komponen proteksi
import ProtectedRoute from './components/auth/ProtectedRoute';
import ErrorBoundary from './components/common/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
        {/* Rute-rute yang menggunakan PublicLayout (Navbar & Footer) */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          
          {/* Jika nanti ada halaman publik lain seperti /tentang, tambahkan di sini */}
        </Route>

        {/* Rute yang berdiri sendiri (tanpa Navbar & Footer umum) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registrasi" element={<RegistrationPage />} />
        <Route path="/lupa-password" element={<ForgotPasswordPage />} />
        <Route path="/update-password" element={<UpdatePasswordPage />} />
        {/* Rute Terlindungi yang menggunakan AppLayout (Sidebar) */}
        <Route element={<AppLayout />}>
          {/* Dashboard utama - akan menampilkan dashboard berdasarkan peran */}
          <Route path="/dashboard" element={
            <ProtectedRoute allowedRoles={['Admin', 'Super Admin', 'Kepala Sekolah', 'Wali Kelas', 'Guru Mapel', 'Guru BK']}>
              <DashboardPage />
            </ProtectedRoute>
          } />

          {/* Dashboard dan halaman khusus siswa */}
          <Route path="/siswa/dashboard" element={
            <ProtectedRoute allowedRoles={['Siswa']}>
              <StudentDashboardPage />
            </ProtectedRoute>
          } />
          <Route path="/siswa/materi" element={
            <ProtectedRoute allowedRoles={['Siswa']}>
              <StudentMaterialsPage />
            </ProtectedRoute>
          } />
          <Route path="/siswa/tugas" element={
            <ProtectedRoute allowedRoles={['Siswa']}>
              <StudentAssignmentsPage />
            </ProtectedRoute>
          } />
          <Route path="/siswa/nilai" element={
            <ProtectedRoute allowedRoles={['Siswa']}>
              <StudentGradesPage />
            </ProtectedRoute>
          } />
          <Route path="/siswa/jadwal" element={
            <ProtectedRoute allowedRoles={['Siswa']}>
              <StudentSchedulePage />
            </ProtectedRoute>
          } />
          <Route path="/siswa/tugas/:assignmentId" element={
            <ProtectedRoute allowedRoles={['Siswa']}>
              <AssignmentDetailPage />
            </ProtectedRoute>
          } />
          <Route path="/siswa/quiz/:quizId" element={
            <ProtectedRoute allowedRoles={['Siswa']}>
              <QuizPage />
            </ProtectedRoute>
          } />

          {/* Rute untuk Admin dan Super Admin */}
          <Route path="/kelola-pengguna" element={
            <ProtectedRoute allowedRoles={['Admin', 'Super Admin']}>
              <ManageUsersPage />
            </ProtectedRoute>
          } />
          <Route path="/kelola-pengguna/tambah" element={
            <ProtectedRoute allowedRoles={['Admin', 'Super Admin']}>
              <AddUserPage />
            </ProtectedRoute>
          } />
          <Route path="/kelola-pengguna/edit/:userId" element={
            <ProtectedRoute allowedRoles={['Admin', 'Super Admin']}>
              <EditUserPage />
            </ProtectedRoute>
          } />

          <Route path="/mata-pelajaran" element={
            <ProtectedRoute allowedRoles={['Admin', 'Super Admin']}>
              <ManageCoursesPage />
            </ProtectedRoute>
          } />
          <Route path="/mata-pelajaran/tambah" element={
            <ProtectedRoute allowedRoles={['Admin', 'Super Admin']}>
              <AddCoursePage />
            </ProtectedRoute>
          } />
          <Route path="/mata-pelajaran/edit/:courseId" element={
            <ProtectedRoute allowedRoles={['Admin', 'Super Admin']}>
              <EditCoursePage />
            </ProtectedRoute>
          } />

          {/* Rute untuk Admin, Wali Kelas, dan Guru Mapel */}
          <Route path="/manajemen-materi" element={
            <ProtectedRoute allowedRoles={['Admin', 'Super Admin', 'Wali Kelas', 'Guru Mapel']}>
              <ManageMaterialsPage />
            </ProtectedRoute>
          } />
          <Route path="/manajemen-materi/tambah" element={
            <ProtectedRoute allowedRoles={['Admin', 'Super Admin', 'Wali Kelas', 'Guru Mapel']}>
              <AddMaterialPage />
            </ProtectedRoute>
          } />
          <Route path="/manajemen-materi/edit/:materialId" element={
            <ProtectedRoute allowedRoles={['Admin', 'Super Admin', 'Wali Kelas', 'Guru Mapel']}>
              <EditMaterialPage />
            </ProtectedRoute>
          } />

          <Route path="/tugas-ujian" element={
            <ProtectedRoute allowedRoles={['Admin', 'Super Admin', 'Wali Kelas', 'Guru Mapel']}>
              <ManageAssignmentsPage />
            </ProtectedRoute>
          } />
          <Route path="/tugas-ujian/tambah" element={
            <ProtectedRoute allowedRoles={['Admin', 'Super Admin', 'Wali Kelas', 'Guru Mapel']}>
              <AddAssignmentPage />
            </ProtectedRoute>
          } />
          <Route path="/tugas-ujian/edit/:assignmentId" element={
            <ProtectedRoute allowedRoles={['Admin', 'Super Admin', 'Wali Kelas', 'Guru Mapel']}>
              <EditAssignmentPage />
            </ProtectedRoute>
          } />
          <Route path="/tugas-ujian/grade/:assignmentId" element={
            <ProtectedRoute allowedRoles={['Admin', 'Super Admin', 'Wali Kelas', 'Guru Mapel']}>
              <GradingPage />
            </ProtectedRoute>
          } />

          {/* Rute untuk pengumuman */}
          <Route path="/pengumuman" element={
            <ProtectedRoute allowedRoles={['Admin', 'Super Admin', 'Kepala Sekolah', 'Wali Kelas']}>
              <ManageAnnouncementsPage />
            </ProtectedRoute>
          } />
          <Route path="/pengumuman/tambah" element={
            <ProtectedRoute allowedRoles={['Admin', 'Super Admin']}>
              <AddAnnouncementPage />
            </ProtectedRoute>
          } />
          <Route path="/pengumuman/edit/:announcementId" element={
            <ProtectedRoute allowedRoles={['Admin', 'Super Admin']}>
              <EditAnnouncementPage />
            </ProtectedRoute>
          } />

          {/* Rute untuk audit log */}
          <Route path="/audit-log" element={
            <ProtectedRoute allowedRoles={['Admin', 'Super Admin', 'Kepala Sekolah']}>
              <AuditLogPage />
            </ProtectedRoute>
          } />

          {/* Rute untuk jadwal pelajaran */}
          <Route path="/jadwal-pelajaran" element={
            <ProtectedRoute allowedRoles={['Admin', 'Super Admin', 'Kepala Sekolah', 'Wali Kelas', 'Guru Mapel']}>
              <ManageSchedulesPage />
            </ProtectedRoute>
          } />
          <Route path="/jadwal-pelajaran/tambah" element={
            <ProtectedRoute allowedRoles={['Admin', 'Super Admin']}>
              <AddSchedulePage />
            </ProtectedRoute>
          } />
          <Route path="/jadwal-pelajaran/edit/:scheduleId" element={
            <ProtectedRoute allowedRoles={['Admin', 'Super Admin']}>
              <EditSchedulePage />
            </ProtectedRoute>
          } />

          {/* Rute untuk pengaturan */}
          <Route path="/pengaturan" element={
            <ProtectedRoute allowedRoles={['Admin', 'Super Admin']}>
              <SettingsPage />
            </ProtectedRoute>
          } />

          {/* Rute untuk laporan nilai */}
          <Route path="/laporan-nilai" element={
            <ProtectedRoute allowedRoles={['Admin', 'Super Admin', 'Kepala Sekolah', 'Wali Kelas', 'Guru Mapel', 'Guru BK']}>
              <ReportsPage />
            </ProtectedRoute>
          } />

          {/* Rute untuk forum diskusi */}
          <Route path="/forum/:subjectId" element={
            <ProtectedRoute allowedRoles={['Admin', 'Super Admin', 'Wali Kelas', 'Guru Mapel', 'Guru BK', 'Siswa']}>
              <ForumPage />
            </ProtectedRoute>
          } />
        </Route>
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;