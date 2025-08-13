import React, { useState } from 'react';
import { useAuth } from '../../context/useAuth.js';
import api from '../../services/api';

const TravelReimbursementForm = ({ formId }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    tripPurpose: '',
    travelDate: '',
    totalAmount: '',
    details: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/forms/submit', {
        formId,
        submissionData: {
          ...formData,
          employeeName: `${user.first_name} ${user.last_name}`
        }
      });
      setMessage('Reimbursement form submitted successfully!');
      setFormData({ tripPurpose: '', travelDate: '', totalAmount: '', details: '' });
    } catch (error) {
      setMessage('Error submitting form.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium">Employee Name</label>
          <input
            type="text"
            readOnly
            value={`${user.first_name} ${user.last_name}`}
            className="mt-1 block w-full p-2 bg-gray-100 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Department</label>
          <input
            type="text"
            readOnly
            value={user.department || 'N/A'}
            className="mt-1 block w-full p-2 bg-gray-100 border border-gray-300 rounded-md"
          />
        </div>
      </div>

      <div>
        <label htmlFor="tripPurpose" className="block text-sm font-medium">Purpose of Trip</label>
        <input
          type="text"
          name="tripPurpose"
          value={formData.tripPurpose}
          onChange={handleChange}
          required
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="travelDate" className="block text-sm font-medium">Date of Travel</label>
          <input
            type="date"
            name="travelDate"
            value={formData.travelDate}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label htmlFor="totalAmount" className="block text-sm font-medium">Total Amount (INR)</label>
          <input
            type="number"
            name="totalAmount"
            value={formData.totalAmount}
            onChange={handleChange}
            placeholder="e.g., 5000"
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>

      <div>
        <label htmlFor="details" className="block text-sm font-medium">Details of Expenses</label>
        <textarea
          name="details"
          value={formData.details}
          onChange={handleChange}
          rows="4"
          placeholder="Attach all original receipts and boarding passes separately."
          required
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
        ></textarea>
      </div>

      <div className="text-right">
        <button
          type="submit"
          className="px-6 py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
        >
          Submit
        </button>
      </div>

      {message && <p className="text-center mt-4">{message}</p>}
    </form>
  );
};

export default TravelReimbursementForm;
