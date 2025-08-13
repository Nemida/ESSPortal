import React from 'react';
import { Link } from 'react-router-dom';

const ServiceCard = ({ title, description, link }) => (
  <Link 
    to={link} 
    className="block p-6 bg-gray-50 rounded-lg border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
  >
    <h3 className="text-xl font-bold text-[#2c3e50]">{title}</h3>
    <p className="mt-2 text-gray-600">{description}</p>
  </Link>
);

const ServicesPage = () => {
  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-900 border-b pb-4">Employee Services</h1>
        <p className="mt-4 text-gray-600">
          Access all the digital services and portals available to you as an employee.
        </p>
      
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ServiceCard 
            title="Employee Forms"
            description="A centralized portal to find, fill, and submit all official DRDO forms, from leave requests to travel reimbursements."
            link="/forms"
          />
          <ServiceCard 
            title="My IT Assets"
            description="View and manage the software licenses and hardware assets that have been assigned to you by the IT department."
            link="/assets"
          />
          <ServiceCard 
            title="Grievance Portal"
            description="A secure and confidential system to report workplace concerns directly to the appropriate management level."
            link="/grievance"
          />
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;