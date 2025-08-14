// src/components/notifications/NotificationCenter.jsx
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useUserRole } from '../../hooks/useUserRole';
import { LuBell, LuX, LuCheck, LuClock, LuFileText, LuUsers, LuMessageCircle } from 'react-icons/lu';
import { motion, AnimatePresence } from 'framer-motion';

function NotificationCenter() {
  const { userRole, userProfile } = useUserRole();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!userProfile) return;
      
      try {
        setLoading(true);
        
        // Simulasi data notifikasi berdasarkan peran
        let mockNotifications = [];
        
        if (userRole === 'Siswa') {
          mockNotifications = [
            {
              id: 1,
              type: 'assignment',
              title: 'Tugas Baru: Project Laravel',
              message: 'Pak Budi telah memberikan tugas baru untuk mata pelajaran Pemrograman Web',
              timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
              read: false,
              actionUrl: '/siswa/tugas/1'
            },
            {
              id: 2,
              type: 'grade',
              title: 'Nilai Tugas Tersedia',
              message: 'Tugas "Database Design" Anda telah dinilai oleh Bu Sari. Nilai: 92/100',
              timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
              read: false,
              actionUrl: '/siswa/nilai'
            },
            {
              id: 3,
              type: 'announcement',
              title: 'Pengumuman: Libur Nasional',
              message: 'Sekolah akan libur pada tanggal 17 Agustus 2024 dalam rangka HUT RI',
              timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
              read: true,
              actionUrl: '/pengumuman'
            },
            {
              id: 4,
              type: 'quiz',
              title: 'Kuis JavaScript Dimulai',
              message: 'Kuis JavaScript Fundamentals akan dimulai dalam 30 menit',
              timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
              read: false,
              actionUrl: '/siswa/tugas/quiz/1'
            }
          ];
        } else if (userRole === 'Guru Mapel' || userRole === 'Wali Kelas') {
          mockNotifications = [
            {
              id: 1,
              type: 'submission',
              title: '5 Pengumpulan Tugas Baru',
              message: 'Ada 5 pengumpulan tugas "Project Laravel" yang perlu dinilai',
              timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
              read: false,
              actionUrl: '/tugas-ujian/grade/1'
            },
            {
              id: 2,
              type: 'question',
              title: 'Pertanyaan dari Siswa',
              message: 'Ahmad Rizki bertanya tentang materi "JavaScript DOM Manipulation"',
              timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
              read: false,
              actionUrl: '/forum/javascript-dom'
            },
            {
              id: 3,
              type: 'reminder',
              title: 'Deadline Tugas Besok',
              message: 'Tugas "Project Laravel" akan berakhir besok pukul 23:59',
              timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
              read: true,
              actionUrl: '/tugas-ujian/1'
            }
          ];
        } else if (userRole === 'Admin' || userRole === 'Super Admin') {
          mockNotifications = [
            {
              id: 1,
              type: 'user',
              title: '3 Pengguna Baru Terdaftar',
              message: 'Ada 3 siswa baru yang mendaftar hari ini',
              timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
              read: false,
              actionUrl: '/kelola-pengguna'
            },
            {
              id: 2,
              type: 'system',
              title: 'Backup Database Selesai',
              message: 'Backup database harian telah berhasil dilakukan',
              timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
              read: true,
              actionUrl: '/pengaturan'
            },
            {
              id: 3,
              type: 'report',
              title: 'Laporan Mingguan Siap',
              message: 'Laporan aktivitas mingguan telah dibuat dan siap diunduh',
              timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
              read: false,
              actionUrl: '/laporan-nilai'
            }
          ];
        }

        setNotifications(mockNotifications);
        setUnreadCount(mockNotifications.filter(n => !n.read).length);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();

    // Setup real-time subscription (simulasi)
    const interval = setInterval(() => {
      // Simulasi notifikasi baru setiap 5 menit
      if (Math.random() > 0.8) {
        const newNotification = {
          id: Date.now(),
          type: 'system',
          title: 'Notifikasi Baru',
          message: 'Ini adalah notifikasi real-time untuk testing',
          timestamp: new Date().toISOString(),
          read: false,
          actionUrl: '/dashboard'
        };
        
        setNotifications(prev => [newNotification, ...prev]);
        setUnreadCount(prev => prev + 1);
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [userRole, userProfile]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'assignment':
      case 'submission':
        return <LuFileText className="text-blue-500" size={16} />;
      case 'grade':
        return <LuCheck className="text-green-500" size={16} />;
      case 'announcement':
        return <LuMessageCircle className="text-purple-500" size={16} />;
      case 'quiz':
        return <LuClock className="text-orange-500" size={16} />;
      case 'user':
        return <LuUsers className="text-blue-500" size={16} />;
      default:
        return <LuBell className="text-gray-500" size={16} />;
    }
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const notifTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - notifTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Baru saja';
    if (diffInMinutes < 60) return `${diffInMinutes} menit lalu`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} jam lalu`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} hari lalu`;
  };

  const markAsRead = async (notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, read: true }
          : notif
      )
    );
    
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = async () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
    setUnreadCount(0);
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl;
    }
    
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <LuBell size={20} />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </button>

      {/* Notification Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-semibold text-gray-900">Notifikasi</h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    Tandai semua dibaca
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <LuX size={16} />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-sm text-gray-500 mt-2">Memuat notifikasi...</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <LuBell className="mx-auto text-gray-400 mb-2" size={32} />
                  <p className="text-gray-500">Tidak ada notifikasi</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                        !notification.read ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <h4 className={`text-sm font-medium ${
                              !notification.read ? 'text-gray-900' : 'text-gray-700'
                            }`}>
                              {notification.title}
                            </h4>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            {formatTimestamp(notification.timestamp)}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-3 border-t bg-gray-50">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    // Navigate to full notifications page
                    window.location.href = '/notifications';
                  }}
                  className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Lihat Semua Notifikasi
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default NotificationCenter;
