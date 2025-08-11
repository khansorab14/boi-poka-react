import React, { useEffect, useState, useRef, useCallback } from "react";
import { useAuthStore } from "../../../state/use-auth-store";
import { useShelfStore } from "../../../store/shelf-book";
import axiosInstance from "../../../api/axios-instance";
import LibraryDropdown from "../../../components/ui/library/library-name";
import ViewControls from "../../../components/ui/books-view/view-control";
import GridView from "../grid-view";
import ListView from "../list-view";
import ShelfView from "../shelf-view";
import SelectedBooksFooter from "../../../components/ui/books-view/selected-book-footer";
import BookDetailModal from "../../../components/ui/books/books-detail-modal";

interface BooksTabProps {
  setShowMoveDialog?: (show: boolean) => void;
  setMoveMode: (mode: "existing" | "new" | null) => void;
  buddyLibrariesData?: any[];
  mode?: "home" | "buddy";
  buddyId?: string;
}

const BooksTab: React.FC<BooksTabProps> = ({
  // setShowMoveDialog,
  // setMoveMode,

  mode,
  buddyId,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // console.log("Buddy Libraries:", buddyLibraries, mode);

  const [view, setView] = useState<"grid" | "list" | "shelf">("shelf");
  const [selectedBookData, setSelectedBookData] = useState<string[]>([]);
  const [selectedLibrary, setSelectedLibrary] = useState("");
  console.log("Selected Library:", selectedLibrary);
  const [sortOption, setSortOption] = useState<
    "default" | "recency" | "desc" | "asc"
  >("default");
  const [selectedGenres, setSelectedGenres] = useState<string[]>();
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>();
  const [books, setBooks] = useState<any[]>([]);
  const [booksData, setBooksData] = useState<any[]>([]);
  const [allBooksData, setAllBooksData] = useState<any[]>([]);
  const [pageNo, setPageNo] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [activeBook, setActiveBook] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const { selectedLibraryId, setSelectedLibraryId } = useAuthStore();
  // console.log(selectedLibraryId, "selectedLibraryId");
  const { shelves, setShelves } = useShelfStore();

  const chunkPattern = [10, 8, 8];
  const shelfStateRef = useRef<Record<string, any[]>>({}); // Persistent shelf structure
  const patternIndexRef = useRef(0); // For cycling chunk sizes
  const shelfCounterRef = useRef(1); // Incrementing shelf names

  const appendToShelves = (newBooks: any[]) => {
    let i = 0;
    while (i < newBooks.length) {
      const chunkSize = chunkPattern[patternIndexRef.current];
      const chunk = newBooks.slice(i, i + chunkSize);

      const shelfName = `Shelf ${shelfCounterRef.current}`;
      if (!shelfStateRef.current[shelfName]) {
        shelfStateRef.current[shelfName] = [];
      }

      shelfStateRef.current[shelfName].push(...chunk);
      setShelves({ ...shelfStateRef.current });

      i += chunkSize;
      shelfCounterRef.current++;
      patternIndexRef.current =
        (patternIndexRef.current + 1) % chunkPattern.length;
    }
  };

  const onSelectAll = async () => {
    try {
      const response = await axiosInstance.get("/userbook/getAllUserBooks");
      const allBookIds =
        response.data?.data?.map((item: any) => item.userBookId) || [];

      setSelectedBookData(allBookIds);
    } catch (error) {
      console.error("Failed to fetch all books:", error);
    }
  };
  const onDeselectAll = () => {
    setSelectedBookData([]);
  };
  const fetchBooks = async (
    page: number,
    libraryId: string,
    sortKey: string,
    authors: string[] = [],
    genres: string[] = []
  ) => {
    const apiPayload = {
      pageNo: page.toString(),
      libraryId,
      genres,
      authors,
      sortBy: sortKey,
    };

    try {
      setIsLoadingMore(true);

      let response;

      if (mode === "buddy") {
        // console.log("Buddy Libraries:", buddyId, mode);

        if (!buddyId) {
          console.error("❌ buddyId is missing in buddyLibraries");
          setHasMore(false);
          return;
        }

        console.log("👤 Fetching buddy books for buddyId:", buddyId);

        response = await axiosInstance.post(
          `/innercircle/getMembersUserBook2/${buddyId}?page=${page}`,
          apiPayload
        );

        console.log("Buddy books fetched:", response.data?.data);
      } else {
        console.log("📚 Fetching books for home mode");
        response = await axiosInstance.post(
          `/userbook/getAllbooks2?page=${page}`,
          apiPayload
        );
        console.log("Books fetched:", response.data?.data);
      }

      const newBooks = response.data?.bookData || response.data?.data || [];

      if (newBooks.length > 0) {
        setAllBooksData((prev) => [...prev, ...newBooks]);
        setBooksData((prev) => [...prev, ...newBooks]);
        setBooks((prev) => [...prev, ...newBooks]);

        appendToShelves(newBooks);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("❌ Failed to fetch books:", error);
      setHasMore(false);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // const refreshData = useCallback(() => {
  //   setPageNo(1);
  //   setHasMore(true);
  //   setAllBooksData([]);
  //   setBooksData([]);
  //   setBooks([]);
  //   shelfStateRef.current = {};
  //   patternIndexRef.current = 0;
  //   shelfCounterRef.current = 1;
  //   setShelves({});
  //   fetchBooks(
  //     1,
  //     selectedLibraryId,
  //     sortOption,
  //     selectedAuthors ?? [],
  //     selectedGenres ?? []
  //   );
  // }, [
  //   selectedLibraryId,
  //   sortOption,
  //   selectedAuthors,
  //   selectedGenres,
  //   setShelves,
  //   fetchBooks,
  // ]);

  const lastBookRef = useCallback(
    (node: HTMLElement | null) => {
      if (isLoadingMore || !hasMore) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          const rect = entry.boundingClientRect;
          const triggerOffset = window.innerHeight * 1;

          if (entry.isIntersecting && rect.top < triggerOffset) {
            const nextPage = pageNo + 1;
            setPageNo(nextPage);
            fetchBooks(
              nextPage,
              selectedLibraryId,
              sortOption,
              selectedAuthors ?? [],
              selectedGenres ?? []
            );
          }
        },
        {
          root: null,
          threshold: 0,
        }
      );

      if (node) observerRef.current.observe(node);
    },
    [
      isLoadingMore,
      hasMore,
      pageNo,
      selectedLibraryId,
      sortOption,
      selectedAuthors,
      selectedGenres,
    ]
  );

  const toggleBookSelection = (userBookId: string) => {
    setSelectedBookData((prev) =>
      prev.includes(userBookId)
        ? prev.filter((id) => id !== userBookId)
        : [...prev, userBookId]
    );
  };

  const clearSelectedBooks = () => setSelectedBookData([]);
  useEffect(() => {
    // Only trigger fetchBooks when preconditions are met
    if (mode === "buddy" && !buddyId) return;

    setPageNo(1);
    setHasMore(true);
    setAllBooksData([]);
    setBooksData([]);
    setBooks([]);
    shelfStateRef.current = {};
    patternIndexRef.current = 0;
    shelfCounterRef.current = 1;
    setShelves({});

    fetchBooks(
      1,
      selectedLibraryId,
      sortOption,
      selectedAuthors ?? [],
      selectedGenres ?? []
    );
  }, [
    mode,
    buddyId,
    selectedLibraryId,
    selectedLibrary,
    sortOption,
    selectedAuthors,
    selectedGenres,
    setShelves,
  ]);

  // useEffect(() => {
  //   setPageNo(1);
  //   setHasMore(true);
  //   setAllBooksData([]);
  //   setBooksData([]);
  //   setBooks([]);
  //   shelfStateRef.current = {};
  //   patternIndexRef.current = 0;
  //   shelfCounterRef.current = 1;
  //   setShelves({});
  //   fetchBooks(
  //     1,
  //     selectedLibraryId,
  //     sortOption,
  //     selectedAuthors ?? [],
  //     selectedGenres ?? []
  //   );
  // }, []);
  const handleBookClick = (book: any) => {
    setActiveBook(book);
    setShowModal(true);
  };
  useEffect(() => {
    const chunkPattern = [10, 8, 8];
    const dynamicShelves: Record<string, any[]> = {};

    let shelfCount = 1;
    let patternIndex = 0;
    let currentChunk: any[] = [];
    let prevLibraryId: string | null = null;

    for (let i = 0; i < allBooksData.length; i++) {
      const book = allBooksData[i];
      const currentLibraryId = book.libraryId || "unknown";

      if (prevLibraryId !== null && currentLibraryId !== prevLibraryId) {
        if (currentChunk.length > 0) {
          dynamicShelves[`Shelf ${shelfCount}`] = [...currentChunk];
          shelfCount++;
          patternIndex = 0;
          currentChunk = [];
        }
      }

      currentChunk.push(book);

      const expectedChunkSize = chunkPattern[patternIndex];

      if (currentChunk.length === expectedChunkSize) {
        dynamicShelves[`Shelf ${shelfCount}`] = [...currentChunk];
        currentChunk = [];
        shelfCount++;
        patternIndex = (patternIndex + 1) % chunkPattern.length;
      }

      prevLibraryId = currentLibraryId;
    }

    if (currentChunk.length > 0) {
      dynamicShelves[`Shelf ${shelfCount}`] = [...currentChunk];
    }

    setShelves(dynamicShelves);
  }, [allBooksData, setShelves]);

  const BOOKS_PER_BATCH = 52;

  const paginatedShelves = Object.entries(shelves).reduce(
    (acc, [shelfName, books]) => {
      acc[shelfName] = books.slice(0, BOOKS_PER_BATCH);
      return acc;
    },
    {} as Record<string, any[]>
  );

  // console.log(paginatedShelves, "paginatedShelves");
  return (
    <>
      <div className="flex justify-between items-center px-4 py-2 border-b shadow-sm">
        <LibraryDropdown
          mode={mode}
          buddyId={buddyId}
          selectedLibrary={selectedLibrary}
          setSelectedLibrary={setSelectedLibrary}
          onLibraryIdChange={setSelectedLibraryId}
        />
        <ViewControls
          sortedData={booksData}
          view={view}
          mode={mode}
          setView={setView as any}
          setFilteredData={() => {}}
          onFilterChange={(genres, authors) => {
            setSelectedGenres(genres);
            setSelectedAuthors(authors);
          }}
          onSortChange={setSortOption as any}
        />
      </div>

      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto mb-20">
        {view === "grid" && (
          <GridView
            booksData={booksData}
            selectedBookData={mode === "buddy" ? [] : selectedBookData}
            handleBookClick={handleBookClick}
            toggleBookSelection={
              mode === "buddy" ? undefined : toggleBookSelection
            }
            onSelectAll={mode === "buddy" ? undefined : onSelectAll}
            onDeselectAll={mode === "buddy" ? undefined : onDeselectAll}
            lastBookRef={lastBookRef}
            isReadOnly={mode === "buddy"}
          />
        )}

        {view === "list" && (
          <ListView
            booksData={books}
            selectedBookData={mode === "buddy" ? [] : selectedBookData}
            handleBookClick={handleBookClick}
            toggleBookSelection={
              mode === "buddy" ? undefined : toggleBookSelection
            }
            setActiveBook={() => {}}
            setShowModal={() => {}}
            showModal={false}
            activeBook={null}
            onSelectAll={mode === "buddy" ? undefined : onSelectAll}
            onDeselectAll={mode === "buddy" ? undefined : onDeselectAll}
            selectedLibraryId={selectedLibraryId}
            lastBookRef={lastBookRef}
            isReadOnly={mode === "buddy"}
          />
        )}

        {view === "shelf" && (
          <ShelfView
            shelves={paginatedShelves}
            sortOption={sortOption}
            lastBookRef={lastBookRef}
            mode={mode === "buddy"}
          />
        )}
      </div>

      <SelectedBooksFooter
        // mode={mode}
        selectedBookData={selectedBookData}
        selectedCount={selectedBookData.length}
        selectedBookIds={[selectedLibraryId]}
        // targetLibraryId={selectedLibraryId}
        // shelves={shelves}
        onCancel={clearSelectedBooks}
        // onMoveClick={() => {
        //   setShowMoveDialog(true);
        //   setMoveMode(null);
        // }}
      />
      {showModal && activeBook && (
        <BookDetailModal
          book={activeBook}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default BooksTab;
