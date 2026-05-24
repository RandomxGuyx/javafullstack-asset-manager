import React, { useEffect, useMemo, useState } from "react";
import {
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaLaptop,
  FaPlus,
  FaSearch,
  FaShieldAlt,
  FaTrash,
  FaTools,
} from "react-icons/fa";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { AnimatePresence, motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AssetModal from "../components/AssetModal";
import { addAsset, deleteAsset, getAssets } from "../services/AssetService";

const STATUS_META = {
  Available: {
    icon: FaCheckCircle,
    color: "#33d69f",
    chip: "bg-emerald-400/15 text-emerald-200 ring-emerald-300/25",
  },
  Maintenance: {
    icon: FaTools,
    color: "#f2c94c",
    chip: "bg-amber-400/15 text-amber-200 ring-amber-300/25",
  },
  Assigned: {
    icon: FaShieldAlt,
    color: "#9b87f5",
    chip: "bg-violet-400/15 text-violet-200 ring-violet-300/25",
  },
  Damaged: {
    icon: FaExclamationTriangle,
    color: "#ff6b6b",
    chip: "bg-rose-400/15 text-rose-200 ring-rose-300/25",
  },
  "Needs Update": {
    icon: FaClock,
    color: "#4cc9f0",
    chip: "bg-sky-400/15 text-sky-200 ring-sky-300/25",
  },
};

const emptyForm = {
  assetName: "",
  category: "",
  serialNumber: "",
  status: "",
};

function Dashboard() {
  const [assets, setAssets] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [formData, setFormData] = useState(emptyForm);
  const [search, setSearch] = useState("");
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      const response = await getAssets();
      setAssets(response.data);
    } catch (error) {
      toast.error("Unable to load assets");
      console.error(error);
    }
  };

  const counts = useMemo(() => {
    return Object.keys(STATUS_META).reduce(
      (total, status) => ({
        ...total,
        [status]: assets.filter((asset) => asset.status === status).length,
      }),
      { ALL: assets.length }
    );
  }, [assets]);

  const pieData = Object.keys(STATUS_META).map((status) => ({
    name: status,
    value: counts[status],
  }));

  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      const assetName = asset.assetName || "";
      const category = asset.category || "";
      const serialNumber = asset.serialNumber || "";
      const query = search.toLowerCase();

      const matchesSearch =
        assetName.toLowerCase().includes(query) ||
        category.toLowerCase().includes(query) ||
        serialNumber.toLowerCase().includes(query);

      const matchesStatus =
        selectedStatus === "ALL" || asset.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [assets, search, selectedStatus]);

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
      setFormData(emptyForm);
    } catch (error) {
      if (error.response && error.response.status === 500) {
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

  const statCards = [
    {
      label: "Total Assets",
      value: counts.ALL,
      status: "ALL",
      icon: FaLaptop,
      accent: "from-cyan-300 to-emerald-300",
    },
    ...Object.entries(STATUS_META).map(([status, meta]) => ({
      label: status,
      value: counts[status],
      status,
      icon: meta.icon,
      accent: "",
      color: meta.color,
    })),
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#06080f] px-4 py-5 text-slate-100 md:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(76,201,240,0.18),transparent_26%),radial-gradient(circle_at_78%_8%,rgba(51,214,159,0.14),transparent_24%),linear-gradient(135deg,rgba(255,255,255,0.05),transparent_38%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/60 to-transparent" />

      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="dark"
        toastClassName="!bg-slate-950 !text-slate-100 !border !border-white/10"
      />

      <section className="relative mx-auto flex w-full max-w-7xl flex-col gap-6">
        <motion.header
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col justify-between gap-5 border-b border-white/10 pb-6 lg:flex-row lg:items-end"
        >
          <div className="max-w-3xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">
              Live inventory
            </div>
            <h1 className="text-4xl font-black leading-tight text-white md:text-6xl">
              Smart Asset Dashboard
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-400 md:text-lg">
              Manage devices, monitor status, and keep serial-number inventory
              clean from one fast dark workspace.
            </p>
          </div>

          <div className="flex w-full max-w-xl items-center gap-3 rounded-lg border border-white/10 bg-white/[0.06] px-4 py-3 shadow-2xl shadow-black/30 backdrop-blur">
            <FaSearch className="shrink-0 text-cyan-200" />
            <input
              type="text"
              placeholder="Search name, category, or serial"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
            />
          </div>
        </motion.header>

        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.06 } },
          }}
          className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6"
        >
          {statCards.map((card) => {
            const Icon = card.icon;
            const active = selectedStatus === card.status;

            return (
              <motion.button
                key={card.status}
                variants={{
                  hidden: { opacity: 0, y: 18 },
                  show: { opacity: 1, y: 0 },
                }}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedStatus(card.status)}
                className={`group min-h-[132px] rounded-lg border p-4 text-left transition ${
                  active
                    ? "border-cyan-200/60 bg-cyan-200/10 shadow-lg shadow-cyan-950/40"
                    : "border-white/10 bg-white/[0.045] hover:border-white/20 hover:bg-white/[0.07]"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div
                    className={`grid h-10 w-10 place-items-center rounded-lg ${
                      card.accent
                        ? `bg-gradient-to-br ${card.accent} text-slate-950`
                        : "bg-white/[0.07]"
                    }`}
                    style={card.color ? { color: card.color } : undefined}
                  >
                    <Icon />
                  </div>
                  {active && (
                    <span className="rounded-full bg-cyan-200 px-2 py-0.5 text-[10px] font-black uppercase text-slate-950">
                      Active
                    </span>
                  )}
                </div>
                <p className="mt-5 text-3xl font-black text-white">
                  {card.value}
                </p>
                <p className="mt-1 text-sm font-medium text-slate-400">
                  {card.label}
                </p>
              </motion.button>
            );
          })}
        </motion.div>

        <section className="grid grid-cols-1 gap-5 lg:grid-cols-[0.9fr_1.4fr]">
          <motion.div
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45 }}
            className="rounded-lg border border-white/10 bg-white/[0.045] p-5 shadow-2xl shadow-black/30 backdrop-blur"
          >
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-white">
                  Asset Analytics
                </h2>
                <p className="text-sm text-slate-400">Status distribution</p>
              </div>
              <span className="rounded-full bg-white/[0.06] px-3 py-1 text-sm font-semibold text-cyan-100 ring-1 ring-white/10">
                {filteredAssets.length} shown
              </span>
            </div>

            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    innerRadius={68}
                    outerRadius={110}
                    paddingAngle={4}
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth={2}
                  >
                    {pieData.map((entry) => (
                      <Cell
                        key={entry.name}
                        fill={STATUS_META[entry.name].color}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "#0b1020",
                      border: "1px solid rgba(255,255,255,0.12)",
                      borderRadius: 8,
                      color: "#f8fafc",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {Object.entries(STATUS_META).map(([status, meta]) => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className="flex items-center justify-between gap-2 rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-slate-300 transition hover:border-white/20 hover:bg-white/[0.06]"
                >
                  <span className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: meta.color }}
                    />
                    {status}
                  </span>
                  <span className="font-bold text-white">{counts[status]}</span>
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45 }}
            className="rounded-lg border border-white/10 bg-white/[0.045] p-5 shadow-2xl shadow-black/30 backdrop-blur"
          >
            <div className="mb-5">
              <h2 className="text-xl font-black text-white">Add New Asset</h2>
              <p className="text-sm text-slate-400">
                Register a device with category, serial number, and lifecycle
                status.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <input
                type="text"
                name="assetName"
                placeholder="Asset name"
                value={formData.assetName}
                onChange={handleChange}
                className="rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-200/70 focus:bg-black/40"
              />
              <input
                type="text"
                name="category"
                placeholder="Category"
                value={formData.category}
                onChange={handleChange}
                className="rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-200/70 focus:bg-black/40"
              />
              <input
                type="text"
                name="serialNumber"
                placeholder="Serial number"
                value={formData.serialNumber}
                onChange={handleChange}
                className="rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-200/70 focus:bg-black/40"
              />
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-cyan-200/70 focus:bg-black/40"
              >
                <option value="">Select status</option>
                {Object.keys(STATUS_META).map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleAddAsset}
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-cyan-200 px-5 py-3 text-sm font-black text-slate-950 shadow-lg shadow-cyan-950/40 transition hover:bg-white"
            >
              <FaPlus />
              Add Asset
            </button>
          </motion.div>
        </section>

        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="rounded-lg border border-white/10 bg-white/[0.045] p-5 shadow-2xl shadow-black/30 backdrop-blur"
        >
          <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-center">
            <div>
              <h2 className="text-xl font-black text-white">
                Asset Inventory
              </h2>
              <p className="text-sm text-slate-400">
                {selectedStatus === "ALL" ? "All statuses" : selectedStatus}
              </p>
            </div>
            <button
              onClick={() => setSelectedStatus("ALL")}
              className="rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:border-cyan-200/50 hover:text-white"
            >
              Clear Filter
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-separate border-spacing-y-2">
              <thead>
                <tr className="text-left text-xs uppercase tracking-[0.16em] text-slate-500">
                  <th className="px-4 py-2">Asset</th>
                  <th className="px-4 py-2">Category</th>
                  <th className="px-4 py-2">Serial Number</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredAssets.map((asset) => {
                    const meta = STATUS_META[asset.status] || STATUS_META.Available;

                    return (
                      <motion.tr
                        key={asset.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        whileHover={{ scale: 1.005 }}
                        className="group cursor-pointer bg-white/[0.035] text-sm text-slate-300 shadow-sm shadow-black/20"
                        onClick={() => openModal(asset)}
                      >
                        <td className="rounded-l-lg border-y border-l border-white/10 px-4 py-4">
                          <div className="font-bold text-white">
                            {asset.assetName}
                          </div>
                        </td>
                        <td className="border-y border-white/10 px-4 py-4">
                          {asset.category}
                        </td>
                        <td className="border-y border-white/10 px-4 py-4 font-mono text-xs text-slate-400">
                          {asset.serialNumber}
                        </td>
                        <td className="border-y border-white/10 px-4 py-4">
                          <span
                            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ring-1 ${meta.chip}`}
                          >
                            {asset.status}
                          </span>
                        </td>
                        <td className="rounded-r-lg border-y border-r border-white/10 px-4 py-4 text-right">
                          <button
                            onClick={(event) => {
                              event.stopPropagation();
                              handleDelete(asset.id);
                            }}
                            className="inline-grid h-9 w-9 place-items-center rounded-lg border border-rose-300/20 bg-rose-400/10 text-rose-200 transition hover:bg-rose-400 hover:text-white"
                            aria-label={`Delete ${asset.assetName}`}
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {filteredAssets.length === 0 && (
            <div className="mt-4 rounded-lg border border-dashed border-white/15 bg-black/20 px-4 py-10 text-center text-slate-400">
              No assets match your current search or filter.
            </div>
          )}
        </motion.section>

        <footer className="flex flex-col items-center justify-between gap-3 border-t border-white/10 py-5 text-sm text-slate-500 md:flex-row">
          <p>Developed by Sohel</p>
          <div className="flex gap-3">
            <a
              href="mailto:smssohel.777@gmail.com"
              className="rounded-lg border border-white/10 px-4 py-2 text-slate-300 transition hover:border-cyan-200/50 hover:text-white"
            >
              Contact Developer
            </a>
            <a
              href="tel:9701550108"
              className="rounded-lg bg-emerald-300 px-4 py-2 font-bold text-slate-950 transition hover:bg-white"
            >
              Call Developer
            </a>
          </div>
        </footer>
      </section>

      <AssetModal
        isOpen={modalOpen}
        closeModal={closeModal}
        asset={selectedAsset}
      />
    </main>
  );
}

export default Dashboard;
