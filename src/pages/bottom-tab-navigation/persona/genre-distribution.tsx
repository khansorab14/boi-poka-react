import React from "react";

interface GenreItem {
  genre: string;
  percentage: number;
}

interface CategoryItem {
  category: string;
  genrePercentage: GenreItem[];
}

interface TitleData {
  academicPercentage?: number;
  leisurePercentage?: number;
  fictionPercentage?: number;
  nonFictionPercentage?: number;
  title?: string;
}

interface GenreDistributionProps {
  genreDistribution?: CategoryItem[];
  titleData?: TitleData;
  isLoading?: boolean; // new prop to control loading state
}

const GenreDistribution: React.FC<GenreDistributionProps> = ({
  genreDistribution = [],
  titleData,
  isLoading = false,
}) => {
  const categoryColors: Record<string, string> = {
    Fiction: "bg-rose-300",
    "Non-Fiction": "bg-yellow-200",
    Academic: "bg-blue-200",
    Leisure: "bg-green-200",
  };

  const renderSection = (category: string, genres: GenreItem[] = []) => {
    // Pick correct percentage from titleData based on category
    let overallCategoryPercentage: number | undefined;
    switch (category) {
      case "Fiction":
        overallCategoryPercentage = titleData?.fictionPercentage;
        break;
      case "Non-Fiction":
        overallCategoryPercentage = titleData?.nonFictionPercentage;
        break;
      case "Academic":
        overallCategoryPercentage = titleData?.academicPercentage;
        break;
      case "Leisure":
        overallCategoryPercentage = titleData?.leisurePercentage;
        break;
    }

    return (
      <div key={category} className="mb-6">
        {overallCategoryPercentage !== undefined && (
          <h2 className="text-lg font-semibold mb-1">
            {category.toLowerCase()} {overallCategoryPercentage}%
          </h2>
        )}

        <div className="space-y-2">
          {genres.map((g) => (
            <div key={g.genre} className="flex items-center gap-2">
              <span className="w-40 text-sm truncate">{g.genre}</span>
              <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                <div
                  className={`${categoryColors[category] || "bg-gray-300"} h-full`}
                  style={{ width: `${g.percentage}%` }}
                ></div>
              </div>
              <span className="text-sm w-10 text-right">{g.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSkeleton = () => (
    <div className="space-y-6">
      {[1, 2, 3, 4].map((n) => (
        <div key={n} className="space-y-2 animate-pulse">
          <div className="h-5 bg-gray-200 rounded w-1/3"></div>
          {[1, 2, 3].map((m) => (
            <div key={m} className="flex items-center gap-2">
              <div className="w-40 h-4 bg-gray-200 rounded"></div>
              <div className="flex-1 h-4 bg-gray-200 rounded"></div>
              <div className="w-10 h-4 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm w-full max-w-md">
      <h1 className="text-2xl font-bold mb-4">
        {titleData?.title || "Genre Distribution"}
      </h1>
      {isLoading
        ? renderSkeleton()
        : genreDistribution.map((cat) =>
            renderSection(cat.category, cat.genrePercentage)
          )}
    </div>
  );
};

export default GenreDistribution;
