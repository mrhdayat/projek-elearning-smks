// src/pages/AddAnnouncementPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

function AddAnnouncementPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.rpc('create_announcement', { title, content });
      if (error) throw error;
      navigate('/pengumuman');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Buat Pengumuman Baru</h1>
      <form onSubmit={handleSubmit} className="max-w-2xl bg-white p-8 rounded-lg shadow-md">
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="title">Judul</label>
          <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-3 border rounded-lg" required />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="content">Isi Pengumuman</label>
          <textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} rows="8" className="w-full p-3 border rounded-lg" required></textarea>
        </div>
        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-300">
          {loading ? 'Menerbitkan...' : 'Terbitkan Pengumuman'}
        </button>
      </form>
    </div>
  );
}

export default AddAnnouncementPage;