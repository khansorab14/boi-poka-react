import { useEffect, useState } from "react";
import { BookOpen, LayoutGrid, List, Filter, SortAsc } from "lucide-react";
import FilterDrawer from "./filter-drawer";
import SortDrawer from "./sort-drawer";
import axiosInstance from "../../../api/axios-instance";

interface ViewControlsProps {
  sortedData: any[];

  view: string;
  setView: (v: string) => void;
  setFilteredData: (data: any[]) => void;

  onFilterChange: (genre: string[], author: string[]) => void;
  onSortChange: (sortOption: string) => void;

  applyFilters?: () => void;

  mode?: "home" | "buddy"; // <-- new prop
}

const ViewControls = ({
  sortedData,
  view,
  setView,
  setFilteredData,
  onSortChange,
  onFilterChange,
  mode, // default to "home"
}: ViewControlsProps) => {
  const [filterGenres, setFilterGenres] = useState<string[]>([]);
  const [filterAuthors, setFilterAuthors] = useState<string[]>([]);
  const [sort, setSort] = useState("Title");
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [showSortDrawer, setShowSortDrawer] = useState(false);
  const [generes, setGenres] = useState<string[]>([]);
  const [author, setAuthors] = useState<string[]>([]);

  // ✅ Fetch filters ONLY if not in buddy mode
  useEffect(() => {
    if (mode === "buddy") return;

    const fetchFilters = async () => {
      try {
        const [authorRes, genreRes] = await Promise.all([
          axiosInstance.get("/userbook/getAllAuthors"),
          axiosInstance.get("/userbook/getAllGenres"),
        ]);
        setAuthors(authorRes.data?.data);
        setGenres(genreRes.data?.data);
      } catch (error) {
        console.error("❌ Failed to fetch authors/genres", error);
      }
    };

    fetchFilters();
  }, [mode]);

  const resetFilters = () => {
    setFilterGenres([]);
    setFilterAuthors([]);
    setFilteredData(sortedData); // reset to full data
    onFilterChange([], []); // notify parent
    setShowFilterDrawer(false);
  };

  const applyFilters = () => {
    let filtered = [...sortedData];

    if (filterGenres.length > 0) {
      filtered = filtered.filter((book) =>
        book.genre?.some((g: string) => filterGenres.includes(g))
      );
    }

    if (filterAuthors.length > 0) {
      filtered = filtered.filter((book) =>
        book.author?.some((a: string) => filterAuthors.includes(a))
      );
    }

    setFilteredData(filtered);
    onFilterChange(filterGenres, filterAuthors);
    setShowFilterDrawer(false);
  };

  const handleSort = (option: string) => {
    setSort(option);
    onSortChange(option);

    let sorted = [...sortedData];

    if (option === "asc") {
      sorted.sort((a, b) =>
        a.bookDetails?.title.localeCompare(b.bookDetails?.title)
      );
    } else if (option === "desc") {
      sorted.sort((a, b) =>
        b.bookDetails?.title.localeCompare(a.bookDetails?.title)
      );
    } else if (option === "recency") {
      sorted.sort(
        (a, b) =>
          new Date(b.bookDetails?.addedAt).getTime() -
          new Date(a.bookDetails?.addedAt).getTime()
      );
    } else if (option === "default") {
      setFilteredData(sortedData); // reset
    }

    setFilteredData(sorted);
    setShowSortDrawer(false);
  };

  const handleMultiSelect = (
    event: React.ChangeEvent<HTMLSelectElement>,
    setter: Function
  ) => {
    const selected = Array.from(
      event.target.selectedOptions,
      (option) => option.value
    );
    setter(selected.includes("all") ? [] : selected);
  };

  return (
    <div className="flex justify-between px-4 mt-4 items-center">
      <div className="flex gap-4">
        {view !== "shelf" && (
          <>
            {/* ✅ Show filter only if not in buddy mode */}
            {mode !== "buddy" && (
              <Filter
                onClick={() => setShowFilterDrawer(true)}
                className="cursor-pointer"
              />
            )}
            <SortAsc
              onClick={() => setShowSortDrawer(true)}
              className="cursor-pointer"
            />
          </>
        )}
        <BookOpen
          className={`cursor-pointer ${view === "shelf" ? "text-black" : "text-gray-400"}`}
          onClick={() => setView("shelf")}
        />
        <LayoutGrid
          className={`cursor-pointer ${view === "grid" ? "text-black" : "text-gray-400"}`}
          onClick={() => setView("grid")}
        />
        <List
          className={`cursor-pointer ${view === "list" ? "text-black" : "text-gray-400"}`}
          onClick={() => setView("list")}
        />
      </div>

      {/* ✅ Render FilterDrawer only if mode !== buddy */}
      {mode !== "buddy" && (
        <FilterDrawer
          show={showFilterDrawer}
          onClose={() => setShowFilterDrawer(false)}
          allGenres={generes}
          allAuthors={author}
          filterGenres={filterGenres}
          filterAuthors={filterAuthors}
          setFilterGenres={setFilterGenres}
          setFilterAuthors={setFilterAuthors}
          handleMultiSelect={handleMultiSelect}
          resetFilters={resetFilters}
          applyFilters={applyFilters}
        />
      )}

      <SortDrawer
        show={showSortDrawer}
        onClose={() => setShowSortDrawer(false)}
        sort={sort}
        handleSort={handleSort}
      />
    </div>
  );
};

export default ViewControls;
