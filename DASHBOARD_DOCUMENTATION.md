# Dokumentasi Sistem Dashboard E-Learning SMKS

## Overview

Sistem dashboard yang telah dibuat mengimplementasikan konsep **Role-Based Access Control (RBAC)** dengan 6 peran pengguna yang berbeda, masing-masing memiliki dashboard, menu navigasi, dan hak akses yang sesuai dengan tanggung jawab mereka.

## Struktur Peran Pengguna

### 1. Admin / Super Admin

**Deskripsi**: Penguasa tertinggi platform dengan akses penuh ke semua fitur.

**Hak Akses**:

- CRUD Penuh untuk semua data
- Mengelola pengguna, mata pelajaran, materi, tugas
- Melihat semua laporan dan audit log
- Mengatur pengaturan sistem
- Export data

**Dashboard Features**:

- Statistik lengkap (siswa, guru, kelas, materi)
- Chart aktivitas mingguan
- Quick actions untuk semua operasi
- Latest assignments dan audit log
- Management overview

**Menu Navigasi**:

- Dashboard, Kelola Pengguna, Mata Pelajaran
- Manajemen Materi, Tugas & Ujian, Laporan Nilai
- Pengumuman, Jadwal Pelajaran, Audit Log, Pengaturan

### 2. Kepala Sekolah

**Deskripsi**: Pemimpin sekolah yang membutuhkan gambaran umum untuk monitoring.

**Hak Akses**:

- Read-only untuk semua data
- Melihat laporan nilai, jadwal, aktivitas pengguna
- Monitor kesehatan akademik sekolah

**Dashboard Features**:

- Statistik sekolah secara keseluruhan
- Indikator performa (rata-rata nilai, tingkat penyelesaian, kehadiran)
- Chart aktivitas dan quick actions monitoring
- Ringkasan akademik dan laporan bulanan

**Menu Navigasi**:

- Dashboard, Laporan Nilai, Jadwal Pelajaran
- Monitor Aktivitas, Pengumuman

### 3. Wali Kelas

**Deskripsi**: Guru yang bertanggung jawab atas satu grup kelas spesifik.

**Hak Akses**:

- CRUD untuk materi dan tugas
- Akses mendalam ke data siswa di kelasnya
- Laporan nilai dan kehadiran kelas

**Dashboard Features**:

- Statistik kelas spesifik (total siswa, rata-rata nilai, kehadiran)
- Tabel performa siswa dengan status dan alert
- Quick actions untuk manajemen kelas
- Ringkasan materi, tugas, dan jadwal hari ini

**Menu Navigasi**:

- Dashboard, Manajemen Materi, Tugas & Ujian
- Laporan Kelas, Jadwal Pelajaran

### 4. Guru Mapel (Mata Pelajaran)

**Deskripsi**: Tulang punggung proses belajar-mengajar untuk mata pelajaran spesifik.

**Hak Akses**:

- CRUD terbatas pada mata pelajaran yang diampu
- Mengelola materi, tugas, dan penilaian
- Melihat data siswa yang mengambil mata pelajarannya

**Dashboard Features**:

- Statistik mata pelajaran (total siswa, materi, tugas, rata-rata nilai)
- Tabel tugas yang perlu dinilai dengan prioritas
- Materi terbaru dan statistik pembelajaran
- Jadwal mengajar hari ini

**Menu Navigasi**:

- Dashboard, Manajemen Materi, Tugas & Ujian
- Jadwal Pelajaran

### 5. Guru BK (Bimbingan Konseling)

**Deskripsi**: Fokus pada kesejahteraan dan bimbingan siswa.

**Hak Akses**:

- Read-only data siswa lintas kelas
- Akses untuk keperluan konseling dan bimbingan
- Tidak bisa mengubah data akademik

**Dashboard Features**:

- Statistik konseling (total siswa, yang perlu perhatian, konsultasi)
- Tabel siswa yang memerlukan perhatian khusus dengan prioritas
- Konsultasi terbaru dan performa per kelas
- Jadwal konseling hari ini

**Menu Navigasi**:

- Dashboard, Data Siswa, Laporan Nilai

### 6. Siswa

**Deskripsi**: Pengguna akhir yang menggunakan platform untuk belajar.

**Hak Akses**:

- Read-only untuk materi dan tugas kelas mereka
- Mengumpulkan tugas dan melihat nilai sendiri
- Melihat jadwal dan progres belajar

**Dashboard Features**:

- Statistik pembelajaran personal (rata-rata nilai, tugas selesai, kehadiran)
- Jadwal pelajaran hari ini
- Tugas yang akan datang dengan status dan deadline
- Nilai terbaru dan progres semester

**Menu Navigasi**:

- Dashboard, Materi, Tugas, Nilai, Jadwal

## Komponen Teknis

### 1. Komponen Shared

- **StatCard**: Kartu statistik yang dapat dikustomisasi dengan trend dan click action
- **QuickActions**: Menu aksi cepat berdasarkan peran pengguna
- **useUserRole**: Hook untuk mengelola state peran pengguna dan permissions

### 2. Komponen Dashboard Spesifik

- **AdminDashboard**: Dashboard lengkap untuk admin
- **PrincipalDashboard**: Dashboard monitoring untuk kepala sekolah
- **ClassTeacherDashboard**: Dashboard manajemen kelas untuk wali kelas
- **SubjectTeacherDashboard**: Dashboard mata pelajaran untuk guru mapel
- **CounselorDashboard**: Dashboard konseling untuk guru BK
- **StudentDashboard**: Dashboard pembelajaran untuk siswa

### 3. Komponen Navigasi

