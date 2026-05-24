import React from "react";
import Modal from "react-modal";
import { FaBarcode, FaBoxOpen, FaLayerGroup, FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";

Modal.setAppElement("#root");

const statusColor = {
  Available: "bg-emerald-400/15 text-emerald-200 ring-emerald-300/25",
  Maintenance: "bg-amber-400/15 text-amber-200 ring-amber-300/25",
  Assigned: "bg-violet-400/15 text-violet-200 ring-violet-300/25",
  Damaged: "bg-rose-400/15 text-rose-200 ring-rose-300/25",
  "Needs Update": "bg-sky-400/15 text-sky-200 ring-sky-300/25",
};

function DetailRow({ icon: Icon, label, value }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
      <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
        <Icon className="text-cyan-200" />
        {label}
      </div>
      <p className="break-words text-lg font-bold text-white">{value}</p>
    </div>
  );
}

function AssetModal({ isOpen, closeModal, asset }) {
  if (!asset) return null;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      className="mx-4 mt-16 w-full max-w-lg outline-none md:mt-24"
      overlayClassName="fixed inset-0 z-50 flex justify-center overflow-y-auto bg-black/75 px-2 backdrop-blur-md"
    >
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.22 }}
        className="relative rounded-lg border border-white/10 bg-[#0b1020] p-5 text-white shadow-2xl shadow-black/50"
      >
        <button
          onClick={closeModal}
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-slate-400 transition hover:border-cyan-200/50 hover:text-white"
          aria-label="Close asset details"
        >
          <FaTimes />
        </button>

        <div className="pr-12">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-cyan-200">
            Asset profile
          </p>
          <h2 className="text-3xl font-black leading-tight text-white">
            {asset.assetName}
          </h2>
          <span
            className={`mt-4 inline-flex rounded-full px-3 py-1 text-xs font-bold ring-1 ${
              statusColor[asset.status] || statusColor.Available
            }`}
          >
            {asset.status}
          </span>
        </div>

        <div className="mt-6 grid gap-3">
          <DetailRow icon={FaBoxOpen} label="Asset Name" value={asset.assetName} />
          <DetailRow icon={FaLayerGroup} label="Category" value={asset.category} />
          <DetailRow
            icon={FaBarcode}
            label="Serial Number"
            value={asset.serialNumber}
          />
        </div>
      </motion.div>
    </Modal>
  );
}

export default AssetModal;
