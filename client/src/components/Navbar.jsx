import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FaUserCircle, FaBars, FaTimes } from 'react-icons/fa';
import DrdoLogo from '../assets/drdo-official-logo.png'; 
import { useAuth } from '../context/useAuth.js';

const Navbar = () => {

  const { isAuthenticated, user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const navLinkClasses = ({ isActive }) =>
    `text-gray-200 hover:bg-gray-700 hover:text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-300 ease-in-out ${
      isActive ? 'bg-gray-900 text-white' : ''
    }`;

  const mobileNavLinkClasses = ({ isActive }) =>
    `block text-gray-200 hover:bg-gray-700 hover:text-white px-4 py-3 rounded-md text-base font-medium ${
      isActive ? 'bg-gray-900 text-white' : ''
    }`;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMobileNavClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50 main-navbar">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center py-3">
          <Link to="/" className="flex items-center">
            <img src={DrdoLogo} alt="logo" className="h-12 w-12 sm:h-16 sm:w-16 lg:h-20 lg:w-20 mr-2 sm:mr-4" />
            <div>
              <h1 className="text-sm sm:text-lg lg:text-2xl font-semibold text-gray-800 leading-tight">
                Defence Research and Development Organisation
              </h1>
              <p className="text-xs sm:text-sm lg:text-md text-gray-600">Scientific Analysis Group</p>
            </div>
          </Link>
        </div>
      </div>


      <nav className="bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12">
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-gray-200 hover:text-white focus:outline-none p-2"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
            </button>

            <div className="hidden lg:flex space-x-1 xl:space-x-4">
              <NavLink to="/" className={navLinkClasses} end>Home</NavLink>
              <NavLink to="/about" className={navLinkClasses}>About Us</NavLink>
              <NavLink to="/research" className={navLinkClasses}>Research</NavLink>
              <NavLink to="/publications" className={navLinkClasses}>Publications</NavLink>
              <NavLink to="/events" className={navLinkClasses}>Events</NavLink>
              <NavLink to="/services" className={navLinkClasses}>Services</NavLink>
              <NavLink to="/contact" className={navLinkClasses}>Directory</NavLink>
              <NavLink to="/ai-assistant" className={navLinkClasses}>AI Assistant</NavLink>
              <NavLink to="/chat" className={navLinkClasses}>Chat</NavLink>
            </div>


            <div className="relative" ref={dropdownRef}>
              {isAuthenticated ? (
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center text-gray-200 hover:text-white focus:outline-none cursor-pointer"
                >
                  <FaUserCircle className="text-2xl mr-1" />
                  <span className="text-sm font-medium hidden sm:inline">{user?.first_name}</span>
                </button>
              ) : (
                <Link
                  to="/login"
                  className="text-gray-200 hover:bg-gray-700 hover:text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
              )}


              {dropdownOpen && isAuthenticated && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50 animate-fadeIn">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Profile Details
                  </Link>
                  {user?.role === 'admin' && (
              <>
                <Link to="/admin/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={() => setDropdownOpen(false)}>Admin Dashboard</Link>
                  <Link to="/admin/users" className="block px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={() => setDropdownOpen(false)}>User Management</Link>
                    <Link to="/admin/grievances" className="block px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={() => setDropdownOpen(false)}>Grievance Inbox</Link>
                    <Link to="/admin/submissions" className="block px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={() => setDropdownOpen(false)}>Form Submissions</Link>
                   </>
            )}
                  <button
                    onClick={() => {
                      logout();
                      setDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {mobileMenuOpen && (
          <div className="lg:hidden bg-gray-800 border-t border-gray-700 pb-4">
            <div className="px-2 pt-2 space-y-1">
              <NavLink to="/" className={mobileNavLinkClasses} end onClick={handleMobileNavClick}>Home</NavLink>
              <NavLink to="/about" className={mobileNavLinkClasses} onClick={handleMobileNavClick}>About Us</NavLink>
              <NavLink to="/research" className={mobileNavLinkClasses} onClick={handleMobileNavClick}>Research</NavLink>
              <NavLink to="/publications" className={mobileNavLinkClasses} onClick={handleMobileNavClick}>Publications</NavLink>
              <NavLink to="/events" className={mobileNavLinkClasses} onClick={handleMobileNavClick}>Events</NavLink>
              <NavLink to="/services" className={mobileNavLinkClasses} onClick={handleMobileNavClick}>Services</NavLink>
              <NavLink to="/contact" className={mobileNavLinkClasses} onClick={handleMobileNavClick}>Directory</NavLink>
              <NavLink to="/ai-assistant" className={mobileNavLinkClasses} onClick={handleMobileNavClick}>AI Assistant</NavLink>
              <NavLink to="/chat" className={mobileNavLinkClasses} onClick={handleMobileNavClick}>💬 Team Chat</NavLink>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
