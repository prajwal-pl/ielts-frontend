import { ChevronLeft, ChevronRight, Volume2 } from "lucide-react";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";

interface Question {
  id: number;
  text: string;
  subQuestions?: string[];
}

interface Part {
  part: number;
  introduction: string;
  questions: Question[];
}

interface DisplayQuestion {
  text: string;
  isIntro?: boolean;
  subQuestions?: string[];
}

const TestInterface = () => {
  const [questionData, setQuestionData] = useState<Part[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/questions");
        if (!response.ok) {
          throw new Error("Failed to fetch questions");
        }
        const data = await response.json();
        setQuestionData(data?.data || []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch questions"
        );
      }
    };
    fetchQuestions();
  }, []);

  const getAllQuestions = (): DisplayQuestion[] => {
    if (!questionData.length) return [];

    let allQuestions: DisplayQuestion[] = [];
    questionData.forEach((part) => {
      if (part.introduction) {
        allQuestions.push({ text: part.introduction, isIntro: true });
      }
      part.questions.forEach((q) => {
        if (q.subQuestions) {
          allQuestions.push({
            text: q.text,
            subQuestions: q.subQuestions,
          });
        } else {
          allQuestions.push({ text: q.text });
        }
      });
    });
    return allQuestions;
  };

  const questions = getAllQuestions();
  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleNext = () => {
    if (!isLastQuestion) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirstQuestion) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  if (error) {
    return <div className="text-center text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="flex flex-col h-screen justify-between">
      <div className="text-center">
        <h1 className="font-bold text-2xl py-4 bg-zinc-200">IELTS Test</h1>
      </div>
      <div className="text-center py-4">
        <div className="font-semibold text-xl">
          {currentQuestion && (
            <div>
              <p className={currentQuestion.isIntro ? "text-blue-600" : ""}>
                {currentQuestion.text}
              </p>
              {currentQuestion.subQuestions && (
                <ul className="mt-4 text-left max-w-md mx-auto">
                  {currentQuestion.subQuestions.map((sq, index) => (
                    <li key={index} className="mb-2">
                      • {sq}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>

      <div>
        <div className="flex justify-center items-center mb-4">
          <Button className="w-1/2">
            <Volume2 className="mr-2" />
            Start Recording
          </Button>
        </div>
        <div className="flex justify-between w-full px-4 py-2 pb-4">
          <Button
            variant="secondary"
            onClick={handlePrev}
            disabled={isFirstQuestion || !questions.length}
          >
            <ChevronLeft className="mr-1" /> Prev
          </Button>
          <Button
            onClick={handleNext}
            disabled={isLastQuestion || !questions.length}
          >
            <ChevronRight className="mr-1" /> Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TestInterface;
