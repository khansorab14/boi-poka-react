import { useState, useEffect } from "react";
import axiosInstance from "../../../../api/axios-instance";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import QuizDialog from "./quiz-dialouge";

export default function QuizPage() {
  const [quizzes, setQuizzes] = useState([]);
  const [quizzes2, setQuizzes2] = useState([]);
  console.log(quizzes2, "respo");
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();

  const fetchQuizzes = () => {
    axiosInstance.get("/user/getUserQuizzesWithStatus").then((res) => {
      setQuizzes2(res.data.data);
    });
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizDetails = async (quizId) => {
    console.log("quizId", quizId);
    const res = await axiosInstance.get(`/user/getQuizDetails/${quizId}`);

    setSelectedQuiz(res.data.data);
    console.log("selectedQuiz", res.data.data);
    setOpenDialog(true);
  };
  const markQuizComplete = async (
    quizId: string,
    answers: Record<string, string>
  ) => {
    const payload = {
      quizId,
      questions: Object.keys(answers).map((qId) => ({
        questionId: qId,
        optionId: [answers[qId]],
        status: true,
      })),
    };

    try {
      const res = await axiosInstance.post("/user/markQuizAsComplete", payload);
      console.log("Quiz completed:", res.data.data.userQuiz.isCompleted);
      const data = quizzes2.map((q: any) => {
        if (q._id === quizId) {
          return {
            ...q,
            attempted: true,
          };
        } else {
          return q;
        }
      });
      console.log("3", quizzes2);
      console.log("1", data);
      setQuizzes2(data);
      console.log(data, "data from quiz ");

      setOpenDialog(false);
      fetchQuizzes();
    } catch (err) {
      console.error("Error marking quiz complete:", err);
    }
  };

  console.log(markQuizComplete, "marl quiz");

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b">
        <button onClick={() => navigate(-1)}>←</button>
        <span className="font-semibold">Whats New</span>
      </div>

      <div className="p-6">
        {quizzes2 &&
          quizzes2.map((quiz) => (
            <div
              key={quiz.quizId}
              onClick={() => fetchQuizDetails(quiz.quizId)}
              className="flex justify-between py-2 border-b cursor-pointer hover:bg-gray-50"
            >
              <span>- {quiz.quizTitle}</span>

              {quiz.attempted && <Check className="text-green-500" />}
            </div>
          ))}
      </div>

      {selectedQuiz && (
        <QuizDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          quizName={selectedQuiz?.quizTitle || ""}
          quizId={selectedQuiz?._id || "23434"}
          questions={selectedQuiz?.questions || []}
          onComplete={markQuizComplete}
        />
      )}
    </div>
  );
}
