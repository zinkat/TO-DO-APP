import React from 'react';

function Pagination({ totalPages, currentPage, onPageChange }) {
  // Génère les numéros de page
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center mt-6 gap-2">
      {pages.map((num) => (
        <button
          key={num}
          onClick={() => onPageChange(num)}
          className={`px-3 py-1 rounded-md ${
            currentPage === num
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-black dark:text-white'
          }`}
        >
          {num}
        </button>
      ))}
    </div>
  );
}

export default Pagination;


