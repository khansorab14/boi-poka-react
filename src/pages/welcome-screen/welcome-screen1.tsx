import { useEffect, useState } from "react";
import axiosInstance from "../../api/axios-instance";
import { useAuthStore } from "../../state/use-auth-store";
import { useNavigate } from "react-router-dom";

interface Genre {
  _id: string;
  name: string;
  iconName: string;
  categories: string[];
}

const WelcomeScreen1 = () => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const navigate = useNavigate();
  const {
    selectedGenres,
    addGenre,
    removeGenre,
    setOnboarded, // ✅ optional flag
    setSelectedGenres,
  } = useAuthStore();

  const isSelected = (id: string) =>
    selectedGenres.find((genre) => genre._id === id);

  const handleGenreClick = (genre: Genre) => {
    if (isSelected(genre._id)) {
      removeGenre(genre._id);
    } else if (selectedGenres.length < 3) {
      addGenre(genre);
    }
  };

  const handleNext = () => {
    if (selectedGenres.length === 3) {
      console.log("✅ Final selected genres:", selectedGenres);
      setSelectedGenres(selectedGenres);
      setOnboarded(true);
      navigate("/preference-ratings");
    } else {
      alert("Please select exactly 3 genres before continuing.");
    }
  };

  const genreImageMap: { [key: string]: string } = {
    icon1: "/assets/icons/icon1.png",
    icon2: "/assets/icons/icon2.png",
    icon3: "/assets/icons/icon3.png",
    icon4: "/assets/icons/icon4.png",
    icon5: "/assets/icons/icon5.png",
    icon6: "/assets/icons/icon6.png",
    icon7: "/assets/icons/icon7.png",
    icon8: "/assets/icons/icon8.png",
    icon9: "/assets/icons/icon9.png",
    icon10: "/assets/icons/icon10.png",
    icon11: "/assets/icons/icon11.png",
    icon12: "/assets/icons/icon12.png",
    icon13: "/assets/icons/icon13.png",
    icon14: "/assets/icons/icon14.png",
    icon15: "/assets/icons/icon15.png",
  };

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axiosInstance.get("/genre/getOnboardGenre");
        setGenres(response.data.data);
      } catch (error) {
        console.error("Genre fetch error:", error);
      }
    };
    fetchGenres();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-md p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Welcome</h1>
        <p className="text-gray-600 mb-6">Select any 3 Genres you enjoy</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
          {genres.map((genre) => {
            const isGenreSelected = isSelected(genre._id);
            const imageFile =
              genreImageMap[genre.iconName] || "/assets/icons/default.png";

            return (
              <div
                key={genre._id}
                onClick={() => handleGenreClick(genre)}
                className={`flex flex-col items-center cursor-pointer rounded-lg p-3 transition ${
                  isGenreSelected
                    ? "bg-green-100 border-2 border-green-500"
                    : "bg-gray-50 shadow hover:shadow-md"
                }`}
              >
                <img
                  src={imageFile}
                  alt={genre.name}
                  className="w-16 h-16 object-contain mb-2"
                />
                <span className="text-sm font-medium">{genre.name}</span>
                <div className="text-xs text-gray-500 mt-1">
                  {genre.categories.join(", ")}
                </div>
              </div>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          className="mt-4 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
          disabled={selectedGenres.length !== 3}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen1;
