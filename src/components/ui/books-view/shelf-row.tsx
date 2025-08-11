import React, { useState, useEffect, useRef } from "react";
import { Book, useShelfStore } from "../../../store/shelf-book";
import ShelfBook from "../books/self-book";
import flowerPot from "../../../../public/assets/icons/boipoka/Group 22.svg";
import penStand from "../../../../public/assets/icons/boipoka/penstand.svg";
import BookDetailModal from "../books/books-detail-modal";
import axiosInstance from "../../../api/axios-instance";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface ShelfRowProps {
  shelfName?: string;
  books?: any;
  sortOption?: any;
  mode?: boolean;
  lastBookRef?: (
    bookIndex: number
  ) => ((node?: HTMLDivElement | null) => void) | any;
}

const ShelfRow: React.FC<ShelfRowProps> = ({
  shelfName,
  books,

  mode,
  lastBookRef,
}) => {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [chunkedShelves, setChunkedShelves] = useState<Book[][]>([]);
  const moveBook = useShelfStore((s) => s.moveBook);
  // const libraryId = useAuthStore((s) => s.selectedLibraryId);
  console.log("ShelfRow rendered with mode:", mode);

  // ✅ TouchSensor comes first for mobile priority
  const sensors = useSensors(
    useSensor(TouchSensor, {
      activationConstraint: { delay: 100, tolerance: 10 },
    }),
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  useEffect(() => {
    const chunkBooks = (bookList: Book[]): Book[][] => {
      const shelves: Book[][] = [];
      let index = 0;
      if (bookList.length > 0) {
        shelves.push(bookList.slice(0, 10));
        index += 10;
        while (index < bookList.length) {
          shelves.push(bookList.slice(index, index + 8));
          index += 8;
        }
      }
      return shelves;
    };
    setChunkedShelves(chunkBooks(books));
  }, [books]);

  const handleOpenModal = (book: Book) => setSelectedBook(book);
  const handleCloseModal = () => setSelectedBook(null);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const fromIndex = books.findIndex((b: any) => b._id === active.id);
    const toIndex = books.findIndex((b: any) => b._id === over.id);
    const userBookId = books[fromIndex]?._id;

    if (fromIndex === -1 || toIndex === -1 || !userBookId) return;

    moveBook(shelfName as string, shelfName as string, fromIndex, toIndex);

    const indexFunction = (index: number) => {
      if (index <= 26) {
        if (index <= 10) {
          return [1, index];
        } else if (index <= 18) {
          return [2, index - 10];
        } else if (index <= 26) {
          return [3, index - 18];
        }
      } else {
        let shelfValue = Math.floor(index / 26);
        let modIndex = index % 26;
        if (modIndex === 0) {
          shelfValue -= 1;
          modIndex = 26;
        }
        if (modIndex <= 10) {
          return [3 + shelfValue, modIndex];
        } else if (modIndex <= 18) {
          return [3 + shelfValue, modIndex - 10];
        } else if (modIndex <= 26) {
          return [3 + shelfValue, modIndex - 18];
        }
      }
      return [1, index]; // fallback
    };
    const toValue = indexFunction(toIndex + 1);
    try {
      await axiosInstance.put("/userbook/updateBookPosition", {
        userBookId,
        targetShelfIndex: toValue[1],
        targetPosition: toValue[0],
      });
    } catch (error) {
      console.error("Failed to update book position:", error);
    }
  };

  const iconIndicesRef = useRef<Record<number, number>>({});
  const iconTypeRef = useRef<Record<number, "flower" | "pen">>({});

  const SortableBook = ({
    book,

    onClick,
    refCallback,
  }: {
    book: Book;
    index: number;
    onClick: () => void;
    refCallback?: (node: HTMLDivElement | null) => void;
  }) => {
    const id = book._id;
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,

      isDragging,
    } = useSortable({
      id,
      animateLayoutChanges: () => true,
    });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition: "transform 250ms ease",
      opacity: isDragging ? 0.4 : 1,
      zIndex: isDragging ? 999 : "auto",
      touchAction: "auto", // ✅ Allow touch gestures
    };

    const details = book.bookDetails;
    const {
      title = "Untitled",
      author = ["Unknown Author"],
      bookHeight,
      bookThickness,
      bookColorScheme,
    } = details || {};

    return (
      <div
        className="touch-auto" // ✅ Tailwind utility for touch support
        ref={(node) => {
          setNodeRef(node);
          if (refCallback) refCallback(node);
        }}
        style={style}
        {...attributes}
        {...listeners}
      >
        <ShelfBook
          title={title}
          author={author}
          color={bookColorScheme}
          height={bookHeight}
          width={bookThickness}
          onClick={onClick}
        />
      </div>
    );
  };

  const renderRow = (
    booksInRow: Book[],
    rowOffset: number,
    shelfIndex: number,
    isLastRow: boolean
  ) => {
    const shouldShowIcon = booksInRow.length <= 8;

    if (shouldShowIcon && iconIndicesRef.current[shelfIndex] === undefined) {
      iconIndicesRef.current[shelfIndex] = Math.floor(
        Math.random() * (booksInRow.length + 1)
      );
      iconTypeRef.current[shelfIndex] = Math.random() < 0.5 ? "flower" : "pen";
    }

    const iconIndex = iconIndicesRef.current[shelfIndex];
    const iconChoice = iconTypeRef.current[shelfIndex];
    const iconElement = (
      <div className="px-1 sm:px-2 flex-shrink-0">
        <img
          src={iconChoice === "flower" ? flowerPot : penStand}
          alt={iconChoice === "flower" ? "Flower Pot" : "Pen Stand"}
          className={`h-auto ${
            iconChoice === "flower"
              ? "w-[40px] sm:w-[45px] md:w-[50px]"
              : "w-[40px] sm:w-[45px] md:w-[55px]"
          }`}
        />
      </div>
    );

    const rowItems = booksInRow.map((item, i) => ({
      item,
      actualBookIndex: rowOffset + i,
    }));

    return mode ? (
      <div className="flex flex-wrap sm:flex-nowrap items-end gap-x-1 sm:gap-x-2 md:gap-x-3 lg:gap-x-4 relative px-1 sm:px-2 md:px-4 transition-all">
        {rowItems.map(({ item, actualBookIndex }, i) => {
          const ref =
            lastBookRef && isLastRow && i === rowItems.length - 1
              ? lastBookRef(actualBookIndex)
              : undefined;
          return (
            <React.Fragment key={item._id}>
              {shouldShowIcon && i === iconIndex && iconElement}
              <div ref={ref} onClick={() => handleOpenModal(item)}>
                <ShelfBook
                  title={item.bookDetails?.title as string}
                  author={item.bookDetails?.author as string[]}
                  color={item.bookDetails?.bookColorScheme}
                  height={item.bookDetails?.bookHeight}
                  width={item.bookDetails?.bookThickness}
                />
              </div>
            </React.Fragment>
          );
        })}
        {shouldShowIcon && iconIndex === rowItems.length && iconElement}
      </div>
    ) : (
      <SortableContext
        items={rowItems.map(({ item }) => item._id || "")}
        strategy={horizontalListSortingStrategy}
      >
        <div className="flex flex-wrap sm:flex-nowrap items-end gap-x-1 sm:gap-x-2 md:gap-x-3 lg:gap-x-4 relative px-1 sm:px-2 md:px-4 transition-all">
          {rowItems.map(({ item, actualBookIndex }, i) => {
            const ref =
              lastBookRef && isLastRow && i === rowItems.length - 1
                ? lastBookRef(actualBookIndex)
                : undefined;
            return (
              <React.Fragment key={item._id}>
                {shouldShowIcon && i === iconIndex && iconElement}
                <SortableBook
                  book={item}
                  index={actualBookIndex}
                  onClick={() => handleOpenModal(item)}
                  refCallback={ref}
                />
              </React.Fragment>
            );
          })}
          {shouldShowIcon && iconIndex === rowItems.length && iconElement}
        </div>
      </SortableContext>
    );
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div>
        {chunkedShelves.map((shelfBooks, shelfIndex) => {
          const shelfOffset = shelfIndex === 0 ? 0 : 10 + (shelfIndex - 1) * 8;
          const isLastRow = shelfIndex === chunkedShelves.length - 1;
          return (
            <div
              key={shelfIndex}
              className="pt-2 border-b-4 w-full border-black bg-cover bg-center"
            >
              {renderRow(shelfBooks, shelfOffset, shelfIndex, isLastRow)}
            </div>
          );
        })}
        {selectedBook && (
          <BookDetailModal book={selectedBook} onClose={handleCloseModal} />
        )}
      </div>
    </DndContext>
  );
};

export default ShelfRow;
