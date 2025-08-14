import React, { useState, useEffect } from 'react';
import api from '../services/api';

const AssetManagementPage = () => {
  const [assets, setAssets] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [assignEmail, setAssignEmail] = useState('');
  const [newAsset, setNewAsset] = useState({ 
    asset_name: '', 
    asset_type: '', 
    license_key: '', 
    email: '', 
    purchase_date: '', 
    expiry_date: '' 
  });

  const fetchData = async () => {
    try {
      const assetsRes = await api.get('/api/assets');
      setAssets(assetsRes.data);
    } catch (error) {
      console.error("Failed to fetch assets", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e) =>
    setNewAsset({ ...newAsset, [e.target.name]: e.target.value });

  const handleAddAsset = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/assets', newAsset);
      setNewAsset({ 
        asset_name: '', 
        asset_type: '', 
        license_key: '', 
        email: '', 
        purchase_date: '', 
        expiry_date: '' 
      });
      fetchData();
    } catch (error) {
      alert('Failed to add asset. Ensure user email is valid if provided.');
    }
  };

  const handleDeleteAsset = async (id) => {
    if (window.confirm('Are you sure you want to delete this asset?')) {
      try {
        await api.delete(`/api/assets/${id}`);
        fetchData();
      } catch (error) {
        alert('Failed to delete asset.');
      }
    }
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/assets/assign', { assetId: selectedAsset.asset_id, email: assignEmail });
      setSelectedAsset(null);
      setAssignEmail('');
      fetchData();
    } catch (error) {
      alert(error.response?.data?.msg || 'Failed to assign asset.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-[#2c3e50] border-b pb-4">
          IT Asset Management (Admin)
        </h1>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold text-[#2c3e50] mb-4">
            Add New Asset
          </h2>
          <form
            onSubmit={handleAddAsset}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-6 rounded-lg border"
          >
            <input
              type="text"
              name="asset_name"
              value={newAsset.asset_name}
              onChange={handleInputChange}
              placeholder="Asset Name"
              required
              className="p-2 border rounded"
            />
            <input
              type="text"
              name="asset_type"
              value={newAsset.asset_type}
              onChange={handleInputChange}
              placeholder="Type (e.g., Software)"
              required
              className="p-2 border rounded"
            />
            <input
              type="text"
              name="license_key"
              value={newAsset.license_key}
              onChange={handleInputChange}
              placeholder="License Key"
              className="p-2 border rounded"
            />
            <div>
              <label className="text-xs text-gray-500">Purchase Date</label>
              <input
                type="date"
                name="purchase_date"
                value={newAsset.purchase_date}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500">Expiry Date</label>
              <input
                type="date"
                name="expiry_date"
                value={newAsset.expiry_date}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500">Assign to (Email)</label>
              <input
                type="email"
                name="email"
                value={newAsset.email}
                onChange={handleInputChange}
                placeholder="employee.email@drdo.com"
                className="w-full p-2 border rounded"
              />
            </div>
            <button
              type="submit"
              className="md:col-span-3 bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700"
            >
              Add Asset
            </button>
          </form>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-[#2c3e50] mb-4">
            All Assets
          </h2>
          <div className="overflow-x-auto border rounded-lg">
            <table className="min-w-full">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="px-6 py-3 text-left">Name</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left">Assigned To (Email)</th>
                  <th className="px-6 py-3 text-left">Purchase Date</th>
                  <th className="px-6 py-3 text-left">Expiry Date</th>
                  <th className="px-6 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {assets.map((asset) => (
                  <tr key={asset.asset_id}>
                    <td className="px-6 py-4">{asset.asset_name}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          asset.status === 'Available'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {asset.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">{asset.email || 'N/A'}</td>
                    <td className="px-6 py-4">
                      {asset.purchase_date
                        ? new Date(asset.purchase_date).toLocaleDateString()
                        : 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      {asset.expiry_date
                        ? new Date(asset.expiry_date).toLocaleDateString()
                        : 'N/A'}
                    </td>
                    <td className="px-6 py-4 space-x-4">
                      {asset.status === 'Available' && (
                        <button
                          onClick={() => setSelectedAsset(asset)}
                          className="text-indigo-600 font-semibold hover:underline"
                        >
                          Assign
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteAsset(asset.asset_id)}
                        className="text-red-600 font-semibold hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {selectedAsset && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
          <form onSubmit={handleAssign} className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-lg font-bold">Assign "{selectedAsset.asset_name}"</h3>
            <p className="text-sm text-gray-600 mt-1">Enter the employee's email to assign this asset.</p>
            <input
              type="email"
              value={assignEmail}
              onChange={(e) => setAssignEmail(e.target.value)}
              placeholder="employee.email@drdo.com"
              required
              className="mt-4 w-full p-2 border rounded"
            />
            <div className="mt-4 flex gap-4">
              <button type="submit" className="flex-1 bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700">Confirm Assignment</button>
              <button type="button" onClick={() => setSelectedAsset(null)} className="flex-1 bg-gray-300 p-2 rounded hover:bg-gray-400">Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AssetManagementPage;
