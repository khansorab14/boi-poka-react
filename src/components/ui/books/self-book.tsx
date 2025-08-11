import React from "react";

interface ShelfBookProps {
  title: string;
  author: string[];
  color: {
    startColor: string;
    middleColor: string;
    endColor: string;
    textColor: string;
  };
  height: number;
  width: number;
  onClick?: () => void;
  index?: number;
  draggable?: boolean;
  onDragStart?: (event: React.DragEvent<HTMLDivElement>) => void;
  onDrop?: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragOver?: (event: React.DragEvent<HTMLDivElement>) => void;
  onTouchStart?: (event: React.TouchEvent<HTMLDivElement>) => void;
  onTouchEnd?: (event: React.TouchEvent<HTMLDivElement>) => void;
}

const ShelfBook: React.FC<ShelfBookProps> = ({
  title,
  author,
  color,
  height,

  onClick,
  index,
  draggable = false,
  onDragStart,
  onDrop,
  onDragOver,
  onTouchEnd,
  onTouchStart,
}) => {
  return (
    <div
      className="relative w-full flex items-end justify-center"
      onDrop={onDrop}
      onDragOver={(e) => {
        e.preventDefault();
        onDragOver?.(e);
      }}
    >
      {index !== undefined && (
        <span className="absolute top-1 left-1 text-[10px] sm:text-xs bg-white/80 text-gray-800 px-2 py-0.5 shadow-md z-10 ">
          #{index + 1}
        </span>
      )}

      <div
        draggable={draggable}
        onDragStart={onDragStart}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className="cursor-grab active:cursor-grabbing flex flex-col  justify-end  pr-5 items-center  sm:px-2 overflow-hidden shadow-lg transition-transform hover:scale-105 "
        style={{
          height: `${height}vh`,
          width: 35,
          background: `linear-gradient(to bottom, ${color.startColor}, ${color.middleColor}, ${color.endColor})`,
          color: color.textColor,
        }}
        onClick={onClick}
      >
        <div className="rotate-[-90deg] pt-4  pl-4 flex flex-col mb-10 items-start justify-start text-left w-max">
          <span className="font-semibold leading-tight truncate max-w-[120px] text-[10px] sm:text-[11px] md:text-[12px]">
            {title}
          </span>
          <span className="opacity-90 truncate max-w-[120px] text-[8px] sm:text-[9px] md:text-[10px]">
            {author}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ShelfBook;
