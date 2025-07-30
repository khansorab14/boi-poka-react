import React, { useEffect, useRef, useState, useCallback } from "react";
import ShelfRow from "../../components/ui/books-view/shelf-view";

interface ShelfViewProps {
  sortOption?: string;
  shelves: {
    [shelfName: string]: any[];
  };
  onLoadMore?: () => void;
  hasMore?: boolean;
}

const ShelfView: React.FC<ShelfViewProps> = ({
  shelves,
  sortOption,
  onLoadMore,
  hasMore,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container || isLoading || !hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    if (scrollTop + clientHeight >= scrollHeight - 300) {
      setIsLoading(true);
      onLoadMore?.();
      setTimeout(() => setIsLoading(false), 500);
    }
  }, [isLoading, onLoadMore, hasMore]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <div
      ref={containerRef}
      className="h-[calc(100vh-100px)] overflow-y-auto border-4 border-black m-1"
    >
      {Object.entries(shelves).map(([shelfName, books]) => (
        <ShelfRow
          key={shelfName}
          shelfName={shelfName}
          books={books}
          sortOption={sortOption}
        />
      ))}

      {isLoading && (
        <div className="text-center py-4 text-gray-500 text-sm">
          Loading more books...
        </div>
      )}
    </div>
  );
};

export default ShelfView;
