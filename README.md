# 🎓 E-Learning SMKS - Sistem Pembelajaran Digital

Aplikasi e-learning lengkap untuk SMK dengan sistem role-based access control yang mendukung 6 peran pengguna berbeda dan fitur pembelajaran interaktif.

## ✨ Fitur Utama

### 🔐 Role-Based Access Control

- **Admin/Super Admin**: Akses penuh ke semua fitur sistem
- **Kepala Sekolah**: Dashboard monitoring dan laporan read-only
- **Wali Kelas**: Manajemen kelas spesifik dan siswa
- **Guru Mapel**: Manajemen mata pelajaran dan penilaian
- **Guru BK**: Bimbingan konseling dan data siswa
- **Siswa**: Portal pembelajaran personal

### 📊 Dashboard Khusus per Peran

- Dashboard yang disesuaikan dengan kebutuhan setiap peran
- Statistik dan analytics yang relevan
- Quick actions berdasarkan hak akses
- Real-time data dan notifikasi

### 🎯 Fitur Pembelajaran

- **Manajemen Materi**: Upload dan organisasi materi pembelajaran
- **Tugas & Ujian**: Sistem penugasan dan penilaian dengan pengumpulan online
- **Kuis Interaktif**: Kuis online dengan timer dan auto-grading
- **Penilaian Digital**: Interface penilaian terpadu untuk guru
- **Laporan Nilai**: Tracking progres akademik siswa dengan analytics
- **Forum Diskusi**: Forum per mata pelajaran untuk Q&A dan diskusi
- **Notifikasi Real-time**: Sistem notifikasi langsung untuk semua aktivitas
- **Jadwal Pelajaran**: Manajemen jadwal dan kalender akademik
- **Pengumuman**: Sistem komunikasi sekolah

### 🚀 Fitur Terbaru (Fase A-B)

- **📝 Pengumpulan Tugas Digital**: Upload file dan text submission dengan validasi
- **🎓 Sistem Penilaian Terpadu**: Interface grading untuk guru dengan feedback
- **🧪 Kuis Online Interaktif**: Timer, multiple choice, essay, auto-grading
- **🔔 Notifikasi Real-time**: Push notifications untuk semua aktivitas
- **💬 Forum Diskusi**: Threaded discussions per mata pelajaran
- **📱 Mobile Responsive**: Optimized untuk semua device

## 🚀 Quick Start

### Prerequisites

- Node.js 16+
- npm atau yarn
- Akun Supabase

### Installation

1. **Clone repository**

```bash
git clone [repository-url]
cd projek-elearning-smks
```

2. **Install dependencies**

```bash
npm install
```

3. **Setup environment variables**

```bash
cp .env.example .env
```

Edit `.env` dengan kredensial Supabase Anda:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Setup database**

