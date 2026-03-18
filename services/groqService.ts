
import Groq from "groq-sdk";
import Tesseract from "tesseract.js";
import { Quiz, Difficulty } from "../types";

const groq = new Groq({ 
  apiKey: process.env.GROQ_API_KEY || '',
  dangerouslyAllowBrowser: true 
});

const QUIZ_SYSTEM_PROMPT = `You are an expert educational content creator. 
Your task is to extract clean and accurate information from the provided material and generate a high-quality study package.

INSTRUCTIONS FOR PROCESSING INPUT:
1. The input text may contain OCR errors (spelling/grammar mistakes). Carefully correct these based on context.
2. If the input text is in Hindi or mixed Hindi-English, translate/process it into clear English internally to ensure full understanding before generating the final content.
3. Do NOT guess or hallucinate missing information. If parts of the text are unclear or garbled, skip them.
4. Only use information that is clearly understandable.

INSTRUCTIONS FOR GENERATING OUTPUT:
1. CRITICAL: You MUST generate all text content (title, articles, questions, explanations) strictly in the Requested Language provided in the user prompt.
2. Ensure each question has exactly 4 unique options. 
3. The intro and conclusion articles should be around 300 words each, professional, and highly educational.

Output MUST be a valid JSON object matching this schema:
{
  "title": "string",
  "introArticle": "string (approx 300 words)",
  "questions": [
    {
      "question": "string",
      "options": ["string", "string", "string", "string"],
      "correctAnswer": number (0-3),
      "explanation": "string"
    }
  ],
  "notesSummary": "string (1-2 sentences)",
  "weakAreas": ["string", "string"],
  "conclusionArticle": "string (approx 300 words)"
}`;

export const generateQuiz = async (
  notes: string,
  difficulty: Difficulty,
  numQuestions: number,
  language: string = 'Hindi'
): Promise<Quiz> => {
  const model = 'llama-3.3-70b-versatile';

  const response = await groq.chat.completions.create({
    model: model,
    messages: [
      { role: "system", content: QUIZ_SYSTEM_PROMPT },
      { 
        role: "user", 
        content: `Please generate a comprehensive study package based on the following notes. 
        Requested Language: ${language}
        Difficulty: ${difficulty}
        Number of questions: ${numQuestions}
        
        Notes content:
        ${notes.substring(0, 8000)}`
      }
    ],
    response_format: { type: "json_object" }
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error("No content received from Groq");

  return JSON.parse(content) as Quiz;
};

export const performOCR = async (
  base64Image: string,
  onProgress?: (progress: number, status: string) => void
): Promise<string> => {
  const { data: { text } } = await Tesseract.recognize(
    `data:image/jpeg;base64,${base64Image}`,
    'eng+hin', // Support both English and Hindi for OCR
    { 
      logger: m => {
        if (m.status === 'recognizing text' && onProgress) {
          onProgress(m.progress, m.status);
        } else if (onProgress) {
          onProgress(0, m.status);
        }
      } 
    }
  );

  if (!text || text.trim().length < 10) {
    throw new Error("Could not extract enough text from the image. Please try a clearer photo.");
  }

  return text;
};

export const generateQuizFromImage = async (
  base64Image: string,
  difficulty: Difficulty,
  numQuestions: number,
  language: string = 'Hindi',
  topic?: string
): Promise<Quiz> => {
  // 1. Perform OCR using Tesseract.js
  const text = await performOCR(base64Image);

  // 2. Generate quiz from extracted text using the fast text model
  return generateQuiz(
    `${topic ? `Topic: ${topic}\n\n` : ''}Extracted Text from Image:\n${text}`,
    difficulty,
    numQuestions,
    language
  );
};

export const generateCurrentAffairsQuiz = async (
  numQuestions: number,
  language: string = 'Hindi',
  difficulty: Difficulty = Difficulty.MEDIUM
): Promise<Quiz> => {
  const currentDate = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  const model = 'llama-3.3-70b-versatile';

  const response = await groq.chat.completions.create({
    model: model,
    messages: [
      { role: "system", content: QUIZ_SYSTEM_PROMPT },
      { 
        role: "user", 
        content: `Please generate a comprehensive study package for Daily India Current Affairs.
        Date: ${currentDate}
        Requested Language: ${language}
        Difficulty: ${difficulty}
        Number of questions: ${numQuestions}
        
        Focus on the latest news, events, government schemes, sports, and economy related to India from the last 24-48 hours.`
      }
    ],
    response_format: { type: "json_object" }
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error("No content received from Groq");

  return JSON.parse(content) as Quiz;
};
