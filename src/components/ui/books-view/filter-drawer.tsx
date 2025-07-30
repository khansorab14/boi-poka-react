import { X, Check } from "lucide-react";

interface FilterDrawerProps {
  show: boolean;
  allGenres: string[];
  allAuthors: string[];
  filterGenres: string[];
  filterAuthors: string[];
  setFilterGenres: (genres: string[]) => void;
  setFilterAuthors: (authors: string[]) => void;
  applyFilters: () => void;
  onClose: () => void;
  resetFilters?: () => void;
}

const FilterDrawer: React.FC<FilterDrawerProps> = ({
  show,
  allGenres,
  allAuthors,
  filterGenres,
  filterAuthors,
  setFilterGenres,
  setFilterAuthors,
  applyFilters,
  onClose,
  resetFilters,
}) => {
  if (!show) return null;

  const toggleSelection = (
    item: string,
    currentList: string[],
    setList: (updated: string[]) => void
  ) => {
    if (item === "All") {
      setList([]);
    } else {
      if (currentList.includes(item)) {
        setList(currentList.filter((i) => i !== item));
      } else {
        setList([...currentList, item]);
      }
    }
  };

  const renderCheckboxList = (
    items: string[],
    selected: string[],
    setSelected: (value: string[]) => void
  ) => (
    <div className="grid grid-cols-2 gap-2 mt-2 max-h-32 overflow-y-auto">
      <div
        key="All"
        onClick={() => toggleSelection("All", selected, setSelected)}
        className="flex items-center gap-2 cursor-pointer"
      >
        <div
          className={`w-5 h-5 border rounded flex items-center justify-center ${
            selected.length === 0 ? "bg-black text-white" : "bg-white"
          }`}
        >
          {selected.length === 0 && <Check size={14} />}
        </div>
        <span className="text-sm">All</span>
      </div>
      {items.map((item) => (
        <div
          key={item}
          onClick={() => toggleSelection(item, selected, setSelected)}
          className="flex items-center gap-2 cursor-pointer"
        >
          <div
            className={`w-5 h-5 border rounded flex items-center justify-center ${
              selected.includes(item) ? "bg-black text-white" : "bg-white"
            }`}
          >
            {selected.includes(item) && <Check size={14} />}
          </div>
          <span className="text-sm">{item}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="absolute top-20 left-4 right-4 bg-white p-4 rounded shadow-md z-50 border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Filter Books</h2>
        <X className="cursor-pointer" onClick={onClose} />
      </div>

      <div className="space-y-6">
        {/* Genre Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Genre
          </label>
          {renderCheckboxList(allGenres, filterGenres, setFilterGenres)}
        </div>

        {/* Author Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Author
          </label>
          {renderCheckboxList(allAuthors, filterAuthors, setFilterAuthors)}
        </div>
        <div className="flex justify-between gap-3  items-center">
          <button
            onClick={applyFilters}
            className="w-full mt-4 px-4 py-2 bg-black text-white rounded"
          >
            Apply Filters
          </button>
          <button
            onClick={resetFilters}
            className=" w-full mt-4 px-4 py-2  bg-red-100 hover:bg-red-200 text-red-600 rounded"
          >
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterDrawer;
