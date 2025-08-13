import React from 'react';


const PhoneIcon = () => <svg className="w-5 h-5 mr-2 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg>;
const ClockIcon = () => <svg className="w-5 h-5 mr-2 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.414L11 10.586V6z" clipRule="evenodd" /></svg>;


const ContactCard = ({ title, person, phone, hours }) => (
  <div className="bg-gray-50 p-6 rounded-lg border shadow-sm">
    <h3 className="text-xl font-bold text-[#2c3e50]">{title}</h3>
    {person && <p className="text-gray-700 mt-1">{person}</p>}
    <div className="mt-4 space-y-2">
      <div className="flex items-center"><PhoneIcon /><span className="text-gray-800">{phone}</span></div>
      <div className="flex items-center"><ClockIcon /><span className="text-gray-800">{hours}</span></div>
    </div>
  </div>
);

const ContactUsPage = () => {
  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 font-serif">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-[#2c3e50] border-b pb-4">Internal Directory</h1>
        <p className="mt-4 text-gray-600">Find contact information for key personnel and departments within the organization.</p>


        <section className="mt-8">
          <h2 className="text-2xl font-semibold text-[#2c3e50] mb-6">Key Contacts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ContactCard 
              title="IT Help Desk"
              person="Mr. Sharma (Lead)"
              phone="Extension: 4321"
              hours="09:00 - 17:00 (Mon-Fri)"
            />
            <ContactCard 
              title="HR Department"
              person="Mrs. Gupta (Manager)"
              phone="Extension: 5678"
              hours="09:30 - 17:00 (Mon-Fri)"
            />
            <ContactCard 
              title="Administration"
              person="Col. Singh (Admin Officer)"
              phone="Extension: 1122"
              hours="09:00 - 17:30 (Mon-Fri)"
            />
          </div>
        </section>

  
        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-[#2c3e50] mb-6">Department Directory</h2>
          <div className="overflow-x-auto border rounded-lg">
            <table className="min-w-full">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold">Department / Lab</th>
                  <th className="px-6 py-3 text-left font-semibold">Landline Extension</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-800">Aeronautics Division</td>
                  <td className="px-6 py-4 text-gray-600">2201, 2205</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-800">Electronics Lab</td>
                  <td className="px-6 py-4 text-gray-600">3450, 3451</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-800">Finance & Accounts</td>
                  <td className="px-6 py-4 text-gray-600">5510, 5512</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-800">Security Office</td>
                  <td className="px-6 py-4 text-gray-600">100 (Emergency)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ContactUsPage;