// components/home/TabHeader.tsx
import React from "react";

type Props = {
  activeTab: "books" | "shelves";
  setActiveTab: (tab: "books" | "shelves") => void;
};

const TabHeader: React.FC<Props> = ({ activeTab, setActiveTab }) => (
  <div className="shrink-0 sticky top-0 z-20 bg-white border-b shadow-sm">
    <div className="flex gap-6 mt-16 text-sm py-2 px-4">
      <button
        onClick={() => setActiveTab("books")}
        className={`pb-1 font-semibold ${
          activeTab === "books"
            ? "border-b-2 border-black text-black"
            : "text-gray-400"
        }`}
      >
        My books
      </button>
      <button
        onClick={() => setActiveTab("shelves")}
        className={`pb-1 font-semibold ${
          activeTab === "shelves"
            ? "border-b-2 border-black text-black"
            : "text-gray-400"
        }`}
      >
        My shelves
      </button>
    </div>
  </div>
);

export default TabHeader;
