import React, { useState } from 'react';
import { useAuth } from '../../context/useAuth.js';
import api from '../../services/api';

const LeaveApplicationForm = ({ formId }) => {
  const { user } = useAuth();
  const [leaveType, setLeaveType] = useState('annual');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage('');

    const submissionData = {
      leaveType,
      startDate,
      endDate,
      reason,
      employeeInfo: { 
        name: `${user.first_name} ${user.last_name}`,
        department: user.department
      }
    };
    
    try {
      await api.post('/api/forms/submit', { formId, submissionData });
      setStatusMessage('Leave application submitted successfully!');
      // Optionally reset the form
      setLeaveType('annual');
      setStartDate('');
      setEndDate('');
      setReason('');
    } catch (err) {
      setStatusMessage('Error submitting form. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="p-8 bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-center border-b pb-4 mb-6">Leave Application Form</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Auto-filled User Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Employee Name</label>
            <input type="text" readOnly value={`${user.first_name} ${user.last_name}`} className="mt-1 block w-full bg-gray-100 border-gray-300 rounded-md shadow-sm p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Department</label>
            <input type="text" readOnly value={user.department || 'N/A'} className="mt-1 block w-full bg-gray-100 border-gray-300 rounded-md shadow-sm p-2" />
          </div>
        </div>
        

        <div>
          <label htmlFor="leaveType" className="block text-sm font-medium text-gray-700">Type of Leave</label>
          <select id="leaveType" value={leaveType} onChange={e => setLeaveType(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500">
            <option value="annual">Annual Leave</option>
            <option value="sick">Sick Leave</option>
            <option value="casual">Casual Leave</option>
          </select>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date</label>
            <input type="date" id="startDate" value={startDate} onChange={e => setStartDate(e.target.value)} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2" />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date</label>
            <input type="date" id="endDate" value={endDate} onChange={e => setEndDate(e.target.value)} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2" />
          </div>
        </div>
        
        <div>
          <label htmlFor="reason" className="block text-sm font-medium text-gray-700">Reason for Leave</label>
          <textarea id="reason" value={reason} onChange={e => setReason(e.target.value)} rows="4" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"></textarea>
        </div>

        <div className="text-right">
          <button type="submit" className="px-6 py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
            Submit Application
          </button>
        </div>
        
        {statusMessage && <p className="mt-4 text-center text-sm">{statusMessage}</p>}
      </form>
    </div>
  );
};

export default LeaveApplicationForm;