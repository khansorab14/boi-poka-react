import React from "react";

interface Props {
  lengths?: number[];
  data?: any;
}

const ChapterLengthDistribution: React.FC<Props> = ({ data }: any) => {
  console.log(data, "length data ");
  //   const max = Math.max(...lengths);
  //   const avg = Math.round(lengths.reduce((a, b) => a + b, 0) / lengths.length);
  //   const total = lengths.reduce((a, b) => a + b, 0);

  return (
    <div className="max-w-2xl px-4">
      {/* Title with left bar */}
      <div className="flex items-center mb-3">
        <div className="w-5 h-1.5 bg-black mr-3" />
        <h3 className="text-xl font-serif font-medium">
          Chapter length distribution
        </h3>
      </div>

      {/* Bar visualization */}
      <div className="flex justify-start items-end gap-[6px] h-24 mb-4 px-1">
        {/* {lengths.map((length, index) => (
          <div
            key={index}
            className="w-[6px] rounded-sm bg-indigo-300"
            style={{
              height: `${(length / max) * 100}%`,
            }}
            title={`Chapter ${index + 1}: ${length} words`}
          />
        ))} */}
      </div>

      {/* Description */}
      {/* <p className="text-sm text-gray-700 leading-relaxed font-light">
        {lengths.length} chapters averaging ~{avg.toLocaleString()} words each
        (assuming ~{Math.round(total / 1000)}k total word count); first 7
        chapters similar in length, mid-book (~8–12) similar in length.
      </p> */}
    </div>
  );
};

export default ChapterLengthDistribution;
