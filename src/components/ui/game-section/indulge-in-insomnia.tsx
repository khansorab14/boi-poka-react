// src/pages/IndulgeInInsomnia.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CalendarMonth, { TriviaDate } from "./trivia/calender";
import axiosInstance from "../../../api/axios-instance";
import { toast } from "react-toastify";

export default function IndulgeInInsomnia() {
  const [selectedTrivias, setSelectedTrivias] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [triviaDates, setTriviaDates] = useState<Record<string, TriviaDate>>(
    {}
  );
  const [loading, setLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState({ year: 2025, month: 8 });

  const navigate = useNavigate();

  const startDate = "2025-01-01";
  const endDate = "2026-12-30";

  // 📌 Fetch all trivia read statuses
  useEffect(() => {
    const fetchTriviaDates = async () => {
      try {
        const payload = { startDate, endDate };
        const res = await axiosInstance.post(
          "/user/getTriviaReadStatus2",
          payload
        );

        const mapped: Record<string, TriviaDate> = {};
        res.data.data.forEach(
          (item: { triviaId: string; date: string; hasRead: boolean }) => {
            mapped[item.date] = item;
          }
        );

        setTriviaDates(mapped);
      } catch (error: any) {
        console.error(
          "❌ Error fetching trivia data:",
          error.response?.data || error.message
        );
      }
    };

    fetchTriviaDates();
  }, [startDate, endDate]);

  // 📌 Handle click on a date
  const handleDateClick = async (triviaId: string) => {
    if (!triviaId) {
      toast("No trivia available for selected date");
      return;
    }
    setLoading(true);

    try {
      const res = await axiosInstance.get(`/user/getTriviaById`, {
        params: { triviaId },
      });

      const { data } = res.data;
      const triviaArray = Array.isArray(data) ? data : [data].filter(Boolean);

      if (data?.alreadyRead) {
        toast(data.message || "You have already read this trivia");
      } else if (triviaArray.some((t: any) => t.alreadyRead)) {
        const readItem = triviaArray.find((t: any) => t.alreadyRead);
        if (readItem?.message) toast(readItem.message);
      }

      if (triviaArray.length > 0) {
        setSelectedTrivias(triviaArray);
        setIsDialogOpen(true);

        const allUnRead = triviaArray.every((t: any) => !t.alreadyRead);
        if (allUnRead) {
          await axiosInstance.post(`/user/hasReadTrivia`, { triviaId });

          setTriviaDates((prev) => {
            const updated = { ...prev };
            for (const dateKey in updated) {
              if (updated[dateKey].triviaId === triviaId) {
                updated[dateKey] = { ...updated[dateKey], hasRead: true };
                break;
              }
            }
            return updated;
          });
        }
      } else {
        setSelectedTrivias([]);
        setIsDialogOpen(false);
      }
    } catch (err) {
      console.error("❌ Error fetching trivia:", err);
    } finally {
      setLoading(false);
    }
  };

  // 📌 Month navigation
  const goToPrevMonth = () => {
    setSelectedMonth((prev) => {
      const date = new Date(prev.year, prev.month - 1);
      return { year: date.getFullYear(), month: date.getMonth() };
    });
  };

  const goToNextMonth = () => {
    setSelectedMonth((prev) => {
      const date = new Date(prev.year, prev.month + 1);
      return { year: date.getFullYear(), month: date.getMonth() };
    });
  };

  return (
    <div className="min-h-screen bg-white p-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => navigate(-1)}>←</button>
        <span className="text-lg font-bold">Trivia</span>
      </div>

      {/* Top Banner */}
      <div className="flex items-center gap-4 mb-4">
        <img
          src="/assets/icons/boipoka/Isolation_Mode.svg"
          alt="Vitamin Books"
          className="w-20 h-20"
        />
        <h1 className="text-4xl font-bold leading-tight">
          vitamin
          <br />
          <span className="text-gray-500">Books</span>
        </h1>
      </div>
      {/* <hr className="mb-4" /> */}

      {/* Calendar */}

      <CalendarMonth
        year={selectedMonth.year}
        month={selectedMonth.month}
        triviaDates={triviaDates}
        onDateClick={(id) => handleDateClick(id)}
      />

      {/* 📌 Modal with multiple trivia carousel */}
      {isDialogOpen && selectedTrivias.length > 0 && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {selectedTrivias.map((trivia) => (
              <div key={trivia._id} className="mb-6 border-b pb-4">
                <h2 className="text-lg font-bold mb-2">{trivia.title}</h2>
                <div
                  className="prose"
                  dangerouslySetInnerHTML={{ __html: trivia.fact }}
                />
                {trivia.alreadyRead && trivia.message && (
                  <div className="mt-2 p-2 bg-yellow-100 text-yellow-700 text-sm rounded">
                    {trivia.message}
                  </div>
                )}
              </div>
            ))}
            <button
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
              onClick={() => setIsDialogOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {loading && <p className="mt-4 text-gray-500">Loading trivia...</p>}
    </div>
  );
}
