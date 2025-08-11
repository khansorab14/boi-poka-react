import React from "react";
import { Rows3, AlignVerticalJustifyStart } from "lucide-react";

const BookShelfCard: React.FC<{ shelvesData: any[] }> = ({ shelvesData }) => {
  const shelf = shelvesData?.[0];

  if (!shelf) return null;

  return (
    <div className="flex flex-col sm:flex-row items-end sm:items-end gap-6">
      <div className="text-black space-y-4">
        <div className="text-lg font-semibold">{shelf.libName}</div>

        <div className="flex items-end gap-2">
          <Rows3 className="w-5 h-5 text-gray-700" />
          <div>
            <p className="text-sm font-bold leading-tight">
              {shelf.position[0]}
            </p>
            <p className="text-xs text-gray-500">shelf</p>
          </div>
        </div>

        <div className="flex items-end gap-2">
          <AlignVerticalJustifyStart className="w-5 h-5 text-gray-700" />
          <div>
            <p className="text-sm font-bold leading-tight">
              {shelf.position[1]}
            </p>
            <p className="text-xs text-gray-500">from left</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookShelfCard;
