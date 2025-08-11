import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ChevronDownIcon } from "lucide-react";

type Library = {
  libraryId: string;
  libraryName: string;
  bookCount: number;
};

type Book = {
  _id: string;
  title: string;
  author: string;
};

type Buddy = {
  buddyId: string;
  fullName: string;
  profileImage?: string;
  librariesSharedByBuddy: Library[];
  librariesSharedByUser: Library[];
  totalBooksSharedByBuddy: number;
  totalBooksSharedByUser: number;
  booksSharedByBuddy: Book[];
  booksSharedByUser: Book[];
};

const FellowPokaCard = ({
  buddyId,
  fullName,
  profileImage,
  librariesSharedByBuddy,
  librariesSharedByUser,
  totalBooksSharedByBuddy,
  totalBooksSharedByUser,
  booksSharedByBuddy,
  booksSharedByUser,
}: Buddy) => {
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState<
    "sharedByBuddy" | "sharedByUser"
  >("sharedByBuddy");

  const [dropdownOpen, setDropdownOpen] = useState<
    "books" | "libraries" | null
  >(null);

  const libraries =
    activeSection === "sharedByUser"
      ? librariesSharedByUser
      : librariesSharedByBuddy;

  const totalBooks =
    activeSection === "sharedByUser"
      ? totalBooksSharedByUser
      : totalBooksSharedByBuddy;

  const handleCardClick = () => {
    navigate(`/buddy-library/${buddyId}`, {
      state: {
        buddyId,
        fullName,
        profileImage,
        librariesSharedByBuddy,
        librariesSharedByUser,
        totalBooksSharedByBuddy,
        totalBooksSharedByUser,
        booksSharedByBuddy,
        booksSharedByUser,
      },
    });
  };

  return (
    <div className="w-full rounded-2xl shadow-md bg-white border border-gray-200 p-5 sm:p-6 flex flex-col gap-4 hover:shadow-lg transition-all relative">
      {/* Avatar and Name */}
      <div
        className="flex items-center gap-4 cursor-pointer"
        onClick={handleCardClick}
      >
        {profileImage ? (
          <img
            src={profileImage}
            alt={fullName}
            className="w-16 h-16 rounded-full object-cover"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xl font-semibold">
            {fullName.charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <p className="text-lg font-semibold text-gray-900">{fullName}</p>
          <p className="text-sm text-gray-500">Fellow Poka</p>
        </div>
      </div>

      {/* Shared Stats with Dropdowns */}
      <div className="flex items-center gap-6 relative">
        {/* Shelves Count */}
        <div className="text-center relative">
          <p className="text-3xl font-bold text-indigo-600">
            {(librariesSharedByBuddy.length + librariesSharedByUser.length)
              .toString()
              .padStart(2, "0")}
          </p>
          <div
            onClick={() =>
              setDropdownOpen(dropdownOpen === "libraries" ? null : "libraries")
            }
            className="flex items-center justify-center gap-1 text-sm text-gray-700 cursor-pointer select-none hover:underline"
          >
            {activeSection === "sharedByUser"
              ? "Shelves by You"
              : "Shelves by Buddy"}
            <ChevronDownIcon className="h-4 w-4" />
          </div>
          {dropdownOpen === "libraries" && (
            <div className="absolute top-16 z-20 w-48 bg-white border border-gray-200 rounded-md shadow-md overflow-hidden">
              <button
                onClick={() => {
                  setActiveSection("sharedByBuddy");
                  setDropdownOpen(null);
                }}
                className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 ${
                  activeSection === "sharedByBuddy"
                    ? "font-semibold text-indigo-600"
                    : ""
                }`}
              >
                Shelves by Buddy
              </button>
              <button
                onClick={() => {
                  setActiveSection("sharedByUser");
                  setDropdownOpen(null);
                }}
                className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 ${
                  activeSection === "sharedByUser"
                    ? "font-semibold text-indigo-600"
                    : ""
                }`}
              >
                Shelves by You
              </button>
            </div>
          )}
        </div>

        {/* Books Count */}
        <div className="text-center relative">
          <p className="text-3xl font-bold text-green-700">
            {String(totalBooks).padStart(2, "0")}
          </p>
          <div
            className="flex items-center justify-center gap-1 text-sm text-gray-700 cursor-pointer select-none hover:underline"
            onClick={() =>
              setDropdownOpen(dropdownOpen === "books" ? null : "books")
            }
          >
            {activeSection === "sharedByUser"
              ? "Books by You"
              : "Books by Buddy"}
            <ChevronDownIcon className="h-4 w-4" />
          </div>
          {dropdownOpen === "books" && (
            <div className="absolute top-16 z-20 w-64 bg-white border border-gray-200 rounded-md shadow-md max-h-64 overflow-y-auto">
              <div className="sticky top-0 bg-white border-b px-3 py-2 text-xs font-semibold text-gray-600 uppercase">
                {activeSection === "sharedByUser"
                  ? "Books by You"
                  : "Books by Buddy"}
              </div>
              {(activeSection === "sharedByUser"
                ? booksSharedByUser
                : booksSharedByBuddy
              ).map((book) => (
                <div
                  key={book._id}
                  onClick={() => navigate(`/books/${book._id}`)}
                  className="px-3 py-2 text-sm text-gray-800 hover:bg-gray-50 cursor-pointer"
                >
                  <span className="font-medium">{book.title}</span>{" "}
                  <span className="text-xs text-gray-500 italic">
                    by {book.author}
                  </span>
                </div>
              ))}

              {(activeSection === "sharedByUser"
                ? booksSharedByUser
                : booksSharedByBuddy
              ).length === 0 && (
                <div className="px-3 py-2 text-sm text-gray-500 italic">
                  No books available
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Library List */}
      <div className="flex flex-col gap-2 border-t border-gray-200 pt-4">
        {libraries.length === 0 ? (
          <p className="text-sm text-gray-500 italic">No shelves to show.</p>
        ) : (
          libraries.map((lib) => (
            <div
              key={lib.libraryId}
              className="flex justify-between items-center hover:bg-gray-100 px-3 py-2 rounded cursor-pointer"
            >
              <span className="text-sm font-medium text-gray-900">
                {lib.libraryName}
              </span>
              <span className="text-xs text-gray-500">
                {lib.bookCount} books
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FellowPokaCard;
