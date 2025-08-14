import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import axiosInstance from "../../../api/axios-instance";

interface NewsItem {
  _id: string;
  title: string;
  description: string;
  link: string;
  createdAt: string;
  source: string;
}

export default function WhatsNew() {
  const navigate = useNavigate();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await axiosInstance.get("/user/getAllNews/V2");
        setNews(res.data.data); // assuming `data` is inside `res.data`
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-200">
        <button
          onClick={() => navigate(-1)}
          className="text-xl font-bold text-gray-700"
        >
          ←
        </button>
        <span className="font-semibold text-lg">Whats New</span>
      </div>

      {/* Top Banner */}
      <div className="flex items-center gap-4 p-4">
        <img
          src="/assets/icons/boipoka/Isolation_Mode.svg"
          alt="news icon"
          className="w-20 h-20 object-contain"
        />
        <h1 className="text-4xl font-bold leading-tight">
          in other
          <br />
          news...
        </h1>
      </div>

      <hr className="border-gray-300" />

      {/* News List */}
      <div className="p-4">
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          <ul className="space-y-6">
            {news.map((item) => (
              <li key={item._id} className="flex flex-col">
                <div className="flex gap-2">
                  <span className="text-gray-400 text-2xl leading-none">•</span>
                  <div>
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-gray-800 hover:underline"
                    >
                      {item.title}
                    </a>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                    <p className="text-gray-400 text-xs mt-1">
                      {new Date(item.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
