import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-300">
        <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center items-center">

            <div className="text-center">
                <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
                <ul className="space-y-2">
                <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link to="/research" className="hover:text-white transition-colors">Research Areas</Link></li>
                <li><Link to="/publications" className="hover:text-white transition-colors">Publications</Link></li>
                </ul>
            </div>
            

            <div className="text-center">
                <h3 className="text-lg font-semibold text-white mb-4">Resources</h3>
                <ul className="space-y-2">
                <li><Link to="/grievance" className="hover:text-white transition-colors">Grievance Portal</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">RTI</a></li>
                </ul>
            </div>

            <div className="text-center">
                <h3 className="text-lg font-semibold text-white mb-4">Contact</h3>
                <p>Metcalfe House, Civil Lines</p>
                <p>Delhi - 110054</p>
                <p>011-23819828</p>
            </div>
            </div>
            
 
            <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400 text-sm">
            <p>Copyright © {new Date().getFullYear()}, DRDO, Ministry of Defence, Government of India</p>
            </div>
        </div>
    </footer>

  );
};

export default Footer;