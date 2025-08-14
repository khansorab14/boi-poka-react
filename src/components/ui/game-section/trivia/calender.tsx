import { useCallback } from "react";

import "react-calendar/dist/Calendar.css";
import Calendar from "react-calendar";

export interface TriviaDate {
  triviaId: string;
  date: string;
  hasRead: boolean;
  year?: any;
}

interface CalendarMonthProps {
  triviaDates: Record<string, TriviaDate>;
  onDateClick: (triviaId: string, dateKey: string) => void;
}

export default function CalendarMonth({
  triviaDates,
  onDateClick,
}: CalendarMonthProps) {
  const tileDisabled = useCallback(
    ({ date }: { date: Date }) => {
      const dateKey = date.toISOString().split("T")[0];
      const triviaInfo = triviaDates[dateKey];
      return !triviaInfo || triviaInfo.hasRead;
    },
    [triviaDates]
  );
  const tileClassName = useCallback(
    ({ date }: { date: Date }) => {
      const dateKey = date.toISOString().split("T")[0];
      const triviaInfo = triviaDates[dateKey];

      if (!triviaInfo) return "";
      return triviaInfo.hasRead
        ? "line-through text-gray-500"
        : "font-bold text-black";
    },
    [triviaDates]
  );

  return (
    <div className="mb-6 flex justify-center items-center">
      <Calendar
        onClickDay={(value) => {
          const dateKey = value.toISOString().split("T")[0];
          const triviaInfo = triviaDates[dateKey];
          if (triviaInfo) {
            onDateClick(triviaInfo.triviaId, dateKey);
          } else {
            onDateClick("", dateKey);
          }
        }}
        tileDisabled={tileDisabled}
        tileClassName={tileClassName}
      />
    </div>
  );
}
