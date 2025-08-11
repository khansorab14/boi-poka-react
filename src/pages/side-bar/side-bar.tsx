import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../state/use-auth-store";
import { toast } from "react-toastify";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  userData: {
    fullName?: string;
    profileImage?: string;
    joinedDate?: string;
  } | null;
}

const menuItems = [
  { label: "Inner Circle Manager", key: "inner-circle-manager" },
  { label: "My Profile", key: "my-profile" },
  { label: "Settings", key: "settings" },
  { label: "Help", key: "help" },
  { label: "Feedback", key: "feedback" },
  { label: "Logout", key: "logout" },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, userData }) => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const handleMenuClick = (key: string) => {
    if (key === "logout") {
      logout();
      toast.success("👋 Logged out successfully");
      navigate("/login");
    } else {
      console.log(`Navigating to ${key}`);
      // Optional: Add route-based navigation here if needed
    }

    onClose(); // Close sidebar on menu click
  };

  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black bg-opacity-60 z-30"
        />
      )}
      <aside
        className={`fixed top-0 left-0 h-full w-4/5 sm:w-80 bg-black text-white z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl focus:outline-none"
        >
          ✖
        </button>

        <div className="flex flex-col items-center justify-center mt-12 px-6 text-center">
          <div className="bg-white text-black rounded-full w-24 h-24 flex items-center justify-center overflow-hidden mb-4">
            {userData?.profileImage ? (
              <img
                src={userData.profileImage}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-4xl">👤</span>
            )}
          </div>
          <h2 className="text-xl font-bold">{userData?.fullName}</h2>
          <p className="text-sm text-gray-300">
            member since {userData?.joinedDate}
          </p>
          <hr className="border-gray-600 w-3/4 mt-4" />
        </div>

        <nav className="mt-8 space-y-4 px-6">
          {menuItems.map((item) => (
            <button
              key={item.key}
              onClick={() => handleMenuClick(item.key)}
              className="flex items-center space-x-2 text-left w-full hover:text-gray-300"
            >
              <span className="text-lg">–</span>
              <span className="text-base font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
