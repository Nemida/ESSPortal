import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const AdminDashboardPage = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState({ date: '', title: '', description: '' });
  const [images, setImages] = useState([]);
  const [newImage, setNewImage] = useState({ imageUrl: '', altText: '' });

  const fetchAnnouncements = async () => {
    const res = await api.get('/api/announcements');
    setAnnouncements(res.data);
  };

  const fetchImages = async () => {
    const res = await api.get('/api/key-moments');
    setImages(res.data);
  };

  useEffect(() => {
    fetchAnnouncements();
    fetchImages();
  }, []);

  const handleAnnouncementInputChange = (e) => setNewAnnouncement({ ...newAnnouncement, [e.target.name]: e.target.value });
  const handleImageInputChange = (e) => setNewImage({ ...newImage, [e.target.name]: e.target.value });

  const handleAddAnnouncement = async (e) => {
    e.preventDefault();
    await api.post('/api/announcements', newAnnouncement);
    setNewAnnouncement({ date: '', title: '', description: '' });
    fetchAnnouncements();
  };

  const handleDeleteAnnouncement = async (id) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      await api.delete(`/api/announcements/${id}`);
      fetchAnnouncements();
    }
  };
  
  const handleAddImage = async (e) => {
    e.preventDefault();
    await api.post('/api/key-moments', newImage);
    setNewImage({ imageUrl: '', altText: '' });
    fetchImages();
  };

  const handleDeleteImage = async (id) => {
    if (window.confirm('Are you sure you want to remove this image?')) {
      await api.delete(`/api/key-moments/${id}`);
      fetchImages();
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-[#2c3e50] border-b pb-4">Admin Dashboard</h1>
        
        <section className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/admin/users" className="p-6 bg-gray-50 rounded-lg border text-center hover:shadow-md transition"><h3 className="font-bold text-lg text-gray-800">User Management</h3></Link>
          <Link to="/admin/assets" className="p-6 bg-gray-50 rounded-lg border text-center hover:shadow-md transition"><h3 className="font-bold text-lg text-gray-800">IT Asset Management</h3></Link>
          <Link to="/admin/grievances" className="p-6 bg-gray-50 rounded-lg border text-center hover:shadow-md transition"><h3 className="font-bold text-lg text-gray-800">Grievance Inbox</h3></Link>
        </section>

        <section className="mt-12 border-t pt-8">
          <h2 className="text-2xl font-bold text-[#2c3e50] mb-4">Manage Key Moments Images</h2>
          <form onSubmit={handleAddImage} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 bg-gray-50 p-4 rounded-lg border">
            <input type="text" name="imageUrl" value={newImage.imageUrl} onChange={handleImageInputChange} placeholder="Image Filename (e.g., 4.jpg)" required className="p-2 border rounded"/>
            <input type="text" name="altText" value={newImage.altText} onChange={handleImageInputChange} placeholder="Alt Text" required className="p-2 border rounded"/>
            <button type="submit" className="bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700">Add Image</button>
          </form>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map(img => (
              <div key={img.image_id} className="relative">
                <img src={`/${img.image_url}`} alt={img.alt_text} className="w-full h-32 object-cover rounded-md shadow-sm"/>
                <button onClick={() => handleDeleteImage(img.image_id)} className="absolute top-1 right-1 bg-red-600 text-white rounded-full h-6 w-6 flex items-center justify-center font-bold text-sm hover:bg-red-700">&times;</button>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12 border-t pt-8">
          <h2 className="text-2xl font-bold text-[#2c3e50] mb-4">Manage Homepage Announcements</h2>
          <form onSubmit={handleAddAnnouncement} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 bg-gray-50 p-4 rounded-lg border">
            <input type="text" name="date" value={newAnnouncement.date} onChange={handleAnnouncementInputChange} placeholder="Date (e.g., August 13, 2025)" required className="p-2 border rounded"/>
            <input type="text" name="title" value={newAnnouncement.title} onChange={handleAnnouncementInputChange} placeholder="Title" required className="p-2 border rounded"/>
            <input type="text" name="description" value={newAnnouncement.description} onChange={handleAnnouncementInputChange} placeholder="Description" required className="p-2 border rounded"/>
            <button type="submit" className="bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700">Add Announcement</button>
          </form>
          <div className="space-y-4">
            {announcements.map(ann => (
              <div key={ann.announcement_id} className="flex justify-between items-center p-3 bg-gray-50 border rounded">
                <div>
                  <p className="font-semibold text-gray-800">{ann.title}</p>
                  <p className="text-sm text-gray-500">{ann.date}</p>
                </div>
                <button onClick={() => handleDeleteAnnouncement(ann.announcement_id)} className="text-red-600 font-semibold hover:text-red-800">Delete</button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboardPage;