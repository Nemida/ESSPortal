import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/useAuth.js';
import api from '../services/api';

const ProfilePage = () => {
  const { user, setUser } = useAuth(); 
  const [formData, setFormData] = useState({ first_name: '', last_name: '', job_title: '', department: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name,
        last_name: user.last_name,
        job_title: user.job_title || '',
        department: user.department || ''
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await api.put(`/api/users/${user.user_id}`, formData);
      setUser(res.data); 
      setMessage('Profile updated successfully!');
    } catch (error) {
      setMessage('Error: Could not update profile.');
    }
  };

  if (!user) {
    return <div className="p-8 text-center">Loading profile...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-[#2c3e50] border-b pb-4">My Profile</h1>
        <p className="mt-4 text-gray-600">Update your job title and department information. Other details are managed by HR.</p>
        <form onSubmit={handleUpdateProfile} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-500">First Name</label>
            <input type="text" name="first_name" value={formData.first_name} onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Last Name</label>
            <input type="text" name="last_name" value={formData.last_name} onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Email Address (Read-only)</label>
            <input type="email" value={user.email} readOnly className="mt-1 w-full p-2 border rounded-md bg-gray-100" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Job Title</label>
            <input type="text" name="job_title" value={formData.job_title} onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Department</label>
            <input type="text" name="department" value={formData.department} onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-md" />
          </div>
          <div className="text-right">
            <button type="submit" className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700">
              Save Changes
            </button>
          </div>
          {message && <p className="text-center mt-4">{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;