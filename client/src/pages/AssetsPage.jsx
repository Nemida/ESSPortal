import React, { useState, useEffect } from 'react';
import api from '../services/api';

const AssetsPage = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const res = await api.get('/api/assets/my');
        setAssets(res.data);
      } catch (error) {
        console.error('Failed to fetch assets', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAssets();
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 font-serif">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-[#2c3e50] border-b pb-4">My IT Assets</h1>
        <p className="mt-4 text-gray-600">A list of software and hardware assigned to you.</p>

        <div className="mt-6 overflow-x-auto">
          {loading ? (
            <p className="text-center py-4">Loading assets...</p>
          ) : (
            <div className="border rounded-lg">
              <table className="min-w-full">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold">Asset Name</th>
                    <th className="px-6 py-3 text-left font-semibold">Type</th>
                    <th className="px-6 py-3 text-left font-semibold">Assigned Date</th>
                    <th className="px-6 py-3 text-left font-semibold">Expiry Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {assets.length > 0 ? (
                    assets.map((asset, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-800">{asset.asset_name}</td>
                        <td className="px-6 py-4 text-gray-600">{asset.asset_type}</td>
                        <td className="px-6 py-4 text-gray-600">{new Date(asset.assigned_date).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-gray-600">{asset.expiry_date ? new Date(asset.expiry_date).toLocaleDateString() : 'N/A'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-4 text-center text-gray-500">No assets are currently assigned to you.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssetsPage;