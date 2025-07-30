import React, { useState } from "react";
import axiosInstance from "../../../api/axios-instance"; // adjust path as needed

interface DeleteShelfDialogProps {
  isOpen: boolean;
  libraryId: string;
  shelfName: string;
  onClose: () => void;
  onSuccess: () => void;
}

const ShelfDialog: React.FC<DeleteShelfDialogProps> = ({
  isOpen,
  libraryId,
  shelfName,
  onClose,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleDelete = async () => {
    try {
      setLoading(true);
      await axiosInstance.delete("/userbook/deleteUserLibrary", {
        data: { libraryId },
      });
      setLoading(false);
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Failed to delete shelf", err);
      setLoading(false);
    }
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-[90%] max-w-sm shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Delete this shelf?</h2>
        <p className="text-sm text-gray-600 mb-6">
          Are you sure you want to delete <strong>{shelfName}</strong>? This
          action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 bg-gray-200 rounded"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShelfDialog;
