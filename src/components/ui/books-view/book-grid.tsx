import React from "react";

interface BookGridProps {
  bookId: string;
  coverImage: string;
  title?: string;
  author?: string;
  isSelected: boolean;
  onSelect: any;
  onClick: () => void;
  mode?: "buddy" | "home";
}

const BookGrid: React.FC<BookGridProps> = ({
  coverImage,
  title,

  isSelected,
  onSelect,
  onClick,
  mode,
}) => {
  return (
    <div
      className={`relative rounded-xl shadow hover:shadow-lg transition-all duration-200 bg-white cursor-pointer overflow-hidden border ${
        isSelected ? "ring-2 ring-blue-500" : "border-gray-200"
      }`}
      onClick={onClick}
    >
      {mode !== "buddy" && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
          className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs border ${
            isSelected
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-gray-500 border-gray-300"
          }`}
        >
          {isSelected ? "✓" : "+"}
        </button>
      )}

      {/* Cover Image */}
      <div className="aspect-[2/3] w-full">
        <img
          src={coverImage}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default BookGrid;
