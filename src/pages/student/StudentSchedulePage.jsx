// src/pages/student/StudentSchedulePage.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { LuCalendar, LuClock, LuMapPin, LuUser } from 'react-icons/lu';

function StudentSchedulePage() {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState('today');

  useEffect(() => {
    const fetchStudentSchedule = async () => {
      try {
        setLoading(true);
        
        // Simulasi data jadwal untuk siswa
        const mockSchedule = {
          monday: [
            {
              id: 1,
              time: "07:30 - 09:00",
              subject: "Pemrograman Web",
              teacher: "Pak Budi Santoso",
              room: "Lab Komputer 1",
              type: "praktikum"
            },
            {
              id: 2,
              time: "09:15 - 10:45",
              subject: "Basis Data",
              teacher: "Bu Sari Dewi",
              room: "Lab Komputer 2",
              type: "teori"
            },
            {
              id: 3,
              time: "11:00 - 12:30",
              subject: "Bahasa Indonesia",
              teacher: "Bu Dewi Sartika",
              room: "Ruang 12A",
              type: "teori"
            },
            {
              id: 4,
              time: "13:30 - 15:00",
              subject: "Matematika",
              teacher: "Pak Ahmad Rizki",
              room: "Ruang 12B",
              type: "teori"
            }
          ],
          tuesday: [
            {
              id: 5,
              time: "07:30 - 09:00",
              subject: "Kewirausahaan",
              teacher: "Bu Rina Sari",
              room: "Ruang 12A",
              type: "teori"
            },
            {
              id: 6,
              time: "09:15 - 10:45",
              subject: "Pemrograman Web",
              teacher: "Pak Budi Santoso",
              room: "Lab Komputer 1",
              type: "praktikum"
            },
            {
              id: 7,
              time: "11:00 - 12:30",
              subject: "Bahasa Inggris",
              teacher: "Bu Lisa Permata",
              room: "Ruang 12C",
              type: "teori"
            }
          ],
          wednesday: [
            {
              id: 8,
              time: "07:30 - 09:00",
              subject: "Basis Data",
              teacher: "Bu Sari Dewi",
              room: "Lab Komputer 2",
              type: "praktikum"
            },
            {
              id: 9,
              time: "09:15 - 10:45",
              subject: "Matematika",
              teacher: "Pak Ahmad Rizki",
              room: "Ruang 12B",
              type: "teori"
            },
            {
              id: 10,
              time: "11:00 - 12:30",
              subject: "Pendidikan Agama",
              teacher: "Pak Hasan Basri",
              room: "Ruang 12D",
              type: "teori"
            }
          ],
          thursday: [
            {
              id: 11,
              time: "07:30 - 09:00",
              subject: "Pemrograman Web",
              teacher: "Pak Budi Santoso",
              room: "Lab Komputer 1",
              type: "praktikum"
            },
            {
              id: 12,
              time: "09:15 - 10:45",
              subject: "Kewirausahaan",
              teacher: "Bu Rina Sari",
              room: "Ruang 12A",
              type: "praktikum"
            },
            {
              id: 13,
              time: "11:00 - 12:30",
              subject: "Bahasa Indonesia",
              teacher: "Bu Dewi Sartika",
              room: "Ruang 12A",
              type: "teori"
            }
          ],
          friday: [
            {
              id: 14,
              time: "07:30 - 09:00",
              subject: "Basis Data",
              teacher: "Bu Sari Dewi",
              room: "Lab Komputer 2",
              type: "teori"
            },
            {
              id: 15,
              time: "09:15 - 10:45",
              subject: "Bahasa Inggris",
              teacher: "Bu Lisa Permata",
              room: "Ruang 12C",
              type: "teori"
            },
            {
              id: 16,
              time: "11:00 - 11:30",
              subject: "Jumat Bersih",
              teacher: "Wali Kelas",
              room: "Ruang 12A",
              type: "kegiatan"
            }
          ]
        };

        setSchedule(mockSchedule);
      } catch (error) {
        console.error("Error fetching schedule:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentSchedule();
  }, []);

  const days = [
    { key: 'today', label: 'Hari Ini', value: 'monday' },
    { key: 'monday', label: 'Senin', value: 'monday' },
    { key: 'tuesday', label: 'Selasa', value: 'tuesday' },
    { key: 'wednesday', label: 'Rabu', value: 'wednesday' },
    { key: 'thursday', label: 'Kamis', value: 'thursday' },
    { key: 'friday', label: 'Jumat', value: 'friday' }
  ];

  const getCurrentDaySchedule = () => {
    const dayKey = selectedDay === 'today' ? 'monday' : selectedDay;
    return schedule[dayKey] || [];
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'praktikum':
        return 'bg-blue-100 text-blue-800';
      case 'teori':
        return 'bg-green-100 text-green-800';
      case 'kegiatan':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat jadwal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Jadwal Pelajaran</h1>
        <p className="text-indigo-100">
          Lihat jadwal pelajaran harian dan mingguan Anda
        </p>
      </div>

      {/* Day Filter */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-wrap gap-2">
          {days.map(day => (
            <button
              key={day.key}
              onClick={() => setSelectedDay(day.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedDay === day.key
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {day.label}
            </button>
          ))}
        </div>
      </div>

      {/* Schedule for Selected Day */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <LuCalendar className="mr-2" />
            Jadwal {days.find(d => d.key === selectedDay)?.label}
          </h2>
        </div>

        <div className="p-6">
          {getCurrentDaySchedule().length > 0 ? (
            <div className="space-y-4">
              {getCurrentDaySchedule().map((class_item) => (
                <div key={class_item.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{class_item.subject}</h3>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(class_item.type)}`}>
                          {class_item.type}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <LuClock className="mr-2 text-gray-400" size={16} />
                          {class_item.time}
                        </div>
                        <div className="flex items-center">
                          <LuUser className="mr-2 text-gray-400" size={16} />
                          {class_item.teacher}
                        </div>
                        <div className="flex items-center">
                          <LuMapPin className="mr-2 text-gray-400" size={16} />
                          {class_item.room}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <LuCalendar className="mx-auto text-gray-400 mb-4" size={48} />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Tidak ada jadwal</h3>
              <p className="text-gray-500">
                Tidak ada pelajaran untuk {days.find(d => d.key === selectedDay)?.label.toLowerCase()}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Weekly Overview */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Ringkasan Mingguan</h2>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {days.slice(1).map(day => (
              <div key={day.key} className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">{day.label}</h3>
                <div className="space-y-2">
                  {(schedule[day.value] || []).map((class_item, index) => (
                    <div key={index} className="text-xs">
                      <p className="font-medium text-gray-700">{class_item.time}</p>
                      <p className="text-gray-600">{class_item.subject}</p>
                    </div>
                  ))}
                  {(!schedule[day.value] || schedule[day.value].length === 0) && (
                    <p className="text-xs text-gray-500">Tidak ada jadwal</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-3">Mata Pelajaran Hari Ini</h3>
          <p className="text-2xl font-bold text-indigo-600">{getCurrentDaySchedule().length}</p>
          <p className="text-sm text-gray-500">Jam pelajaran</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-3">Jam Pertama</h3>
          <p className="text-lg font-bold text-gray-900">
            {getCurrentDaySchedule().length > 0 ? getCurrentDaySchedule()[0].time : '-'}
          </p>
          <p className="text-sm text-gray-500">
            {getCurrentDaySchedule().length > 0 ? getCurrentDaySchedule()[0].subject : 'Tidak ada jadwal'}
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-3">Jam Terakhir</h3>
          <p className="text-lg font-bold text-gray-900">
            {getCurrentDaySchedule().length > 0 ? getCurrentDaySchedule()[getCurrentDaySchedule().length - 1].time : '-'}
          </p>
          <p className="text-sm text-gray-500">
            {getCurrentDaySchedule().length > 0 ? getCurrentDaySchedule()[getCurrentDaySchedule().length - 1].subject : 'Tidak ada jadwal'}
          </p>
        </div>
      </div>
    </div>
  );
}

export default StudentSchedulePage;
