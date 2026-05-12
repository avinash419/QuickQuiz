
import { Difficulty, QuizData } from "../types";

export const cleanText = async (text: string): Promise<string> => {
  try {
    const response = await fetch("/api/ai/clean-text", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    if (!response.ok) {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const err = await response.json();
        throw new Error(err.error || "Failed to clean text");
      } else {
        const textError = await response.text();
        console.error("Non-JSON error response:", textError.substring(0, 200));
        throw new Error("Server error: Received unexpected response format. The server might be busy or restarting.");
      }
    }
    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error("Error cleaning text:", error);
    return text;
  }
};

export const generateQuiz = async (
  text: string,
  difficulty: Difficulty,
  numQuestions: number,
  language: string = "Hindi"
): Promise<QuizData> => {
  const response = await fetch("/api/ai/generate-quiz", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, difficulty, numQuestions, language }),
  });
  if (!response.ok) {
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const err = await response.json();
      throw new Error(err.error || "Failed to generate quiz");
    } else {
      throw new Error("Server error: AI service is temporarily unavailable. Please try again in 30 seconds.");
    }
  }
  return response.json();
};

export const generateCurrentAffairs = async (
  numQuestions: number,
  language: string = "Hindi",
  difficulty: Difficulty = Difficulty.MEDIUM
): Promise<QuizData> => {
  const response = await fetch("/api/ai/current-affairs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ numQuestions, language, difficulty }),
  });
  if (!response.ok) {
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const err = await response.json();
      throw new Error(err.error || "Failed to generate current affairs");
    } else {
      throw new Error("Server error: Received unexpected response format. Please try again in a moment.");
    }
  }
  return response.json();
};

export const generateRandomQuiz = async (
  category: string,
  numQuestions: number,
  language: string = "Hindi",
  difficulty: Difficulty = Difficulty.MEDIUM
): Promise<QuizData> => {
  const response = await fetch("/api/ai/random-quiz", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ category, numQuestions, language, difficulty }),
  });
  if (!response.ok) {
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const err = await response.json();
      throw new Error(err.error || "Failed to generate quiz");
    } else {
      throw new Error("Server error: AI service is busy or restarting. Please try again soon.");
    }
  }
  return response.json();
};

export const validateQuizData = (data: QuizData): boolean => {
  if (
    data.notesSummary?.includes("Not enough valid text") ||
    !data.questions ||
    data.questions.length === 0
  ) {
    return false;
  }
  for (const q of data.questions) {
    if (!q.question || !q.options || q.options.length !== 4 || q.correctAnswer === undefined) {
      return false;
    }
  }
  return true;
};
