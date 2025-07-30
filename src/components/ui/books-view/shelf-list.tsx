interface ShelfItem {
  name: string;
  date: string;
  friends: number;
  books: number;
}

const shelves: ShelfItem[] = [
  { name: "Home", date: "04.06.2025", friends: 3, books: 102 },
  { name: "CSV", date: "05.06.2025", friends: 0, books: 4 },
  { name: "Office", date: "05.06.2025", friends: 0, books: 13 },
  { name: "New Lib", date: "06.06.2025", friends: 1, books: 2 },
];

const ShelfList = () => {
  return (
    <>
      {shelves.map((shelf, i) => (
        <div
          key={i}
          className="bg-yellow-50 rounded p-4 flex justify-between items-center"
        >
          <div>
            <div className="text-lg font-medium">{shelf.name}</div>
            <div className="text-sm text-gray-500">{shelf.date}</div>
            <div className="text-black mt-2">●●●</div>
          </div>
          <div className="flex flex-col text-right">
            <span className="text-sm text-gray-500">friends</span>
            <span className="text-lg font-semibold">{shelf.friends}</span>
            <span className="text-sm text-gray-500 mt-2">books</span>
            <span className="text-lg font-semibold">{shelf.books}</span>
          </div>
        </div>
      ))}
    </>
  );
};

export default ShelfList;
