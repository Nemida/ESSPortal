import React, { useState, useEffect } from 'react';
import api from '../services/api';

const AdminSubmissionsPage = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await api.get('/api/forms/submissions');
        setSubmissions(res.data);
      } catch (error) { console.error("Failed to fetch submissions", error); }
      finally { setLoading(false); }
    };
    fetchSubmissions();
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 font-serif">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-[#2c3e50] border-b pb-4">Form Submissions Inbox</h1>
        <p className="mt-4 text-gray-600">Review all forms submitted by employees.</p>
        <div className="mt-8 space-y-6">
          {loading ? <p>Loading submissions...</p> : submissions.map(sub => (
            <div key={sub.submission_id} className="p-5 border rounded-lg bg-gray-50 shadow-sm">
              <div className="flex justify-between items-center mb-3"><h2 className="text-xl font-bold text-gray-800">{sub.form_title}</h2><span className="text-sm font-semibold px-2 py-1 rounded-full bg-blue-100 text-blue-800 capitalize">{sub.status}</span></div>
              <p className="text-sm text-gray-500 mb-4">Submitted by <span className="font-semibold">{sub.first_name} {sub.last_name}</span> on {new Date(sub.submitted_at).toLocaleString()}</p>
              <div className="bg-white p-4 border rounded-md text-sm"><h4 className="font-semibold mb-2">Submitted Details:</h4><pre className="whitespace-pre-wrap font-sans">{JSON.stringify(sub.submission_data, null, 2)}</pre></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminSubmissionsPage;