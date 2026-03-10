import React, { useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

const Modal = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto animate-fade-in">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop with blur */}
        <div 
          className="fixed inset-0 bg-gradient-to-br from-gray-900/90 to-primary-900/90 backdrop-blur-md transition-opacity"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/20"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

        {/* Modal Content */}
        <div className="inline-block align-bottom bg-white/95 backdrop-blur rounded-3xl text-left 
                      overflow-hidden shadow-2xl transform transition-all duration-500 
                      sm:my-8 sm:align-middle sm:max-w-lg sm:w-full animate-slide-up
                      border border-white/20">
          
          {/* Header with gradient */}
          <div className="relative bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-5">
            <h3 className="text-xl font-bold text-white flex items-center space-x-2">
              <span className="w-1 h-6 bg-white rounded-full animate-pulse"></span>
              <span>{title}</span>
            </h3>
            <button
              onClick={onClose}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 
                       w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 
                       flex items-center justify-center text-white
                       transition-all duration-300 hover:rotate-90 hover:scale-110
                       focus:ring-4 focus:ring-white/30 focus:outline-none
                       group"
            >
              <FaTimes className="text-lg group-hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-6 modern-scrollbar max-h-[70vh] overflow-y-auto">
            {children}
          </div>

          {/* Decorative bottom gradient */}
          <div className="h-1 bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700"></div>
        </div>
      </div>
    </div>
  );
};

export default Modal;