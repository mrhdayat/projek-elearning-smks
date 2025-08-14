// src/pages/SettingsPage.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

function SettingsPage() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Mengambil data pengaturan saat halaman dimuat
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase.rpc('get_all_settings');
        if (error) throw error;
        
        // Ubah array dari DB menjadi satu objek state agar mudah dikelola
        const settingsObject = data.reduce((acc, setting) => {
          acc[setting.id] = setting.value;
          return acc;
        }, {});
        setSettings(settingsObject);

      } catch (err) {
        setError("Gagal mengambil data pengaturan: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');
    try {
      const { error } = await supabase.rpc('update_settings', { settings_data: settings });
      if (error) throw error;
      setSuccess('Pengaturan berhasil disimpan!');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Memuat pengaturan...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Pengaturan Umum</h1>
      <form onSubmit={handleSubmit} className="max-w-2xl bg-white p-8 rounded-lg shadow-md">
        {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">{error}</p>}
        {success && <p className="bg-green-100 text-green-700 p-3 rounded-lg mb-4">{success}</p>}
        
        <div className="space-y-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="school_name">Nama Sekolah</label>
            <input type="text" name="school_name" id="school_name" value={settings.school_name || ''} onChange={handleChange} className="w-full p-3 border rounded-lg" />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="academic_year">Tahun Ajaran Aktif</label>
            <input type="text" name="academic_year" id="academic_year" value={settings.academic_year || ''} onChange={handleChange} className="w-full p-3 border rounded-lg" />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="school_address">Alamat Sekolah</label>
            <textarea name="school_address" id="school_address" value={settings.school_address || ''} onChange={handleChange} rows="3" className="w-full p-3 border rounded-lg"></textarea>
          </div>
        </div>
        
        <button type="submit" disabled={loading} className="w-full mt-8 bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-300">
          {loading ? 'Menyimpan...' : 'Simpan Pengaturan'}
        </button>
      </form>
    </div>
  );
}

export default SettingsPage;