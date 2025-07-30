import React, { useState, useEffect, useRef } from "react";
import axiosInstance from "../../../api/axios-instance";

interface BookData {
  bookId: string;
  libraryId: string;
}

interface ProgressProps {
  progress: number;
  showLabel?: boolean;
  showSliderThumb?: boolean;
  onChange?: (value: number) => void;
  bookId?: string;
  data?: BookData[]; // Array of books
  allSelected?: boolean;
  pageNo?: number;
  genres?: string[];
  authors?: string[];
}

const Progress: React.FC<ProgressProps> = ({
  progress,
  showLabel = true,
  showSliderThumb = false,
  onChange,
  bookId,
  data = [],
  allSelected = false,
  pageNo = 1,
  genres = [],
  authors = [],
}) => {
  const [localProgress, setLocalProgress] = useState(progress);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setLocalProgress(progress);
  }, [progress]);

  const handleChange = (value: number) => {
    setLocalProgress(value);
    onChange?.(value);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      if (allSelected && data.length > 0) {
        const libraryId = data[0]?.libraryId || "";

        const booksPayload = data.map((book) => ({
          bookId: book.bookId,
          readProgress: value,
        }));

        axiosInstance
          .put("/userbook/updateProgress", {
            // pageNo,
            libraryId,
            // genres,
            // authors,
            allSelected: true,
            books: booksPayload,
            readProgress: value,
          })
          .then(() => {
            console.log("All books updated with progress:", value);
          })
          .catch((error) => {
            console.error("Failed to update all books:", error);
          });
      } else if (bookId) {
        axiosInstance
          .put("/userbook/updateProgress", {
            books: [
              {
                bookId: bookId,
                readProgress: value,
              },
            ],
            readProgress: value,
          })
          .then(() => {
            console.log("Single book progress updated:", bookId, value);
          })
          .catch((error) => {
            console.error("Failed to update single book:", error);
          });
      }
    }, 500);
  };

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between mb-1 text-sm text-gray-600">
          <span>Reading Progress</span>
          <span>{localProgress}%</span>
        </div>
      )}

      <input
        type="range"
        min={0}
        max={100}
        value={localProgress}
        onChange={(e) => handleChange(parseInt(e.target.value))}
        disabled={showSliderThumb}
        style={{
          background: `linear-gradient(to right, #86efac 0%, #86efac ${localProgress}%, #d1d5db ${localProgress}%, #d1d5db 100%)`,
        }}
        className={`
          w-full h-2 appearance-none rounded-full 
          accent-green-500
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:h-5
          [&::-webkit-slider-thumb]:w-5
          [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:bg-black
          [&::-webkit-slider-thumb]:border-2
          [&::-webkit-slider-thumb]:border-white
          [&::-webkit-slider-thumb]:shadow-md
          [&::-webkit-slider-thumb]:cursor-pointer
          [&::-moz-range-thumb]:appearance-none
          [&::-moz-range-thumb]:h-5
          [&::-moz-range-thumb]:w-5
          [&::-moz-range-thumb]:rounded-full
          [&::-moz-range-thumb]:bg-black
          [&::-moz-range-thumb]:border-2
          [&::-moz-range-thumb]:border-white
          [&::-moz-range-thumb]:cursor-pointer
          focus:outline-none
        `}
      />
    </div>
  );
};

export default Progress;
