// src/pages/AddMaterialPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

function AddMaterialPage() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [title, setTitle] = useState('');
  const [courseId, setCourseId] = useState('');
  const [materialType, setMaterialType] = useState('file');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      const { data, error } = await supabase.rpc('get_all_courses');
      if (error) console.error("Gagal mengambil data mata pelajaran:", error);
      else setCourses(data);
    };
    fetchCourses();
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      let materialContent = content;

      if (materialType === 'file') {
        if (!file) throw new Error("Silakan pilih file untuk di-upload.");
        
        // PERBAIKAN: Mengganti nama folder dari 'public' menjadi 'dokumen'
        const filePath = `dokumen/${Date.now()}_${file.name}`;
        
        const { error: uploadError } = await supabase.storage
          .from('materi-pembelajaran')
          .upload(filePath, file);

        if (uploadError) throw uploadError;
        
        materialContent = filePath;
      }

      const { error: rpcError } = await supabase.rpc('create_material', {
        title,
        course_id: Number(courseId),
        type: materialType,
        content: materialContent,
      });

      if (rpcError) throw rpcError;

      setSuccess('Materi baru berhasil ditambahkan!');
      setTimeout(() => navigate('/manajemen-materi'), 2000);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    // ... JSX untuk form tidak berubah ...
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Tambah Materi Baru</h1>
      <form onSubmit={handleSubmit} className="max-w-2xl bg-white p-8 rounded-lg shadow-md">
        {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">{error}</p>}
        {success && <p className="bg-green-100 text-green-700 p-3 rounded-lg mb-4">{success}</p>}

        <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Tipe Materi</label>
            <div className="flex space-x-4">
                <label><input type="radio" name="materialType" value="file" checked={materialType === 'file'} onChange={() => setMaterialType('file')} /> File</label>
                <label><input type="radio" name="materialType" value="link" checked={materialType === 'link'} onChange={() => setMaterialType('link')} /> Link</label>
                <label><input type="radio" name="materialType" value="text" checked={materialType === 'text'} onChange={() => setMaterialType('text')} /> Teks</label>
            </div>
        </div>

        <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="title">Judul Materi</label>
            <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-3 border rounded-lg" required />
        </div>
        
        <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="courseId">Mata Pelajaran</label>
            <select id="courseId" value={courseId} onChange={(e) => setCourseId(e.target.value)} className="w-full p-3 border rounded-lg bg-white" required>
                <option value="">-- Pilih Mata Pelajaran --</option>
                {courses.map(course => (
                    <option key={course.id} value={course.id}>{course.name}</option>
                ))}
            </select>
        </div>

        {materialType === 'file' && (
            <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2" htmlFor="file">Upload File</label>
                <input type="file" id="file" onChange={handleFileChange} className="w-full p-3 border rounded-lg" />
            </div>
        )}
        {materialType === 'link' && (
             <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2" htmlFor="content">URL Link</label>
                <input type="url" id="content" value={content} onChange={(e) => setContent(e.target.value)} className="w-full p-3 border rounded-lg" placeholder="https://contoh.com/materi" />
            </div>
        )}
        {materialType === 'text' && (
            <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2" htmlFor="content">Isi Materi Teks</label>
                <textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} rows="6" className="w-full p-3 border rounded-lg"></textarea>
            </div>
        )}

        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-300">
            {loading ? 'Menyimpan...' : 'Simpan Materi'}
        </button>
      </form>
    </div>
  );
}

export default AddMaterialPage;