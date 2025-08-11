import React from "react";

interface ShareModeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: (mode: "custom" | "contactList") => void;
}

const ShareModeDialog: React.FC<ShareModeDialogProps> = ({
  isOpen,
  onClose,
  onContinue,
}) => {
  const [selectedMode, setSelectedMode] = React.useState<
    "custom" | "contactList" | null
  >(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-80">
        <h2 className="text-xl font-bold mb-4 text-center">
          Choose Sharing Mode
        </h2>

        <div className="space-y-3 mb-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="shareMode"
              value="custom"
              checked={selectedMode === "custom"}
              onChange={() => setSelectedMode("custom")}
            />
            <span>Share with custom contact</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="shareMode"
              value="contactList"
              checked={selectedMode === "contactList"}
              onChange={() => setSelectedMode("contactList")}
            />
            <span>Share from contact list</span>
          </label>
        </div>

        <div className="flex justify-between items-center">
          <button
            className="border px-4 py-2 rounded text-sm"
            onClick={onClose}
          >
            ●●● Cancel
          </button>
          <button
            className="border px-4 py-2 rounded text-sm"
            disabled={!selectedMode}
            onClick={() => {
              if (selectedMode) onContinue(selectedMode);
            }}
          >
            ↪ Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModeDialog;
