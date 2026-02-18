
export enum Difficulty {
  EASY = 'Easy',
  MEDIUM = 'Medium',
  HARD = 'Hard'
}

export interface Question {
  question: string;
  options: string[];
  correctAnswer: number; // Index 0-3
  explanation: string;
}

export interface Quiz {
  title: string;
  questions: Question[];
  difficulty: Difficulty;
  notesSummary: string;
  weakAreas?: string[];
}

export interface QuizResult {
  score: number;
  total: number;
  answers: number[]; // User's chosen indices
  timeTaken: number; // seconds
}

export type AppState = 'HOME' | 'GENERATING' | 'QUIZ' | 'RESULT';
