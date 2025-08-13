import React, { useState, useEffect } from 'react';
import api from '../services/api';

const AdminGrievancesPage = () => {
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGrievances = async () => {
      try {
        const res = await api.get('/api/grievances');
        setGrievances(res.data);
      } catch (error) {
        console.error("Failed to fetch grievances", error);
        alert('Could not fetch grievances. Ensure you have admin privileges.');
      } finally {
        setLoading(false);
      }
    };
    fetchGrievances();
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-[#2c3e50] border-b pb-4">Grievance Inbox</h1>
        <p className="mt-4 text-gray-600">Review all confidential grievances submitted by employees.</p>
        
        <div className="mt-8 space-y-6">
          {loading ? (
            <p>Loading grievances...</p>
          ) : grievances.length > 0 ? (
            grievances.map(item => (
              <div key={item.grievance_id} className="p-5 border rounded-lg bg-gray-50 shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-xl font-semibold text-gray-800">{item.grievance_subject}</h2>
                  <span className="text-sm text-gray-500">
                    Received: {new Date(item.submitted_at).toLocaleString()}
                  </span>
                </div>
                <p className="text-gray-700 whitespace-pre-wrap">{item.grievance_details}</p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-10">No grievances have been submitted.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminGrievancesPage;