import React from "react";

interface Shelf {
  libraryId: string;
  libraryName: string;
  libraryType: string;
  createdAt: string;
  bookCount: number;
  friendsWithAccess: number;
}

interface ShelfActionDrawerProps {
  showDrawer: boolean;
  selectedShelf: Shelf | null;
  closeDrawer: () => void;
  setShowDeleteDialog: (val: boolean) => void;
  setShareModeStage?: React.Dispatch<
    React.SetStateAction<"select" | "customInput" | null>
  >;

  setShowLibrary: (val: boolean) => void;
  setRemoveMode: (val: boolean) => void;
  setShowRenameDialog: (val: boolean) => void;
  setShowRemoveFriendsDialog: (val: boolean) => void;
  fetchFriendsWithAccess: (libraryId: string) => void;
}

const ShelfActionDrawer: React.FC<ShelfActionDrawerProps> = ({
  showDrawer,
  selectedShelf,
  closeDrawer,
  setShowDeleteDialog,
  setShareModeStage,
  setShowLibrary,
  setRemoveMode,
  setShowRenameDialog,
  fetchFriendsWithAccess,
  setShowRemoveFriendsDialog,
}) => {
  if (!showDrawer || !selectedShelf) return null;

  return (
    <div
      className="fixed inset-0 z-40 bg-black bg-opacity-30 flex items-end"
      onClick={closeDrawer}
    >
      <div
        className="bg-white w-full border-t rounded-t-2xl shadow-xl p-4 z-50"
        onClick={(e) => e.stopPropagation()} // prevent closing on inner click
      >
        <div className="text-center font-semibold mb-3">
          {selectedShelf.libraryName}
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <button
            className="bg-red-100 p-2 rounded"
            onClick={() => setShowDeleteDialog(true)}
          >
            🗑 Delete Shelf
          </button>
          <button
            className="bg-green-100 p-2 rounded"
            onClick={() => setShareModeStage && setShareModeStage("select")}
          >
            ➕ Add Friend
          </button>
          <button
            className="bg-yellow-100 p-2 rounded"
            onClick={() => {
              if (selectedShelf?.libraryId) {
                fetchFriendsWithAccess(selectedShelf.libraryId);
                setShowRemoveFriendsDialog(true);
              }
            }}
          >
            ➖ Remove Friend
          </button>
          <button
            className="bg-blue-100 p-2 rounded"
            onClick={() => {
              setShowLibrary(true);
              closeDrawer();
            }}
          >
            📚 Add Books
          </button>
          <button
            className="bg-rose-100 p-2 rounded"
            onClick={() => setRemoveMode(true)}
          >
            ❌ Remove Books
          </button>
          <button
            className="bg-gray-100 p-2 rounded"
            onClick={() => setShowRenameDialog(true)}
          >
            ✏️ Rename Shelf
          </button>
        </div>
        <button
          onClick={closeDrawer}
          className="mt-4 w-full text-center text-blue-600 font-medium"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ShelfActionDrawer;
