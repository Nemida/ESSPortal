import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth.js';
import api from '../services/api';
const ResearchCard = ({ title, description, link, bgColor }) => (
  <div className={`relative p-6 rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl ${bgColor}`}>
    <div className="relative z-10">
      <h2 className="text-xl font-bold text-white">{title}</h2>
      <p className="mt-2 text-white opacity-90">{description}</p>
      <Link to={link} className="inline-block mt-3 text-white font-semibold group">
        Explore
        <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5"> →</span>
      </Link>
    </div>
  </div>
);

const ResearchAreasPage = () => {
    const {isAdmin} = useAuth(); 
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);


    const [newProject, setNewProject] = useState({ projectName: '', description: '', status: '' });

    const fetchProjects = async () => {
        try {
        const res = await api.get('/api/projects');
        setProjects(res.data);
        } catch (error) {
        console.error("Failed to fetch projects", error);
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProject(prevState => ({ ...prevState, [name]: value }));
    };

    const handleAddProject = async (e) => {
        e.preventDefault();
        try {
        await api.post('/api/projects', newProject);
        setNewProject({ projectName: '', description: '', status: '' }); 
        fetchProjects(); 
        } catch (error) {
        console.error("Failed to add project", error);
        alert("Error: Could not add project.");
        }
    };

    const handleDeleteProject = async (projectId) => {
        if (window.confirm("Are you sure you want to delete this project?")) {
        try {
            await api.delete(`/api/projects/${projectId}`);
            fetchProjects(); 
        } catch (error) {
            console.error("Failed to delete project", error);
            alert("Error: Could not delete project.");
        }
        }
    };

    return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-8 rounded-lg shadow-md">
    
        <h1 className="text-3xl font-bold text-gray-900 border-b pb-4">Research Areas</h1>
        <p className="mt-4 text-gray-700">
          DRDO spearheads transformative research across critical defense domains. Our current focus areas include hypersonic technologies, quantum computing applications for cybersecurity, artificial intelligence in unmanned systems, and next-generation armor materials.
        </p>

        {/* Research Categories */}
        <section className="mt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <ResearchCard
              title="Aeronautics"
              description="Developing advanced aircraft and UAVs."
              link="/research/aeronautics"
              bgColor="bg-gradient-to-br from-blue-500 to-blue-700"
            />
            <ResearchCard
              title="Armaments"
              description="Weapons and combat vehicle systems."
              link="/research/armaments"
              bgColor="bg-gradient-to-br from-red-500 to-red-700"
            />
            <ResearchCard
              title="Electronics"
              description="Radars, EW, and communication tech."
              link="/research/electronics"
              bgColor="bg-gradient-to-br from-purple-500 to-purple-700"
            />
            <ResearchCard
              title="Missiles"
              description="Strategic and tactical missile systems."
              link="/research/missiles"
              bgColor="bg-gradient-to-br from-green-500 to-green-700"
            />
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Current Major Projects</h2>
          <div className="overflow-x-auto border rounded-lg">
            <table className="min-w-full text-left">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="px-6 py-3 font-semibold">Project</th>
                  <th className="px-6 py-3 font-semibold">Description</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                  {isAdmin && <th className="px-6 py-3 font-semibold">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y">
                {loading ? (
                  <tr><td colSpan="4" className="text-center p-4">Loading...</td></tr>
                ) : (
                  projects.map(project => (
                    <tr key={project.project_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">{project.project_name}</td>
                      <td className="px-6 py-4 text-gray-600">{project.description}</td>
                      <td className="px-6 py-4 text-gray-600">{project.status}</td>
                      {isAdmin && (
                        <td className="px-6 py-4">
                          <button 
                            onClick={() => handleDeleteProject(project.project_id)} 
                            className="text-red-500 hover:text-red-700 font-semibold"
                          >
                            Delete
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>


        {isAdmin && (
          <section className="mt-12 border-t pt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Add New Project</h2>
            <form onSubmit={handleAddProject} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700">Project Name</label>
                <input type="text" name="projectName" value={newProject.projectName} onChange={handleInputChange} required className="mt-1 p-2 w-full border rounded-md" />
              </div>
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <input type="text" name="description" value={newProject.description} onChange={handleInputChange} required className="mt-1 p-2 w-full border rounded-md" />
              </div>
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <input type="text" name="status" value={newProject.status} onChange={handleInputChange} required className="mt-1 p-2 w-full border rounded-md" />
              </div>
              <div className="md:col-span-1">
                <button type="submit" className="w-full bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700">Add Project</button>
              </div>
            </form>
          </section>
        )}
      </div>
    </div>
  );
};

export default ResearchAreasPage;