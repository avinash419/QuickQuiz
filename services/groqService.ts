
import Groq from "groq-sdk";
import { Quiz, Difficulty } from "../types";

const groq = new Groq({ 
  apiKey: process.env.GROQ_API_KEY || '',
  dangerouslyAllowBrowser: true 
});

const QUIZ_SYSTEM_PROMPT = `You are an expert educational content creator. 
Analyze the material provided and create a high-quality study package. 
CRITICAL: You MUST generate all text content strictly in the requested language.
Ensure each question has exactly 4 unique options. 
The intro and conclusion articles should be around 300 words each, professional, and highly educational.

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

export const generateQuizFromImage = async (
  base64Image: string,
  difficulty: Difficulty,
  numQuestions: number,
  language: string = 'Hindi',
  topic?: string
): Promise<Quiz> => {
  // Use a vision-capable model for images
  const model = 'llama-3.2-11b-vision-preview';

  const response = await groq.chat.completions.create({
    model: model,
    messages: [
      { role: "system", content: QUIZ_SYSTEM_PROMPT },
      { 
        role: "user", 
        content: [
          {
            type: "text",
            text: `Analyze the study material in this image. 
            ${topic ? `The topic is: ${topic}` : ''}
            Generate a comprehensive study package in ${language} with ${numQuestions} questions at ${difficulty} difficulty.`
          },
          {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${base64Image}`
            }
          }
        ]
      }
    ],
    response_format: { type: "json_object" }
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error("No content received from Groq");

  return JSON.parse(content) as Quiz;
};
