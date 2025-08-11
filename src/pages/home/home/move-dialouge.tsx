// components/home/MoveDialog.tsx
import React, { useState } from "react";
import MoveActionSelector from "../../../components/ui/books/move-action-selector";
import { useAuthStore } from "../../../state/use-auth-store";

interface MoveDialogProps {
  moveMode: "existing" | "new" | null;
  setMoveMode: (mode: "existing" | "new" | null) => void;
  setShowMoveDialog: (show: boolean) => void;
}

const MoveDialog: React.FC<MoveDialogProps> = ({
  moveMode,
  setMoveMode,
  setShowMoveDialog,
}) => {
  const [targetShelf, setTargetShelf] = useState("");
  const { libraryNames } = useAuthStore();

  const handleMoveToLibrary = async (libraryName: string) => {
    console.log(`Moved books to ${libraryName}`);
    setTargetShelf("");
    setMoveMode(null);
    setShowMoveDialog(false);
  };

  return (
    <div className="fixed inset-0 z-40 bg-black bg-opacity-40 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 relative">
        {moveMode === null && <MoveActionSelector onSelect={setMoveMode} />}

        {moveMode === "existing" && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-center">Select Shelf</h2>
            <div className="rounded-xl bg-gray-100 px-4 py-3">
              <select
                value={targetShelf}
                onChange={(e) => setTargetShelf(e.target.value)}
                className="w-full bg-transparent text-gray-800 font-medium focus:outline-none"
              >
                <option value="">Select Shelf</option>
                {libraryNames.map((lib, i) => (
                  <option key={i} value={lib}>
                    {lib}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => {
                  setMoveMode(null);
                  setTargetShelf("");
                }}
                className="flex items-center gap-1 text-black font-semibold"
              >
                <span className="text-2xl">⋯</span> Cancel
              </button>

              <button
                disabled={!targetShelf}
                onClick={() => handleMoveToLibrary(targetShelf)}
                className={`flex items-center gap-1 ${
                  targetShelf
                    ? "text-blue-600 font-semibold"
                    : "text-gray-400 cursor-not-allowed"
                }`}
              >
                <span className="text-xl">↗</span> Move
              </button>
            </div>
          </div>
        )}

        <button
          className="absolute top-2 right-3 text-gray-400 hover:text-black text-xl"
          onClick={() => {
            setShowMoveDialog(false);
            setMoveMode(null);
          }}
        >
          ✖
        </button>
      </div>
    </div>
  );
};

export default MoveDialog;
