import React, { useState } from "react";

interface Quote {
  quote: string;
  source?: string;
}

interface CommunitySocialMatricProps {
  data?: Quote[] | string[];
  reader?: string;
}

const CommunitySocialMatric: React.FC<CommunitySocialMatricProps> = ({
  data = [],
  reader,
}) => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const analysisSections = [
    "Popular Quotes",
    "Trending Discussions",
    "Reader Demographics",
  ];

  // Normalize all quote data to Quote[]
  const normalizedQuotes: Quote[] = (data as any[]).map((item) =>
    typeof item === "string"
      ? { quote: item.replace(/^'|'$/g, "") }
      : { quote: item.quote.replace(/^'|'$/g, ""), source: item.source }
  );

  return (
    <div className="max-w-2xl mx-auto px-4">
      <h2 className="text-2xl font-serif font-semibold mb-6">
        Community & Social Metrics
      </h2>

      <div className="space-y-4">
        {analysisSections.map((section) => {
          const isOpen = openSections[section];
          return (
            <div key={section} className="border-b">
              <button
                onClick={() => toggleSection(section)}
                className="flex items-center justify-between w-full text-left text-lg font-medium py-2"
              >
                <span className="flex items-center gap-2">
                  <span className="text-xl">{isOpen ? "−" : "+"}</span>{" "}
                  {section}
                </span>
              </button>

              <div
                className={`transition-all duration-500 ease-in-out overflow-hidden transform ${
                  isOpen
                    ? "max-h-[800px] opacity-100 translate-y-0"
                    : "max-h-0 opacity-0 -translate-y-2"
                }`}
              >
                <div className="pl-6 pb-4 pt-2 text-sm text-gray-700 space-y-3">
                  {section === "Popular Quotes" ? (
                    normalizedQuotes.length > 0 ? (
                      <ul className="list-disc ml-4 space-y-1">
                        {normalizedQuotes.map((item, index) => (
                          <li key={index}>
                            <blockquote className="italic">
                              “{item.quote}”
                            </blockquote>
                            {item.source && (
                              <div className="text-xs text-gray-500">
                                — {item.source}
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No popular quotes available.</p>
                    )
                  ) : section === "Reader Demographics" ? (
                    <p>{reader}</p>
                  ) : (
                    <p>No data for {section}.</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CommunitySocialMatric;
