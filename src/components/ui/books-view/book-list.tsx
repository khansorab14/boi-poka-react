import React from "react";
import { Plus } from "lucide-react";

interface BookListProps {
  bookId: string;
  coverImage: string;
  isSelected: boolean;
  allSelected: boolean;
  onSelect: () => void;
  onClick: () => void;
  extraContent?: React.ReactNode; // 👈 Add this
}

const BookList: React.FC<BookListProps> = ({
  bookId,
  coverImage,
  title = "Untitled",
  author = "Unknown",
  isSelected,
  allSelected,
  onSelect,
  onOpenModal,
  extraContent,
}) => {
  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-xl shadow-md bg-white relative cursor-pointer transition-all duration-200 ${
        allSelected || isSelected ? "ring-2 ring-blue-500 ring-offset-2" : ""
      }`}
    >
      {/* Plus icon button */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // prevent modal opening
          onSelect();
        }}
        className="absolute top-2 right-2 bg-white border border-gray-300 p-1 rounded-full shadow-md hover:bg-blue-100"
      >
        <Plus className="w-4 h-4 text-gray-800" />
      </button>

      <img
        src={coverImage || "/images/placeholder-book.png"}
        alt={title}
        className="w-20 h-28 rounded-md border object-cover"
      />
      {extraContent && (
        <div className="w-full">
          <div className="flex-1 pr-6" onClick={onOpenModal}>
            <p className="font-semibold text-[10px] sm:text-base text-gray-900 break-words line-clamp-2 sm:line-clamp-3">
              {title}
            </p>
            <p className="text-xs sm:text-sm text-black mt-1 font-thin break-words">
              {author}
            </p>
          </div>
          {extraContent}
        </div>
      )}
      {!extraContent && (
        <div className="flex-1 pr-6" onClick={onOpenModal}>
          <p className="font-semibold text-sm sm:text-base text-gray-900 break-words line-clamp-2 sm:line-clamp-3">
            {title}
          </p>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 break-words">
            Author: {author}
          </p>
        </div>
      )}
    </div>
  );
};

export default BookList;
