import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaTasks, FaUsers, FaBars, FaTimes, FaMoon, FaSun } from 'react-icons/fa';

const Navbar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Initialize dark mode from localStorage or system preference
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Apply theme changes and save to localStorage
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ${
      scrolled 
        ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg shadow-lg py-2' 
        : 'bg-gradient-to-r from-primary-600 to-primary-800 py-4'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo with animation */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className={`w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center
                          transform group-hover:rotate-12 transition-all duration-500
                          ${scrolled ? 'text-primary-600 dark:text-primary-400' : 'text-white'}`}>
              <FaTasks className="text-xl floating" />
            </div>
            <span className={`text-2xl font-bold tracking-tight transition-colors duration-300
                           ${scrolled ? 'text-gray-800 dark:text-white' : 'text-white'}`}>
              Task<span className="font-light">Flow</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-2">
            <Link
              to="/tasks"
              className={`relative px-6 py-3 rounded-xl font-medium transition-all duration-300
                        group overflow-hidden ${
                isActive('/tasks')
                  ? scrolled 
                    ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30' 
                    : 'text-white bg-white/20'
                  : scrolled
                    ? 'text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <span className="relative z-10 flex items-center space-x-2">
                <FaTasks className="text-lg" />
                <span>Tasks</span>
              </span>
              {isActive('/tasks') && (
                <span className="absolute inset-0 animate-pulse-slow bg-primary-500/10 dark:bg-primary-400/10"></span>
              )}
            </Link>

            <Link
              to="/employees"
              className={`relative px-6 py-3 rounded-xl font-medium transition-all duration-300
                        group overflow-hidden ${
                isActive('/employees')
                  ? scrolled 
                    ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30' 
                    : 'text-white bg-white/20'
                  : scrolled
                    ? 'text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <span className="relative z-10 flex items-center space-x-2">
                <FaUsers className="text-lg" />
                <span>Employees</span>
              </span>
              {isActive('/employees') && (
                <span className="absolute inset-0 animate-pulse-slow bg-primary-500/10 dark:bg-primary-400/10"></span>
              )}
            </Link>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`ml-4 p-3 rounded-xl transition-all duration-300 transform hover:scale-110
                        ${scrolled 
                          ? 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:text-primary-600 dark:hover:text-primary-400' 
                          : 'bg-white/10 text-white hover:bg-white/20'
                        }`}
              aria-label="Toggle theme"
            >
              {isDark ? <FaSun className="text-xl" /> : <FaMoon className="text-xl" />}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden p-3 rounded-xl transition-all duration-300
                      ${scrolled 
                        ? 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300' 
                        : 'bg-white/10 text-white'
                      }`}
            aria-label="Toggle menu"
          >
            {isOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-500 overflow-hidden ${
          isOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
        }`}>
          <div className={`rounded-2xl p-4 space-y-2 ${
            scrolled 
              ? 'bg-white dark:bg-gray-800 shadow-xl' 
              : 'bg-white/10 backdrop-blur'
          }`}>
            <Link
              to="/tasks"
              onClick={() => setIsOpen(false)}
              className={`flex items-center space-x-3 p-4 rounded-xl transition-all duration-300
                        ${isActive('/tasks')
                          ? 'bg-primary-500 text-white'
                          : scrolled
                            ? 'text-gray-600 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:text-primary-600 dark:hover:text-primary-400'
                            : 'text-white hover:bg-white/20'
                        }`}
            >
              <FaTasks className="text-lg" />
              <span className="font-medium">Tasks</span>
            </Link>

            <Link
              to="/employees"
              onClick={() => setIsOpen(false)}
              className={`flex items-center space-x-3 p-4 rounded-xl transition-all duration-300
                        ${isActive('/employees')
                          ? 'bg-primary-500 text-white'
                          : scrolled
                            ? 'text-gray-600 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:text-primary-600 dark:hover:text-primary-400'
                            : 'text-white hover:bg-white/20'
                        }`}
            >
              <FaUsers className="text-lg" />
              <span className="font-medium">Employees</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;