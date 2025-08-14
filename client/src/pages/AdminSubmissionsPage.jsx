import React, { useState, useEffect } from 'react';
import api from '../services/api';
import SubmissionDataViewer from '../components/SubmissionDataViewer';

const AdminSubmissionsPage = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await api.get('/api/forms/submissions');
        setSubmissions(res.data);
      } catch (error) {
        console.error("Failed to fetch submissions", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSubmissions();
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-[#2c3e50] border-b pb-4">Form Submissions Inbox</h1>
        <p className="mt-4 text-gray-600">Review all forms submitted by employees.</p>

        <div className="mt-8 space-y-6">
          {loading ? (
            <p className="text-center text-gray-500">Loading submissions...</p>
          ) : submissions.length > 0 ? (
            submissions.map(sub => (
              <div key={sub.submission_id} className="p-5 border rounded-lg bg-gray-50 shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-xl font-bold text-gray-800">{sub.form_title}</h2>
                  <span className="text-sm font-semibold px-2 py-1 rounded-full bg-blue-100 text-blue-800 capitalize">
                    {sub.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-4">
                  Submitted by <span className="font-semibold">{sub.first_name} {sub.last_name}</span> on {new Date(sub.submitted_at).toLocaleString()}
                </p>
                <div className="bg-white p-4 border rounded-md text-sm">
                  <h4 className="font-semibold mb-2 text-gray-700">Submitted Details:</h4>
                  <SubmissionDataViewer data={sub.submission_data} />
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-10">No forms have been submitted yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSubmissionsPage;