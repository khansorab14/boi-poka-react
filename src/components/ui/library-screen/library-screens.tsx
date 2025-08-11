import { useEffect, useState } from "react";
import { useAuthStore } from "../../../state/use-auth-store";
import axiosInstance from "../../../api/axios-instance";

const LibraryScreen = () => {
  const { currentShelf, libraryBookMap } = useAuthStore();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [books, setBooks] = useState<any>([]); // adjust type as needed

  useEffect(() => {
    const fetchBooks = async () => {
      if (!currentShelf) return;
      const bookIds = libraryBookMap[currentShelf] || [];

      const fetchedBooks = await Promise.all(
        bookIds.map(async (id: string) => {
          try {
            const res = await axiosInstance.get(
              `/userbook/getBookDetails/${id}`
            );
            return res.data;
          } catch (err) {
            console.error(`Failed to fetch book ${id}`, err);
            return null;
          }
        })
      );

      setBooks(fetchedBooks.filter(Boolean)); // remove failed ones
    };

    fetchBooks();
  }, [currentShelf, libraryBookMap]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Books in: {currentShelf}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {books.map((book: any, index: any) => (
          <div key={index} className="p-2 border rounded shadow-sm">
            <img
              src={book.coverImage}
              alt={book.title}
              className="w-full h-40 object-cover mb-2"
            />
            <h3 className="text-sm font-medium">{book.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LibraryScreen;
