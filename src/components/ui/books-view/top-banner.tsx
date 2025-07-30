// components/TopBanner.tsx
import React from "react";

interface TopBannerProps {
  message: string;
  onClose: () => void;
}

const TopBanner: React.FC<TopBannerProps> = ({ message, onClose }) => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-green-500 text-white py-3 px-6 text-center shadow-md animate-slide-in">
      {message}
      <button
        onClick={onClose}
        className="absolute right-4 top-2 text-white text-lg"
      >
        &times;
      </button>
    </div>
  );
};

export default TopBanner;
