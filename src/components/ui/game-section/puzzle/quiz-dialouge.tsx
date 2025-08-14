import { useState, useEffect } from "react";
import { Dialog } from "@mui/material";
import { Check } from "lucide-react";

interface QuizDialogProps {
  open: boolean;
  onClose: () => void;
  quizName?: string;
  quizId?: string;
  onComplete?: (
    quizId: string,
    selectedAnswers: Record<string, string>
  ) => void;
  questions?: {
    _id: string;
    questionTitle: string;
    options: { text: string; _id: string; isCorrect?: boolean }[];
  }[];
}

export default function QuizDialog({
  open,
  onClose,
  quizName = "",
  quizId = "345678z",
  questions = [],
  onComplete,
}: QuizDialogProps) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  // Reset quiz when dialog opens
  useEffect(() => {
    if (open) {
      setStep(0);
      setAnswers({});
      setShowResult(false);
      setScore(0);
    }
  }, [open]);

  const handleSelectOption = (questionId: string, optionId: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleDone = () => {
    if (step < questions.length - 1) {
      setStep((prev) => prev + 1);
    } else {
      let correctCount = 0;
      questions.forEach((q) => {
        const selectedId = answers[q._id];
        const correctOption = q.options.find((opt) => opt.isCorrect);
        if (selectedId && correctOption && correctOption._id === selectedId) {
          correctCount++;
        }
      });
      setScore(correctCount);
      setShowResult(true);

      if (quizId && onComplete) {
        onComplete(quizId, answers);
      }
    }
  };

  const handlePrevious = () => {
    if (step > 0) setStep((prev) => prev - 1);
  };

  if (!questions.length) {
    return (
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <div className="p-6 text-center text-gray-500">
          Loading questions...
        </div>
      </Dialog>
    );
  }

  const progress = ((step + 1) / questions.length) * 100;
  const currentQuestion = questions[step];
  const selectedOptionId = answers[currentQuestion._id];

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      {showResult ? (
        <div className="p-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Quiz Completed!</h2>
          <p className="text-lg">
            You scored{" "}
            <span className="font-bold text-teal-500">
              {score}/{questions.length}
            </span>
          </p>

          <button
            onClick={() => {
              console.log("hgh", quizId);
              if (quizId && onComplete) {
                console.log("sjldf");
                onComplete(quizId, answers);
              }
              onClose();
            }}
            className="bg-teal-400 text-white px-4 py-2 rounded-lg mt-4"
          >
            Done
          </button>
        </div>
      ) : (
        <>
          {/* Progress Bar */}
          <div className="relative p-4">
            <div className="h-2 bg-gray-200 rounded-full">
              <div
                className="h-2 bg-teal-300 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="absolute top-2 right-4 text-sm font-semibold">
              {step + 1}/{questions.length}
            </span>
          </div>

          {/* Question */}
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">{quizName}</h2>
            <p className="text-lg font-semibold mb-4">
              {currentQuestion.questionTitle}
            </p>
            <ul className="space-y-2">
              {currentQuestion.options.map((opt) => (
                <li
                  key={opt._id}
                  onClick={() =>
                    handleSelectOption(currentQuestion._id, opt._id)
                  }
                  className={`flex justify-between items-center p-2 border rounded-lg cursor-pointer ${
                    selectedOptionId === opt._id
                      ? "bg-teal-100 border-teal-400"
                      : ""
                  }`}
                >
                  {opt.text}
                  {selectedOptionId === opt._id && (
                    <Check className="text-teal-500" size={20} />
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="flex justify-between p-4 border-t">
            {step > 0 ? (
              <button
                onClick={handlePrevious}
                className="text-gray-600 font-semibold"
              >
                Previous
              </button>
            ) : (
              <div />
            )}
            <button
              onClick={handleDone}
              className="bg-teal-400 text-white px-4 py-2 rounded-lg disabled:opacity-50"
              disabled={!selectedOptionId}
            >
              {step < questions.length - 1 ? "Next" : "Finish"}
            </button>
          </div>
        </>
      )}
    </Dialog>
  );
}
