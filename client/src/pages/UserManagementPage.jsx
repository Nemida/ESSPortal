import React, { useState, useEffect } from 'react';
import api from '../services/api';

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newUser, setNewUser] = useState({ first_name: '', last_name: '', email: '', password: '', role: 'employee', job_title: '', department: '' });

  const fetchUsers = async () => {
    try {
      const res = await api.get('/api/users');
      setUsers(res.data);
    } catch (error) {
      console.error("Failed to fetch users", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleInputChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/users', newUser);
      setIsAdding(false);
      setNewUser({ first_name: '', last_name: '', email: '', password: '', role: 'employee', job_title: '', department: '' });
      fetchUsers();
    } catch (error) {
      alert('Error: Could not add user.');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/api/users/${userId}`);
        fetchUsers();
      } catch (error) {
        alert('Error: Could not delete user.');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <section className="bg-white p-8 rounded-lg shadow-md">
        <div className="flex justify-between items-center border-b pb-4">
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <button onClick={() => setIsAdding(!isAdding)} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
            {isAdding ? 'Cancel' : 'Add New User'}
          </button>
        </div>

        {isAdding && (
          <div className="mt-8 bg-gray-50 p-6 rounded-lg border">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">New User Form</h2>
            <form onSubmit={handleAddUser} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" name="first_name" value={newUser.first_name} onChange={handleInputChange} placeholder="First Name" required className="p-2 border rounded"/>
              <input type="text" name="last_name" value={newUser.last_name} onChange={handleInputChange} placeholder="Last Name" required className="p-2 border rounded"/>
              <input type="email" name="email" value={newUser.email} onChange={handleInputChange} placeholder="Email" required className="p-2 border rounded"/>
              <input type="password" name="password" value={newUser.password} onChange={handleInputChange} placeholder="Password" required className="p-2 border rounded"/>
              <input type="text" name="job_title" value={newUser.job_title} onChange={handleInputChange} placeholder="Job Title" className="p-2 border rounded"/>
              <input type="text" name="department" value={newUser.department} onChange={handleInputChange} placeholder="Department" className="p-2 border rounded"/>
              <select name="role" value={newUser.role} onChange={handleInputChange} className="p-2 border rounded bg-white">
                <option value="employee">Employee</option>
                <option value="admin">Admin</option>
              </select>
              <button type="submit" className="md:col-span-2 bg-green-600 text-white p-2 rounded hover:bg-green-700">Create User</button>
            </form>
          </div>
        )}

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="px-6 py-3 text-left font-semibold">Name</th>
                <th className="px-6 py-3 text-left font-semibold">Email</th>
                <th className="px-6 py-3 text-left font-semibold">Role</th>
                <th className="px-6 py-3 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map(user => (
                <tr key={user.user_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{user.first_name} {user.last_name}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4 capitalize">{user.role}</td>
                  <td className="px-6 py-4">
                    <button onClick={() => handleDeleteUser(user.user_id)} className="text-red-600 hover:underline font-semibold">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default UserManagementPage;