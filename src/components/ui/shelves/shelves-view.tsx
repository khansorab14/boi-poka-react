import React, { useEffect, useState } from "react";
import axiosInstance from "../../../api/axios-instance";
import { useUIStore } from "../../../store/ui-store";
import ShelfDialog from "./shelf-dialouge";
import GridView from "../../../pages/home/grid-view";
import SelectedBooksFooter from "../books-view/selected-book-footer";
import RenameShelfDialog from "./rename-shlef-dialouge";

interface Shelf {
  libraryId: string;
  libraryName: string;
  libraryType: "csv" | "physical" | "others";
  createdAt: string;
  bookCount: number;
  friendsWithAccess: number;
  booksData?: { _id: string }[]; // assuming book objects have _id
}

interface LibraryStats {
  totalBooksCount: number;
  physicalBook: number;
  csvBook: number;
  othersBook: number;
}

const ShelvesView = ({ booksData }) => {
  const [shelves, setShelves] = useState<Shelf[]>([]);
  const [stats, setStats] = useState<LibraryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedShelf, setSelectedShelf] = useState<Shelf | null>(null);
  const [showDrawer, setShowDrawer] = useState(false);
  const { setShowLibrary } = useUIStore();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [removeMode, setRemoveMode] = useState(false);
  const [selectedBookData, setSelectedBookData] = useState<string[]>([]);
  const [showRenameDialog, setShowRenameDialog] = useState(false);

  const fetchLibraryData = async () => {
    try {
      const res = await axiosInstance.get("/userbook/getLibraryData");
      const data = res.data?.data;

      if (data) {
        setShelves(data.libraryData);
        setStats({
          totalBooksCount: data.totalBooksCount,
          physicalBook: data.physicalBook,
          csvBook: data.csvBook,
          othersBook: data.othersBook,
        });
      }
    } catch (err) {
      console.error("Failed to fetch libraries", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLibraryData();
  }, []);

  const openDrawer = (shelf: Shelf) => {
    setSelectedShelf(shelf);
    setShowDrawer(true);
  };

  const closeDrawer = () => {
    setSelectedShelf(null);
    setShowDrawer(false);
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="space-y-4 px-4 mt-6">
      {stats && (
        <div className="grid grid-cols-4 gap-2 text-center text-sm">
          <div className="bg-yellow-50 p-3 rounded">
            <div className="text-gray-500">total books</div>
            <div className="text-xl font-semibold">{stats.totalBooksCount}</div>
          </div>
          <div className="bg-teal-100 p-3 rounded">
            <div className="text-gray-500">physical</div>
            <div className="text-xl font-semibold">{stats.physicalBook}</div>
          </div>
          <div className="bg-blue-100 p-3 rounded">
            <div className="text-gray-500">csv</div>
            <div className="text-xl font-semibold">{stats.csvBook}</div>
          </div>
          <div className="bg-rose-100 p-3 rounded">
            <div className="text-gray-500">others</div>
            <div className="text-xl font-semibold">{stats.othersBook}</div>
          </div>
        </div>
      )}

      {shelves.map((shelf) => (
        <div
          key={shelf.libraryId}
          className="bg-yellow-50 rounded p-4 flex justify-between items-center cursor-pointer"
          onClick={() => openDrawer(shelf)}
        >
          <div>
            <div className="text-lg font-medium">{shelf.libraryName}</div>
            <div className="text-sm text-gray-500">{shelf.createdAt}</div>
            <div className="text-black text-[10px] mt-2">●●●</div>
          </div>
          <div className="flex flex-col text-right">
            <span className="text-sm text-gray-500">friends</span>
            <span className="text-lg font-semibold">
              {shelf.friendsWithAccess}
            </span>
            <span className="text-sm text-gray-500 mt-2">books</span>
            <span className="text-lg font-semibold">{shelf.bookCount}</span>
          </div>
        </div>
      ))}

      {/* Bottom Drawer */}
      {showDrawer && selectedShelf && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t rounded-t-2xl shadow-xl p-4 z-50">
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
              onClick={() => alert("Add Friend")}
            >
              ➕ Add Friend
            </button>
            <button
              className="bg-yellow-100 p-2 rounded"
              onClick={() => alert("Remove Friend")}
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
      )}

      {/* Remove Mode Book Grid */}
      {removeMode && selectedShelf && selectedShelf.booksData && (
        <GridView
          booksData={selectedShelf.booksData}
          selectedBookData={selectedBookData}
          toggleBookSelection={(id) =>
            setSelectedBookData((prev) =>
              prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
            )
          }
          handleBookClick={() => {}}
          onSelectAll={() =>
            setSelectedBookData(
              selectedShelf.booksData?.map((b) => b._id) || []
            )
          }
          onDeselectAll={() => setSelectedBookData([])}
        />
      )}

      {/* Footer when books selected */}
      {removeMode && selectedBookData.length > 0 && (
        <SelectedBooksFooter
          selectedCount={selectedBookData.length}
          selectedBookData={selectedBookData}
          selectedBookIds={selectedBookData}
          onCancel={() => {
            setSelectedBookData([]);
            setRemoveMode(false);
          }}
          onDeleteSelected={async () => {
            try {
              await axiosInstance.delete("/userbook/deleteBookFromLibrary", {
                data: {
                  userBookIds: selectedBookData,
                  libraryIds: [selectedShelf?.libraryId],
                  deleteFromAll: false,
                },
              });
              await fetchLibraryData();
              setSelectedBookData([]);
              setRemoveMode(false);
            } catch (err) {
              console.error("Failed to delete books", err);
            }
          }}
          refreshData={fetchLibraryData}
        />
      )}

      {/* Delete Shelf Dialog */}
      <ShelfDialog
        isOpen={showDeleteDialog}
        libraryId={selectedShelf?.libraryId || ""}
        shelfName={selectedShelf?.libraryName || ""}
        onClose={() => setShowDeleteDialog(false)}
        onSuccess={() => {
          setShelves((prev) =>
            prev.filter((s) => s.libraryId !== selectedShelf?.libraryId)
          );
          closeDrawer();
        }}
      />
      <RenameShelfDialog
        isOpen={showRenameDialog}
        currentName=""
        onClose={() => setShowRenameDialog(false)}
        onRenameSuccess={(libraryId, newName) => {
          setShelves((prev) =>
            prev.map((s) =>
              s.libraryId === libraryId ? { ...s, libraryName: newName } : s
            )
          );
        }}
      />
    </div>
  );
};

export default ShelvesView;
