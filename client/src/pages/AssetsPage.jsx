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
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-[#2c3e50] border-b pb-4">My IT Assets</h1>
        <p className="mt-4 text-gray-600">A list of software and hardware assigned to you.</p>

        <div className="mt-6 overflow-x-auto">
          {loading ? (
            <p className="text-center py-4 animate-pulse text-gray-500">Loading assets...</p>
          ) : (
            <div className="border border-gray-200 shadow-md rounded-xl overflow-hidden">
              <table className="min-w-full text-sm text-left text-gray-700">
                <thead className="bg-gradient-to-r from-gray-800 to-gray-700 text-white uppercase text-xs tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Asset Name</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">License Key</th>
                    <th className="px-6 py-4">Assigned Date</th>
                    <th className="px-6 py-4">Expiry Date</th>
                  </tr>
                </thead>
                <tbody>
                  {assets.length > 0 ? (
                    assets.map((asset, index) => (
                      <tr
                        key={index}
                        className={`transition-colors duration-200 ${
                          index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                        } hover:bg-gray-100`}
                      >
                        <td className="px-6 py-4 font-medium text-gray-900">{asset.asset_name}</td>
                        <td className="px-6 py-4">{asset.asset_type}</td>
                        <td className="px-6 py-4 font-mono text-xs text-gray-600">
                          {asset.license_key || 'N/A'}
                        </td>
                        <td className="px-6 py-4">{new Date(asset.assigned_date).toLocaleDateString()}</td>
                        <td className="px-6 py-4">
                          {asset.expiry_date
                            ? new Date(asset.expiry_date).toLocaleDateString()
                            : 'N/A'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-6 py-8 text-center text-gray-500 italic"
                      >
                        No assets are currently assigned to you.
                      </td>
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