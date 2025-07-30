import { X } from "lucide-react";

interface SortDrawerProps {
  show: boolean;
  sort: string;
  handleSort: (value: string) => void;
  onClose: () => void;
}

const SortDrawer: React.FC<SortDrawerProps> = ({
  show,
  sort,
  handleSort,
  onClose,
}) => {
  if (!show) return null;

  const sortOptions = ["asc", "desc", "recency", "default"];

  return (
    <div className="absolute top-20 right-4 bg-white p-4 rounded shadow-md z-50">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">Sort Books</h2>
        <X className="cursor-pointer" onClick={onClose} />
      </div>
      <ul className="space-y-2">
        {sortOptions.map((option) => (
          <li
            key={option}
            className={`cursor-pointer ${
              sort === option ? "font-bold text-black" : "text-gray-600"
            }`}
            onClick={() => handleSort(option)}
          >
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SortDrawer;
