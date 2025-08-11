const SideBar = ({ menuOpen, setMenuOpen }: any) => {
  return (
    <div
      className={`absolute top-0 left-0 h-full w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out transform ${
        menuOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="p-4">
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
  );
};

export default SideBar;
