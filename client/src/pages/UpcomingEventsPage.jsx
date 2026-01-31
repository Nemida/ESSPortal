import React, { useState, useEffect, useMemo, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from '../context/useAuth.js';

const initialForm = { day: '', month: '', title: '', description: '', event_date: '' };

function normalizeToStartOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function parseDateSafe(value) {
  const d = new Date(value);
  return isNaN(d) ? null : d;
}


const EmptyState = ({ title, subtitle }) => (
  <div className="border border-dashed rounded-lg p-8 text-center text-gray-600 bg-gray-50">
    <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
    {subtitle && <p className="mt-1">{subtitle}</p>}
  </div>
);

const UpcomingEventsPage = () => {
  const { isAdmin } = useAuth();

  const [allEvents, setAllEvents] = useState([]);
  const [newEvent, setNewEvent] = useState(initialForm);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/api/events');
      setAllEvents(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Failed to fetch events', err);
      setError('Failed to fetch events. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const { upcomingEvents, pastEvents } = useMemo(() => {
    const today = normalizeToStartOfDay(new Date());
    const buckets = { upcomingEvents: [], pastEvents: [] };

    for (const event of allEvents) {
      const eventDate = parseDateSafe(event.event_date);
      if (!eventDate) {
        buckets.pastEvents.push(event);
        continue;
      }

      const normalized = normalizeToStartOfDay(eventDate);
      if (normalized >= today) {
        buckets.upcomingEvents.push(event);
      } else {
        buckets.pastEvents.push(event);
      }
    }

    buckets.upcomingEvents.sort((a, b) => new Date(a.event_date) - new Date(b.event_date));
    buckets.pastEvents.sort((a, b) => new Date(b.event_date) - new Date(a.event_date));

    return buckets;
  }, [allEvents]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      if (!newEvent.event_date || !newEvent.title || !newEvent.description || !newEvent.day || !newEvent.month) {
        setError('Please fill out all fields.');
        return;
      }
      await api.post('/api/events', newEvent);
      setNewEvent(initialForm);
      await fetchEvents();
    } catch (err) {
      console.error('Failed to add event', err);
      setError('Failed to add event. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure?')) return;
    setError('');
    try {
      await api.delete(`/api/events/${eventId}`);
      await fetchEvents();
    } catch (err) {
      console.error('Failed to delete event', err);
      setError('Failed to delete event. Please try again.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-900 border-b pb-4">Events</h1>
        <p className="mt-4 text-gray-700">
          DRDO convenes thought leadership through symposiums, technology demonstrations, and industry partnerships.
        </p>

        {error && (
          <div className="mt-4 p-3 rounded bg-red-50 text-red-700 border border-red-200">
            {error}
          </div>
        )}

        {loading ? (
          <div className="mt-8 text-gray-600">Loading events…</div>
        ) : (
          <>
            <section className="mt-8">
              <h2 className="text-2xl font-semibold text-[#2c3e50] mb-6">Upcoming Events</h2>
              {upcomingEvents.length === 0 ? (
                <EmptyState
                  title="No upcoming events"
                  subtitle="Check back soon or explore the past events gallery below."
                />
              ) : (
                <div className="space-y-6">
                  {upcomingEvents.map((event) => (
                    <div
                      key={event.event_id}
                      className="flex bg-white rounded-lg shadow overflow-hidden border relative"
                    >
                      {isAdmin && (
                        <button
                          aria-label="Delete event"
                          onClick={() => handleDeleteEvent(event.event_id)}
                          className="absolute top-2 right-2 text-red-500 font-bold text-xl hover:text-red-700 z-10"
                        >
                          &times;
                        </button>
                      )}
                      <div className="bg-[#2c3e50] text-white p-5 min-w-[90px] text-center flex flex-col justify-center">
                        <span className="block text-3xl font-bold">{event.day}</span>
                        <span className="block -mt-1">{event.month}</span>
                      </div>
                      <div className="p-5 flex-1">
                        <h3 className="font-semibold text-xl text-gray-800">{event.title}</h3>
                        <p className="text-gray-600 mt-1">{event.description}</p>
                        <a
                          href="#"
                          className="inline-block mt-3 px-4 py-2 bg-[#2c3e50] text-white text-sm rounded hover:bg-[#34495e] transition"
                        >
                          Register Now
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

           
            <section className="mt-12">
              <h2 className="text-2xl font-semibold text-[#2c3e50] mb-6">Past Events Gallery</h2>
              {pastEvents.length === 0 ? (
                <EmptyState
                  title="No past events yet"
                  subtitle="Events you host will appear in this gallery."
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {pastEvents.map((event) => {
                    const d = parseDateSafe(event.event_date);
                    const displayDate = d ? d.toLocaleDateString() : '—';
                    return (
                      <div
                        key={event.event_id}
                        className="bg-gray-50 rounded-lg shadow overflow-hidden text-center relative"
                      >
                        {isAdmin && (
                          <button
                            aria-label="Delete past event"
                            onClick={() => handleDeleteEvent(event.event_id)}
                            className="absolute top-1 right-1 bg-white bg-opacity-50 rounded-full h-6 w-6 text-red-500 font-bold text-lg hover:text-red-700 z-10"
                          >
                            &times;
                          </button>
                        )}
                        <img
                          src={event.image_url ? (event.image_url.startsWith('http') ? event.image_url : `/${event.image_url}`) : '/1.jpg'}
                          alt={event.title || 'Event image'}
                          className="w-full h-40 object-cover"
                          loading="lazy"
                        />
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-800">{event.title}</h3>
                          <p className="text-sm text-gray-500">{displayDate}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </>
        )}

        {isAdmin && (
          <section className="mt-12 border-t pt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Add New Event</h2>
            <form
              onSubmit={handleAddEvent}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-gray-50 p-6 rounded-lg border"
            >
              <input
                type="date"
                name="event_date"
                value={newEvent.event_date}
                onChange={handleInputChange}
                required
                className="p-2 border rounded"
                aria-label="Event date"
              />
              <input
                type="text"
                name="day"
                value={newEvent.day}
                onChange={handleInputChange}
                placeholder="Day (e.g., 22)"
                required
                className="p-2 border rounded"
                aria-label="Day"
              />
              <input
                type="text"
                name="month"
                value={newEvent.month}
                onChange={handleInputChange}
                placeholder="Month (e.g., Aug)"
                required
                className="p-2 border rounded"
                aria-label="Month"
              />
              <input
                type="text"
                name="title"
                value={newEvent.title}
                onChange={handleInputChange}
                placeholder="Title"
                required
                className="p-2 border rounded"
                aria-label="Title"
              />
              <input
                type="text"
                name="description"
                value={newEvent.description}
                onChange={handleInputChange}
                placeholder="Description"
                required
                className="p-2 border rounded lg:col-span-3"
                aria-label="Description"
              />
              <button
                type="submit"
                className="bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700 disabled:opacity-60"
                disabled={submitting}
              >
                {submitting ? 'Adding…' : 'Add Event'}
              </button>
            </form>
          </section>
        )}
      </div>
    </div>
  );
};

export default UpcomingEventsPage;
