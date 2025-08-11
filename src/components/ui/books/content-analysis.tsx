import React, { useEffect, useState } from "react";
import PopularityChart from "../charts/popularity-chart";
import axiosInstance from "../../../api/axios-instance";
import SentimentMeter from "../charts/sentiments";
import BookMode from "../charts/book-mode";
import ReviewSlider from "./review-slider";
import FanFictionSlider from "./fan-fiction";

import DialogueVsNarrative from "../coolapsable/dialogue-vs-narrative";
import bookData from "../../../utils/data/powerless.json";

import KeyThemesMotifs from "./key-themes-and-motifs";
import LocationMapSetting from "./location-map-setting";

interface ContentAnalysisProps {
  id?: string;
}
interface ChartData {
  asset: string;
  amount: number;
}
interface DialogueVsNarrativeData {
  dialogue_percentage: number;
  narrative_percentage: number;
  note: string;
}
const ContentAnalysis: React.FC<ContentAnalysisProps> = ({ id }) => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(true);

  const [reviewData, setReviewData] = useState<ChartData[]>([]);
  const [fanFictionData, setFanFictionsData] = useState<ChartData[]>([]);
  const [dialogue, setDialogue] = useState<DialogueVsNarrativeData | null>(
    null
  );
  const [popularity, setPopularity] = useState<Record<string, number>>({});
  const [sentiments, setSentiments] = useState<any | undefined>(undefined);
  const [bookMode, setBookMoodData] = useState<Record<string, number>>({});
  const [keyTheme, setKeyThemes] = useState<any | null>(null);
  const [locationMap, setLocationMap] = useState<any | null>(null);

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const renderSectionContent = (section: string) => {
    switch (section) {
      case "Popularity":
        return <PopularityChart popularity={popularity} />;
      case "Sentiment":
        return <SentimentMeter sentiments={sentiments} />;
      case "Book mood":
        return <BookMode bookMode={bookMode} />;
      case "Key themes and Motif’s frequency":
        return keyTheme ? <KeyThemesMotifs data={keyTheme} /> : <p>No data</p>;

      case "Location Map of Story settings":
        return <LocationMapSetting data={locationMap} />;
      case "Dialogue v/s narrative ratio":
        return (
          <DialogueVsNarrative
            dialogue={dialogue}
            dialoguePercent={dialogue?.dialogue_percentage || 0}
            narrativePercent={dialogue?.narrative_percentage || 0}
            insight={dialogue?.note || "—"}
          />
        );
      default:
        return <p>Details about {section} will be shown here...</p>;
    }
  };
  const analysisSections = [
    "Popularity",
    "Sentiment",
    "Book mood",
    "Character network map/relationships",
    "Location Map of Story settings",
    "Key themes and Motif’s frequency",
    "Dialogue v/s narrative ratio",
  ];

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const res = await axiosInstance.get(
          `/book/getBookAnalytics?bookId=${id}`
        );
        const contentData = res.data?.data;
        const popularity = contentData?.popularity_country;
        const sentimentData = contentData?.sentiment;
        const bookMoodData = contentData?.book_read_mood;
        const reviewData = contentData?.expert_reviews;
        const fanFictionData = contentData?.fan_fiction;

        console.log(contentData, "contentData");

        setPopularity(popularity);
        setSentiments(sentimentData);
        setBookMoodData(bookMoodData);
        setReviewData(reviewData);
        setFanFictionsData(fanFictionData);
      } catch (err: any) {
        console.error("Error fetching chart data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, [id]);

  useEffect(() => {
    console.log("Static JSON import:", bookData);
    // setBook(bookData); // Optional
    setDialogue(bookData?.data?.analysis?.dialogue_vs_narrative_ratio);
    setKeyThemes(bookData?.data?.analysis?.key_themes_and_motifs);
    setLocationMap(bookData?.data?.analysis?.location_map_settings);
  }, []);

  if (loading) {
    return <div className="text-center py-6">Loading content…</div>;
  }
  return (
    <div className="max-w-2xl mx-auto  py-8">
      <h2 className="text-2xl font-serif font-semibold mb-6">
        Content Analysis
      </h2>
      <div className="space-y-4">
        {analysisSections.map((section) => {
          const isOpen = openSections[section];
          return (
            <div key={section} className="border-b">
              <button
                onClick={() => toggleSection(section)}
                className="flex items-center justify-between w-full text-left text-lg font-medium py-2"
              >
                <span className="flex items-center gap-2">
                  <span className="text-xl">{isOpen ? "−" : "+"}</span>{" "}
                  {section}
                </span>
              </button>

              {/* Transition Container */}
              <div
                className={`transition-all duration-500 ease-in-out overflow-hidden transform ${
                  isOpen
                    ? "max-h-[800px] opacity-100 translate-y-0"
                    : "max-h-0 opacity-0 -translate-y-2"
                }`}
              >
                <div className="pl-6 pb-4 pt-2 text-sm text-gray-700">
                  {renderSectionContent(section)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <ReviewSlider reviewData={reviewData} />
      <FanFictionSlider fanFictionData={fanFictionData} />
    </div>
  );
};

export default ContentAnalysis;
