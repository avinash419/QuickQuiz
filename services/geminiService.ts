
import Groq from "groq-sdk";
import Tesseract from "tesseract.js";
import { Quiz, Difficulty } from "../types";

const groq = new Groq({ 
  apiKey: process.env.GROQ_API_KEY || '',
  dangerouslyAllowBrowser: true 
});

const QUIZ_SYSTEM_PROMPT = `You are a strict quiz generator. 
Your task is to generate high-quality study packages ONLY from the provided material (often OCR text from books or notes).

STEP 1: TEXT CLEANING
1. The input may contain OCR errors (especially Hindi or mixed Hindi-English). Carefully correct obvious spelling and grammar mistakes using context.
2. If the text is in Hindi, translate it into clear English internally before proceeding to ensure accuracy.

STEP 2: CORE QUIZ (STRICT)
1. Generate quiz questions ONLY from the exact information present in the text.
2. Do NOT add any external knowledge.
3. Do NOT guess missing or unclear parts.
4. Questions must strictly reflect the content of the image/text.

STEP 3: RELATED QUIZ (CONTROLLED EXPANSION)
1. After completing core questions, you may generate additional questions based on closely related concepts within the same topic.
2. Stay within the same topic. Do NOT go off-topic or introduce unrelated subjects.

STRICT RULES:
1. If the text is limited, generate fewer questions instead of adding random content.
2. If the OCR text is unclear or insufficient, the "notesSummary" field should state: "Insufficient clear text to generate quiz."
3. Avoid repetition and maintain topic consistency.
4. CRITICAL: You MUST generate all text content (title, articles, questions, explanations) strictly in the Requested Language provided in the user prompt.
5. Ensure each question has exactly 4 unique options.
6. The intro and conclusion articles should be around 300 words each, professional, and highly educational.

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
