import React from 'react';
import { NavLink } from 'react-router-dom';
import DrdoLogo from '../assets/drdo-official-logo.png';
import { useAuth } from '../context/useAuth.js';


const Icon = ({ className }) => <span className={`w-6 h-6 ${className}`}></span>;

const Sidebar = () => {
  const { logout } = useAuth();

  const navLinkClasses = ({ isActive }) =>
    `flex items-center px-4 py-2.5 text-sm font-medium rounded-lg hover:bg-gray-700 ${
      isActive ? 'bg-gray-700 text-white' : 'text-gray-300'
    }`;

  return (
    <aside className="flex flex-col w-64 h-screen px-4 py-8 bg-gray-800 text-white">
      <div className="flex items-center justify-center mb-10">
        <img src={DrdoLogo} alt="DRDO Logo" className="w-16 h-16" />
        <h2 className="ml-3 text-xl font-bold">ESS Portal</h2>
      </div>
      <nav className="flex flex-col flex-grow space-y-2">
        <NavLink to="/dashboard" className={navLinkClasses}>
          <Icon className="bg-blue-400" /> 
          <span className="ml-4">Dashboard</span>
        </NavLink>
        <NavLink to="/forms" className={navLinkClasses}>
          <Icon className="bg-green-400" /> 
          <span className="ml-4">Employee Forms</span>
        </NavLink>
        <NavLink to="/assets" className={navLinkClasses}>
          <Icon className="bg-yellow-400" /> 
          <span className="ml-4">IT Assets</span>
        </NavLink>
        <NavLink to="/grievance" className={navLinkClasses}>
          <Icon className="bg-red-400" /> 
          <span className="ml-4">Grievance</span>
        </NavLink>

      </nav>
      <div className="pt-4 mt-auto border-t border-gray-700">
        <button
          onClick={logout}
          className="flex items-center w-full px-4 py-2.5 text-sm font-medium text-gray-300 rounded-lg hover:bg-gray-700"
        >
          <Icon className="bg-purple-400" />
          <span className="ml-4">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;