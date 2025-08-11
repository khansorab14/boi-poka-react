import ShelfRow from "../../components/ui/books-view/shelf-row";

interface ShelfViewProps {
  sortOption?: string;
  shelves: {
    [shelfName: string]: any[];
  };
  lastBookRef?: (node: HTMLDivElement | null) => void;
  mode?: boolean; // true for buddy mode, false for user mode
}

const ShelfView: React.FC<ShelfViewProps> = ({
  shelves,
  sortOption = "default",
  lastBookRef,
  mode,
}) => {
  console.log(mode, "sohrmodeab");
  return (
    <div className="mx-2">
      {Object.entries(shelves).map(
        ([shelfName, books], shelfIndex, shelfArray) => {
          const isLastShelf = shelfIndex === shelfArray.length - 1;
          const lastBookIndex = books.length - 1;

          return (
            <ShelfRow
              mode={mode}
              key={shelfName}
              shelfName={shelfName}
              books={books}
              sortOption={sortOption}
              lastBookRef={(bookIndex: number) =>
                isLastShelf && bookIndex === lastBookIndex
                  ? lastBookRef
                  : undefined
              }
            />
          );
        }
      )}
    </div>
  );
};

export default ShelfView;
