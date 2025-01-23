import "regenerator-runtime/runtime";

import { ChevronLeft, ChevronRight, Target, Volume2 } from "lucide-react";
import { Button } from "./ui/button";
import { useCallback, useEffect, useState } from "react";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { sendQuestionData } from "@/lib/utils";
import { UserButton, useUser } from "@clerk/clerk-react";
import { NavLink } from "react-router";

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

interface TestInterfaceProps {
  userId: string | null;
}

const TestInterface = ({ userId }: TestInterfaceProps) => {
  const [questionData, setQuestionData] = useState<Part[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const { speak } = useSpeechSynthesis();
  const [hasNarrated, setHasNarrated] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const { user } = useUser();
  // const userId = user?.id;

  // if (!user || !userId) {
  //   window.location.href = "/sign-in";
  // }

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

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

  useEffect(() => {
    setHasNarrated(false);
  }, [currentQuestionIndex]);

  useEffect(() => {
    if (currentQuestion && !hasNarrated) {
      speak(currentQuestion.text);
      if (currentQuestion.subQuestions) {
        currentQuestion.subQuestions.forEach((sq) => speak(sq));
      }
      setHasNarrated(true);
    }
  }, [currentQuestion, hasNarrated, speak]);

  const handleRecording = useCallback(() => {
    if (!isRecording) {
      setIsRecording(true);
      SpeechRecognition.startListening({ continuous: true });
    } else {
      setIsRecording(false);
      SpeechRecognition.stopListening();
      if (transcript.length > 1 && currentQuestion) {
        console.log("Transcript: ", transcript);
        sendQuestionData(userId!, currentQuestion.text, transcript);
      }
    }
  }, [isRecording, transcript, currentQuestion]);

  if (error) {
    return <div className="text-center text-red-500 p-4">{error}</div>;
  }

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="text-center text-red-500 p-4">
        Speech recognition is not supported in your browser.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen justify-between">
      <div className=" flex items-center justify-between bg-zinc-200 px-4">
        <h1 className="text-center font-bold text-2xl py-4 ">IELTS Test</h1>
        <UserButton />
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
          <Button
            className="w-1/2"
            onClick={handleRecording}
            disabled={!currentQuestion}
          >
            <Volume2 className="mr-2" />
            {listening ? "Stop Recording" : "Start Recording"}
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
          {isLastQuestion || !questions.length ? (
            <Button className="">
              <Target className="mr-1" /> Submit
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={isLastQuestion || !questions.length}
            >
              <ChevronRight className="mr-1" /> Next
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestInterface;
