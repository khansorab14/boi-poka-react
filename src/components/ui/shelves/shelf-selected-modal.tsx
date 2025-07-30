import React from "react";
import { Check } from "lucide-react";

interface Shelf {
  id: string;
  name: string;
}

interface ShelfSelectorModalProps {
  isOpen: boolean;
  shelves: Shelf[];
  selectedShelf: string | null;
  actionType: "move" | "copy" | "delete" | null;
  onSelectShelf: (id: string) => void;
  onConfirm: () => void;
  onClose: () => void;
}

const ShelfSelectorModal: React.FC<ShelfSelectorModalProps> = ({
  isOpen,
  shelves,
  selectedShelf,
  actionType,
  onSelectShelf,
  onConfirm,
  onClose,
}) => {
  if (!isOpen || !actionType) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 sm:p-8">
        <h2 className="text-xl font-semibold text-gray-800 text-center mb-6">
          Select a shelf to {actionType}
        </h2>

        <div className="max-h-64 overflow-y-auto space-y-2 mb-6 scrollbar-thin scrollbar-thumb-gray-300">
          {shelves.map((shelf) => (
            <div
              key={shelf.id}
              onClick={() => onSelectShelf(shelf.id)}
              className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all duration-200
                ${
                  selectedShelf === shelf.id
                    ? "bg-blue-100 border-blue-500 shadow-md"
                    : "hover:bg-gray-50"
                }`}
            >
              <span className="text-gray-700 font-medium">{shelf.name}</span>
              {selectedShelf === shelf.id && (
                <Check className="text-blue-600 w-4 h-4" />
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <button
            onClick={onClose}
            className="w-full py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={!selectedShelf}
            className={`w-full py-2 rounded-md text-white font-semibold transition 
              ${
                actionType === "move"
                  ? "bg-blue-600 hover:bg-blue-700"
                  : actionType === "copy"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
              } ${!selectedShelf ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {actionType === "move"
              ? "Move"
              : actionType === "copy"
                ? "Copy"
                : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShelfSelectorModal;
