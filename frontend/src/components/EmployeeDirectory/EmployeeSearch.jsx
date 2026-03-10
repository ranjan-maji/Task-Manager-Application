import React, { useState, useEffect, useRef } from 'react';
import { FaSearch, FaTimes, FaFilter, FaEnvelope } from 'react-icons/fa';

const DEPARTMENTS = [
  'All',
  'Engineering',
  'Marketing',
  'Sales',
  'Human Resources',
  'Finance',
  'Operations',
  'Customer Support',
  'Product',
  'Design'
];

const EmployeeSearch = ({ onSearch, onFilter, currentFilter }) => {
  const [searchEmail, setSearchEmail] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch(searchEmail);
  };

  const handleSearchChange = (e) => {
    setSearchEmail(e.target.value);
    if (e.target.value === '') {
      onSearch('');
    }
  };

  const clearSearch = () => {
    setSearchEmail('');
    onSearch('');
    inputRef.current?.focus();
  };

  const getDepartmentColor = (dept) => {
    const colors = {
      'Engineering': 'blue',
      'Marketing': 'purple',
      'Sales': 'green',
      'Human Resources': 'pink',
      'Finance': 'yellow',
      'Operations': 'orange',
      'Customer Support': 'teal',
      'Product': 'indigo',
      'Design': 'rose'
    };
    return colors[dept] || 'gray';
  };

  return (
    <div className="relative group animate-slide-up">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-primary-600/5 
                    rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
      </div>

      <div className="relative space-y-4">
        {/* Search Form */}
        <form onSubmit={handleSearchSubmit} className="relative">
          <div className="relative">
            {/* Search icon */}
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <FaEnvelope className={`text-gray-400 transition-all duration-300 
                                    ${isExpanded ? 'text-primary-500 scale-110' : ''}`} />
            </div>

            {/* Input field */}
            <input
              ref={inputRef}
              type="email"
              value={searchEmail}
              onChange={handleSearchChange}
              onFocus={() => setIsExpanded(true)}
              onBlur={() => setIsExpanded(false)}
              placeholder="Search by email address..."
              className="w-full pl-12 pr-24 py-4 bg-white border-2 border-gray-200 rounded-2xl
                       focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100
                       transition-all duration-300 text-gray-700 placeholder-gray-400
                       hover:border-primary-300"
            />

            {/* Action buttons */}
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
              {searchEmail && (
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

          {/* Search tips */}
          {isExpanded && (
            <div className="absolute left-0 right-0 mt-2 p-3 bg-white rounded-xl shadow-xl 
                          border border-gray-100 animate-slide-up z-20">
              <p className="text-xs text-gray-500 flex items-center space-x-2">
                <FaEnvelope className="text-primary-500" />
                <span>💡 Tip: Enter full or partial email address to search</span>
              </p>
            </div>
          )}
        </form>

        {/* Filter Section */}
        <div className="relative">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full p-3 bg-white border-2 border-gray-200 rounded-xl
                     hover:border-primary-300 transition-all duration-300
                     flex items-center justify-between group"
          >
            <div className="flex items-center space-x-2">
              <FaFilter className={`text-gray-400 transition-colors duration-300 
                                  ${showFilters ? 'text-primary-500' : 'group-hover:text-primary-500'}`} />
              <span className="text-sm font-medium text-gray-700">Filter by Department</span>
            </div>
            {currentFilter && (
              <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-lg text-xs font-medium">
                Active: {currentFilter}
              </span>
            )}
          </button>

          {/* Filter Options */}
          {showFilters && (
            <div className="absolute left-0 right-0 mt-2 p-4 bg-white rounded-xl shadow-xl 
                          border border-gray-100 animate-slide-up z-20">
              <div className="grid grid-cols-2 gap-2">
                {DEPARTMENTS.map(dept => {
                  const color = getDepartmentColor(dept);
                  const isActive = currentFilter === dept || (dept === 'All' && !currentFilter);
                  
                  return (
                    <button
                      key={dept}
                      onClick={() => {
                        onFilter(dept === 'All' ? '' : dept);
                        setShowFilters(false);
                      }}
                      className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300
                               transform hover:scale-105 flex items-center justify-center space-x-1
                               ${isActive 
                                 ? `bg-${color}-500 text-white shadow-lg` 
                                 : `bg-${color}-50 text-${color}-700 hover:bg-${color}-100 border border-${color}-200`
                               }`}
                    >
                      <span>{dept}</span>
                      {isActive && <FaFilter className="text-xs" />}
                    </button>
                  );
                })}
              </div>

              {/* Active filters */}
              {currentFilter && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Active filter:</span>
                    <button
                      onClick={() => {
                        onFilter('');
                        setShowFilters(false);
                      }}
                      className="text-xs text-red-500 hover:text-red-600 font-medium
                               flex items-center space-x-1"
                    >
                      <FaTimes />
                      <span>Clear filter</span>
                    </button>
                  </div>
                  <div className="mt-2">
                    <span className={`inline-flex items-center space-x-1 px-3 py-1 
                                    bg-${getDepartmentColor(currentFilter)}-100 
                                    text-${getDepartmentColor(currentFilter)}-700 
                                    rounded-lg text-sm`}>
                      <FaFilter className="text-xs" />
                      <span>{currentFilter}</span>
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Search results info */}
        {searchEmail && (
          <div className="text-sm text-primary-600 animate-fade-in flex items-center space-x-2">
            <FaEnvelope className="text-xs" />
            <span>Searching for: <span className="font-semibold">"{searchEmail}"</span></span>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeSearch;