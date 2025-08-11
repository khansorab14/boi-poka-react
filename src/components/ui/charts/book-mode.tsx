import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { AgCharts } from "ag-charts-react";
import {
  AgCartesianChartOptions,
  AgAreaSeriesOptions,
} from "ag-charts-community";

interface BookModeProps {
  bookMode?: Record<string, number>;
}

const BookMode: React.FC<BookModeProps> = ({ bookMode }) => {
  const [options, setOptions] = useState<AgCartesianChartOptions>({
    title: {
      text: "Book Mood Scores",
    },
    data: [],
    series: [
      {
        type: "area",
        xKey: "mood",
        yKey: "score",
        yName: "Mood Score",
        stroke: "#4B5563", // dark gray stroke
        strokeWidth: 2,
        fill: "#D1D5DB", // light gray fill
        marker: {
          enabled: true,
          fill: "#6B7280", // medium gray
        },
        label: {
          enabled: true,
          fontWeight: "bold",
          formatter: ({ value }) => value.toFixed(1),
        },
        interpolation: { type: "linear" }, // straight lines
      } as AgAreaSeriesOptions,
    ],
    legend: { enabled: false },
    axes: [
      { type: "category", position: "bottom", title: { text: "Mood" } },
      { type: "number", position: "left", title: { text: "Score" } },
    ],
  });

  useEffect(() => {
    if (bookMode) {
      const formattedData = Object.entries(bookMode).map(([mood, score]) => ({
        mood,
        score,
      }));

      setOptions((prev) => ({
        ...prev,
        data: formattedData,
      }));
    }
  }, [bookMode]);

  return (
    <div className="flex justify-center items-center h-full min-h-[400px]">
      <div className="w-full max-w-2xl">
        <AgCharts options={options} />
      </div>
    </div>
  );
};

// Optional standalone mount
const root = document.getElementById("root");
if (root) {
  const mockData = {
    joy: 10,
    melancholic: 30,
    thrilling: 15,
    inspiring: 10,
    thoughtful: 20,
  };
  createRoot(root).render(<BookMode bookMode={mockData} />);
}

export default BookMode;
