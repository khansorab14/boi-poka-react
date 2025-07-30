import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../state/use-auth-store";

const PreferenceRatings = () => {
  const navigate = useNavigate();
  const data = useAuthStore((state) => state);
  console.log("PreferenceRatings data:", data);

  const preferenceRatings = useAuthStore((state) => state.preferenceRatings);
  const setPreferenceRating = useAuthStore(
    (state) => state.setPreferenceRating
  );

  const handleSliderChange =
    (type: keyof typeof preferenceRatings) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPreferenceRating(type, Number(e.target.value));
    };

  //   if (selectedGenres.length === 3) {
  //     console.log("✅ Final selected genres:", selectedGenres);
  //     setOnboarded(true);
  //     navigate("/preference-ratings");
  //   } else {
  //     alert("Please select exactly 3 genres before continuing.");
  //   }
  // };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-md p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Welcome</h1>
        <p className="text-gray-600 mb-6">
          On a scale of 1-10, how much do you enjoy...
        </p>

        <div className="space-y-6 text-left">
          <div>
            <label className="font-medium">Physical Books:</label>
            <div className="flex items-center gap-4 mt-2">
              <input
                type="range"
                min="1"
                max="10"
                value={preferenceRatings.physicalBook}
                onChange={handleSliderChange("physicalBook")}
                className="w-full"
              />
              <span className="w-10 text-center text-sm font-medium">
                {preferenceRatings.physicalBook}
              </span>
            </div>
          </div>

          <div>
            <label className="font-medium">E-Books:</label>
            <div className="flex items-center gap-4 mt-2">
              <input
                type="range"
                min="1"
                max="10"
                value={preferenceRatings.eBook}
                onChange={handleSliderChange("eBook")}
                className="w-full"
              />
              <span className="w-10 text-center text-sm font-medium">
                {preferenceRatings.eBook}
              </span>
            </div>
          </div>

          <div>
            <label className="font-medium">Audiobooks:</label>
            <div className="flex items-center gap-4 mt-2">
              <input
                type="range"
                min="1"
                max="10"
                value={preferenceRatings.audioBook}
                onChange={handleSliderChange("audioBook")}
                className="w-full"
              />
              <span className="w-10 text-center text-sm font-medium">
                {preferenceRatings.audioBook}
              </span>
            </div>
          </div>
        </div>

        <button
          className="mt-8 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          onClick={() => navigate("/user-profile")}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PreferenceRatings;
