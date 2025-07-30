import React, { useState } from "react";

interface ShareBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShare: (name: string, phone: string) => void;
}

const ShareBookModal: React.FC<ShareBookModalProps> = ({
  isOpen,
  onClose,
  onShare,
}) => {
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-2xl p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">
          Share Book
        </h2>
        <div className="space-y-4">
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Full Name"
            className="w-full border border-gray-300 rounded-md px-4 py-2"
          />
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Phone Number"
            className="w-full border border-gray-300 rounded-md px-4 py-2"
          />
        </div>
        <div className="mt-6 flex justify-between gap-4">
          <button
            onClick={onClose}
            className="w-full py-2 border border-gray-300 rounded-md hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onShare(fullName, phoneNumber);
              onClose();
            }}
            disabled={!fullName || !phoneNumber}
            className="w-full py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-md"
          >
            Share
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareBookModal;
