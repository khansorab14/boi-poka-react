import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const BookDetailModal = ({
  book,
  onClose,
}: {
  bookId?: any;
  book: any;
  onClose: () => void;
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close modal when clicking outside the box
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  if (!book) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div
        ref={modalRef}
        className="bg-white rounded-lg p-6 max-w-sm w-full relative shadow-lg"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black text-2xl font-bold"
          aria-label="Close"
        >
          &times;
        </button>

        {/* Book Cover */}
        <img
          src={book.bookDetails.coverImage || "/images/placeholder-book.png"}
          alt={book.bookDetails.title}
          className="w-full h-full object-cover rounded mb-4"
        />

        {/* Book Info */}
        <h2 className="text-xl font-semibold mb-2">{book.bookDetails.title}</h2>
        <p className="text-gray-700 text-sm mb-1">
          Author: {book.bookDetails.author?.join(", ") || "Unknown"}
        </p>
        {book.bookDetails.description && (
          <p className="text-sm text-gray-600 mt-3 line-clamp-4">
            {book.bookDetails.description}
          </p>
        )}

        {/* More Link */}
        <Link
          to={`/books/${book.bookDetails._id}`}
          className="text-sm text-blue-600 mt-3 underline inline-block"
        >
          More
        </Link>
      </div>
    </div>
  );
};

export default BookDetailModal;
