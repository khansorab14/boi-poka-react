import React from "react";
import BookGrid from "../../components/ui/books-view/book-grid";
import { CheckCircle, Circle } from "lucide-react";

interface GridViewProps {
  booksData: any[];
  selectedBookData: string[];
  toggleBookSelection: any;
  handleBookClick: (book: any) => void;
  onSelectAll?: () => void;
  onDeselectAll?: () => void;
  lastBookRef?: (node: HTMLElement | null) => void;
  isReadOnly?: boolean;
  mode?: "buddy" | "home"; // optional, defaults to "home"
}

const GridView: React.FC<GridViewProps> = ({
  booksData,
  selectedBookData,
  toggleBookSelection,
  handleBookClick,
  onSelectAll,
  lastBookRef,
  mode,
  onDeselectAll,
}) => {
  console.log(booksData, "booksData");
  const uniqueBookList = Array.from(
    new Map(booksData.map((b) => [b._id, b])).values()
  );
  const allSelected = uniqueBookList.every((book) =>
    selectedBookData.includes(book._id)
  );
  console.log("allSelected", allSelected);
  console.log("sleected data", selectedBookData);

  return (
    <div className="px-4 mt-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Books</h2>
        {mode !== "buddy" && (
          <button
            onClick={allSelected ? onDeselectAll : onSelectAll}
            className="flex items-center gap-2 text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded transition"
          >
            {allSelected ? (
              <>
                <CheckCircle className="w-4 h-4 text-green-600" />
                Deselect All
              </>
            ) : (
              <>
                <Circle className="w-4 h-4 text-gray-500" />
                Select All
              </>
            )}
          </button>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {uniqueBookList.map((book, index) => {
          const bookId = book._id;
          const isSelected = selectedBookData.includes(bookId);
          const coverImage =
            book.bookDetails.coverImage || "/assets/icons/boipoka/image.jpg";

          const isLast = index === uniqueBookList.length - 1;

          return (
            <div key={bookId} ref={isLast ? lastBookRef : null}>
              <BookGrid
                bookId={bookId}
                coverImage={coverImage}
                isSelected={isSelected}
                onSelect={
                  mode === "buddy"
                    ? undefined
                    : () => toggleBookSelection(bookId)
                }
                onClick={() => handleBookClick(book)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GridView;