- Buat project baru di [Supabase](https://supabase.com)
- Jalankan SQL scripts yang ada di folder `database/`
- Atau import schema dari `database/schema.sql`

5. **Jalankan aplikasi**

```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:5173`

## 🧪 Testing

### Test Users

Gunakan akun berikut untuk testing:

| Peran          | Email              | Password     | Fitur Utama               |
| -------------- | ------------------ | ------------ | ------------------------- |
| Admin          | admin@smks.edu     | admin123     | Akses penuh semua fitur   |
| Kepala Sekolah | kepsek@smks.edu    | kepsek123    | Monitoring read-only      |
| Wali Kelas     | walikelas@smks.edu | walikelas123 | Manajemen kelas XII RPL 2 |
| Guru Mapel     | guru@smks.edu      | guru123      | Guru Pemrograman Web      |
| Guru BK        | gurubk@smks.edu    | gurubk123    | Bimbingan konseling       |
| Siswa          | siswa@smks.edu     | siswa123     | Portal pembelajaran siswa |

### Testing Fitur Baru

#### 1. Pengumpulan Tugas (Siswa)

```
✅ Login sebagai siswa
✅ Menu "Tugas" → Pilih tugas → "Lihat Detail"
✅ Upload file atau ketik jawaban
✅ Submit tugas sebelum deadline
✅ Lihat status pengumpulan
```

#### 2. Penilaian Tugas (Guru)

```
✅ Login sebagai guru
✅ Menu "Tugas & Ujian" → Pilih tugas → "Nilai Siswa"
✅ Download file pengumpulan siswa
✅ Berikan nilai dan feedback
✅ Save penilaian
```

#### 3. Kuis Online (Siswa)

```
✅ Login sebagai siswa
✅ Menu "Tugas" → Pilih kuis → "Mulai Kuis"
✅ Jawab soal dengan timer berjalan
✅ Submit kuis (manual atau auto)
✅ Lihat hasil kuis
```

#### 4. Forum Diskusi (Semua Peran)

```
✅ Menu "Forum Diskusi"
✅ Buat diskusi baru
✅ Filter berdasarkan kategori
✅ Search diskusi
✅ Reply dan like
```

#### 5. Notifikasi Real-time

```
✅ Icon bell di header
✅ Notifikasi muncul real-time
✅ Klik notifikasi untuk navigasi
✅ Mark as read functionality
```

Lihat [TESTING_GUIDE.md](TESTING_GUIDE.md) untuk panduan testing lengkap.

## 📁 Struktur Project

```
src/
├── components/
│   ├── auth/              # Komponen autentikasi
│   │   └── ProtectedRoute.jsx
│   ├── dashboard/         # Komponen dashboard
│   │   ├── AdminDashboard.jsx
│   │   ├── StudentDashboard.jsx
│   │   ├── Header.jsx
│   │   └── Sidebar.jsx
│   ├── notifications/     # Sistem notifikasi
│   │   └── NotificationCenter.jsx
│   └── common/            # Komponen umum
│       ├── ErrorBoundary.jsx
│       └── UnderDevelopment.jsx
├── pages/
│   ├── student/           # Halaman khusus siswa
│   │   ├── AssignmentDetailPage.jsx
│   │   ├── QuizPage.jsx
│   │   ├── StudentMaterialsPage.jsx
│   │   ├── StudentAssignmentsPage.jsx
│   │   ├── StudentGradesPage.jsx
│   │   └── StudentSchedulePage.jsx
│   ├── teacher/           # Halaman khusus guru
│   │   └── GradingPage.jsx
│   ├── ForumPage.jsx      # Forum diskusi
│   ├── ReportsPage.jsx    # Laporan nilai
│   └── ...                # Halaman lainnya
├── hooks/                 # Custom React hooks
│   └── useUserRole.js
├── layouts/               # Layout komponen
│   └── AppLayout.jsx
├── lib/                   # Konfigurasi library
│   └── supabaseClient.js
└── utils/                 # Utility functions
    └── testUsers.js
```

## 🔧 Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Icons**: React Icons (Lucide + Font Awesome)
- **Routing**: React Router DOM
- **Animation**: Framer Motion
- **Backend**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Real-time**: Supabase Realtime
- **State Management**: React Hooks + Context

## 📋 Matriks Hak Akses

| Modul          | Admin    | Kepala Sekolah | Wali Kelas             | Guru Mapel             | Guru BK         | Siswa                         |
| -------------- | -------- | -------------- | ---------------------- | ---------------------- | --------------- | ----------------------------- |
| Pengguna       | CRUD     | Read           | Read (Kelasnya)        | Read                   | Read            | -                             |
| Mata Pelajaran | CRUD     | Read           | Read                   | Read                   | Read            | Read                          |
| Materi         | CRUD     | Read           | CRUD (Kelasnya)        | CRUD (Mapelnya)        | Read            | Read                          |
| Tugas & Ujian  | CRUD     | Read           | CRUD (Kelasnya)        | CRUD (Mapelnya)        | Read            | Read                          |
| Pengumpulan    | Read     | Read           | Read/Update (Kelasnya) | Read/Update (Mapelnya) | Read            | Create/Read/Update (Miliknya) |
| Penilaian      | CRUD     | Read           | CRUD (Kelasnya)        | CRUD (Mapelnya)        | Read            | Read (Miliknya)               |
| Forum          | Moderate | Read           | Moderate (Kelasnya)    | Moderate (Mapelnya)    | Read            | Participate                   |
| Jadwal         | CRUD     | Read           | Read                   | Read                   | Read            | Read                          |
| Pengumuman     | CRUD     | Read           | Read                   | Read                   | Read            | Read                          |
| Laporan Nilai  | Read     | Read           | Read (Kelasnya)        | Read (Mapelnya)        | Read (Tertentu) | Read (Miliknya)               |

## 🛠️ Development

### Menambah Fitur Baru

1. Buat komponen dengan validasi peran
2. Tambahkan ke routing di `App.jsx` dengan `ProtectedRoute`
3. Update menu navigasi di `Sidebar.jsx`
4. Implementasikan di dashboard yang relevan
5. Tambahkan testing scenarios

### Menambah Peran Baru

1. Update `roleBasedNavLinks` di `Sidebar.jsx`
2. Update `roleBasedActions` di `QuickActions.jsx`
3. Buat komponen dashboard baru jika diperlukan
4. Update `RoleBasedDashboard.jsx`
5. Tambahkan permissions di `useUserRole.js`

## 📖 Dokumentasi

- [Dashboard Documentation](DASHBOARD_DOCUMENTATION.md) - Dokumentasi lengkap sistem dashboard
- [Fitur Baru Documentation](FITUR_BARU_DOCUMENTATION.md) - Dokumentasi fitur-fitur terbaru
- [Testing Guide](TESTING_GUIDE.md) - Panduan testing dan troubleshooting
- [API Documentation](API_DOCUMENTATION.md) - Dokumentasi API dan database

## 🚧 Roadmap

### ✅ Fase A: Fitur Akademik Inti (SELESAI)

- [x] Pengumpulan tugas digital
- [x] Sistem penilaian terpadu
- [x] Kuis online interaktif
- [x] Notifikasi real-time

### ✅ Fase B: Interaksi & Komunikasi (SELESAI)

- [x] Forum diskusi per mata pelajaran
- [x] Sistem notifikasi real-time
- [x] Enhanced user experience

### 🔄 Fase C: UX & Dashboard Lanjutan (IN PROGRESS)

- [ ] Fitur pencarian global
- [ ] Dashboard yang diperkaya
- [ ] Halaman profil pengguna
- [ ] Mode gelap (Dark mode)

### 📋 Fase D: Administrasi Lanjutan (PLANNED)

- [ ] Manajemen grup kelas
- [ ] Manajemen kode registrasi
- [ ] Laporan kehadiran (absensi)
- [ ] Pencarian global advanced

### 🚀 Fase E: Advanced Features (FUTURE)

- [ ] Video conferencing integration
- [ ] Advanced analytics
- [ ] Mobile app
- [ ] Offline capabilities
- [ ] AI-powered features

## 🤝 Contributing

1. Fork repository
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📞 Support

Jika mengalami masalah atau butuh bantuan:

- Buka issue di GitHub
- Cek [TESTING_GUIDE.md](TESTING_GUIDE.md) untuk troubleshooting
- Cek [FITUR_BARU_DOCUMENTATION.md](FITUR_BARU_DOCUMENTATION.md) untuk fitur terbaru
- Email: support@smks.edu
- Forum: `/forum/technical-support`

---

**Dibuat dengan ❤️ untuk kemajuan pendidikan Indonesia**

_Last updated: Januari 2024 - Fase A & B Complete_
