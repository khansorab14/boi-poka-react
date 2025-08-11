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
  mode?: "buddy" | "home"; // optional, defaults to "user"
  buddyId?: string; // required when mode is "buddy"
}

const LibraryDropdown = ({
  selectedLibrary,
  setSelectedLibrary,
  onLibraryIdChange,
  mode,
  buddyId,
}: Props) => {
  const [libraries, setLibraries] = useState<Library[]>([]);
  const setSelectedLibraryId = useAuthStore(
    (state) => state.setSelectedLibraryId
  );

  useEffect(() => {
    const fetchLibraryNames = async () => {
      try {
        let response;

        if (mode === "buddy" && buddyId) {
          response = await axiosInstance.get(
            `/innercircle/getMembersAllLibraries/${buddyId}`
          );

          const buddyLibraries = response.data?.data || [];

          const formatted = buddyLibraries.map((lib: any) => ({
            name: lib.libraryName,
            id: lib.libraryId,
          }));

          setLibraries(formatted);
        } else {
          response = await axiosInstance.get("/userbook/getLibraryData");

          const librariesData = response.data.data.libraryData;

          const formatted = librariesData.map((lib: any) => ({
            name: lib.libraryName,
            id: lib.libraryId,
          }));

          setLibraries(formatted);
        }
      } catch (error) {
        console.error("❌ Failed to fetch library names", error);
      }
    };

    fetchLibraryNames();
  }, [mode, buddyId]);

  useEffect(() => {
    setSelectedLibrary(""); // All Books
    onLibraryIdChange(""); // notify parent
    setSelectedLibraryId(""); // Zustand state
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

          onLibraryIdChange(selectedId);
          setSelectedLibraryId(selectedId);
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
