// src/pages/EditAnnouncementPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

function EditAnnouncementPage() {
  const { announcementId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ title: '', content: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const { data, error } = await supabase.rpc('get_announcement_by_id', { announcement_id: announcementId });
        if (error) throw error;
        setFormData(data);
      } catch (err) {
        setError("Gagal mengambil data: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncement();
  }, [announcementId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.rpc('update_announcement', {
        announcement_id: announcementId,
        new_title: formData.title,
        new_content: formData.content,
      });
      if (error) throw error;
      navigate('/pengumuman');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Memuat...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Pengumuman</h1>
      <form onSubmit={handleSubmit} className="max-w-2xl bg-white p-8 rounded-lg shadow-md">
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="title">Judul</label>
          <input type="text" name="title" value={formData.title || ''} onChange={handleChange} className="w-full p-3 border rounded-lg" required />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="content">Isi Pengumuman</label>
          <textarea name="content" id="content" value={formData.content || ''} onChange={handleChange} rows="8" className="w-full p-3 border rounded-lg" required></textarea>
        </div>
        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-300">
          {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
      </form>
    </div>
  );
}

export default EditAnnouncementPage;