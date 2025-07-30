import React from "react";
import ReactSpeedometer from "react-d3-speedometer";

interface SentimentBreakdown {
  positive: number;
  neutral: number;
  negative: number;
}

interface SentimentMeterProps {
  sentiments?: SentimentBreakdown;
}

const SentimentMeter: React.FC<SentimentMeterProps> = ({ sentiments }) => {
  if (!sentiments) {
    return (
      <div className="text-center text-gray-500">
        No sentiment data available.
      </div>
    );
  }

  const { positive, neutral, negative } = sentiments;
  const total = positive + neutral + negative;

  const getPercentage = (val: number) =>
    total > 0 ? ((val / total) * 100).toFixed(1) : "0.0";

  const weightedScore = total
    ? (positive * 1 + neutral * 0 + negative * -1) / total
    : 0;

  const normalizedScore = Math.round((weightedScore + 1) * 50);

  const getSentimentLabel = (score: number): string => {
    if (score < 35) return "Negative";
    if (score < 65) return "Neutral";
    return "Positive";
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6 sm:p-8 bg-white ">
      <h2 className="text-center text-xl sm:text-2xl font-bold mb-6 text-gray-800">
        Sentiment Analysis
      </h2>

      <div className="w-full flex justify-center items-center h-auto">
        <ReactSpeedometer
          minValue={0}
          maxValue={100}
          value={normalizedScore}
          segments={3}
          segmentColors={["#ef4444", "#facc15", "#22c55e"]}
          customSegmentLabels={[
            { text: "Negative", position: "INSIDE", color: "#000" },
            { text: "Neutral", position: "INSIDE", color: "#000" },
            { text: "Positive", position: "INSIDE", color: "#000" },
          ]}
          ringWidth={30}
          needleHeightRatio={0.7}
          needleColor="steelblue"
          currentValueText={`Score: ${weightedScore.toFixed(2)}`}
          textColor="#000"
          height={window.innerWidth < 640 ? 200 : 260}
          width={window.innerWidth < 640 ? 300 : 500}
          forceRender={true} // ensures re-render on screen resize
        />
      </div>

      <div className="text-center text-base sm:text-lg mt-4 font-medium text-gray-700">
        Overall Sentiment:{" "}
        <span className="font-bold text-blue-600">
          {getSentimentLabel(normalizedScore)}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 text-sm text-gray-600 text-center">
        <div className="flex flex-col items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-red-500"></span>
          <span>
            Negative:{" "}
            <span className="font-semibold">{getPercentage(negative)}%</span>
          </span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
          <span>
            Neutral:{" "}
            <span className="font-semibold">{getPercentage(neutral)}%</span>
          </span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-green-500"></span>
          <span>
            Positive:{" "}
            <span className="font-semibold">{getPercentage(positive)}%</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default SentimentMeter;
