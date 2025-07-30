// components/layout/Footer.tsx
import React, { useState } from "react";
import { Plus } from "lucide-react";

import Library1 from "../../../../public/assets/icons/boipoka/image 180.svg";

import Library2 from "../../../../public/assets/icons/boipoka/_ÎÓÈ_1.svg";
import Library3 from "../../../../public/assets/icons/boipoka/Vector.svg";
import Library4 from "../../../../public/assets/icons/boipoka/Group 21.svg";
import CreateYourLibrary from "../../../pages/user/create-your-library";
import { useUIStore } from "../../../store/ui-store";

interface FooterProps {
  bottomTab: string;
  setBottomTab: (tab: string) => void;
  // handleAddItem: () => void;
}

const Footer: React.FC<FooterProps> = ({
  bottomTab,
  setBottomTab,
  // handleAddItem,
}) => {
  const { showLibrary, toggleLibrary, setShowLibrary } = useUIStore();
  // const [showLibrary, setShowLibrary] = useState(false);
const handleAddItem = () => {
  setShowLibrary(!showLibrary);
};
  return (
    <div className="fixed bottom-0 left-0 w-full border-t bg-white px-4 py-3 grid grid-cols-5 items-end text-xs z-10">
      <button
        onClick={() => setBottomTab("Library")}
        className={`flex flex-col items-center ${bottomTab === "Library" ? "text-black" : "text-gray-400"}`}
      >
        <img src={Library1} alt="Library" className="w-5 h-5 mb-1" />
        <span>Library</span>
      </button>
      <button
        onClick={() => setBottomTab("I am Bored")}
        className={`flex flex-col items-center ${bottomTab === "I am Bored" ? "text-black" : "text-gray-400"}`}
      >
        <img src={Library2} alt="I am Bored" className="w-5 h-5 mb-1" />
        <span>I am Bored</span>
      </button>
      <div className="relative flex flex-col items-center">
        <button
          onClick={handleAddItem}
          className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center absolute -top-8"
        >
          <Plus className="w-6 h-6" />
        </button>
        {showLibrary && <CreateYourLibrary />}

        <span className="text-gray-400 mt-6">Add Item</span>
      </div>
      <button
        onClick={() => setBottomTab("Inner Circle")}
        className={`flex flex-col items-center ${bottomTab === "Inner Circle" ? "text-black" : "text-gray-400"}`}
      >
        <img src={Library3} alt="Inner Circle" className="w-5 h-5 mb-1" />
        <span>Inner Circle</span>
      </button>
      <button
        onClick={() => setBottomTab("My Persona")}
        className={`flex flex-col items-center ${bottomTab === "My Persona" ? "text-black" : "text-gray-400"}`}
      >
        <img src={Library4} alt="My Persona" className="w-5 h-5 mb-1" />
        <span>My Persona</span>
      </button>
    </div>
  );
};

export default Footer;
