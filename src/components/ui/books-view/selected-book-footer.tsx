import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import axiosInstance from "../../../api/axios-instance";

import { MoveRight, Copy, Trash2, Share2 } from "lucide-react"; // Top of file
import ShelfSelectorModal from "../shelves/shelf-selected-modal";
import ShareBookModal from "../shelves/share-book-modal";
import TopBanner from "./top-banner";
interface Shelf {
  id: string;
  name: string;
}
interface SelectedBooksFooterProps {
  selectedBookData?: string[];
  selectedCount: number;
  selectedBookIds: string[];
  onCancel: () => void;
  refreshData?: () => void;
}
const SelectedBooksFooter: React.FC<SelectedBooksFooterProps> = ({
  selectedCount,
  selectedBookIds,
  onCancel,
  selectedBookData,
  refreshData,
}) => {
  const [isShelfSelectorOpen, setShelfSelectorOpen] = useState(false);
  const [actionType, setActionType] = useState<
    "move" | "copy" | "delete" | null
  >(null);
  const [selectedShelf, setSelectedShelf] = useState<string | null>(null);
  const [shelves, setShelves] = useState<Shelf[]>([]);
  const [isShareModalOpen, setShareModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  // const selectedLibraryId = useAuthStore((state) => state.selectedLibraryId);
  useEffect(() => {
    const fetchLibraryNames = async () => {
      try {
        const response = await axiosInstance.get("/userbook/getLibraryData");
        const librariesData = response?.data?.data?.libraryData || [];
        const formatted = librariesData.map((lib: any) => ({
          name: lib.libraryName,
          id: lib.libraryId,
        }));
        setShelves(formatted);
      } catch (error) {
        console.error(":x: Failed to fetch library names", error);
      }
    };
    fetchLibraryNames();
  }, []);
  const openShelfSelector = (type: "move" | "copy" | "delete") => {
    setActionType(type);
    setShelfSelectorOpen(true);
  };
  const handleShelfSelect = async (shelfId: string) => {
    try {
      if (actionType === "delete") {
        await axiosInstance.delete("/userbook/deleteBookFromLibrary", {
          data: {
            userBookIds: selectedBookData,
            libraryIds: [shelfId],
            deleteFromAll: false,
          },
        });
      } else if (actionType === "move") {
        // Use PUT for move
        await axiosInstance.put("/userbook/moveBooksOrLib", {
          userBookIds: selectedBookIds,
          targetLibraryIds: [shelfId],
        });
      } else if (actionType === "copy") {
        // Use POST for copy
        await axiosInstance.post("/userbook/copyBooksOrLib", {
          userBookIds: selectedBookIds,
          targetLibraryIds: [shelfId],
        });
      }
      setShelfSelectorOpen(false);
      setSelectedShelf(null);
      refreshData?.();
      onCancel();
    } catch (err) {
      console.error(`${actionType} failed:`, err);
    }
  };
  const handleShareClick = () => {
    setShareModalOpen(true);
  };
  const handleShare = async (fullName: string, phone: string) => {
    try {
      const response = await axiosInstance.post("/innercircle/shareBook", {
        userBookIds: selectedBookData,
        invitees: [
          {
            receiverPhoneNumber: phone,
            fullName,
          },
        ],
      });
      console.log(response.data.message, "data toast");
      if (response.data?.message) {
        setSuccessMessage(response.data.message);
        // auto-dismiss banner after 3 seconds
        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
      }
    } catch (error) {
      console.error("Error sharing book:", error);
    }
  };
  if (selectedCount === 0) return null;
  return (
    <>
      <div className="fixed flex justify-center items-center bottom-16 left-0 w-full z-30 px-4">
        <div className="bg-white border shadow-md rounded-xl px-4 py-3 flex justify-between items-center relative">
          <div className="absolute -top-2 -left-2 bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-md">
            {selectedCount}
          </div>
          <div className="flex  justify-between items-center gap-2 flex-wrap">
            <button
              onClick={() => openShelfSelector("move")}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
            >
              <MoveRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => openShelfSelector("copy")}
              className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-600"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              onClick={() => openShelfSelector("delete")}
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleShareClick}
              className="flex items-center gap-2 bg-yellow-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-yellow-600"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={onCancel}
              className="p-2 rounded-full hover:bg-gray-100"
              title="Cancel selection"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
      <ShareBookModal
        isOpen={isShareModalOpen}
        onClose={() => setShareModalOpen(false)}
        onShare={handleShare}
      />
      {isShelfSelectorOpen && (
        <ShelfSelectorModal
          isOpen={isShelfSelectorOpen}
          shelves={shelves}
          selectedShelf={selectedShelf}
          actionType={actionType}
          onSelectShelf={setSelectedShelf}
          onClose={() => {
            setSelectedShelf(null);
            setShelfSelectorOpen(false);
          }}
          onConfirm={() => selectedShelf && handleShelfSelect(selectedShelf)}
        />
      )}
      {successMessage && (
        <TopBanner
          message={successMessage}
          onClose={() => setSuccessMessage("")}
        />
      )}
    </>
  );
};
export default SelectedBooksFooter;
