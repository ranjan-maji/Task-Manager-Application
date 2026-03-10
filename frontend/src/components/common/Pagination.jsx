import React from 'react';
import { FaChevronLeft, FaChevronRight, FaEllipsisH } from 'react-icons/fa';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i);
      }
    }

    range.forEach(i => {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    });

    return rangeWithDots;
  };

  return (
    <div className="flex items-center justify-center space-x-3 mt-8">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="group relative p-3 rounded-xl bg-white shadow-md hover:shadow-xl
                 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-md
                 transition-all duration-300 transform hover:scale-110 hover:-translate-x-1
                 border-2 border-transparent hover:border-primary-500
                 focus:ring-4 focus:ring-primary-300 focus:outline-none"
      >
        <FaChevronLeft className="text-gray-600 group-hover:text-primary-600 transition-colors" />
        <span className="absolute inset-0 rounded-xl bg-primary-500/0 group-hover:bg-primary-500/10 
                       transition-all duration-300"></span>
      </button>

      {/* Page Numbers */}
      <div className="flex items-center space-x-2">
        {getPageNumbers().map((page, index) => (
          <React.Fragment key={index}>
            {page === '...' ? (
              <span className="px-4 py-3 text-gray-400">
                <FaEllipsisH className="animate-pulse" />
              </span>
            ) : (
              <button
                onClick={() => onPageChange(page)}
                className={`relative px-5 py-3 rounded-xl font-semibold transition-all duration-500
                          transform hover:scale-110 group overflow-hidden
                          ${currentPage === page
                            ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-xl scale-110 neon-glow'
                            : 'bg-white text-gray-700 shadow-md hover:shadow-xl border-2 border-gray-100 hover:border-primary-500'
                          }`}
              >
                <span className="relative z-10">{page}</span>
                {currentPage === page && (
                  <span className="absolute inset-0 bg-white/20 animate-pulse"></span>
                )}
              </button>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="group relative p-3 rounded-xl bg-white shadow-md hover:shadow-xl
                 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-md
                 transition-all duration-300 transform hover:scale-110 hover:translate-x-1
                 border-2 border-transparent hover:border-primary-500
                 focus:ring-4 focus:ring-primary-300 focus:outline-none"
      >
        <FaChevronRight className="text-gray-600 group-hover:text-primary-600 transition-colors" />
        <span className="absolute inset-0 rounded-xl bg-primary-500/0 group-hover:bg-primary-500/10 
                       transition-all duration-300"></span>
      </button>
    </div>
  );
};

export default Pagination;