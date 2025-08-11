import React, { useEffect, useState } from "react";
import { Search, Loader2 } from "lucide-react";
import axiosInstance from "../../../api/axios-instance";
import { toast } from "react-toastify";

interface Book {
  _id: string;
  bookDetails: {
    coverImage: string;
    title: string;
    author: string;
  };
}

interface RemoveBooksDialogProps {
  isOpen: boolean;
  shelves: any;
  setShelves: any;
  onClose: () => void;
  shelfName: string;
  libraryId?: any;
  sortKey?: string;
  authors?: string[];
  genres?: string[];
  refreshData?: () => void;
  books?: any;
  selectedBookIds?: any;
  setSelectedBookIds?: any;
  onSuccess?: any;
  onRemoveSelected?: any;
}

const RemoveBooksDialog: React.FC<RemoveBooksDialogProps> = ({
  isOpen,
  onClose,

  shelfName,
  libraryId,
}) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBookIds, setSelectedBookIds] = useState<string[]>([]);

  const toggleSelect = (id: string) => {
    setSelectedBookIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const fetchBooks = async () => {
    setIsLoading(true);
    try {
      const payload = { libraryId };
      const response = await axiosInstance.post(
        `/userbook/getAllUserBooks2`,
        payload
      );
      const bookList = response.data?.bookData || response.data?.data || [];
      setBooks(bookList);
    } catch (error) {
      console.error("❌ Failed to fetch books:", error);
      toast.error("Failed to load books.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveSelected = async () => {
    if (selectedBookIds.length === 0) return;

    // try {
    //   const response = await axiosInstance.delete(
    //     "/userbook/deleteBookFromLibrary",
    //     {
    //       data: {
    //         userBookIds: selectedBookIds,
    //         libraryIds: [libraryId],
    //         deleteFromAll: false,
    //       },
    //     }
    //   );

    //   toast.success("Books removed from shelf!");
    //   // console.log("shelves", JSON.stringify(shelves));
    //   setShelves((prevShelves: any[]) =>
    //     prevShelves.map((shelf) =>
    //       shelf.libraryId === libraryId
    //         ? {
    //             ...shelf,
    //             bookCount: Math.max(
    //               0,
    //               shelf.bookCount - selectedBookIds.length
    //             ),
    //           }
    //         : shelf
    //     )
    //   );
    //   setSelectedBookIds([]);
    //   onClose();
    //   refreshData?.();
    // } catch (err) {
    //   console.error("❌ Failed to remove books:", err);
    //   toast.error("Failed to remove books.");
    // }
  };

  useEffect(() => {
    if (isOpen) {
      fetchBooks();
      setSelectedBookIds([]); // reset on open
    }
  }, [isOpen, libraryId]);

  const filteredBooks = books.filter((book) =>
    book.bookDetails.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white w-full max-w-xl max-h-[90%] rounded-2xl p-4 shadow-xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="text-xl font-semibold mb-4">
          Remove Books from "{shelfName}"
        </div>

        {/* Search */}
        <div className="flex items-center bg-gray-100 rounded px-3 py-2 mb-4">
          <Search className="w-4 h-4 text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search books"
            className="bg-transparent outline-none w-full text-sm"
            disabled={isLoading}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Book list */}
        <div className="overflow-y-auto flex-1 space-y-4 pr-1">
          {isLoading ? (
            <div className="flex justify-center items-center h-48">
              <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
            </div>
          ) : filteredBooks.length === 0 ? (
            <div className="text-center text-gray-500 py-12 text-sm">
              No books found on this shelf.
            </div>
          ) : (
            filteredBooks.map((book) => (
              <div
                key={book._id}
                className="flex items-center justify-between border-b pb-2"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={book.bookDetails.coverImage || "/default.jpg"}
                    alt={book.bookDetails.title}
                    className="w-10 h-14 object-cover rounded"
                  />
                  <div className="text-sm">
                    <div className="font-medium truncate w-48">
                      {book.bookDetails.title}
                    </div>
                    <div className="text-gray-600 text-xs">
                      {book.bookDetails.author}
                    </div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={selectedBookIds.includes(book._id)}
                  onChange={() => toggleSelect(book._id)}
                  className="w-4 h-4"
                />
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t pt-4 mt-4">
          <button
            onClick={onClose}
            className="text-sm font-medium text-gray-600 px-4 py-2"
          >
            ●●● Cancel
          </button>
          <button
            onClick={handleRemoveSelected}
            disabled={selectedBookIds.length === 0 || isLoading}
            className={`text-sm font-medium flex items-center gap-1 px-4 py-2 rounded ${
              selectedBookIds.length === 0 || isLoading
                ? "bg-gray-200 text-gray-400"
                : "bg-rose-500 text-white"
            }`}
          >
            ↩ Remove Selected
          </button>
        </div>
      </div>
    </div>
  );
};

export default RemoveBooksDialog;
