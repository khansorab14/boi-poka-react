// components/ui/inner-circle/modals/library-select-modal.tsx
import React, { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import axiosInstance from "../../../../api/axios-instance";

interface Library {
  name: string;
  id: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (libraryId: string) => void;
}

const LibrarySelectModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [libraries, setLibraries] = useState<Library[]>([]);
  const [selectedLibrary, setSelectedLibrary] = useState("");

  useEffect(() => {
    const fetchLibraryNames = async () => {
      try {
        const response = await axiosInstance.get("/userbook/getLibraryData");
        const data = response.data.data.libraryData;
        const formatted = data.map((lib: any) => ({
          name: lib.libraryName,
          id: lib.libraryId,
        }));
        setLibraries(formatted);
      } catch (error) {
        console.error("❌ Failed to fetch libraries", error);
      }
    };
    if (isOpen) fetchLibraryNames();
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center">
        <Dialog.Panel className="bg-white p-6 rounded-xl w-[90%] max-w-md mx-auto">
          <Dialog.Title className="text-xl font-semibold mb-4">
            Select a Library
          </Dialog.Title>

          <select
            className="border p-2 rounded w-full"
            value={selectedLibrary}
            onChange={(e) => setSelectedLibrary(e.target.value)}
          >
            <option value="">🏷️ Select a Library</option>
            {libraries.map((lib) => (
              <option key={lib.id} value={lib.id}>
                {lib.name}
              </option>
            ))}
          </select>

          <div className="flex justify-end space-x-4 mt-6">
            <button onClick={onClose} className="text-gray-600 hover:underline">
              Cancel
            </button>
            <button
              disabled={!selectedLibrary}
              onClick={() => onConfirm(selectedLibrary)}
              className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 disabled:opacity-50"
            >
              Share
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default LibrarySelectModal;
