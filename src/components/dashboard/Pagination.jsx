// src/components/dashboard/Pagination.jsx
import React from 'react';

function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center space-x-2 mt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-white border rounded-md disabled:opacity-50"
      >
        Sebelumnya
      </button>
      <span className="text-gray-700">
        Halaman {currentPage} dari {totalPages}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 bg-white border rounded-md disabled:opacity-50"
      >
        Berikutnya
      </button>
    </div>
  );
}
export default Pagination;