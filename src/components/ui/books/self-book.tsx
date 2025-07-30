import React, { useMemo } from "react";

interface ShelfBookProps {
  title: string;
  author: string;
  color: string; // e.g., "#ffffff" or "white"
  onClick: () => void;
  index?: number;
  draggable?: boolean;
  onDragStart?: (event: React.DragEvent<HTMLDivElement>) => void;
  onDrop?: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragOver?: (event: React.DragEvent<HTMLDivElement>) => void;
  onTouchStart?: (event: React.TouchEvent<HTMLDivElement>) => void;
  onTouchEnd?: (event: React.TouchEvent<HTMLDivElement>) => void;
}

// Convert hex or named color to RGB and compute brightness
function getContrastTextColor(bgColor: string): string {
  let r = 255,
    g = 255,
    b = 255; // default white

  const ctx = document.createElement("canvas").getContext("2d");
  if (ctx) {
    ctx.fillStyle = bgColor;
    const computed = ctx.fillStyle; // standardizes the color
    ctx.fillStyle = computed;
    const [rStr, gStr, bStr] = ctx.fillStyle.match(/\d+/g) || [];
    r = parseInt(rStr || "255");
    g = parseInt(gStr || "255");
    b = parseInt(bStr || "255");
  }

  // Calculate brightness
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 186 ? "#000000" : "#ffffff"; // threshold
}

const ShelfBook: React.FC<ShelfBookProps> = ({
  title,
  author,
  color,
  onClick,
  index,
  draggable = false,
  onDragStart,
  onDrop,
  onDragOver,
  onTouchEnd,
  onTouchStart,
}) => {
  const heightPercent = useMemo(() => {
    const min = 80;
    const max = 100;
    return `${Math.floor(Math.random() * (max - min + 1) + min)}%`;
  }, []);

  const textColor = useMemo(() => getContrastTextColor(color), [color]);

  return (
    <div
      className="relative w-auto sm:w-24 h-48 flex items-end justify-center"
      onDrop={onDrop}
      onDragOver={(e) => {
        e.preventDefault();
        onDragOver?.(e);
      }}
    >
      {index !== undefined && (
        <span className="absolute top-1 left-1 text-[10px] sm:text-xs bg-white/80 text-gray-800 px-2 py-0.5 shadow-md z-10">
          #{index + 1}
        </span>
      )}

      <div
        draggable={draggable}
        onDragStart={onDragStart}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className="w-8 sm:w-14 cursor-grab active:cursor-grabbing flex flex-col justify-center items-center px-1 sm:px-2 overflow-hidden shadow-lg transition-transform hover:scale-105"
        style={{
          height: heightPercent,
          background: `linear-gradient(to bottom right, ${color}, ${color}cc)`,
          color: textColor,
        }}
        onClick={onClick}
      >
        <div className="rotate-[-90deg] pt-6 flex flex-col items-start justify-center text-left w-max">
          <span className="text-[12px] sm:text-[11px] font-semibold max-w-[140px] truncate">
            {title}
          </span>
          <span className="text-[8px] sm:text-[9px] opacity-90 max-w-[140px] truncate">
            {author}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ShelfBook;
