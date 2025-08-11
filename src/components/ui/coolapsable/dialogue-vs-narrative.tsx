import React from "react";

interface DialogueVsNarrativeProps {
  dialogue: {
    dialogue_percentage?: number;
    narrative_percentage?: number;
    note?: string;
  } | null;
  dialoguePercent?: number;
  narrativePercent?: number;
  insight?: string;
}
const DialogueVsNarrative: React.FC<DialogueVsNarrativeProps> = ({
  dialogue,
}) => {
  if (!dialogue) return null;

  return (
    <div className="font-serif">
      <h3 className="text-xl font-semibold mb-4">
        Dialogue v/s narrative ratio
      </h3>

      <div className="flex justify-between items-center text-sm md:text-base font-medium mb-2 px-2">
        <div className="flex items-center gap-1">
          <span>dialogue</span>
          <span className="text-lg">{dialogue.dialogue_percentage}%</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-lg">{dialogue.narrative_percentage}%</span>
          <span>narrative</span>
        </div>
      </div>

      <div className="flex w-full h-6 gap-1 rounded-sm overflow-hidden">
        <div
          className="bg-indigo-300 rounded-sm transition-all duration-700 ease-in-out"
          style={{ width: `${dialogue.dialogue_percentage}%` }}
        />
        <div
          className="bg-green-300 transition-all rounded-sm  duration-700 ease-in-out"
          style={{ width: `${dialogue.narrative_percentage}%` }}
        />
      </div>

      <p className="text-center mt-3 text-sm text-gray-700">{dialogue.note}</p>
    </div>
  );
};

export default DialogueVsNarrative;
