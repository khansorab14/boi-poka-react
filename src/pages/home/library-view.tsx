// components/ui/library/library-view.tsx

import BookGrid from "../../components/ui/books-view/book-grid.tsx";
import BookList from "../../components/ui/books-view/book-list";
import ShelfRow from "../../components/ui/books-view/shelf-row.tsx";

const LibraryView = ({ data, view }: { data: any[]; view: string }) => {
  console.log(data, "data from library");
  if (view === "grid") {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 px-4 mt-6">
        {data.map((book, index) => (
          <BookGrid
            key={book._id || index}
            bookId={book.bookDetails?._id || book._id}
            coverImage={
              book.bookDetails?.coverImage || "/assets/icons/boipoka/image.jpg"
            }
            isSelected={false}
            onSelect={() => {}}
            onClick={() => {}}
          />
        ))}
      </div>
    );
  }

  if (view === "list") {
    return (
      <div className="flex flex-col gap-4 mt-6">
        {data.map((book, index) => (
          <BookList
            key={index}
            bookId={book.bookDetails?._id || book._id}
            coverImage={
              book.bookDetails?.coverImage || "/assets/icons/boipoka/image.jpg"
            }
            title={book.bookDetails?.title || "Untitled"}
            author={book.bookDetails?.author?.join(", ") || "Unknown Author"}
            isSelected={false}
            onSelect={() => {}}
            onOpenModal={() => {}}
          />
        ))}
      </div>
    );
  }

  if (view === "shelf") {
    return (
      <div className="m-1 border-4 border-black">
        {Object.entries(data || {}).map(([shelfName, books]: any) => (
          <ShelfRow key={shelfName} shelfName={shelfName} books={books} />
        ))}
      </div>
    );
  }

  return null;
};

export default LibraryView;
