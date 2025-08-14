// src/utils/testUsers.js
// File ini berisi data test user untuk development dan testing

export const testUsers = [
  {
    email: 'admin@smks.edu',
    password: 'admin123',
    role: 'Admin',
    full_name: 'Administrator Sistem',
    description: 'Akses penuh ke semua fitur sistem'
  },
  {
    email: 'superadmin@smks.edu',
    password: 'superadmin123',
    role: 'Super Admin',
    full_name: 'Super Administrator',
    description: 'Akses penuh + pengaturan sistem'
  },
  {
    email: 'kepsek@smks.edu',
    password: 'kepsek123',
    role: 'Kepala Sekolah',
    full_name: 'Dr. Budi Hartono, M.Pd',
    description: 'Monitoring dan laporan read-only'
  },
  {
    email: 'walikelas@smks.edu',
    password: 'walikelas123',
    role: 'Wali Kelas',
    full_name: 'Sari Dewi, S.Pd',
    description: 'Manajemen kelas XII RPL 2'
  },
  {
    email: 'guru@smks.edu',
    password: 'guru123',
    role: 'Guru Mapel',
    full_name: 'Budi Santoso, S.Kom',
    description: 'Guru Pemrograman Web'
  },
  {
    email: 'gurubk@smks.edu',
    password: 'gurubk123',
    role: 'Guru BK',
    full_name: 'Rina Sari, S.Psi',
    description: 'Bimbingan dan konseling siswa'
  },
  {
    email: 'siswa@smks.edu',
    password: 'siswa123',
    role: 'Siswa',
    full_name: 'Ahmad Rizki Pratama',
    description: 'Siswa XII RPL 2'
  }
];

// Function untuk mendapatkan user berdasarkan role
export const getUserByRole = (role) => {
  return testUsers.find(user => user.role === role);
};

// Function untuk mendapatkan semua roles yang tersedia
export const getAvailableRoles = () => {
  return [...new Set(testUsers.map(user => user.role))];
};

// Function untuk validasi login (untuk development)
export const validateTestLogin = (email, password) => {
  const user = testUsers.find(u => u.email === email && u.password === password);
  return user || null;
};

// Matriks hak akses berdasarkan Excel yang diberikan
export const accessMatrix = {
  'Admin': {
    'Pengguna': 'CRUD',
    'Mata Pelajaran': 'CRUD',
    'Materi': 'CRUD',
    'Tugas & Ujian': 'CRUD',
    'Pengumpulan': 'Read',
    'Jadwal': 'CRUD',
    'Pengumuman': 'CRUD',
    'Laporan Nilai': 'Read',
    'Helpdesk': 'CRUD',
    'Pengaturan': 'CRUD'
  },
  'Super Admin': {
    'Pengguna': 'CRUD',
    'Mata Pelajaran': 'CRUD',
    'Materi': 'CRUD',
    'Tugas & Ujian': 'CRUD',
    'Pengumpulan': 'Read',
    'Jadwal': 'CRUD',
    'Pengumuman': 'CRUD',
    'Laporan Nilai': 'Read',
    'Helpdesk': 'CRUD',
    'Pengaturan': 'CRUD'
  },
  'Kepala Sekolah': {
    'Pengguna': 'Read',
    'Mata Pelajaran': 'Read',
    'Materi': 'Read',
    'Tugas & Ujian': 'Read',
    'Pengumpulan': 'Read',
    'Jadwal': 'Read',
    'Pengumuman': 'Read',
    'Laporan Nilai': 'Read',
    'Helpdesk': '-',
    'Pengaturan': '-'
  },
  'Wali Kelas': {
    'Pengguna': 'Read (Kelasnya)',
    'Mata Pelajaran': 'Read',
    'Materi': 'CRUD (Kelasnya)',
    'Tugas & Ujian': 'CRUD (Kelasnya)',
    'Pengumpulan': 'Read/Update (Kelasnya)',
    'Jadwal': 'Read',
    'Pengumuman': 'Read',
    'Laporan Nilai': 'Read (Kelasnya)',
    'Helpdesk': 'Create/Read',
    'Pengaturan': '-'
  },
  'Guru Mapel': {
    'Pengguna': 'Read',
    'Mata Pelajaran': 'Read',
    'Materi': 'CRUD (Mapelnya)',
    'Tugas & Ujian': 'CRUD (Mapelnya)',
    'Pengumpulan': 'Read/Update (Mapelnya)',
    'Jadwal': 'Read',
    'Pengumuman': 'Read',
    'Laporan Nilai': 'Read (Mapelnya)',
    'Helpdesk': 'Create/Read',
    'Pengaturan': '-'
  },
  'Guru BK': {
    'Pengguna': 'Read',
    'Mata Pelajaran': 'Read',
    'Materi': 'Read',
    'Tugas & Ujian': 'Read',
    'Pengumpulan': 'Read',
    'Jadwal': 'Read',
    'Pengumuman': 'Read',
    'Laporan Nilai': 'Read (Tertentu)',
    'Helpdesk': 'Create/Read',
    'Pengaturan': '-'
  },
  'Siswa': {
    'Pengguna': '-',
    'Mata Pelajaran': 'Read',
    'Materi': 'Read',
    'Tugas & Ujian': 'Read',
    'Pengumpulan': 'Create/Read/Update (Miliknya)',
    'Jadwal': 'Read',
    'Pengumuman': 'Read',
    'Laporan Nilai': 'Read (Miliknya)',
    'Helpdesk': 'Create/Read',
    'Pengaturan': '-'
  }
};

// Function untuk mengecek hak akses
export const checkAccess = (userRole, module, action) => {
  const userAccess = accessMatrix[userRole];
  if (!userAccess || !userAccess[module]) return false;
  
  const moduleAccess = userAccess[module];
  
  if (moduleAccess === 'CRUD') return true;
  if (moduleAccess === 'Read' && action === 'read') return true;
  if (moduleAccess.includes(action)) return true;
  
  return false;
};

export default testUsers;
