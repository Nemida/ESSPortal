import React, { useState, useEffect, useMemo } from 'react';
import api from '../services/api';
import { useAuth } from '../context/useAuth.js';

const UpcomingEventsPage = () => {
  const { isAdmin } = useAuth();
  const [allEvents, setAllEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ day: '', month: '', title: '', description: '', event_date: '' });

  const fetchEvents = async () => {
    try {
      const res = await api.get('/api/events');
      setAllEvents(res.data);
    } catch (error) {
      console.error("Failed to fetch events", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const { upcomingEvents, pastEvents } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return allEvents.reduce((acc, event) => {
      const eventDate = new Date(event.event_date);
      if (eventDate >= today) {
        acc.upcomingEvents.push(event);
      } else {
        acc.pastEvents.push(event);
      }
      return acc;
    }, { upcomingEvents: [], pastEvents: [] });
  }, [allEvents]);

  const handleInputChange = (e) => {
    setNewEvent({ ...newEvent, [e.target.name]: e.target.value });
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    await api.post('/api/events', newEvent);
    setNewEvent({ day: '', month: '', title: '', description: '', event_date: '' });
    fetchEvents();
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm("Are you sure?")) {
      await api.delete(`/api/events/${eventId}`);
      fetchEvents();
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 font-serif">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-900 border-b pb-4">Events</h1>
        <p className="mt-4 text-gray-700">DRDO convenes thought leadership through symposiums, technology demonstrations, and industry partnerships.</p>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold text-[#2c3e50] mb-6">Upcoming Events</h2>
          <div className="space-y-6">
            {upcomingEvents.map((event) => (
              <div key={event.event_id} className="flex bg-white rounded-lg shadow overflow-hidden border relative">
                {isAdmin && <button onClick={() => handleDeleteEvent(event.event_id)} className="absolute top-2 right-2 text-red-500 font-bold text-xl hover:text-red-700 z-10">&times;</button>}
                <div className="bg-[#2c3e50] text-white p-5 min-w-[90px] text-center flex flex-col justify-center">
                  <span className="block text-3xl font-bold">{event.day}</span>
                  <span className="block -mt-1">{event.month}</span>
                </div>
                <div className="p-5 flex-1">
                  <h3 className="font-semibold text-xl text-gray-800">{event.title}</h3>
                  <p className="text-gray-600 mt-1">{event.description}</p>
                  <a href="#" className="inline-block mt-3 px-4 py-2 bg-[#2c3e50] text-white text-sm rounded hover:bg-[#34495e] transition">Register Now</a>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-[#2c3e50] mb-6">Past Events Gallery</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {pastEvents.map((event) => (
              <div key={event.event_id} className="bg-gray-50 rounded-lg shadow overflow-hidden text-center relative">
                {isAdmin && <button onClick={() => handleDeleteEvent(event.event_id)} className="absolute top-1 right-1 bg-white bg-opacity-50 rounded-full h-6 w-6 text-red-500 font-bold text-lg hover:text-red-700 z-10">&times;</button>}
                <img src={`/${event.image_url || '1.jpg'}`} alt={event.title} className="w-full h-40 object-cover" />
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800">{event.title}</h3>
                  <p className="text-sm text-gray-500">{new Date(event.event_date).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {isAdmin && (
          <section className="mt-12 border-t pt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Add New Event</h2>
            <form onSubmit={handleAddEvent} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-gray-50 p-6 rounded-lg border">
              <input type="date" name="event_date" value={newEvent.event_date} onChange={handleInputChange} required className="p-2 border rounded"/>
              <input type="text" name="day" value={newEvent.day} onChange={handleInputChange} placeholder="Day (e.g., 22)" required className="p-2 border rounded"/>
              <input type="text" name="month" value={newEvent.month} onChange={handleInputChange} placeholder="Month (e.g., Aug)" required className="p-2 border rounded"/>
              <input type="text" name="title" value={newEvent.title} onChange={handleInputChange} placeholder="Title" required className="p-2 border rounded"/>
              <input type="text" name="description" value={newEvent.description} onChange={handleInputChange} placeholder="Description" required className="p-2 border rounded lg:col-span-3"/>
              <button type="submit" className="bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700">Add Event</button>
            </form>
          </section>
        )}
      </div>
    </div>
  );
};

export default UpcomingEventsPage;