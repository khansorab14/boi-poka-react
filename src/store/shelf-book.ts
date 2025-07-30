import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Book {
  id: string;
  title: string;
  author: string[];
  color: string;
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
}

const shelfLevels = [
  "Top Shelf",
  "Middle Shelf",
  "Bottom Shelf",
  "Floor Shelf",
];
const rowsPerShelf = 2;

const generateShelves = (): { [shelfName: string]: Book[] } => {
  const shelves: { [shelfName: string]: Book[] } = {};
  shelfLevels.forEach((level) => {
    for (let row = 1; row <= rowsPerShelf; row++) {
      shelves[`${level} - Row ${row}`] = [];
    }
  });
  return shelves;
};

export const useShelfStore = create<ShelfState>()(
  persist(
    (set) => ({
      shelves: generateShelves(),

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
    }),
    {
      name: "shelf-storage", // <- key for localStorage
    }
  )
);
