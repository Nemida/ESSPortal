import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const FormsPage = () => {
  const [allForms, setAllForms] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const res = await api.get('/api/forms');
        setAllForms(res.data);
      } catch (err) {
        console.error("Failed to fetch forms", err);
      }
    };
    fetchForms();
  }, []);

  const filteredForms = useMemo(() => {
    return allForms.filter(form => {
      const categoryMatch = activeCategory === 'All' || form.category === activeCategory;
      const searchMatch = form.search_tags.toLowerCase().includes(searchTerm.toLowerCase());
      return categoryMatch && searchMatch;
    });
  }, [allForms, searchTerm, activeCategory]);

  const FilterButton = ({ category }) => (
    <button
      onClick={() => setActiveCategory(category)}
      className={`px-4 py-2 text-sm rounded-full border transition-colors ${activeCategory === category ? 'bg-[#2c3e50] text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
    >
      {category}
    </button>
  );

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 font-serif">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-b pb-4 mb-6">
          <h1 className="text-3xl font-bold text-[#2c3e50]">Employee Forms Portal</h1>
          <div className="relative w-full md:w-80">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input
              type="text"
              placeholder="Search forms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-full focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          <FilterButton category="All" />
          <FilterButton category="HR" />
          <FilterButton category="Finance" />
          <FilterButton category="Travel" />
          <FilterButton category="Administration" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredForms.length > 0 ? (
            filteredForms.map((form) => (
              <Link to={`/forms/${form.form_id}`} key={form.form_id} className="block bg-white rounded-lg shadow border overflow-hidden transform transition-transform hover:-translate-y-1 hover:shadow-xl">
                <div className="p-5">
                  <span className={`inline-block px-2 py-1 text-xs text-white rounded mb-3 ${form.badge_color}`}>
                    {form.badge_text}
                  </span>
                  <h3 className="text-lg font-semibold text-[#2c3e50]">{form.title}</h3>
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed">{form.description}</p>
                </div>
                <div className="px-5 py-3 bg-gray-50 flex justify-between items-center">
                   <div className="text-xs text-gray-500">
                     <span>Updated: {new Date(form.last_updated).toLocaleDateString()}</span> | <span>{form.version}</span>
                   </div>
                  <span className="text-sm font-semibold text-indigo-600">Open Form →</span>
                </div>
              </Link>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500 py-10">No forms found matching your criteria.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormsPage;