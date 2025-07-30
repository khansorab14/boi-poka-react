import React, { useState } from "react";
import EstimatedReadingTime from "./estimate-reading";
import ChapterLengthDistribution from "./chapter-length";

interface ReadingStatisticsProps {
  estimatedTimeToRead?: number;
  lengthOfChapters?: number[];
  data?: any;
  readingData?: string[];
}

const ReadingStatistics: React.FC<ReadingStatisticsProps> = ({
  data,
  lengthOfChapters = [],
}) => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  console.log(data, "data from reading");

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const analysisSections = [
    {
      title: "Estimate Reading Time",
      content: <EstimatedReadingTime minutes={data.estimatedTimeToRead} />,
    },
    {
      title: "Chapter Length Distribution",
      content: lengthOfChapters.length ? (
        <ChapterLengthDistribution data={data} />
      ) : (
        <p>No chapter data available.</p>
      ),
    },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4">
      <h2 className="text-2xl font-serif font-semibold mb-6">
        Reading Statistics
      </h2>
      <div className="space-y-4">
        {analysisSections.map(({ title, content }) => {
          const isOpen = openSections[title];
          return (
            <div key={title} className="border-b">
              <button
                onClick={() => toggleSection(title)}
                className="flex items-center justify-between w-full text-left text-lg font-medium py-2"
              >
                <span className="flex items-center gap-2">
                  <span className="text-xl">{isOpen ? "−" : "+"}</span> {title}
                </span>
              </button>

              <div
                className={`transition-all duration-500 ease-in-out overflow-hidden transform ${
                  isOpen
                    ? "max-h-[800px] opacity-100 translate-y-0"
                    : "max-h-0 opacity-0 -translate-y-2"
                }`}
              >
                <div className="pl-6 pb-4 pt-2">{content}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ReadingStatistics;
