# Panduan Testing E-Learning SMKS

## 🚀 Quick Start Testing

### 1. Test Users yang Tersedia

Gunakan akun berikut untuk testing berbagai peran:

| Peran | Email | Password | Akses |
|-------|-------|----------|-------|
| **Admin** | admin@smks.edu | admin123 | Akses penuh semua fitur |
| **Super Admin** | superadmin@smks.edu | superadmin123 | Akses penuh + pengaturan sistem |
| **Kepala Sekolah** | kepsek@smks.edu | kepsek123 | Monitoring read-only |
| **Wali Kelas** | walikelas@smks.edu | walikelas123 | Manajemen kelas XII RPL 2 |
| **Guru Mapel** | guru@smks.edu | guru123 | Guru Pemrograman Web |
| **Guru BK** | gurubk@smks.edu | gurubk123 | Bimbingan konseling |
| **Siswa** | siswa@smks.edu | siswa123 | Portal pembelajaran siswa |

### 2. Skenario Testing

#### A. Testing Login dan Routing
1. **Login sebagai Admin**
   - Masuk dengan admin@smks.edu / admin123
   - Harus diarahkan ke `/dashboard`
   - Menu sidebar menampilkan semua fitur
   - Dashboard menampilkan AdminDashboard

2. **Login sebagai Siswa**
   - Masuk dengan siswa@smks.edu / siswa123
   - Harus diarahkan ke `/siswa/dashboard`
   - Menu sidebar hanya menampilkan fitur siswa
   - Dashboard menampilkan StudentDashboard

3. **Login sebagai Kepala Sekolah**
   - Masuk dengan kepsek@smks.edu / kepsek123
   - Harus diarahkan ke `/dashboard`
   - Menu sidebar terbatas (read-only)
   - Dashboard menampilkan PrincipalDashboard

#### B. Testing Hak Akses
1. **Admin/Super Admin**
   - ✅ Dapat mengakses semua halaman
   - ✅ Dapat melihat tombol "Tambah", "Edit", "Hapus"
   - ✅ Dapat export data

2. **Kepala Sekolah**
   - ✅ Dapat melihat dashboard dan laporan
   - ❌ Tidak dapat mengakses halaman tambah/edit
   - ✅ Dapat melihat audit log

3. **Wali Kelas**
   - ✅ Dapat mengelola materi dan tugas
   - ✅ Dapat melihat laporan kelas yang diampu
   - ❌ Tidak dapat mengakses kelola pengguna

4. **Guru Mapel**
   - ✅ Dapat mengelola materi mata pelajaran
   - ✅ Dapat membuat dan menilai tugas
   - ❌ Tidak dapat melihat data kelas lain

5. **Guru BK**
   - ✅ Dapat melihat data siswa untuk konseling
   - ❌ Tidak dapat mengubah nilai
   - ✅ Dapat melihat laporan nilai (read-only)

6. **Siswa**
   - ✅ Dapat mengakses materi pembelajaran
   - ✅ Dapat mengumpulkan tugas
   - ✅ Dapat melihat nilai sendiri
   - ❌ Tidak dapat mengakses halaman admin

#### C. Testing Fitur Siswa
1. **Dashboard Siswa** (`/siswa/dashboard`)
   - Statistik pembelajaran personal
   - Jadwal hari ini
   - Tugas yang akan datang
   - Nilai terbaru

2. **Materi Pembelajaran** (`/siswa/materi`)
   - Daftar materi per mata pelajaran
   - Filter berdasarkan mata pelajaran
   - Download materi

3. **Tugas & Ujian** (`/siswa/tugas`)
   - Daftar tugas dengan status
   - Filter berdasarkan status
   - Kumpulkan tugas

4. **Nilai** (`/siswa/nilai`)
   - Nilai per mata pelajaran
   - Rata-rata dan peringkat
   - Grafik perkembangan

