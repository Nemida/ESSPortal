import React, { useState, useEffect, useMemo, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from '../context/useAuth.js';
import { useAutoRefresh } from '../hooks/useSocket';

const DownloadIcon = () => (
  <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
);

const PublicationsPage = () => {
  const { isAdmin } = useAuth();
  const [allPublications, setAllPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [newPub, setNewPub] = useState({ type: 'Journal', title: '', meta: '', description: '', pdf_link: '' });

  const fetchPublications = useCallback(async () => {
    try {
      const res = await api.get('/api/publications');
      setAllPublications(res.data);
    } catch (error) {
      console.error("Failed to fetch publications", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-refresh when publications are updated via WebSocket
  useAutoRefresh('publications', fetchPublications);

  useEffect(() => {
    fetchPublications();
  }, [fetchPublications]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPub(prevState => ({ ...prevState, [name]: value }));
  };

  const handleAddPublication = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/publications', newPub);
      setNewPub({ type: 'Journal', title: '', meta: '', description: '', pdf_link: '#' });
      fetchPublications();
    } catch (error) {
      alert("Error: Could not add publication.");
    }
  };

  const handleDeletePublication = async (pubId) => {
    if (window.confirm("Are you sure?")) {
      try {
        await api.delete(`/api/publications/${pubId}`);
        fetchPublications();
      } catch (error) {
        alert("Error: Could not delete publication.");
      }
    }
  };

  const filteredPublications = useMemo(() => {
    if (activeFilter === 'All') return allPublications;
    return allPublications.filter(p => p.type === activeFilter);
  }, [activeFilter, allPublications]);

  const FilterButton = ({ type }) => (
    <button onClick={() => setActiveFilter(type)} className={`px-4 py-2 text-sm font-medium rounded-md border transition-colors ${activeFilter === type ? 'bg-[#2c3e50] text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}>
      {type === 'Report' ? 'Reports' : type}
    </button>
  );

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="bg-white p-8 rounded-lg shadow-md">
            <h1 className="text-3xl font-bold text-gray-900 border-b pb-4">Our Publications</h1>
            <p className="mt-4 text-gray-700">Explore our peer-reviewed journals, technical reports, and conference proceedings.</p>

        <section className="mt-8">
          <div className="flex space-x-2 mb-8">
            <FilterButton type="All" />
            <FilterButton type="Report" />
            <FilterButton type="Journal" />
            <FilterButton type="Brochure" />
          </div>
          
          {loading ? <p>Loading publications...</p> : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredPublications.map((pub) => (
                <article key={pub.publication_id} className="bg-white p-5 rounded-md shadow border relative hover:shadow-md transition-shadow">
                  {isAdmin && (
                    <button onClick={() => handleDeletePublication(pub.publication_id)} className="absolute top-2 right-2 text-red-500 font-bold text-lg hover:text-red-700">&times;</button>
                  )}
                  <div className="text-sm text-gray-500">{pub.meta}</div>
                  <h2 className="mt-1 text-lg font-semibold text-gray-800">{pub.title}</h2>
                  <p className="mt-2 text-sm text-gray-600">{pub.description}</p>
                  <a href={pub.pdf_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center mt-4 px-4 py-2 bg-[#2c3e50] text-white text-sm font-medium rounded-md hover:bg-[#34495e] transition-colors">
                    <DownloadIcon /> Download PDF
                  </a>
                </article>
              ))}
            </div>
          )}
        </section>

        {isAdmin && (
          <section className="mt-12 border-t pt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Add New Publication</h2>
            <form onSubmit={handleAddPublication} className="space-y-4 bg-gray-50 p-6 rounded-lg border">
              <input type="text" name="title" value={newPub.title} onChange={handleInputChange} placeholder="Title" required className="w-full p-2 border rounded-md"/>
              <input type="text" name="meta" value={newPub.meta} onChange={handleInputChange} placeholder="Meta (e.g., Monthly Journal)" required className="w-full p-2 border rounded-md"/>
              <select name="type" value={newPub.type} onChange={handleInputChange} className="w-full p-2 border rounded-md bg-white">
                <option value="Journal">Journal</option>
                <option value="Report">Report</option>
                <option value="Brochure">Brochure</option>
              </select>
              <textarea name="description" value={newPub.description} onChange={handleInputChange} placeholder="Description" required className="w-full p-2 border rounded-md"></textarea>
              <input type="text" name="pdf_link" value={newPub.pdf_link} onChange={handleInputChange} placeholder="PDF Link (URL)" required className="w-full p-2 border rounded-md"/>
              <button type="submit" className="w-full bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700">Add Publication</button>
            </form>
          </section>
        )}
      </div>
    </div>
  );
};

export default PublicationsPage;