import React, { useState } from 'react';
import api from '../services/api';

const GrievancePage = () => {
  const [subject, setSubject] = useState('');
  const [details, setDetails] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      await api.post('/api/grievances/submit', { subject, details });
      setMessage('Your grievance has been submitted successfully and confidentially.');
      setSubject('');
      setDetails('');
    } catch (err) {
      setError('Failed to submit grievance. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-[#2c3e50] border-b pb-4">Submit a Grievance</h1>
        <p className="mt-4 text-gray-600">
          Your submission is secure and will be routed to the appropriate manager. Your identity will be kept confidential throughout the process.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
            <input
              type="text"
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="A brief summary of your concern"
            />
          </div>
          <div>
            <label htmlFor="details" className="block text-sm font-medium text-gray-700">Details of Grievance</label>
            <textarea
              id="details"
              rows="8"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              required
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Please provide all relevant details, including dates, times, and persons involved."
            ></textarea>
          </div>
          <div className="text-right">
            <button type="submit" className="px-6 py-2 font-semibold text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors">
              Submit Confidentially
            </button>
          </div>
          {message && <p className="text-center text-green-600 font-semibold">{message}</p>}
          {error && <p className="text-center text-red-600 font-semibold">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default GrievancePage;