5. **Jadwal** (`/siswa/jadwal`)
   - Jadwal harian dan mingguan
   - Filter berdasarkan hari

## 🔧 Troubleshooting

### Masalah Umum

#### 1. Dashboard Tidak Sesuai Peran
**Gejala**: Login sebagai admin tapi masuk ke dashboard siswa

**Solusi**:
```javascript
// Cek di browser console
console.log(localStorage.getItem('supabase.auth.token'))

// Atau cek di Network tab apakah RPC function berjalan
```

**Penyebab Umum**:
- RPC function `get_current_user_profile` belum dibuat
- Data peran di database tidak sesuai
- Cache browser

#### 2. Menu Navigasi Tidak Muncul
**Gejala**: Sidebar kosong atau tidak sesuai peran

**Solusi**:
- Pastikan `useUserRole` hook berfungsi
- Cek apakah `roleBasedNavLinks` sudah didefinisikan
- Refresh halaman

#### 3. Halaman 404 atau Blank
**Gejala**: Klik menu tapi halaman tidak muncul

**Solusi**:
- Cek routing di `App.jsx`
- Pastikan komponen sudah di-import
- Cek console untuk error

#### 4. Error "Function not found"
**Gejala**: Error saat mengambil data profil

**Solusi**:
- Buat RPC function di Supabase:
```sql
CREATE OR REPLACE FUNCTION get_current_user_profile()
RETURNS TABLE (
  id UUID,
  email TEXT,
  full_name TEXT,
  role TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT p.id, p.email, p.full_name, p.role
  FROM profiles p
  WHERE p.id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Debug Mode

Untuk debugging, tambahkan di console browser:
```javascript
// Cek peran pengguna saat ini
window.debugUser = () => {
  console.log('Current user role:', localStorage.getItem('userRole'));
  console.log('Auth token:', localStorage.getItem('supabase.auth.token'));
}

// Panggil dengan
debugUser();
```

## 📋 Checklist Testing

### Pre-Testing
- [ ] Database Supabase sudah setup
- [ ] RPC functions sudah dibuat
- [ ] Test users sudah ada di database
- [ ] Environment variables sudah diset

### Testing Login & Auth
- [ ] Login dengan setiap peran berhasil
- [ ] Redirect sesuai dengan peran
- [ ] Logout berfungsi dengan baik
- [ ] Session management bekerja

### Testing Dashboard
- [ ] Admin Dashboard menampilkan data lengkap
- [ ] Kepala Sekolah Dashboard read-only
- [ ] Wali Kelas Dashboard sesuai kelas
- [ ] Guru Mapel Dashboard sesuai mata pelajaran
- [ ] Guru BK Dashboard untuk konseling
- [ ] Siswa Dashboard personal

### Testing Navigation
- [ ] Menu sidebar sesuai peran
- [ ] Semua link navigasi berfungsi
- [ ] Breadcrumb benar
- [ ] Mobile responsive

### Testing Access Control
- [ ] Protected routes berfungsi
- [ ] Unauthorized access di-redirect
- [ ] Error handling yang baik
- [ ] Loading states

### Testing Features
- [ ] CRUD operations sesuai hak akses
- [ ] Export data (untuk admin)
- [ ] Search dan filter
- [ ] Responsive design

## 🐛 Reporting Bugs

Jika menemukan bug, laporkan dengan format:

```
**Bug**: [Deskripsi singkat]
**Peran**: [Admin/Siswa/dll]
**Steps to Reproduce**:
1. Login sebagai [peran]
2. Klik [menu/tombol]
3. [Aksi yang dilakukan]

**Expected**: [Yang diharapkan]
**Actual**: [Yang terjadi]
**Browser**: [Chrome/Firefox/dll]
**Console Error**: [Copy error dari console]
```

## 📞 Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Cek network tab untuk failed requests
3. Pastikan database connection
4. Hubungi developer dengan detail error
