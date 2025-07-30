import React from "react";

interface KeyThemesMotifsProps {
  data: {
    themes: string[];
    motifs: string[];
    frequent_words: string[];
  };
}

const KeyThemesMotifs: React.FC<KeyThemesMotifsProps> = ({ data }) => {
  const { themes, motifs, frequent_words } = data;

  return (
    <div className="text-sm text-start font-serif">
      <div className="mb-2">
        <span className="font-semibold">Themes:</span> {themes.join(", ")}
      </div>
      <div className="mb-2">
        <span className="font-semibold">Motifs:</span> {motifs.join(", ")}
      </div>
      <div>
        <span className="font-semibold">Frequent words:</span>{" "}
        {frequent_words.join(", ")}
      </div>
    </div>
  );
};

export default KeyThemesMotifs;
