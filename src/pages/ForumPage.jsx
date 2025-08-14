// src/pages/ForumPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useUserRole } from '../hooks/useUserRole';
import { LuMessageCircle, LuPlus, LuSearch, LuUser, LuClock, LuThumbsUp, LuReply, LuPin } from 'react-icons/lu';

function ForumPage() {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const { userRole, userProfile } = useUserRole();
  const [subject, setSubject] = useState(null);
  const [threads, setThreads] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showNewThreadModal, setShowNewThreadModal] = useState(false);

  useEffect(() => {
    const fetchForumData = async () => {
      try {
        setLoading(true);
        
        // Simulasi data mata pelajaran
        const mockSubject = {
          id: subjectId,
          name: "Pemrograman Web",
          teacher: "Pak Budi Santoso",
          description: "Forum diskusi untuk mata pelajaran Pemrograman Web"
        };

        // Simulasi data thread forum
        const mockThreads = [
          {
            id: 1,
            title: "Cara menggunakan Laravel Eloquent ORM?",
            content: "Saya masih bingung dengan penggunaan Eloquent ORM di Laravel. Bisakah dijelaskan dengan contoh sederhana?",
            author: "Ahmad Rizki",
            authorRole: "Siswa",
            authorAvatar: "https://i.pravatar.cc/150?img=1",
            createdAt: "2024-01-20T10:30:00Z",
            category: "question",
            isPinned: false,
            replies: 5,
            likes: 8,
            lastReply: {
              author: "Pak Budi Santoso",
              timestamp: "2024-01-20T14:15:00Z"
            }
          },
          {
            id: 2,
            title: "Tips Optimasi Database Query",
            content: "Sharing tips untuk mengoptimalkan query database agar aplikasi web lebih cepat. Silakan diskusi di sini!",
            author: "Pak Budi Santoso",
            authorRole: "Guru",
            authorAvatar: "https://i.pravatar.cc/150?img=60",
            createdAt: "2024-01-19T09:00:00Z",
            category: "discussion",
            isPinned: true,
            replies: 12,
            likes: 15,
            lastReply: {
              author: "Siti Nurhaliza",
              timestamp: "2024-01-20T16:45:00Z"
            }
          },
          {
            id: 3,
            title: "Error 'Class not found' di Laravel",
            content: "Saya mendapat error 'Class not found' saat menjalankan migration. Sudah coba composer dump-autoload tapi masih error. Help!",
            author: "Budi Santoso",
            authorRole: "Siswa",
            authorAvatar: "https://i.pravatar.cc/150?img=2",
            createdAt: "2024-01-20T08:15:00Z",
            category: "help",
            isPinned: false,
            replies: 3,
            likes: 2,
            lastReply: {
              author: "Dewi Sartika",
              timestamp: "2024-01-20T12:30:00Z"
            }
          },
          {
            id: 4,
            title: "Resource Belajar JavaScript Modern",
            content: "Kumpulan resource terbaik untuk belajar JavaScript ES6+, React, dan Node.js. Silakan tambahkan rekomendasi kalian!",
            author: "Pak Budi Santoso",
            authorRole: "Guru",
            authorAvatar: "https://i.pravatar.cc/150?img=60",
            createdAt: "2024-01-18T15:20:00Z",
            category: "resource",
            isPinned: false,
            replies: 8,
            likes: 20,
            lastReply: {
              author: "Ahmad Rizki",
              timestamp: "2024-01-19T20:10:00Z"
            }
          }
        ];

        setSubject(mockSubject);
        setThreads(mockThreads);
      } catch (error) {
        console.error("Error fetching forum data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchForumData();
  }, [subjectId]);

  const categories = [
    { value: 'all', label: 'Semua', color: 'gray' },
    { value: 'question', label: 'Pertanyaan', color: 'blue' },
    { value: 'discussion', label: 'Diskusi', color: 'green' },
    { value: 'help', label: 'Bantuan', color: 'red' },
    { value: 'resource', label: 'Resource', color: 'purple' }
  ];

  const getCategoryColor = (category) => {
    const cat = categories.find(c => c.value === category);
    return cat ? cat.color : 'gray';
  };

  const getCategoryBadge = (category) => {
    const cat = categories.find(c => c.value === category);
    const colorClass = {
      blue: 'bg-blue-100 text-blue-800',
      green: 'bg-green-100 text-green-800',
      red: 'bg-red-100 text-red-800',
      purple: 'bg-purple-100 text-purple-800',
      gray: 'bg-gray-100 text-gray-800'
    };
    
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${colorClass[cat?.color || 'gray']}`}>
        {cat?.label || category}
      </span>
    );
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Baru saja';
    if (diffInMinutes < 60) return `${diffInMinutes} menit lalu`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} jam lalu`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} hari lalu`;
  };

  const filteredThreads = threads.filter(thread => {
    const matchesSearch = thread.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         thread.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || thread.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedThreads = filteredThreads.sort((a, b) => {
    // Pinned threads first
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    
    // Then by last reply time
    const aTime = new Date(a.lastReply?.timestamp || a.createdAt);
    const bTime = new Date(b.lastReply?.timestamp || b.createdAt);
    return bTime - aTime;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat forum...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Forum Diskusi</h1>
        <p className="text-blue-100">
          {subject?.name} • {subject?.teacher}
        </p>
        <p className="text-blue-200 text-sm mt-1">
          {subject?.description}
        </p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <LuSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Cari diskusi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          {/* New Thread Button */}
          <button
            onClick={() => setShowNewThreadModal(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <LuPlus className="mr-2" size={16} />
            Buat Diskusi Baru
          </button>
        </div>
      </div>

      {/* Forum Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm border p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{threads.length}</div>
          <div className="text-sm text-gray-600">Total Diskusi</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {threads.reduce((sum, thread) => sum + thread.replies, 0)}
          </div>
          <div className="text-sm text-gray-600">Total Balasan</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">
            {threads.reduce((sum, thread) => sum + thread.likes, 0)}
          </div>
          <div className="text-sm text-gray-600">Total Like</div>
        </div>
      </div>

      {/* Threads List */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b">
          <h3 className="font-semibold text-gray-900">
            Diskusi ({sortedThreads.length})
          </h3>
        </div>

        <div className="divide-y divide-gray-100">
          {sortedThreads.length === 0 ? (
            <div className="p-12 text-center">
              <LuMessageCircle className="mx-auto text-gray-400 mb-4" size={48} />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Belum ada diskusi</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || selectedCategory !== 'all' 
                  ? 'Tidak ada diskusi yang sesuai dengan filter Anda'
                  : 'Jadilah yang pertama memulai diskusi!'
                }
              </p>
              {(!searchTerm && selectedCategory === 'all') && (
                <button
                  onClick={() => setShowNewThreadModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Buat Diskusi Pertama
                </button>
              )}
            </div>
          ) : (
            sortedThreads.map((thread) => (
              <div
                key={thread.id}
                className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => navigate(`/forum/${subjectId}/thread/${thread.id}`)}
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <img
                    src={thread.authorAvatar}
                    alt={thread.author}
                    className="w-10 h-10 rounded-full flex-shrink-0"
                  />

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        {thread.isPinned && (
                          <LuPin className="text-green-600 flex-shrink-0" size={16} />
                        )}
                        <h3 className="font-semibold text-gray-900 hover:text-blue-600">
                          {thread.title}
                        </h3>
                        {getCategoryBadge(thread.category)}
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {thread.content}
                    </p>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <LuUser size={14} />
                          <span>{thread.author}</span>
                          <span className="text-xs">({thread.authorRole})</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <LuClock size={14} />
                          <span>{formatTimestamp(thread.createdAt)}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <LuReply size={14} />
                          <span>{thread.replies}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <LuThumbsUp size={14} />
                          <span>{thread.likes}</span>
                        </div>
                      </div>
                    </div>

                    {thread.lastReply && (
                      <div className="mt-2 pt-2 border-t border-gray-100">
                        <p className="text-xs text-gray-500">
                          Balasan terakhir oleh <span className="font-medium">{thread.lastReply.author}</span> • {formatTimestamp(thread.lastReply.timestamp)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* New Thread Modal */}
      {showNewThreadModal && (
        <NewThreadModal
          subjectId={subjectId}
          onClose={() => setShowNewThreadModal(false)}
          onThreadCreated={(newThread) => {
            setThreads(prev => [newThread, ...prev]);
            setShowNewThreadModal(false);
          }}
        />
      )}
    </div>
  );
}

// Modal component for creating new thread
function NewThreadModal({ subjectId, onClose, onThreadCreated }) {
  const { userProfile } = useUserRole();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('question');
  const [submitting, setSubmitting] = useState(false);

  const categories = [
    { value: 'question', label: 'Pertanyaan' },
    { value: 'discussion', label: 'Diskusi' },
    { value: 'help', label: 'Bantuan' },
    { value: 'resource', label: 'Resource' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      alert('Judul dan konten tidak boleh kosong');
      return;
    }

    try {
      setSubmitting(true);
      
      // Simulasi create thread
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newThread = {
        id: Date.now(),
        title: title.trim(),
        content: content.trim(),
        author: userProfile?.full_name || 'Anonymous',
        authorRole: userProfile?.role || 'User',
        authorAvatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
        createdAt: new Date().toISOString(),
        category,
        isPinned: false,
        replies: 0,
        likes: 0,
        lastReply: null
      };

      onThreadCreated(newThread);
      alert('Diskusi berhasil dibuat!');
    } catch (error) {
      console.error('Error creating thread:', error);
      alert('Gagal membuat diskusi. Silakan coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Buat Diskusi Baru</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kategori
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Judul Diskusi
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Masukkan judul diskusi..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Konten
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Tulis konten diskusi Anda..."
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? 'Membuat...' : 'Buat Diskusi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ForumPage;
