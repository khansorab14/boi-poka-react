import { useEffect, useState } from "react";
import { BookOpen, LayoutGrid, List, Filter, SortAsc, X } from "lucide-react";
import FilterDrawer from "./filter-drawer";
import SortDrawer from "./sort-drawer";
import axiosInstance from "../../../api/axios-instance";

interface ViewControlsProps {
  sortedData: any[];

  view: string;
  setView: (v: string) => void;
  setFilteredData: (data: any[]) => void;

  onFilterChange: (genre: string[], author: string[]) => void;
  onSortChange: (sortOption: string) => void; // ✅ new prop

  applyFilters: () => void;
}

const ViewControls = ({
  sortedData,

  view,
  setView,
  setFilteredData,
  onSortChange,
  onFilterChange,
}: ViewControlsProps) => {
  const [filterGenres, setFilterGenres] = useState<string[]>([]);
  const [filterAuthors, setFilterAuthors] = useState<string[]>([]);
  const [sort, setSort] = useState("Title");
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [showSortDrawer, setShowSortDrawer] = useState(false);
  const [generes, setGenres] = useState();
  const [author, setAuthors] = useState();
  console.log(filterGenres, "filterGenres");
  console.log(filterAuthors, "filterAuthors");
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const response = await axiosInstance.get("/userbook/getAllAuthors");
        const res = await axiosInstance.get("/userbook/getAllGenres");

        console.log(res.data?.data, "generes");
        setGenres(res.data?.data);
        console.log(response.data?.data, "authors");

        setAuthors(response.data?.data);
      } catch (error) {
        console.error("❌ Failed to fetch library names", error);
      }
    };

    fetchFilters();
  }, []);
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
    onSortChange(option); // Notify parent

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
      setFilteredData(sortedData); // reset  to original order
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
    setter(selected.includes("all") ? [] : selected); // Treat "All" as reset
  };

  return (
    <div className="flex justify-between px-4 mt-4 items-center">
      {/* View Icons */}
      <div className="flex gap-4">
        {view !== "shelf" && (
          <>
            <Filter
              onClick={() => setShowFilterDrawer(true)}
              className="cursor-pointer"
            />
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
