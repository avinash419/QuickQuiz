
import { GoogleGenAI, Type } from "@google/genai";
import { Quiz, Difficulty } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const QUIZ_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    questions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING },
          options: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          correctAnswer: { type: Type.INTEGER, description: "Index of the correct answer (0-3)" },
          explanation: { type: Type.STRING }
        },
        required: ["question", "options", "correctAnswer", "explanation"]
      }
    },
    notesSummary: { type: Type.STRING, description: "A short 1-2 sentence summary of the key notes" },
    weakAreas: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A list of 2-3 specific topics the user should review if they miss these questions"
    }
  },
  required: ["title", "questions", "notesSummary", "weakAreas"]
};

export const generateQuiz = async (
  notes: string,
  difficulty: Difficulty,
  numQuestions: number,
  language: string = 'Hindi'
): Promise<Quiz> => {
  const model = 'gemini-3-flash-preview';

  const response = await ai.models.generateContent({
    model: model,
    contents: `Please generate a quiz based on the following notes. 
    Requested Language: ${language}
    Difficulty: ${difficulty}
    Number of questions: ${numQuestions}
    
    Notes content:
    ${notes.substring(0, 8000)}`,
    config: {
      systemInstruction: `You are an expert quiz generator. Analyze the notes provided and create high-quality multiple choice questions. 
      CRITICAL: You MUST generate all text content strictly in ${language}.
      Ensure each question has exactly 4 unique options. Output in JSON.`,
      responseMimeType: "application/json",
      responseSchema: QUIZ_SCHEMA as any
    }
  });

  return JSON.parse(response.text) as Quiz;
};

export const generateQuizFromImage = async (
  base64Image: string,
  difficulty: Difficulty,
  numQuestions: number,
  language: string = 'Hindi',
  topic?: string
): Promise<Quiz> => {
  const model = 'gemini-3-flash-preview';

  const response = await ai.models.generateContent({
    model: model,
    contents: [
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: base64Image
        }
      },
      {
        text: `Analyze the study material in this image (notes, book chapter, or hand-written notes). 
        ${topic ? `The topic is: ${topic}` : ''}
        1. Extract the key educational content.
        2. Generate ${numQuestions} multiple choice questions.
        3. Language: ${language}
        4. Difficulty: ${difficulty}`
      }
    ],
    config: {
      systemInstruction: `You are an expert OCR and quiz generator. Extract text from the provided image and transform it into a professional quiz.
      CRITICAL: You MUST generate all text content strictly in ${language}.
      Ensure each question has exactly 4 unique options. Output in JSON matching the specified schema.`,
      responseMimeType: "application/json",
      responseSchema: QUIZ_SCHEMA as any
    }
  });

  return JSON.parse(response.text) as Quiz;
};
