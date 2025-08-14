import React, { useState } from 'react';
import { useAuth } from '../../context/useAuth.js';
import api from '../../services/api';

const TravelReimbursementForm = ({ formInfo }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ tripPurpose: '', travelDate: '', totalAmount: '', details: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/forms/submit', { 
        formId: formInfo.form_id, 
        submissionData: { ...formData, employeeName: `${user.first_name} ${user.last_name}` } 
      });
      setMessage('Reimbursement form submitted successfully!');
      setFormData({ tripPurpose: '', travelDate: '', totalAmount: '', details: '' });
    } catch (error) {
      setMessage('Error submitting form.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <input type="text" readOnly value={`${user.first_name} ${user.last_name}`} className="w-full p-2 bg-gray-100 border rounded-md" />
      <input type="text" name="tripPurpose" value={formData.tripPurpose} onChange={handleChange} placeholder="Purpose of Trip" required className="w-full p-2 border rounded-md" />
      <input type="date" name="travelDate" value={formData.travelDate} onChange={handleChange} required className="w-full p-2 border rounded-md" />
      <input type="number" name="totalAmount" value={formData.totalAmount} onChange={handleChange} placeholder="Total Amount (INR)" required className="w-full p-2 border rounded-md" />
      <textarea name="details" value={formData.details} onChange={handleChange} rows="4" placeholder="Details of expenses (attach receipts separately)" required className="w-full p-2 border rounded-md"></textarea>
      <div className="text-right"><button type="submit" className="px-6 py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700">Submit</button></div>
      {message && <p className="text-center mt-4">{message}</p>}
    </form>
  );
};

export default TravelReimbursementForm;