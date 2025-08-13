import React from 'react';


import drdoHeadquarters from '../assets/drdo.png';
import directorImg from '../assets/director.jpg';
import sagDirectorImg from '../assets/sagdirector.png';

const AboutUsPage = () => {
  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <section className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-900 border-b pb-4">About Us</h1>
        <p className="mt-4 text-gray-700">The Defence Research and Development Organisation (DRDO) is India's premier agency dedicated to military research and development. Established in 1958, we operate at the forefront of cutting-edge defense technologies to empower our armed forces with indigenously developed systems.</p>
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="text-gray-700 space-y-6">
            <div>
              <h2 className="text-2xl font-semibold">Our Mission</h2>
              <p>To design, develop and lead to production state-of-the-art sensors, weapon systems, platforms and allied equipment for our Defence Services.</p>
            </div>
            <div>
              <h2 className="text-2xl font-semibold">Our History</h2>
              <p>Established in 1958, DRDO is India's premier agency for military research and development. With over 50 laboratories across India, we've been at the forefront of defense technology development.</p>
            </div>
            <div>
              <h2 className="text-2xl font-semibold">Key Achievements</h2>
              <ul className="list-disc list-inside ml-4">
                <li>Development of missile systems (Agni, Prithvi, Akash)</li>
                <li>Light Combat Aircraft (Tejas)</li>
                <li>Main Battle Tank (Arjun)</li>
                <li>Electronic warfare systems</li>
              </ul>
            </div>
          </div>
          <div>
            <img src={drdoHeadquarters} alt="DRDO Headquarters" className="rounded-lg shadow-lg w-full h-auto" />
          </div>
        </div>
      </section>


      <section className="mt-12 bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center text-gray-900">Our Leadership</h2>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-10 justify-items-center">

          <div className="text-center">
            <img src={directorImg} alt="DRDO Director" className="w-48 h-48 mx-auto rounded-full object-cover shadow-md" />
            <h3 className="mt-4 text-xl font-semibold">Dr. Samir V. Kamat</h3>
            <p className="text-gray-600">Chairman, DRDO</p>
          </div>

          <div className="text-center">
            <img src={sagDirectorImg} alt="SAG Director" className="w-48 h-48 mx-auto rounded-full object-cover shadow-md" />
            <h3 className="mt-4 text-xl font-semibold">Dr. N. Rajesh Pillai</h3>
            <p className="text-gray-600">Director, SAG</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUsPage;