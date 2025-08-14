// src/components/dashboard/ActivityChart.jsx
import React from 'react';
import { 
  ResponsiveContainer, LineChart, Line, XAxis, 
  YAxis, CartesianGrid, Tooltip, Legend 
} from 'recharts';

function ActivityChart({ data }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm h-96">
      <h3 className="font-bold text-lg text-gray-800 mb-4">Aktivitas Pengguna Mingguan</h3>
      {/* ResponsiveContainer membuat chart menyesuaikan ukuran parent-nya */}
      <ResponsiveContainer width="100%" height="90%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="day_name" tick={{ fill: '#6b7280', fontSize: 12 }} />
          <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem'
            }} 
          />
          <Legend wrapperStyle={{ fontSize: '14px' }} />
          <Line 
            type="monotone" 
            dataKey="siswa_activity" 
            name="Siswa" 
            stroke="#3b82f6" 
            strokeWidth={2} 
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line 
            type="monotone" 
            dataKey="guru_activity" 
            name="Guru"
            stroke="#16a34a" 
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ActivityChart;