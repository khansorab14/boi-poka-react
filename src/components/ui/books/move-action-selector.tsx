import React from "react";

interface MoveActionSelectorProps {
  onSelect: (mode: "existing" | "new") => void;
}

const MoveActionSelector: React.FC<MoveActionSelectorProps> = ({
  onSelect,
}) => {
  return (
    <div className="space-y-6 text-center">
      <h2 className="text-xl font-semibold">Select Action</h2>
      <div className="space-y-3">
        <button
          onClick={() => onSelect("existing")}
          className="w-full bg-gray-100 hover:bg-gray-200 text-black font-medium py-2 rounded-md"
        >
          📁 Move to Existing Shelf
        </button>
        <button
          onClick={() => onSelect("new")}
          className="w-full bg-gray-100 hover:bg-gray-200 text-black font-medium py-2 rounded-md"
        >
          ➕ Create New Shelf & Move
        </button>
      </div>
    </div>
  );
};

export default MoveActionSelector;
