import React, { useEffect, useState } from "react";
import {
  FaLaptop,
  FaTools,
  FaShieldAlt,
  FaExclamationTriangle,
  FaEdit,
  FaTrash,
} from "react-icons/fa";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { motion } from "framer-motion";

import {
  getAssets,
  addAsset,
  deleteAsset,
} from "../services/AssetService";

import AssetModal from "../components/AssetModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function Dashboard() {

  const [assets, setAssets] = useState([]);

  const [selectedStatus, setSelectedStatus] = useState("ALL");

  const [formData, setFormData] = useState({
    assetName: "",
    category: "",
    serialNumber: "",
    status: "",
  });

  const [search, setSearch] = useState("");

  const [selectedAsset, setSelectedAsset] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    const response = await getAssets();
    setAssets(response.data);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

 const handleAddAsset = async () => {

  if (
    !formData.assetName ||
    !formData.category ||
    !formData.serialNumber ||
    !formData.status
  ) {
    toast.warning("Please fill all fields");
    return;
  }

  try {

    await addAsset(formData);

    await fetchAssets();

    toast.success("Asset added successfully");

    setFormData({
      assetName: "",
      category: "",
      serialNumber: "",
      status: "",
    });

  } catch (error) {

    if (
      error.response &&
      error.response.status === 500
    ) {

      toast.error("Device already exists");

    } else {

      toast.error("Something went wrong");

    }

    console.error(error);
  }
};

 const handleDelete = async (id) => {

  try {

    await deleteAsset(id);

    await fetchAssets();

    toast.success("Asset deleted successfully");

  } catch (error) {

    toast.error("Delete failed");

    console.error(error);
  }
};

  const openModal = (asset) => {
    setSelectedAsset(asset);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const availableCount = assets.filter(
    (a) => a.status === "Available"
  ).length;

  const maintenanceCount = assets.filter(
    (a) => a.status === "Maintenance"
  ).length;

  const assignedCount = assets.filter(
    (a) => a.status === "Assigned"
  ).length;

  const damagedCount = assets.filter(
    (a) => a.status === "Damaged"
  ).length;

  const updateCount = assets.filter(
    (a) => a.status === "Needs Update"
  ).length;

  const pieData = [
    { name: "Available", value: availableCount },
    { name: "Maintenance", value: maintenanceCount },
    { name: "Assigned", value: assignedCount },
    { name: "Damaged", value: damagedCount },
    { name: "Needs Update", value: updateCount },
  ];

  const COLORS = [
    "#22c55e",
    "#facc15",
    "#a855f7",
    "#ef4444",
    "#06b6d4",
  ];

  const filteredAssets = assets.filter((asset) => {

    const matchesSearch =
      asset.assetName
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesStatus =
      selectedStatus === "ALL"
        ? true
        : asset.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  return (

    <div className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-cyan-950 text-white p-4 md:p-6">

  <ToastContainer
    position="top-right"
    autoClose={3000}
  />

      {/* HEADER */}

      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
   className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10"
      >

        <div>

          <h1 className="text-3xl md:text-6xl font-black text-cyan-400 tracking-wide">
            Smart Asset Dashboard
          </h1>

          <p className="text-gray-400 mt-2 text-xl">
            Real-Time Asset Monitoring & Analytics
          </p>

        </div>

        <input
          type="text"
          placeholder="Search assets..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-white/10 border border-white/10 px-6 py-4 rounded-3xl outline-none w-full md:w-80 backdrop-blur-lg"
        />

      </motion.div>

      {/* TOP CARDS */}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-10">

        {/* TOTAL */}

        <div
          onClick={() => setSelectedStatus("ALL")}
          className="cursor-pointer bg-white/10 backdrop-blur-xl border border-cyan-500/20 rounded-3xl p-6 hover:scale-105 transition duration-300"
        >
          <h2>Total Assets</h2>

          <p className="text-5xl font-bold text-cyan-400 mt-4">
            {assets.length}
          </p>
        </div>

        {/* AVAILABLE */}

        <div
          onClick={() => setSelectedStatus("Available")}
          className="cursor-pointer bg-green-500/10 border border-green-500/20 rounded-3xl p-6 hover:scale-105 transition duration-300"
        >
          <FaLaptop className="text-green-400 text-4xl mb-4" />

          <h2>Available</h2>

          <p className="text-5xl font-bold text-green-400 mt-4">
            {availableCount}
          </p>
        </div>

        {/* MAINTENANCE */}

        <div
          onClick={() => setSelectedStatus("Maintenance")}
          className="cursor-pointer bg-yellow-500/10 border border-yellow-500/20 rounded-3xl p-6 hover:scale-105 transition duration-300"
        >
          <FaTools className="text-yellow-400 text-4xl mb-4" />

          <h2>Maintenance</h2>

          <p className="text-5xl font-bold text-yellow-400 mt-4">
            {maintenanceCount}
          </p>
        </div>

        {/* ASSIGNED */}

        <div
          onClick={() => setSelectedStatus("Assigned")}
          className="cursor-pointer bg-purple-500/10 border border-purple-500/20 rounded-3xl p-6 hover:scale-105 transition duration-300"
        >
          <FaShieldAlt className="text-purple-400 text-4xl mb-4" />

          <h2>Assigned</h2>

          <p className="text-5xl font-bold text-purple-400 mt-4">
            {assignedCount}
          </p>
        </div>

        {/* DAMAGED */}

        <div
          onClick={() => setSelectedStatus("Damaged")}
          className="cursor-pointer bg-red-500/10 border border-red-500/20 rounded-3xl p-6 hover:scale-105 transition duration-300"
        >
          <FaExclamationTriangle className="text-red-400 text-4xl mb-4" />

          <h2>Damaged</h2>

          <p className="text-5xl font-bold text-red-400 mt-4">
            {damagedCount}
          </p>
        </div>

        {/* UPDATE */}

        <div
          onClick={() => setSelectedStatus("Needs Update")}
          className="cursor-pointer bg-cyan-500/10 border border-cyan-500/20 rounded-3xl p-6 hover:scale-105 transition duration-300"
        >
          <FaEdit className="text-cyan-400 text-4xl mb-4" />

          <h2>Needs Update</h2>

          <p className="text-5xl font-bold text-cyan-400 mt-4">
            {updateCount}
          </p>
        </div>

      </div>

      {/* MIDDLE SECTION */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10" >

        {/* PIE CHART */}

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white/5 backdrop-blur-xl border border-cyan-500/20 rounded-3xl p-6 shadow-2xl"
        >

          <h2 className="text-4xl font-bold text-cyan-400 mb-6">
            Asset Analytics
          </h2>

          <div className="h-[350px]">

            <ResponsiveContainer width="100%" height="100%">

              <PieChart>

                <Pie
                  data={pieData}
                  dataKey="value"
                  outerRadius={120}
                  innerRadius={60}
                  label
                >

                  {pieData.map((entry, index) => (

                    <Cell
                      key={index}
                      fill={COLORS[index]}
                    />

                  ))}

                </Pie>

                <Tooltip />

              </PieChart>

            </ResponsiveContainer>

          </div>

        </motion.div>

        {/* FORM */}

        <motion.div
          whileHover={{ scale: 1.01 }}
          className="lg:col-span-2 bg-white/5 backdrop-blur-xl border border-cyan-500/20 rounded-3xl p-4 md:p-8 shadow-2xl"
        >

          <h2 className="text-3xl md:text-5xl font-black text-cyan-400 mb-8">
            Add New Asset
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <input
              type="text"
              name="assetName"
              placeholder="Asset Name"
              value={formData.assetName}
              onChange={handleChange}
              className="bg-black/40 border border-cyan-500/20 p-5 rounded-2xl outline-none"
            />

            <input
              type="text"
              name="category"
              placeholder="Category"
              value={formData.category}
              onChange={handleChange}
              className="bg-black/40 border border-cyan-500/20 p-5 rounded-2xl outline-none"
            />

            <input
              type="text"
              name="serialNumber"
              placeholder="Serial Number"
              value={formData.serialNumber}
              onChange={handleChange}
              className="bg-black/40 border border-cyan-500/20 p-5 rounded-2xl outline-none"
            />

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="bg-black/40 border border-cyan-500/20 p-5 rounded-2xl outline-none"
            >
              <option value="">Select Status</option>
              <option value="Available">Available</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Assigned">Assigned</option>
              <option value="Damaged">Damaged</option>
              <option value="Needs Update">Needs Update</option>
            </select>

          </div>

          <button
            onClick={handleAddAsset}
            className="mt-8 bg-gradient-to-r from-cyan-500 to-purple-600 px-10 py-5 rounded-2xl font-black text-xl hover:scale-105 transition duration-300"
          >
            + Add Asset
          </button>

        </motion.div>

      </div>

      {/* TABLE */}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white/5 backdrop-blur-xl border border-cyan-500/20 rounded-3xl p-6 shadow-2xl"
      >

        <h2 className="text-3xl md:text-5xl font-black text-cyan-400 mb-8">
  Asset Inventory
</h2>

        <div className="overflow-x-auto">
  <table className="w-full min-w-[700px]">

          <thead>

            <tr className="text-cyan-300 border-b border-cyan-500/20 text-left">

              <th className="pb-5 text-xl">Asset Name</th>
              <th className="pb-5 text-xl">Category</th>
              <th className="pb-5 text-xl">Serial Number</th>
              <th className="pb-5 text-xl">Status</th>
              <th className="pb-5 text-xl">Actions</th>

            </tr>

          </thead>

          <tbody>

            {filteredAssets.map((asset) => (

              <motion.tr
                key={asset.id}
                whileHover={{
                  scale: 1.01,
                  backgroundColor: "rgba(0,255,255,0.05)",
                }}
                className="border-b border-cyan-500/10"
              >

                <td
                  onClick={() => openModal(asset)}
                  className="py-6 text-lg cursor-pointer"
                >
                  {asset.assetName}
                </td>

                <td>{asset.category}</td>

                <td>{asset.serialNumber}</td>

                <td>

                  <span
                    className={`px-5 py-2 rounded-full font-bold text-white

                    ${
                      asset.status === "Available"
                        ? "bg-green-500"

                        : asset.status === "Maintenance"
                        ? "bg-yellow-500"

                        : asset.status === "Assigned"
                        ? "bg-purple-500"

                        : asset.status === "Damaged"
                        ? "bg-red-500"

                        : "bg-cyan-500"
                    }

                    `}
                  >
                    {asset.status}
                  </span>

                </td>

                <td>

                  <button
                    onClick={() => handleDelete(asset.id)}
                    className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-xl transition"
                  >
                    <FaTrash />
                  </button>

                </td>

              </motion.tr>

            ))}

          </tbody>

        </table>
</div>
      </motion.div>

      <AssetModal
        isOpen={modalOpen}
        closeModal={closeModal}
        asset={selectedAsset}
      />

    </div>
  );
}

export default Dashboard;