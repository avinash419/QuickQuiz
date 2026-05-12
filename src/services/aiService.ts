
import { Difficulty, QuizData } from "../types";

export const cleanText = async (text: string): Promise<string> => {
  try {
    const response = await fetch("/api/ai/clean-text", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || "Failed to clean text");
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
    const err = await response.json();
    throw new Error(err.error || "Failed to generate quiz");
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
    const err = await response.json();
    throw new Error(err.error || "Failed to generate current affairs");
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
