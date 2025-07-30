import React, { useEffect, useState, useRef, useCallback } from "react";
import { useAuthStore } from "../../state/use-auth-store";
import axiosInstance from "../../api/axios-instance";
import BookDetailModal from "../../components/ui/books/books-detail-modal";
import ShelvesView from "../../components/ui/shelves/shelves-view";
import LibraryDropdown from "../../components/ui/library/library-name";
import GridView from "./grid-view";
import ListView from "./list-view";
import ShelfView from "./shelf-view";
import ViewControls from "../../components/ui/books-view/view-control";
import SelectedBooksFooter from "../../components/ui/books-view/selected-book-footer";
import MoveActionSelector from "../../components/ui/books/move-action-selector";
import LayoutWithSidebar from "./layout-with-sidebar";
import { useShelfStore } from "../../store/shelf-book";

const Home = () => {
  const [activeTab, setActiveTab] = useState<"books" | "shelves">("books");
  const [bottomTab, setBottomTab] = useState("Library");
  const [view, setView] = useState<"grid" | "list" | "shelf">("shelf");
  const [selectedLibrary, setSelectedLibrary] = useState<string>("");

  const { selectedLibraryId, setSelectedLibraryId } = useAuthStore(
    (state) => state
  );
  console.log(selectedLibraryId, "-<-selectedLibrary");
  const [selectedId, setSelectedId] = useState("");
  const rawLibraryNames = useAuthStore((state) => state.libraryNames);
  const libraryNames = Array.isArray(rawLibraryNames) ? rawLibraryNames : [];

  const [moveMode, setMoveMode] = useState<"existing" | "new" | null>(null);
  const [booksData, setBooksData] = useState<any[]>([]);
  const [activeBook, setActiveBook] = useState<any | null>(null);
  const [selectedBook, setSelectedBook] = useState<{
    _id: string;
    title: string;
  } | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedBookData, setSelectedBookData] = useState<string[]>([]);
  const [showMoveDialog, setShowMoveDialog] = useState(false);
  const [targetShelf, setTargetShelf] = useState("");
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>();
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [sortOption, setSortOption] = useState<
    "default" | "recency" | "desc" | "asc"
  >("default");

  console.log(selectedBookData, "selectedBookData");

  const [allBooksData, setAllBooksData] = useState<any[]>([]);
  // const [selectedGenre, setSelectedGenre] = useState("All");
  const [pageNo, setPageNo] = useState("1");
  // const [selectedAuthor, setSelectedAuthor] = useState("All");
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [books, setBooks] = useState<any[]>([]);

  const { shelves, setShelves } = useShelfStore();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const toggleBookSelection = (bookId: string) => {
    setSelectedBookData((prevSelected) =>
      prevSelected.includes(bookId)
        ? prevSelected.filter((id) => id !== bookId)
        : [...prevSelected, bookId]
    );
  };

  const handleFilterChange = (genres: string[], authors: string[]) => {
    setSelectedGenres(genres);
    setSelectedAuthors(authors);
  };
  const clearSelectedBooks = () => {
    setSelectedBookData([]);
  };

  const handleBookClick = (book: any) => {
    setSelectedBook(book);
    setShowModal(true);
  };

  const handleTabClick = (tab: "books" | "shelves") => setActiveTab(tab);

  const fetchBooks = async (
    pageNo: string,
    libraryId: string,
    sortKey: string,
    authors: string[] = [],
    genres: string[] = []
  ) => {
    if (parseInt(pageNo) > 4) return;

    const apiPayload = {
      pageNo,
      libraryId: libraryId || "",
      genres,
      authors,
      sortBy: sortKey,
    };

    try {
      setIsLoadingMore(true);

      const response = await axiosInstance.post(
        `/userbook/getAllbooks2?page=${pageNo}`,
        apiPayload
      );
      const userBookIds = response.data.data.map((item: any) => item._id);
      // console.log(userBookIds, "Extracted userBookIds");
      // console.log(response.data.data[0]._id, "data from home");

      setSelectedId(userBookIds);
      const newBooks = response.data?.bookData || response.data?.data || [];

      setAllBooksData((prev) =>
        pageNo === "1" ? newBooks : [...prev, ...newBooks]
      );
      setBooksData((prev) =>
        pageNo === "1" ? newBooks : [...prev, ...newBooks]
      );
      setBooks((prev) => (pageNo === "1" ? newBooks : [...prev, ...newBooks]));

      setIsLoadingMore(false);
    } catch (error) {
      setIsLoadingMore(false);
      console.error("❌ Failed to fetch books:", error);
    }
  };
  const applyFilters = () => {
    setPageNo("1");
    fetchBooks(
      "1",
      selectedLibraryId,
      sortOption,
      selectedAuthors ?? [],
      selectedGenres ?? []
    );
  };

  // Fetch on dependencies update
  const refreshData = useCallback(() => {
    setPageNo("1"); // Reset page number first
    fetchBooks(
      "1",
      selectedLibraryId,
      sortOption,
      selectedAuthors ?? [],
      selectedGenres ?? []
    );
  }, [selectedLibraryId, sortOption, selectedAuthors, selectedGenres]);

  // ✅ Use it inside an effect if you want to react to filter changes
  useEffect(() => {
    refreshData();
  }, [selectedLibraryId, sortOption, selectedAuthors, selectedGenres]);
  useEffect(() => {
    setPageNo("1");
  }, [selectedLibraryId]);

  // Scroll listener on the inner container
  useEffect(() => {
    const scrollEl = scrollContainerRef.current;
    if (!scrollEl) return;

    // Run only if 'All Library' is selected
    if (selectedLibraryId !== "all" && selectedLibraryId !== "") return;

    const handleScroll = () => {
      const nearBottom =
        scrollEl.scrollTop + scrollEl.clientHeight >=
        scrollEl.scrollHeight - 300;

      const currentPage = parseInt(pageNo);

      if (nearBottom && !isLoadingMore && currentPage < 4) {
        const nextPage = (currentPage + 1).toString();
        setPageNo(nextPage);
        // Fetch the next page immediately
        fetchBooks(
          nextPage,
          selectedLibraryId,
          sortOption,
          selectedAuthors ?? [],
          selectedGenres ?? []
        );
      }
    };

    scrollEl.addEventListener("scroll", handleScroll);
    return () => scrollEl.removeEventListener("scroll", handleScroll);
  }, [
    pageNo,
    isLoadingMore,
    selectedLibraryId,
    sortOption,
    selectedAuthors,
    selectedGenres,
  ]);

  // Split books into shelves
  useEffect(() => {
    if (!allBooksData || allBooksData.length === 0) return;

    const topShelf = allBooksData.slice(0, 10);
    const middleShelf = allBooksData.slice(10, 26);
    const bottomShelf = allBooksData.slice(26, 34);

    setShelves({
      "Top Shelf": topShelf,
      "Middle Shelf": middleShelf,
      "Bottom Shelf": bottomShelf,
    });
  }, [allBooksData, setShelves]);

  const handleMoveToLibrary = (libraryName: string) => {
    const movedBooks = [...selectedBookData];
    setSelectedBookData([]);

    console.log(`Moved books to ${libraryName}:`, movedBooks);
    refreshData();
  };

  return (
    <LayoutWithSidebar>
      <div className="h-screen flex flex-col bg-white overflow-hidden">
        {/* Sticky Header */}
        <div className="shrink-0 sticky top-0 z-20 bg-white border-b shadow-sm">
          <div className="flex gap-6 mt-16 text-sm py-2 px-4">
            <button
              onClick={() => handleTabClick("books")}
              className={`pb-1 font-semibold ${
                activeTab === "books"
                  ? "border-b-2 border-black text-black"
                  : "text-gray-400"
              }`}
            >
              My books
            </button>
            <button
              onClick={() => handleTabClick("shelves")}
              className={`pb-1 font-semibold ${
                activeTab === "shelves"
                  ? "border-b-2 border-black text-black"
                  : "text-gray-400"
              }`}
            >
              My shelves
            </button>
          </div>

          {activeTab === "books" && (
            <div className="flex justify-between items-center px-4 py-2">
              <div className="max-w-[220px]">
                <LibraryDropdown
                  selectedLibrary={selectedLibrary}
                  setSelectedLibrary={setSelectedLibrary}
                  onLibraryIdChange={setSelectedLibraryId}
                />
              </div>
              <div className="flex gap-2">
                <ViewControls
                  sortedData={booksData}
                  view={view}
                  setView={setView}
                  setFilteredData={setFilteredData}
                  onFilterChange={handleFilterChange}
                  onSortChange={(option) => setSortOption(option)}
                  applyFilters={applyFilters}
                />
              </div>
            </div>
          )}
        </div>

        {/* Scrollable Content */}
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto mb-20  text-center text-xl font-semibold text-gray-700"
        >
          {activeTab === "books" && (
            <>
              {view === "grid" && (
                <GridView
                  booksData={booksData}
                  selectedBookData={selectedBookData}
                  toggleBookSelection={toggleBookSelection}
                  handleBookClick={handleBookClick}
                  onSelectAll={() =>
                    setSelectedBookData(books.map((b) => b?._id))
                  }
                  onDeselectAll={() => setSelectedBookData([])}
                />
              )}

              {view === "list" && (
                <ListView
                  selectedLibraryId={selectedLibraryId}
                  booksData={books}
                  selectedBookData={selectedBookData}
                  toggleBookSelection={toggleBookSelection}
                  setActiveBook={setActiveBook}
                  setShowModal={setShowModal}
                  showModal={showModal}
                  activeBook={activeBook}
                  onSelectAll={() =>
                    setSelectedBookData(books.map((b) => b._id))
                  }
                  onDeselectAll={() => setSelectedBookData([])}
                />
              )}

              {view === "shelf" && (
                <ShelfView shelves={shelves} sortOption={sortOption} />
              )}
            </>
          )}

          <SelectedBooksFooter
            onCancel={clearSelectedBooks}
            selectedBookData={selectedBookData}
            selectedCount={selectedBookData.length}
            selectedBookIds={selectedId}
            targetLibraryId={selectedLibraryId}
            shelves={shelves}
            refreshData={refreshData}
            onMoveClick={() => {
              setShowMoveDialog(true);
              setMoveMode(null);
            }}
          />

          {activeTab === "shelves" && <ShelvesView booksData={books} />}
          {bottomTab === "I am Bored" && <div>I am Bored</div>}
          {bottomTab === "Inner Circle" && <div>Inner Circle</div>}
          {bottomTab === "My Persona" && <div>My Persona</div>}
        </div>
      </div>

      {showMoveDialog && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-40 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 relative">
            {moveMode === null && <MoveActionSelector onSelect={setMoveMode} />}

            {moveMode === "existing" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-center">
                  Select Shelf
                </h2>
                <div className="rounded-xl bg-gray-100 px-4 py-3">
                  <select
                    value={targetShelf}
                    onChange={(e) => setTargetShelf(e.target.value)}
                    className="w-full bg-transparent text-gray-800 font-medium focus:outline-none"
                  >
                    <option value="">Select Shelf</option>
                    {libraryNames.map((lib, i) => (
                      <option key={i} value={lib}>
                        {lib}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <button
                    onClick={() => {
                      setMoveMode(null);
                      setTargetShelf("");
                    }}
                    className="flex items-center gap-1 text-black font-semibold"
                  >
                    <span className="text-2xl">⋯</span> Cancel
                  </button>

                  <button
                    disabled={!targetShelf}
                    onClick={async () => {
                      await handleMoveToLibrary(targetShelf);
                      setTargetShelf("");
                      setMoveMode(null);
                      setShowMoveDialog(false);
                    }}
                    className={`flex items-center gap-1 ${
                      targetShelf
                        ? "text-blue-600 font-semibold"
                        : "text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    <span className="text-xl">↗</span> Move
                  </button>
                </div>
              </div>
            )}

            <button
              className="absolute top-2 right-3 text-gray-400 hover:text-black text-xl"
              onClick={() => {
                setShowMoveDialog(false);
                setMoveMode(null);
              }}
            >
              ✖
            </button>
          </div>
        </div>
      )}
    </LayoutWithSidebar>
  );
};

export default Home;
