import React, { useState } from 'react';
import { useAuth } from '../../context/useAuth.js';
import api from '../../services/api';

const ITSupportRequestForm = ({ formInfo }) => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({ issueType: 'software', description: '' });
    const [message, setMessage] = useState('');

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/api/forms/submit', { 
              formId: formInfo.form_id, 
              submissionData: { ...formData, employeeName: `${user.first_name} ${user.last_name}` } 
            });
            setMessage('IT support request submitted successfully!');
            setFormData({ issueType: 'software', description: '' });
        } catch (error) {
            setMessage('Error submitting request.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <input type="text" readOnly value={`${user.first_name} ${user.last_name}`} className="w-full p-2 bg-gray-100 border rounded-md" />
            <select name="issueType" value={formData.issueType} onChange={handleChange} className="w-full p-2 border rounded-md bg-white">
                <option value="software">Software Issue</option>
                <option value="hardware">Hardware Issue</option>
                <option value="network">Network Problem</option>
            </select>
            <textarea name="description" value={formData.description} onChange={handleChange} rows="5" placeholder="Please describe the issue in detail" required className="w-full p-2 border rounded-md"></textarea>
            <div className="text-right"><button type="submit" className="px-6 py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700">Submit Request</button></div>
            {message && <p className="text-center mt-4">{message}</p>}
        </form>
    );
};

export default ITSupportRequestForm;