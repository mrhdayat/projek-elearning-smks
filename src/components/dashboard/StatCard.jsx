// src/components/dashboard/StatCard.jsx
import React from 'react';

function StatCard({ icon, title, value, details, colorClass, trend, onClick, isClickable = false }) {
  const CardComponent = isClickable ? 'button' : 'div';

  return (
    <CardComponent
      className={`bg-white p-6 rounded-lg shadow-sm flex items-center space-x-4 ${isClickable ? 'hover:shadow-md transition-shadow cursor-pointer w-full text-left' : ''}`}
      onClick={onClick}
    >
      <div className={`p-4 rounded-full ${colorClass}`}>
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
        {details && (
          <p className="text-xs text-gray-500">{details}</p>
        )}
        {trend && (
          <div className={`flex items-center mt-2 text-xs ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
            <span className="mr-1">
              {trend.isPositive ? '↗' : '↘'}
            </span>
            {trend.value}
          </div>
        )}
      </div>
    </CardComponent>
  );
}

export default StatCard;