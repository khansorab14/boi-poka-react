import React from "react";
import { Search, Bell, User } from "lucide-react";

interface HeaderProps {
  onMenuOpen?: () => void;
  onSearchToggle?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuOpen, onSearchToggle }) => {
  return (
    <div className="fixed top-0 left-0 w-full z-40 bg-white p-4 shadow flex items-center justify-between">
      <button onClick={onMenuOpen}>
        <svg
          className="w-6 h-6 text-gray-800"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      <div className="absolute left-1/2 transform -translate-x-1/2 text-lg font-bold">
        Home
      </div>

      <div className="flex items-center gap-4">
        <button onClick={onSearchToggle}>
          <Search className="w-6 h-6 text-gray-800" />
        </button>
        <button onClick={() => alert("🔔 Notifications")}>
          <Bell className="w-6 h-6 text-gray-800" />
        </button>
        <button onClick={() => alert("👤 Profile clicked")}>
          <User className="w-6 h-6 text-gray-800" />
        </button>
      </div>
    </div>
  );
};

export default Header;
