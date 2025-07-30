import { useEffect, useState } from "react";
import axiosInstance from "../../../api/axios-instance";
import { useAuthStore } from "../../../state/use-auth-store";

interface Library {
  name: string;
  id: string;
}

interface Props {
  selectedLibrary: string;
  setSelectedLibrary: (value: string) => void;
  onLibraryIdChange: (id: string) => void;
}

const LibraryDropdown = ({
  selectedLibrary,
  setSelectedLibrary,
  onLibraryIdChange,
}: Props) => {
  const [libraries, setLibraries] = useState<Library[]>([]);
  const setSelectedLibraryId = useAuthStore(
    (state) => state.setSelectedLibraryId
  ); // ✅ Zustand setter

  useEffect(() => {
    const fetchLibraryNames = async () => {
      try {
        const response = await axiosInstance.get("/userbook/getLibraryData");
        const librariesData = response.data.data.libraryData;

        const formatted = librariesData.map((lib: any) => ({
          name: lib.libraryName,
          id: lib.libraryId,
        }));

        setLibraries(formatted);
      } catch (error) {
        console.error("❌ Failed to fetch library names", error);
      }
    };

    fetchLibraryNames();
  }, []);
  useEffect(() => {
    setSelectedLibrary(""); // Set dropdown to "All Books"
    onLibraryIdChange(""); // Notify parent that no specific library is selected
    setSelectedLibraryId(""); // Set Zustand state to empty (All Books)
  }, []);

  return (
    <div>
      <select
        value={selectedLibrary}
        onChange={(e) => {
          const selectedName = e.target.value;
          setSelectedLibrary(selectedName);

          const selected = libraries.find((lib) => lib.name === selectedName);
          const selectedId = selected?.id || "";

          onLibraryIdChange(selectedId); // send ID to parent
          setSelectedLibraryId(selectedId); // ✅ update Zustand state
        }}
        className="border p-2 rounded w-32"
      >
        <option value="">🏷️ All Books</option>
        {libraries.map((lib, index) => (
          <option key={index} value={lib.name}>
            {lib.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LibraryDropdown;
