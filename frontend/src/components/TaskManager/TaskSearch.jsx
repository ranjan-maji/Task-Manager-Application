import React, { useState, useEffect, useRef } from 'react';
import { FaSearch, FaTimes, FaFilter } from 'react-icons/fa';

const TaskSearch = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value === '') {
      onSearch('');
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    onSearch('');
    inputRef.current?.focus();
  };

  return (
    <div className="relative group animate-slide-up">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-primary-600/5 
                    rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
      </div>

      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          {/* Search icon */}
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
            <FaSearch className={`text-gray-400 transition-all duration-300 
                                ${isExpanded ? 'text-primary-500 scale-110' : ''}`} />
          </div>

          {/* Input field */}
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={handleChange}
            onFocus={() => setIsExpanded(true)}
            onBlur={() => setIsExpanded(false)}
            placeholder="Search tasks by title or description..."
            className="w-full pl-12 pr-24 py-4 bg-white border-2 border-gray-200 rounded-2xl
                     focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100
                     transition-all duration-300 text-gray-700 placeholder-gray-400
                     hover:border-primary-300"
          />

          {/* Action buttons */}
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
            {searchTerm && (
              <button
                type="button"
                onClick={clearSearch}
                className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-300
                         transform hover:scale-110 group"
                title="Clear search"
              >
                <FaTimes className="text-gray-400 group-hover:text-gray-600" />
              </button>
            )}
            
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-700 
                       text-white rounded-xl font-medium
                       hover:from-primary-700 hover:to-primary-800 
                       transform hover:scale-105 transition-all duration-300
                       focus:ring-4 focus:ring-primary-300 focus:outline-none
                       flex items-center space-x-2 shadow-lg hover:shadow-xl"
            >
              <FaSearch className="text-sm" />
              <span>Search</span>
            </button>
          </div>
        </div>

        {/* Search tips (shown when focused) */}
        {isExpanded && (
          <div className="absolute left-0 right-0 mt-2 p-3 bg-white rounded-xl shadow-xl 
                        border border-gray-100 animate-slide-up z-20">
            <p className="text-xs text-gray-500 flex items-center space-x-2">
              <FaFilter className="text-primary-500" />
              <span>💡 Tip: You can search by task title or description</span>
            </p>
          </div>
        )}
      </form>

      {/* Active search indicator */}
      {searchTerm && (
        <div className="absolute -bottom-6 left-4 text-sm text-primary-600 animate-fade-in">
          Searching for: <span className="font-semibold">"{searchTerm}"</span>
        </div>
      )}
    </div>
  );
};

export default TaskSearch;