- **RoleBasedDashboard**: Router utama yang menentukan dashboard berdasarkan peran
- **Sidebar**: Menu navigasi dinamis berdasarkan peran
- **Header**: Header dengan informasi pengguna dan notifikasi

## Alur Kerja Sistem

### 1. Authentication & Authorization

1. User login melalui LoginPage
2. Sistem mengambil profil pengguna dengan `get_current_user_profile`
3. Berdasarkan peran, user diarahkan ke dashboard yang sesuai
4. Menu navigasi dan fitur disesuaikan dengan hak akses

### 2. Dashboard Rendering

1. `RoleBasedDashboard` mendeteksi peran pengguna
2. Render komponen dashboard yang sesuai
3. Setiap dashboard mengambil data spesifik sesuai kebutuhan peran
4. Tampilkan statistik, chart, dan quick actions yang relevan

### 3. Navigation & Access Control

1. `Sidebar` menampilkan menu berdasarkan `roleBasedNavLinks`
2. `Header` menampilkan informasi pengguna dan notifikasi sesuai peran
3. Setiap halaman memiliki validasi akses berdasarkan peran

## Fitur Keamanan

### 1. Role-Based Access Control

- Setiap komponen memvalidasi peran pengguna
- Menu dan fitur hanya ditampilkan sesuai hak akses
- Redirect otomatis jika akses tidak sesuai

### 2. Data Isolation

- Setiap peran hanya melihat data yang relevan
- Siswa hanya melihat data mereka sendiri
- Guru hanya melihat data mata pelajaran/kelas yang diampu

### 3. Permission Helpers

- `hasPermission()`: Mengecek izin spesifik berdasarkan peran
- `getNavigationMenus()`: Mendapatkan menu yang sesuai
- Validasi di level komponen dan routing

## Implementasi Responsif

### 1. Mobile-First Design

- Sidebar collapsible untuk mobile
- Grid layout yang responsif
- Touch-friendly interface

### 2. Progressive Enhancement

- Loading states untuk semua komponen
- Error handling yang user-friendly
- Graceful degradation untuk fitur advanced

## Extensibility

### 1. Menambah Peran Baru

1. Tambahkan peran di `roleBasedNavLinks` dan `roleBasedActions`
2. Buat komponen dashboard baru jika diperlukan
3. Update `RoleBasedDashboard` untuk handle peran baru
4. Tambahkan permissions di `hasPermission()`

### 2. Menambah Fitur Baru

1. Buat komponen baru dengan validasi peran
2. Tambahkan ke menu navigasi yang sesuai
3. Update quick actions jika diperlukan
4. Implementasikan di dashboard yang relevan

## Best Practices

### 1. Component Structure

- Setiap dashboard adalah komponen terpisah
- Shared components untuk reusability
- Props drilling minimal dengan custom hooks

### 2. Data Management

- Fetch data di level komponen yang membutuhkan
- Loading states untuk UX yang baik
- Error boundaries untuk error handling

### 3. Security

- Validasi peran di setiap komponen sensitif
- Tidak mengandalkan frontend-only security
- Backend validation untuk semua operasi

Sistem dashboard ini memberikan pengalaman yang personal dan sesuai untuk setiap peran pengguna, sambil mempertahankan keamanan dan kemudahan maintenance.

## Testing Dashboard

### 1. Testing dengan Peran Berbeda

Untuk menguji dashboard dengan peran yang berbeda:

1. **Login sebagai Admin**:

   - Email: admin@smks.edu
   - Akan diarahkan ke `/dashboard` dengan AdminDashboard
   - Memiliki akses penuh ke semua fitur

2. **Login sebagai Siswa**:

   - Email: siswa@smks.edu
   - Akan diarahkan ke `/siswa/dashboard` dengan StudentDashboard
   - Hanya memiliki akses ke fitur pembelajaran

3. **Login sebagai Guru**:
   - Email: guru@smks.edu
   - Akan diarahkan ke `/dashboard` dengan dashboard sesuai peran guru
   - Akses terbatas sesuai mata pelajaran/kelas yang diampu

### 2. Validasi Fitur

- Cek apakah menu navigasi sesuai dengan peran
- Pastikan quick actions hanya menampilkan aksi yang diizinkan
- Verifikasi data yang ditampilkan sesuai dengan hak akses
- Test responsivitas di berbagai ukuran layar

## Troubleshooting

### 1. Dashboard Tidak Muncul

- Pastikan user sudah login dan memiliki peran yang valid
- Cek apakah `get_current_user_profile` function tersedia di database
- Verifikasi routing di App.jsx sudah benar

### 2. Menu Tidak Sesuai Peran

- Cek apakah `useUserRole` hook berfungsi dengan baik
- Pastikan `roleBasedNavLinks` sudah didefinisikan untuk peran tersebut
- Verifikasi peran user di database sesuai dengan yang diharapkan

### 3. Data Tidak Muncul

- Pastikan RPC functions di Supabase sudah dibuat
- Cek apakah ada error di console browser
- Verifikasi koneksi ke database dan permissions

## Maintenance

### 1. Update Peran Pengguna

Jika ada perubahan peran atau penambahan peran baru:

1. Update `roleBasedNavLinks` di Sidebar.jsx
2. Update `roleBasedActions` di QuickActions.jsx
3. Tambahkan case baru di `RoleBasedDashboard.jsx`
4. Buat komponen dashboard baru jika diperlukan

### 2. Update UI/UX

- Semua styling menggunakan Tailwind CSS
- Komponen menggunakan design system yang konsisten
- Icons dari react-icons/lu dan react-icons/fa

### 3. Performance Optimization

- Lazy loading untuk komponen dashboard yang besar
- Memoization untuk komponen yang sering re-render
- Optimasi query database untuk data yang besar
