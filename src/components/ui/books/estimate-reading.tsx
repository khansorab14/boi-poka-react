import React, { useMemo } from "react";

interface Props {
  minutes: number;
  originalWPM?: number;
  comparisonWPM?: number;
}

const EstimatedReadingTime: React.FC<Props> = ({
  minutes,
  originalWPM = 200,
  comparisonWPM = 300,
}) => {
  const calculateTime = (wpm: number) => {
    const totalWords = minutes * originalWPM;
    const totalMinutes = totalWords / wpm;
    const hours = Math.round(totalMinutes / 60);
    return hours;
  };

  const readingTimes = [
    {
      wpm: comparisonWPM,
      hours: useMemo(() => calculateTime(comparisonWPM), [minutes]),
    },
    {
      wpm: originalWPM,
      hours: useMemo(() => calculateTime(originalWPM), [minutes]),
    },
  ];

  return (
    <div className="text-black space-y-4">
      <div className="flex gap-12">
        {readingTimes.map(({ wpm, hours }) => (
          <div key={wpm} className="text-left">
            <p className="text-sm text-gray-600">at</p>
            <p className="text-lg font-semibold border-b border-gray-300 w-max">
              ~{wpm} WPM:
            </p>
            <p className="text-lg font-semibold mt-1 border-b border-gray-300 w-max">
              ~{hours} hours:
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EstimatedReadingTime;
