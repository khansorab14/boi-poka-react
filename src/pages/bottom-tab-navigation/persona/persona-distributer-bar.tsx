const PersonaDistributionBar = ({ analytics }: any) => {
  const bars = [
    {
      leftLabel: "Academic",
      leftValue: analytics.academicPercentage,
      leftColor: "#3B82F6", // blue
      rightLabel: "Leisure",
      rightValue: analytics.leisurePercentage,
      rightColor: "#FBBF24", // amber
    },
    {
      leftLabel: "Fiction",
      leftValue: analytics.fictionPercentage,
      leftColor: "#8B5CF6", // violet
      rightLabel: "Non-Fiction",
      rightValue: analytics.nonFictionPercentage,
      rightColor: "#10B981", // green
    },
    {
      leftLabel: "Original",
      leftValue: analytics.originalPercentage ?? 56,
      leftColor: "#EC4899",
      rightLabel: "Translated",
      rightValue: analytics.translatedPercentage ?? 44,
      rightColor: "#F59E0B",
    },
  ];

  return (
    <div className="flex flex-col gap-6 w-full">
      {bars.map((bar, idx) => (
        <div key={idx} className="flex flex-col gap-1">
          {/* Labels */}
          <div className="flex justify-between text-sm font-serif">
            <span>
              {bar.leftLabel}
              <span className="font-bold">{bar.leftValue}%</span>
            </span>
            <span>
              {bar.rightLabel}{" "}
              <span className="font-bold">{bar.rightValue}%</span>
            </span>
          </div>

          {/* Progress Bar */}
          <div className="flex  h-6 rounded overflow-hidden">
            <div
              style={{
                width: `${bar.leftValue}%`,
                backgroundColor: bar.leftColor,
              }}
            />
            <div
              style={{
                width: `${100 - bar.rightValue}%`,
                backgroundColor: bar.rightColor,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default PersonaDistributionBar;
