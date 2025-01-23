import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import axios from "axios";
import { toast } from "sonner";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function sendQuestionData(
  userId: string,
  question: string,
  answer: string
) {
  try {
    const data = await axios.post("http://localhost:8000/api/answers", {
      userId,
      question,
      answer,
    });
    if (data.status === 200) {
      console.log("Answer submitted successfully");
      toast("Answer submitted successfully");
    }
  } catch (error) {
    console.error(error);
  }
}

export async function fetchResults(userId: string) {
  try {
    const data = await axios.get(`http://localhost:8000/api/answers/${userId}`);
    if (data.status === 200) {
      console.log("Results fetched successfully");
      toast("Results fetched successfully");
      return data.data;
    }
  } catch (error) {
    console.error(error);
  }
}
