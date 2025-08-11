import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Book {
  id: string;
  _id: string;
  title: string;
  author: string[];
  color: string;
  bookHeight: any;
  bookThickness: any;
  bookColorScheme: any;
  bookDetails?: Book; // For backward compatibility with ShelfBook usage
}

interface ShelfState {
  shelves: {
    [shelfName: string]: Book[];
  };
  moveBook: (
    fromShelf: string,
    toShelf: string,
    fromIndex: number,
    toIndex: number
  ) => void;
  setShelves: (newShelves: { [shelfName: string]: Book[] }) => void;
  populateShelvesFromBooks: (books: Book[]) => void;
}

const layoutPattern = [10, 8, 8]; // Book count per row

const useShelfStore = create<ShelfState>()(
  persist(
    (set) => ({
      shelves: {},

      moveBook: (fromShelf, toShelf, fromIndex, toIndex) =>
        set((state) => {
          if (!state.shelves[fromShelf] || !state.shelves[toShelf])
            return state;

          const fromBooks = [...state.shelves[fromShelf]];
          const toBooks =
            fromShelf === toShelf ? fromBooks : [...state.shelves[toShelf]];
          const [movedBook] = fromBooks.splice(fromIndex, 1);
          if (!movedBook) return state;

          toBooks.splice(toIndex, 0, movedBook);

          return {
            shelves: {
              ...state.shelves,
              [fromShelf]: fromBooks,
              [toShelf]: toBooks,
            },
          };
        }),

      setShelves: (newShelves) => set({ shelves: newShelves }),
      populateShelvesFromBooks: (books: Book[]) => {
        set(() => {
          const newShelves: Record<string, Book[]> = {};
          const booksByLibrary: Record<string, Book[]> = {};

          // Group books by library
          books.forEach((book: any) => {
            const libId = book?.libraryId || "unknown";
            if (!booksByLibrary[libId]) booksByLibrary[libId] = [];
            booksByLibrary[libId].push(book);
          });

          let shelfCounter = 1;

          Object.entries(booksByLibrary).forEach(([libId, libraryBooks]) => {
            let bookIndex = 0;
            let patternIndex = 0;

            while (bookIndex < libraryBooks.length) {
              const chunkSize =
                layoutPattern[patternIndex % layoutPattern.length];
              const chunk = libraryBooks.slice(
                bookIndex,
                bookIndex + chunkSize
              );

              const shelfKey = `${libId} - Shelf ${shelfCounter}`;
              newShelves[shelfKey] = chunk;

              bookIndex += chunkSize;
              shelfCounter++;
              patternIndex++;
            }
          });

          return { shelves: newShelves };
        });
      },
    }),
    {
      name: "shelf-storage", // localStorage key
    }
  )
);

export { useShelfStore };
