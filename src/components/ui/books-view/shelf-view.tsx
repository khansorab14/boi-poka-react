import React, { useState } from "react";
import { Book, useShelfStore } from "../../../store/shelf-book";
import ShelfBook from "../books/self-book";
import flowerPot from "../../../../public/assets/icons/boipoka/Group 22.svg";
import penStand from "../../../../public/assets/icons/boipoka/penstand.svg";
import BookDetailModal from "../books/books-detail-modal";
import axiosInstance from "../../../api/axios-instance";
import { useAuthStore } from "../../../state/use-auth-store";
interface ShelfRowProps {
  shelfName: string;
  books: Book[];
  sortOption: string;
}
const ShelfRow: React.FC<ShelfRowProps> = ({
  shelfName,
  books,
  sortOption,
}) => {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [draggedBookInfo, setDraggedBookInfo] = useState<{
    fromShelf: string;
    index: number;
    shelfIndex: number;
  } | null>(null);
  const data = useAuthStore((state) => state);
  console.log(data.selectedLibraryId, "selectedLibraryId--> from ");
  const libararyId = data.selectedLibraryId;
  const moveBook = useShelfStore((s) => s.moveBook);
  const handleOpenModal = (book: Book) => setSelectedBook(book);
  const handleCloseModal = () => setSelectedBook(null);
  const handleTouchStart = (index: number, shelfIndex: number) => {
    setDraggedBookInfo({ fromShelf: shelfName, index, shelfIndex });
  };
  const dragDropActive = sortOption === "default" && !!libararyId;
  // const dragDropActive = sortOption === "custom" && !!selectedLibraryId;
  const handleTouchEnd = async (
    targetIndex: number,
    targetShelfIndex: number
  ) => {
    if (!draggedBookInfo) return;
    const { fromShelf, index: fromIndex } = draggedBookInfo;
    const book = books[fromIndex];
    const userBookId = book?.bookDetails?._id;
    if (!userBookId) return;
    moveBook(fromShelf, shelfName, fromIndex, targetIndex);
    setDraggedBookInfo(null);
    try {
      await axiosInstance.put("/userbook/updateBookPosition", {
        userBookId,
        targetShelfIndex,
        targetPosition: targetIndex,
      });
    } catch (error) {
      console.error("Failed to update book position:", error);
    }
  };
  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    index: number,
    shelfIndex: number
  ) => {
    e.dataTransfer.setData(
      "application/json",
      JSON.stringify({ shelfName, index, shelfIndex })
    );
  };
  const handleDrop = async (
    e: React.DragEvent<HTMLDivElement>,
    targetIndex: number,
    targetShelfIndex: number
  ) => {
    e.preventDefault();
    const { shelfName: fromShelf, index: fromIndex } = JSON.parse(
      e.dataTransfer.getData("application/json")
    );
    const book = books[fromIndex];
    const userBookId = book?._id;
    if (!userBookId) return;
    moveBook(fromShelf, shelfName, fromIndex, targetIndex);
    try {
      await axiosInstance.put("/userbook/updateBookPosition", {
        userBookId,
        targetShelfIndex: targetIndex + 1,
        targetPosition: targetShelfIndex + 1,
      });
    } catch (error) {
      console.error("Failed to update book position:", error);
    }
  };
  const renderRow = (
    booksInRow: Book[],
    rowOffset: number,
    shelfIndex: number
  ) => {
    const rowItems: {
      item: Book | { type: "decor"; src: string };
      actualBookIndex?: number;
    }[] = [];
    for (let i = 0; i < booksInRow.length; i += 8) {
      const block = booksInRow.slice(i, i + 8);
      const decor = Math.random() > 0.5 ? penStand : flowerPot;
      const decoratedBlock = [
        ...block.slice(0, 4),
        { type: "decor", src: decor } as const,
        ...block.slice(4),
      ];
      decoratedBlock.forEach((b, j) => {
        const isBook = !("type" in b);
        rowItems.push({
          item: b,
          actualBookIndex: isBook
            ? rowOffset + i + (j < 4 ? j : j - 1)
            : undefined,
        });
      });
    }
    return (
      <div className="flex items-end space-x-2">
        {rowItems.map(({ item, actualBookIndex }, idx) => {
          if ("type" in item && item.type === "decor") {
            return (
              <div
                key={`decor-${rowOffset + idx}`}
                className="w-20 h-16 flex items-end justify-center"
              >
                <img
                  src={item.src}
                  alt="Decor"
                  className="h-full object-contain"
                />
              </div>
            );
          }
          const details = item.bookDetails;
          if (!details || !details._id) return null;
          const {
            _id,
            title = "Untitled",
            author = ["Unknown Author"],
            color,
          } = details;
          const safeColor = color?.trim() ? color : "#FACC15";
          return (
            <ShelfBook
              key={_id}
              title={title}
              author={author}
              color={safeColor}
              onClick={() => handleOpenModal(item)}
              draggable={dragDropActive}
              onDragStart={
                sortOption === "default"
                  ? (e) => handleDragStart(e, actualBookIndex!, shelfIndex)
                  : undefined
              }
              onDrop={
                sortOption === "default"
                  ? (e) => handleDrop(e, actualBookIndex!, shelfIndex)
                  : undefined
              }
              onDragOver={
                sortOption === "default" ? (e) => e.preventDefault() : undefined
              }
              onTouchStart={
                sortOption === "default"
                  ? () => handleTouchStart(actualBookIndex!, shelfIndex)
                  : undefined
              }
              onTouchEnd={
                sortOption === "default"
                  ? () => handleTouchEnd(actualBookIndex!, shelfIndex)
                  : undefined
              }
            />
          );
        })}
      </div>
    );
  };
  const shelves: Book[][] = [];
  for (let i = 0; i < books.length; i += 52) {
    shelves.push(books.slice(i, i + 52));
  }
  return (
    <div>
      {shelves.map((shelfBooks, shelfIndex) => {
        const shelfOffset = shelfIndex * 52;
        return (
          <div
            key={shelfIndex}
            className="pt-2 border-b-4 border-black bg-cover bg-center"
          >
            {renderRow(shelfBooks.slice(0, 10), shelfOffset, shelfIndex)}
            {renderRow(shelfBooks.slice(10, 18), shelfOffset + 10, shelfIndex)}
            {renderRow(shelfBooks.slice(18, 26), shelfOffset + 18, shelfIndex)}
            {renderRow(shelfBooks.slice(26, 36), shelfOffset + 26, shelfIndex)}
            {renderRow(shelfBooks.slice(36, 44), shelfOffset + 36, shelfIndex)}
            {renderRow(shelfBooks.slice(44, 52), shelfOffset + 44, shelfIndex)}
          </div>
        );
      })}
      {selectedBook && (
        <BookDetailModal book={selectedBook} onClose={handleCloseModal} />
      )}
    </div>
  );
};
export default ShelfRow;
