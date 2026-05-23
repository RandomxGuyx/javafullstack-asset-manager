import React from "react";
import Modal from "react-modal";

Modal.setAppElement("#root");

function AssetModal({
  isOpen,
  closeModal,
  asset,
}) {
  if (!asset) return null;

  const statusColor = {
    Available: "bg-green-500",
    Maintenance: "bg-yellow-500",
    Assigned: "bg-purple-500",
    Damaged: "bg-red-500",
    "Needs Update": "bg-cyan-500",
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      className="bg-gray-900 text-white p-8 rounded-3xl w-[500px] mx-auto mt-32 border border-cyan-500 shadow-2xl outline-none"
      overlayClassName="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-start"
    >
      <h2 className="text-3xl font-bold text-cyan-400 mb-6">
        Asset Details
      </h2>

      <div className="space-y-4 text-lg">

        <div>
          <span className="text-gray-400">Asset Name:</span>
          <p className="font-semibold">{asset.assetName}</p>
        </div>

        <div>
          <span className="text-gray-400">Category:</span>
          <p className="font-semibold">{asset.category}</p>
        </div>

        <div>
          <span className="text-gray-400">Serial Number:</span>
          <p className="font-semibold">{asset.serialNumber}</p>
        </div>

        <div>
          <span className="text-gray-400">Status:</span>

          <div
            className={`inline-block px-4 py-2 rounded-full mt-2 text-white font-semibold ${statusColor[asset.status]}`}
          >
            {asset.status}
          </div>
        </div>

      </div>

      <button
        onClick={closeModal}
        className="mt-8 bg-cyan-500 hover:bg-cyan-600 px-6 py-3 rounded-xl font-bold transition duration-300"
      >
        Close
      </button>
    </Modal>
  );
}

export default AssetModal;