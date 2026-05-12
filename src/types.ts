
export enum Difficulty {
  EASY = "Easy",
  MEDIUM = "Medium",
  HARD = "Hard",
}

export interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface QuizData {
  title: string;
  introArticle: string;
  questions: Question[];
  notesSummary: string;
  weakAreas: string[];
  conclusionArticle: string;
}

export interface QuizResult {
  score: number;
  total: number;
  answers: number[];
  timeTaken: number;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  category: string;
  readTime: string;
  date: string;
  imageUrl: string;
  excerpt: string;
  content: string;
}
