import React, { useEffect, useState } from "react";
import { getAssets } from "../services/AssetService";

function Dashboard() {
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    const response = await getAssets();
    setAssets(response.data);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      
      <h1 className="text-4xl font-bold text-cyan-400 mb-8">
        Asset Dashboard
      </h1>

      <div className="grid grid-cols-3 gap-6 mb-8">
        
        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
          <h2 className="text-gray-400">Total Assets</h2>
          <p className="text-3xl font-bold mt-2">{assets.length}</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
          <h2 className="text-gray-400">Available</h2>
          <p className="text-3xl font-bold text-green-400 mt-2">
            {assets.length}
          </p>
        </div>

        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
          <h2 className="text-gray-400">Maintenance</h2>
          <p className="text-3xl font-bold text-yellow-400 mt-2">0</p>
        </div>

      </div>

      <div className="bg-gray-800 rounded-2xl p-6 shadow-lg">
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">
            Asset Inventory
          </h2>

          <button className="bg-cyan-500 hover:bg-cyan-600 px-4 py-2 rounded-lg font-semibold">
            + Add Asset
          </button>
        </div>

        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-700 text-gray-400">
              <th className="pb-3">Asset Name</th>
              <th className="pb-3">Category</th>
              <th className="pb-3">Serial Number</th>
              <th className="pb-3">Status</th>
            </tr>
          </thead>

          <tbody>
            {assets.map((asset) => (
              <tr
                key={asset.id}
                className="border-b border-gray-700 hover:bg-gray-700"
              >
                <td className="py-4">{asset.assetName}</td>
                <td>{asset.category}</td>
                <td>{asset.serialNumber}</td>

                <td>
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                    {asset.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  );
}

export default Dashboard;