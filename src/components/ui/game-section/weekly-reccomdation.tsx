import { useEffect, useState } from "react";
import axiosInstance from "../../../api/axios-instance";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import ShelfView from "../../../pages/home/shelf-view";

interface BookDetails {
  title: string;
  author: string[];
  bookColorScheme: {
    startColor: string;
    middleColor: string;
    endColor: string;
    textColor: string;
  };
}

interface WeeklyBook {
  _id: string;
  weekStartKey: string;
  bookDetails: BookDetails;
}

interface ApiResponse {
  data: WeeklyBook[];
}

export default function WeeklyRecommendation() {
  const [weeklyBooks, setWeeklyBooks] = useState<WeeklyBook[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axiosInstance.get<ApiResponse>(
          "/user/getWeeklyRecomendation"
        );
        console.log(res.data.data, "weekly books");
        setWeeklyBooks(res.data.data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, []);

  // Transform weeklyBooks into shelves object for ShelfView
  const shelves = weeklyBooks.reduce((acc: Record<string, any[]>, book) => {
    const weekLabel = `Recommendation for week of ${dayjs(
      book.weekStartKey
    ).format("D MMMM")}`;
    if (!acc[weekLabel]) acc[weekLabel] = [];
    acc[weekLabel].push(book);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => navigate(-1)}>←</button>
        <span className="text-lg font-bold">Weekly Recommendation</span>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <img
          src="/assets/icons/boipoka/Isolation_Mode (2).svg"
          alt="recommendation"
          className="w-20 h-20"
        />
        <h1 className="text-4xl font-bold leading-tight">
          new books this week
          <br />
          <span className="text-gray-500">Books</span>
        </h1>
      </div>

      {Object.entries(shelves).map(([weekLabel, books]) => (
        <div key={weekLabel} className="mb-12">
          <h1 className="text-lg font-normal mb-4">{weekLabel}</h1>
          <ShelfView shelves={{ [weekLabel]: books }} mode={false} />
        </div>
      ))}
    </div>
  );
}
