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

  // ✅ Normalize structure so we always use `details` for rendering
  const details = book.bookDetails || book;
  const bookId = book.bookId || details.bookId;

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
          src={details.coverImage || "/images/placeholder-book.png"}
          alt={details.title || "Untitled"}
          className="w-full h-full object-cover rounded mb-4"
        />

        <h2 className="text-xl font-semibold mb-2">
          {details.title || "No title available"}
        </h2>

        <p className="text-gray-700 text-sm mb-1">
          Author:{" "}
          {Array.isArray(details.author)
            ? details.author.join(", ")
            : details.author || "Unknown"}
        </p>

        {details.description && (
          <p className="text-sm text-gray-600 mt-3 line-clamp-4">
            {details.description}
          </p>
        )}

        {/* More Link */}
        <Link
          to={`/books/${bookId}`}
          className="text-sm text-blue-600 mt-3 underline inline-block"
        >
          More
        </Link>
      </div>
    </div>
  );
};

export default BookDetailModal;
