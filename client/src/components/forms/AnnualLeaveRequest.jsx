import React, { useState } from 'react';
import { useAuth } from '../../context/useAuth.js';
import api from '../../services/api';
import DrdoLogo from '../../assets/drdo-official-logo.png';

const AnnualLeaveRequest = ({ formInfo }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    leaveType: 'Annual Leave',
    startDate: '',
    endDate: '',
    totalDays: 0,
    reason: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      if (name === 'startDate' || name === 'endDate') {
        const start = new Date(newData.startDate);
        const end = new Date(newData.endDate);
        if (newData.startDate && newData.endDate && start <= end) {
          const diffTime = Math.abs(end - start);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
          newData.totalDays = diffDays;
        } else {
          newData.totalDays = 0;
        }
      }
      return newData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/forms/submit', {
        formId: formInfo.form_id,
        submissionData: { ...formData, employeeName: `${user.first_name} ${user.last_name}` }
      });
      setMessage('Leave application submitted successfully!');
      setFormData({ leaveType: 'Annual Leave', startDate: '', endDate: '', reason: '', totalDays: 0 });
    } catch (error) {
      setMessage('Error submitting form.');
    }
  };

  const handlePrint = () => window.print();

  return (
    <div id="printable-form" className="bg-white p-8 rounded-lg shadow-lg font-serif">
      <div className="flex items-start justify-between border-b pb-4 mb-6">
        <div className="flex items-center">
          <img src={DrdoLogo} alt="DRDO Logo" className="h-16 w-16 mr-4"/>
          <div>
            <h2 className="text-xl font-bold text-black">Defence R&D Organisation</h2>
            <p className="text-sm text-gray-600">Ministry of Defence</p>
          </div>
        </div>
        <div className="text-right">
          <h3 className="text-lg font-bold text-gray-800">{formInfo.title}</h3>
          <p className="text-sm text-gray-500">Version: {formInfo.version}</p>
        </div>
      </div>
      
      <section className="mb-6">
        <h3 className="font-semibold text-lg mb-2">Employee Details</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><strong>Name:</strong> {user.first_name} {user.last_name}</div>
          <div><strong>Department:</strong> {user.department || 'N/A'}</div>
          <div><strong>Job Title:</strong> {user.job_title || 'N/A'}</div>
          <div><strong>Email:</strong> {user.email}</div>
        </div>
      </section>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <section>
          <h3 className="font-semibold text-lg mb-2">Leave Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div><label className="block text-sm font-medium">Start Date</label><input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required className="mt-1 w-full p-2 border rounded-md"/></div>
            <div><label className="block text-sm font-medium">End Date</label><input type="date" name="endDate" value={formData.endDate} onChange={handleChange} required className="mt-1 w-full p-2 border rounded-md"/></div>
            <div><label className="block text-sm font-medium">Total Days</label><input type="text" readOnly value={formData.totalDays} className="mt-1 w-full p-2 bg-gray-100 border rounded-md"/></div>
          </div>
          <div className="mt-4"><label className="block text-sm font-medium">Reason for Leave</label><textarea name="reason" value={formData.reason} onChange={handleChange} rows="3" required className="mt-1 w-full p-2 border rounded-md"></textarea></div>
        </section>
        
        <div className="flex justify-end gap-4 pt-4 border-t no-print">
          <button type="button" onClick={handlePrint} className="px-6 py-2 font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">Print Form</button>
          <button type="submit" className="px-6 py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700">Submit Request</button>
        </div>
        {message && <p className="text-center mt-4 no-print">{message}</p>}
      </form>
    </div>
  );
};

export default AnnualLeaveRequest;