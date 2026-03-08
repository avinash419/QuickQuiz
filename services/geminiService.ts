
import { GoogleGenAI, Type } from "@google/genai";
import { Quiz, Difficulty } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const QUIZ_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    introArticle: { 
      type: Type.STRING, 
      description: "A comprehensive introductory article (approx 300 words) about the topic to prepare the student for the quiz." 
    },
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
    },
    conclusionArticle: { 
      type: Type.STRING, 
      description: "A detailed concluding article (approx 300 words) that reinforces the concepts covered in the quiz and provides deeper context." 
    }
  },
  required: ["title", "introArticle", "questions", "notesSummary", "weakAreas", "conclusionArticle"]
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
    contents: `Please generate a comprehensive study package based on the following notes. 
    Requested Language: ${language}
    Difficulty: ${difficulty}
    Number of questions: ${numQuestions}
    
    The package MUST include:
    1. A detailed introductory article (approx 300 words) to set the context.
    2. ${numQuestions} multiple choice questions with explanations.
    3. A detailed concluding article (approx 300 words) that summarizes key takeaways and provides deeper insights.
    
    Notes content:
    ${notes.substring(0, 8000)}`,
    config: {
      systemInstruction: `You are an expert educational content creator. Analyze the notes provided and create a high-quality study package. 
      CRITICAL: You MUST generate all text content strictly in ${language}.
      Ensure each question has exactly 4 unique options. 
      The intro and conclusion articles should be around 300 words each, professional, and highly educational.
      Output in JSON matching the specified schema.`,
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
        2. Generate a comprehensive study package including:
           - A detailed introductory article (approx 300 words).
           - ${numQuestions} multiple choice questions with explanations.
           - A detailed concluding article (approx 300 words).
        3. Language: ${language}
        4. Difficulty: ${difficulty}`
      }
    ],
    config: {
      systemInstruction: `You are an expert OCR and educational content creator. Extract text from the provided image and transform it into a professional study package.
      CRITICAL: You MUST generate all text content strictly in ${language}.
      Ensure each question has exactly 4 unique options. 
      The intro and conclusion articles should be around 300 words each, professional, and highly educational.
      Output in JSON matching the specified schema.`,
      responseMimeType: "application/json",
      responseSchema: QUIZ_SCHEMA as any
    }
  });

  return JSON.parse(response.text) as Quiz;
};
