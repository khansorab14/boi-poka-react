// components/StatCards.tsx
import React from "react";

interface StatCardsProps {
  analytics: {
    userBooksCount: number;
    physicalBookCount: number;
    eBookCount: number;
    audioBookCount: number;
  };
}

const StatCards: React.FC<StatCardsProps> = ({ analytics }) => {
  const cards = [
    {
      label: "total books",
      value: analytics.userBooksCount,
      bg: "bg-yellow-100",
      align: "text-start",
    },
    {
      label: "physical",
      value: analytics.physicalBookCount,
      bg: "bg-teal-100",
      align: "text-center",
    },
    {
      label: "csv",
      value: analytics.eBookCount,
      bg: "bg-blue-100",
      align: "text-center",
    },
    {
      label: "others",
      value: analytics.audioBookCount,
      bg: "bg-pink-100",
      align: "text-center",
    },
  ];

  return (
    <div className="grid grid-cols-4 md:grid-cols-4 gap-4 mb-8">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`${card.bg} rounded-xl p-2 ${card.align} shadow`}
        >
          <p className="text-sm mb-2">{card.label}</p>
          <p className="text-2xl font-semibold">{card.value}</p>
        </div>
      ))}
    </div>
  );
};

export default StatCards;
