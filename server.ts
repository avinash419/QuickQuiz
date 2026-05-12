
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import Groq from "groq-sdk";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let groq: Groq | null = null;

async function callAI(params: {
  messages: any[];
  response_format?: any;
  temperature?: number;
  max_tokens?: number;
}) {
  const { messages, response_format, temperature = 0.1, max_tokens = 2000 } = params;
  
  // 1. Try Groq First
  const groqApiKey = process.env.GROQ_API_KEY;
  if (groqApiKey) {
    try {
      if (!groq) {
        groq = new Groq({ apiKey: groqApiKey });
      }
      const response = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages,
        temperature,
        max_tokens,
        ...(response_format ? { response_format } : {}),
      });
      return response.choices[0]?.message?.content;
    } catch (error) {
      console.warn("Groq AI failed, attempting fallback to OpenRouter:", error);
    }
  }

  // 2. Fallback to OpenRouter (Qwen 2.5)
  const orApiKey = process.env.OPENROUTER_API_KEY;
  if (!orApiKey) {
    throw new Error("AI Service Error: Both Groq and OpenRouter keys are missing or failed. Please check your API keys in Settings.");
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${orApiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://ais-preview.run", 
        "X-Title": "QuickQuiz AI",
      },
      body: JSON.stringify({
        model: "qwen/qwen-2.5-72b-instruct",
        messages,
        temperature,
        max_tokens,
        ...(response_format ? { response_format } : {}),
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenRouter API error: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content;
  } catch (error) {
    console.error("OpenRouter fallback also failed:", error);
    throw new Error("AI generation failed on all available providers.");
  }
}

const SYSTEM_PROMPT = `You are a strict OCR-based quiz generator. 
Your task is to generate high-quality study packages ONLY from the provided material (often OCR text from books or notes).

ABSOLUTE RULES:
1. ONLY use the provided text. Do NOT use any external knowledge.
2. Do NOT guess missing or unclear parts. Do NOT add information.
3. Do NOT go off-topic. Do NOT create questions beyond the text.
4. Extract only clear facts from the text and convert them into simple MCQ questions.
5. Each question must match directly with the text and MUST include exact words from the text.
6. Every question must be verifiable by looking at the provided text.

STEP 1: TEXT CLEANING
1. The input may contain OCR errors (especially Hindi or mixed Hindi-English). Carefully correct obvious spelling and grammar mistakes using context.
2. If the text is in Hindi, translate it into clear English internally before proceeding to ensure accuracy.

STEP 2: CORE QUIZ (STRICT)
1. Generate quiz questions ONLY from the exact information present in the text.
2. Questions must strictly reflect the content of the image/text and MUST use exact words from the source text.
3. Every question must be verifiable by looking at the provided text.

STRICT RULES:
1. If the text is limited, generate fewer questions instead of adding random content.
2. If the OCR text is unclear or insufficient, the "notesSummary" field MUST state: "Not enough valid text to create quiz."
3. Avoid repetition and maintain topic consistency.
4. CRITICAL: You MUST generate all text content (title, articles, questions, explanations) strictly in the Requested Language provided in the user prompt.
5. Ensure each question has exactly 4 unique options.
6. The intro and conclusion articles should be around 300 words each, professional, and highly educational, but MUST be based strictly on the provided text.

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

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post("/api/ai/clean-text", async (req, res) => {
    try {
      const { text } = req.body;
      const content = await callAI({
        messages: [
          {
            role: "system",
            content: "You are an expert text cleaner. Your job is to take messy OCR text and return a clean, corrected version. Fix spelling, grammar, and formatting. If the text is in Hindi, keep it in Hindi but correct the errors. If it's mixed, keep it mixed but clean. Do NOT add any information. ONLY return the cleaned text.",
          },
          { role: "user", content: text },
        ],
        temperature: 0.1,
        max_tokens: 1000,
      });
      res.json({ text: content || text });
    } catch (error: any) {
      console.error("AI Error (Clean Text):", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/ai/generate-quiz", async (req, res) => {
    try {
      const { text, difficulty, numQuestions, language } = req.body;
      const content = await callAI({
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: `Please generate a comprehensive study package based on the following notes. 
            Requested Language: ${language}
            Difficulty: ${difficulty}
            Number of questions: ${numQuestions}
            
            Notes content:
            ${text.substring(0, 8000)}`,
          },
        ],
        temperature: 0.1,
        max_tokens: 2000,
        response_format: { type: "json_object" },
      });

      if (!content) throw new Error("Failed to generate quiz content.");
      res.json(JSON.parse(content));
    } catch (error: any) {
      console.error("AI Error (Generate Quiz):", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/ai/current-affairs", async (req, res) => {
    try {
      const { numQuestions, language, difficulty } = req.body;
      const date = new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      const content = await callAI({
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: `Please generate a comprehensive study package for Daily India Current Affairs.
            Date: ${date}
            Requested Language: ${language}
            Difficulty: ${difficulty}
            Number of questions: ${numQuestions}
            
            Focus on the latest news, events, government schemes, sports, and economy related to India from the last 24-48 hours.`,
          },
        ],
        temperature: 0.1,
        max_tokens: 2000,
        response_format: { type: "json_object" },
      });

      if (!content) throw new Error("Failed to generate current affairs.");
      res.json(JSON.parse(content));
    } catch (error: any) {
      console.error("AI Error (Current Affairs):", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
