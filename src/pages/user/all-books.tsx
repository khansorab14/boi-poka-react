import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axios-instance";
import { useAuthStore } from "../../state/use-auth-store";

const AllBooks = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    uploadedImageURL,
    selectedBookIds,
    selectBookId,
    deselectBookId,
    setSelectedBookIds,
    libraryNames,
    setLibraryNames,
    addLibraryName,
    isOnboarded,
    token,
  } = useAuthStore();

  const responseData = location.state?.responseData || { data: [] };

  const [activeTab, setActiveTab] = useState("identified");
  const [showDrawer, setShowDrawer] = useState(false);
  const [newLibraryName, setNewLibraryName] = useState("");
  const [selectedLibraries, setSelectedLibraries] = useState([]);
  const [libraryMode, setLibraryMode] = useState("existing");
  const [existingLibraries, setExistingLibraries] = useState([]);
  const [loading, setLoading] = useState(false);

  const identifiedBooks = responseData.data.filter(
    (item) => item.message === "Book already exists in master"
  );
  const doubtfulBooks = responseData.data.filter(
    (item) => item.message === "Book not found"
  );

  const books = activeTab === "identified" ? identifiedBooks : doubtfulBooks;

  const toggleSelectAll = () => {
    const ids = books.map((item, idx) => item?.data?._id || `book-${idx}`);
    if (selectedBookIds.length === books.length) {
      setSelectedBookIds([]);
    } else {
      setSelectedBookIds(ids);
    }
  };

  const addBooksToLibraries = async () => {
    try {
      setLoading(true);

      if (libraryMode === "new" && !newLibraryName.trim()) {
        alert("Please enter a new library name.");
        return;
      }

      if (libraryMode === "existing" && selectedLibraries.length === 0) {
        alert("Please select at least one existing library.");
        return;
      }

      const libraryIds =
        libraryMode === "new" ? [newLibraryName] : selectedLibraries;

      const payload = {
        libraryIds,
        uploadSource: "IMAGE",
        uploadSourceUrl: uploadedImageURL,
        books: selectedBookIds.map((id) => ({ bookId: id })),
      };

      const res = await axiosInstance.post(
        "/userbook/addBooksToLibraries",
        payload
      );
      console.log("✅ API Response:", res.data);

      if (libraryMode === "new") {
        addLibraryName(newLibraryName);
        setLibraryNames([...libraryNames, newLibraryName]);
      }

      setSelectedBookIds([]);
      setShowDrawer(false);
      setNewLibraryName("");
      setSelectedLibraries([]);
      navigate("/home");
    } catch (err) {
      console.error("❌ Failed to add books:", err);
      alert("Something went wrong while adding books to the library.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchLibraries = async () => {
      try {
        const res = await axiosInstance.get("/userbook/getLibraryData", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setExistingLibraries(res.data.data.libraryData || []);
      } catch (err) {
        console.error("Error fetching libraries", err);
      }
    };

    if (isOnboarded) fetchLibraries();
  }, [isOnboarded, token]);

  return (
    <div className="p-4 pb-32 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">📘 All Books</h1>

      {uploadedImageURL && (
        <div className="mb-6">
          <p className="text-lg font-medium mb-2">Uploaded Image:</p>
          <img
            src={uploadedImageURL}
            alt="Uploaded preview"
            className="w-full rounded-lg border shadow-md max-w-sm mx-auto"
          />
        </div>
      )}

      <div className="flex justify-between items-center gap-2 mb-4">
        <button
          onClick={() => setActiveTab("identified")}
          className={`flex-1 py-2 rounded-full text-sm font-medium transition ${
            activeTab === "identified"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          Identified
        </button>
        <button
          onClick={() => setActiveTab("doubtful")}
          className={`flex-1 py-2 rounded-full text-sm font-medium transition ${
            activeTab === "doubtful"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          Doubtful
        </button>
        <button
          onClick={toggleSelectAll}
          className="py-2 px-3 bg-green-600 text-white text-sm font-medium rounded-full"
        >
          {selectedBookIds.length === books.length
            ? "Deselect All"
            : "Select All"}
        </button>
      </div>

      <div className="flex flex-col gap-4 overflow-y-auto max-h-[calc(100vh-240px)]">
        {books.map((item, idx) => {
          const bookId = item?.data?._id || `book-${idx}`;
          const isSelected = selectedBookIds.includes(bookId);
          const coverImage =
            item.data?.coverImage ||
            item.uploadSourceUrl ||
            "/images/placeholder-book.png";
          const title = item.title || item.data?.title || "Untitled Book";
          const author =
            (item.author && item.author.join(", ")) ||
            (item.data?.author && item.data.author.join(", ")) ||
            "Unknown";

          return (
            <div
              key={bookId}
              className={`flex items-center gap-3 p-3 rounded-xl shadow-md bg-white relative ${
                isSelected ? "ring-2 ring-blue-500" : ""
              }`}
            >
              <img
                src={coverImage}
                alt={title}
                className="w-20 h-28 rounded-md border object-cover"
              />
              <div className="flex-1 pr-6">
                <p className="font-semibold text-sm sm:text-base text-gray-900 break-words line-clamp-2 sm:line-clamp-3">
                  {title}
                </p>
                <p className="text-xs sm:text-sm text-gray-500 mt-1 break-words">
                  Author: {author}
                </p>
              </div>
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() =>
                  isSelected ? deselectBookId(bookId) : selectBookId(bookId)
                }
                className="absolute top-2 right-2 w-5 h-5"
              />
            </div>
          );
        })}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t px-4 py-4 z-50 shadow-md">
        <div className="flex justify-center">
          <button
            className="px-6 py-2 bg-blue-600 text-white rounded text-sm"
            onClick={() => setShowDrawer(true)}
          >
            ➕ Add Book
          </button>
        </div>
      </div>

      {showDrawer && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end">
          <div className="w-full bg-white rounded-t-2xl px-4 py-5 shadow-xl animate-slide-up transition-all duration-300 max-h-[60vh] overflow-y-auto">
            <h2 className="text-lg font-semibold text-center mb-4">
              📚 Add to Library
            </h2>

            {isOnboarded && (
              <div className="mb-6">
                <p className="text-sm font-medium mb-2">
                  Choose Library Option:
                </p>

                <div className="flex flex-col gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="libraryMode"
                      value="existing"
                      checked={libraryMode === "existing"}
                      onChange={() => setLibraryMode("existing")}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Add Existing Library</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="libraryMode"
                      value="new"
                      checked={libraryMode === "new"}
                      onChange={() => {
                        setLibraryMode("new");
                        setSelectedLibraries([]);
                      }}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Create New Library</span>
                  </label>
                </div>

                {libraryMode === "existing" ? (
                  <select
                    multiple
                    value={selectedLibraries}
                    onChange={(e) => {
                      const selected = Array.from(
                        e.target.selectedOptions,
                        (option) => option.value
                      );
                      setSelectedLibraries(selected);
                      setNewLibraryName("");
                    }}
                    className="w-full px-4 py-2 mt-4 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 h-40"
                  >
                    {existingLibraries.map((lib, idx) => (
                      <option key={idx} value={lib.libraryId}>
                        {lib.libraryName}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    placeholder="Enter new library name"
                    className="w-full px-4 py-2 mt-4 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newLibraryName}
                    onChange={(e) => {
                      setNewLibraryName(e.target.value);
                      setSelectedLibraries([]);
                    }}
                  />
                )}
              </div>
            )}

            <div className="flex justify-between gap-3">
              <button
                onClick={() => {
                  setShowDrawer(false);
                  setNewLibraryName("");
                  setSelectedLibraries([]);
                }}
                className="w-1/2 py-2 rounded-lg bg-gray-200 text-gray-700 text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={addBooksToLibraries}
                disabled={loading}
                className={`w-1/2 py-2 rounded-lg text-sm font-medium ${loading ? "bg-blue-300" : "bg-blue-600 text-white"}`}
              >
                {loading ? "Saving..." : "Continue"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllBooks;
