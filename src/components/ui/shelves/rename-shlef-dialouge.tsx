import React, { useEffect, useState } from "react";
import axiosInstance from "../../../api/axios-instance";

// interface Shelf {
//   libraryId: string;
//   libraryName: string;
// }

interface RenameShelfDialogProps {
  isOpen: boolean;
  currentName: string;
  onClose: () => void;
  onRenameSuccess: (libraryId: string, newName: string) => void;
}

const RenameShelfDialog: React.FC<RenameShelfDialogProps> = ({
  isOpen,
  currentName,
  onClose,
  onRenameSuccess,
}) => {
  // const [shelves, setShelves] = useState<Shelf[]>([]);
  const [selectedLibraryId, setSelectedLibraryId] = useState("");
  const [newName, setNewName] = useState(currentName);
  const [loading, setLoading] = useState(false);
  const [fetchingLibraries, setFetchingLibraries] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchLibraries();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setNewName(currentName); // reset newName input when dialog opens
    }
  }, [isOpen, currentName]);

  const fetchLibraries = async () => {
    setFetchingLibraries(true);
    try {
      const res = await axiosInstance.get("/userbook/getLibraryData");
      const libraryData = res.data.data.libraryData;
      // setShelves(libraryData);
      if (libraryData && libraryData.length > 0) {
        const matchedShelf = libraryData.find(
          (shelf: any) => shelf.libraryName === currentName
        );
        if (matchedShelf) {
          setSelectedLibraryId(matchedShelf.libraryId);
        } else {
          setSelectedLibraryId(libraryData[0].libraryId);
        }
      }
    } catch (err) {
      console.error("Failed to fetch libraries", err);
    } finally {
      setFetchingLibraries(false);
    }
  };

  const handleRename = async () => {
    if (!selectedLibraryId || !newName.trim()) return;
    setLoading(true);
    try {
      await axiosInstance.put(`/userbook/renameLibrary/${selectedLibraryId}`, {
        newName,
      });
      onRenameSuccess(selectedLibraryId, newName.trim());
      onClose(); // ✅ Close the dialog after renaming
    } catch (err) {
      console.error("Rename failed", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-[90%] max-w-md">
        <h2 className="text-lg font-semibold mb-4">Rename Shelf</h2>

        <label className="text-sm text-gray-700 mb-1 block">Current Name</label>
        <div className="border w-full px-3 py-2 rounded mb-4 bg-gray-50">
          {currentName}
        </div>

        <label className="text-sm text-gray-700 mb-1 block">New Name</label>
        <input
          className="border w-full px-3 py-2 rounded mb-4"
          value={newName} // ✅ correct binding
          onChange={(e) => setNewName(e.target.value)}
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="text-gray-500"
            disabled={loading}
          >
            {fetchingLibraries ? "Canceling..." : "Cancel"}
          </button>
          <button
            onClick={handleRename}
            disabled={loading || fetchingLibraries}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
          >
            {loading ? "Renaming..." : "Rename"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RenameShelfDialog;
