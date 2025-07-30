import React, { useState } from "react";
import { Search } from "lucide-react";
import Footer from "../../components/common/header-footer/footer";
import Header from "../../components/common/header-footer/header";

const LayoutWithSidebar = ({ children }: { children: React.ReactNode }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [bottomTab, setBottomTab] = useState("Library");

  const handleAddItem = () => {
    // Your logic (already handled inside the Footer, but you can log here if needed)
    console.log("Add Item Clicked");
  };

  return (
    <div className="flex flex-col min-h-screen bg-white relative overflow-hidden">
      {/* Overlay */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 bg-black opacity-30 z-20"
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white z-30 shadow-lg transform transition-transform duration-300 ease-in-out ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 relative">
          <button
            onClick={() => setMenuOpen(false)}
            className="absolute top-4 right-4 text-gray-600"
          >
            ✖
          </button>
          <h2 className="text-xl font-semibold mb-4">Menu</h2>
          <ul className="space-y-3 text-gray-700">
            <li>
              <button onClick={() => alert("📚 Your Library")}>
                Your Library
              </button>
            </li>
            <li>
              <button onClick={() => alert("🔔 Notifications")}>
                Notifications
              </button>
            </li>
            <li>
              <button onClick={() => alert("⚙️ Settings")}>Settings</button>
            </li>
          </ul>
        </div>
      </div>

      {/* Header */}
      <Header
        onMenuOpen={() => setMenuOpen(true)}
        onSearchToggle={() => console.log("Search toggled")}
      />

      {/* Main Content */}
      <main className="flex-grow ">{children}</main>

      {/* Footer */}
      <Footer
        bottomTab={bottomTab}
        setBottomTab={setBottomTab}
        handleAddItem={handleAddItem}
      />
    </div>
  );
};

export default LayoutWithSidebar;
