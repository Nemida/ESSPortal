import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import DrdoLogo from '../assets/drdo-official-logo.png'; 
import { useAuth } from '../context/useAuth.js';

const Navbar = () => {

  const { isAuthenticated, user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const navLinkClasses = ({ isActive }) =>
    `text-gray-200 hover:bg-gray-700 hover:text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-300 ease-in-out ${
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

  return (
    <header className="bg-white shadow-md sticky top-0 z-50 main-navbar">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center py-3">
          <Link to="/" className="flex items-center">
            <img src={DrdoLogo} alt="logo" className="h-20 w-20 mr-4" />
            <div>
              <h1 className="text-2xl font-semibold text-gray-800 leading-tight">
                Defence Research and Development Organisation
              </h1>
              <p className="text-md text-gray-600">Scientific Analysis Group</p>
            </div>
          </Link>
        </div>
      </div>


      <nav className="bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12">

            <div className="flex space-x-4">
              <NavLink to="/" className={navLinkClasses} end>Home</NavLink>
              <NavLink to="/about" className={navLinkClasses}>About Us</NavLink>
              <NavLink to="/research" className={navLinkClasses}>Research</NavLink>
              <NavLink to="/publications" className={navLinkClasses}>Publications</NavLink>
              <NavLink to="/events" className={navLinkClasses}>Events</NavLink>
              <NavLink to="/services" className={navLinkClasses}>Services</NavLink>
              <NavLink to="/contact" className={navLinkClasses}>Directory</NavLink>
            </div>


            <div className="relative" ref={dropdownRef}>
              {isAuthenticated ? (
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center text-gray-200 hover:text-white focus:outline-none cursor-pointer"
                >
                  <FaUserCircle className="text-2xl mr-1" />
                  <span className="text-sm font-medium">{user?.first_name}</span>
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
                <Link to="/admin/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Admin Dashboard</Link>
                  <Link to="/admin/users" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">User Management</Link>
                    <Link to="/admin/grievances" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Grievance Inbox</Link>
                    <Link to="/admin/submissions" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Form Submissions</Link>
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
      </nav>
    </header>
  );
};

export default Navbar;
