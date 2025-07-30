import React, { useEffect, useMemo, useState } from "react";
import { CheckCircle, Circle, SquareCheck } from "lucide-react";
import BookList from "../../components/ui/books-view/book-list";
import BookDetailModal from "../../components/ui/books/books-detail-modal";
import Progress from "../../components/ui/progress-bar/progress-bar";
import { useAuthStore } from "../../state/use-auth-store";
import axiosInstance from "../../api/axios-instance";

interface ListViewProps {
  booksData: any[];
  selectedBookData: string[];
  toggleBookSelection: (id: string) => void;
  setActiveBook: (book: any) => void;
  setShowModal: (visible: boolean) => void;
  showModal: boolean;
  activeBook: any;
  selectedLibraryId?: string;
  onSelectAll?: () => void;
  onDeselectAll?: () => void;
}

const ListView: React.FC<ListViewProps> = ({
  booksData,
  selectedBookData,
  toggleBookSelection,
  setActiveBook,
  setShowModal,
  showModal,
  activeBook,
  selectedLibraryId,
  onSelectAll,
  onDeselectAll,
}) => {
  const data = useAuthStore((state) => state);

  const [localProgress, setLocalProgress] = useState(0);
  const [pendingValue, setPendingValue] = useState<number | null>(null);

  const uniqueBookList = useMemo(() => {
    return Array.from(
      new Map(
        booksData.filter((b) => b.bookDetails?._id).map((b) => [b.bookId, b])
      ).values()
    );
  }, [booksData]);

  const selectedSet = useMemo(
    () => new Set(selectedBookData),
    [selectedBookData]
  );
  const allSelected = uniqueBookList.every((book) => selectedSet.has(book._id));

  const progressData = useMemo(
    () =>
      booksData.map((b) => ({
        bookId: b._id,
        libraryId: b.libraryId,
      })),
    [booksData]
  );

  const handleChange = (value: number) => {
    setLocalProgress(value);
    setPendingValue(value);
  };

  const handleUpdateClick = async () => {
    if (pendingValue === null) return;

    try {
      if (allSelected && progressData.length > 0) {
        const libraryId = progressData[0]?.libraryId || "";
        const booksPayload = progressData.map((book) => ({
          bookId: book.bookId,
          readProgress: pendingValue,
        }));

        await axiosInstance.put("/userbook/updateProgress", {
          libraryId,
          allSelected: true,
          books: booksPayload,
          readProgress: pendingValue,
        });
      }

      setPendingValue(null);
      window.location.reload();
    } catch (error) {
      console.error("❌ Failed to update progress:", error);
    }
  };

  const SelectAllButton = () => (
    <button
      onClick={allSelected ? onDeselectAll : onSelectAll}
      className="flex items-center gap-2 text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded transition"
    >
      {allSelected ? (
        <>
          <CheckCircle className="w-4 h-4 text-green-500" />
          Deselect All
        </>
      ) : (
        <>
          <Circle className="w-4 h-4 text-gray-500" />
          Select All
        </>
      )}
    </button>
  );

  return (
    <div className="relative flex flex-col gap-4 mt-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between px-4">
        <h2 className="text-lg font-semibold">Books</h2>
        <SelectAllButton />
      </div>

      {/* Library-wide progress bar */}
      {selectedLibraryId && allSelected && (
        <div className="px-4">
          <div className="mb-2">
            <div className="flex justify-between text-sm text-gray-700">
              <span className="font-medium">Update All Progress</span>
              <span className="font-semibold text-green-600">
                {localProgress}%
              </span>
            </div>
          </div>
          <Progress
            data={progressData}
            bookId={undefined}
            progress={localProgress}
            allSelected={true}
            pageNo={1}
            genres={[]}
            authors={[]}
            onChange={handleChange}
          />
          <button
            onClick={handleUpdateClick}
            className="mt-3 w-full bg-green-500 hover:bg-green-600 transition-colors text-white py-2 rounded-lg font-medium"
          >
            ✅ Update All Progress
          </button>
        </div>
      )}

      {/* Book List */}
      {uniqueBookList.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">No books found.</div>
      ) : (
        uniqueBookList.map((book, index) => {
          const bookId = book.bookDetails._id;
          const isSelected = selectedSet.has(bookId);
          const coverImage =
            book.bookDetails?.coverImage || "/assets/icons/boipoka/image.jpg";

          return (
            <BookList
              key={`${book.bookId}-${index}`}
              bookId={bookId}
              coverImage={coverImage}
              title={book.bookDetails?.title}
              author={book.bookDetails?.author?.join(", ")}
              isSelected={isSelected}
              allSelected={allSelected}
              onSelect={() => toggleBookSelection(bookId)}
              onOpenModal={() => {
                setActiveBook(book);
                setShowModal(true);
              }}
              extraContent={
                selectedLibraryId && (
                  <div className="w-full pt-2">
                    <Progress
                      data={progressData}
                      bookId={book.bookId}
                      progress={book.readProgress || 0}
                      allSelected={false}
                      pageNo={1}
                      genres={[]}
                      authors={[]}
                    />
                  </div>
                )
              }
            />
          );
        })
      )}

      {/* Book Detail Modal */}
      {showModal && activeBook && (
        <BookDetailModal
          book={activeBook}
          onClose={() => setShowModal(false)}
        />
      )}

      {/* Floating Select/Deselect All Button */}
      {selectedLibraryId !== "all" && uniqueBookList.length > 0 && (
        <button
          className="fixed bottom-20 right-6 z-50 bg-black text-white rounded-full p-3 shadow-lg hover:bg-gray-800 transition flex items-center gap-2"
          onClick={allSelected ? onDeselectAll : onSelectAll}
        >
          {allSelected ? (
            <>
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-sm">Deselect All</span>
            </>
          ) : (
            <>
              <SquareCheck className="w-5 h-5 text-white" />
              <span className="text-sm">Select All</span>
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default ListView;
