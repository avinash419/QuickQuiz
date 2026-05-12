
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
  model?: string;
}) {
  const { messages, response_format, temperature = 0.1, max_tokens = 2000, model } = params;
  
  // 1. If a specific model is requested (like Vision), try OpenRouter directly
  const orApiKey = process.env.OPENROUTER_API_KEY;
  if (model === "qwen/qwen2.5-vl-72b-instruct" && orApiKey) {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${orApiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://ais-preview.run", 
          "X-Title": "QuickQuiz AI Vision",
        },
        body: JSON.stringify({
          model: "qwen/qwen2.5-vl-72b-instruct",
          messages,
          temperature,
          max_tokens,
          ...(response_format ? { response_format } : {}),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`OpenRouter Vision API error: ${JSON.stringify(errorData)}`);
      }

      const data = await response.json();
      return data.choices?.[0]?.message?.content;
    } catch (error) {
      console.error("OpenRouter Vision failed:", error);
      throw error;
    }
  }

  // 2. Default logic: Try Groq First
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

const SYSTEM_PROMPT = `You are a Senior Academic Content Specialist specializing in Indian Education (CBSE, ICSE, and Competitive Exams).
Your task is to transform provided study notes into a comprehensive, high-quality learning package.

CRITICAL QUALITY REQUIREMENTS:
1. HINDI AUTHENTICITY: If Requested Language is Hindi, use "Shuddh" yet readable Hindi as found in NCERT textbooks. Avoid generic translations. The tone must be authoritative, academic, and encouraging. Use proper Devanagari punctuation.
2. NATURAL FLOW: Articles must read like they were written by a human teacher, with logical transitions and clear explanations.
3. CONTEXTUAL RECOVERY: OCR text is often broken. Use your deep knowledge of Indian subjects (History, Geography, Science, Polity, etc.) to intelligently fill in obvious gaps while remaining 100% faithful to the core facts of the source.

STRUCTURE:
- Title: Catchy but professional.
- Intro Article: ~300 words. Define concepts, provide context, and explain why this topic is important.
- Questions: High-quality MCQs that test conceptual clarity, not just rote memorization.
- Explanations: Each answer must explain the underlying concept clearly.
- Conclusion Article: ~300 words. Summarize key facts and provide a "Pro-Tip" for remembering this topic.

STRICT JSON OUTPUT:
{
  "title": "string",
  "introArticle": "string (Academic, natural, professional)",
  "questions": [
    {
      "question": "string",
      "options": ["string", "string", "string", "string"],
      "correctAnswer": number (0-3),
      "explanation": "string (Concept-focused explanation)"
    }
  ],
  "notesSummary": "string (Brief pedagogical summary)",
  "weakAreas": ["string", "string (Common student pitfalls in this topic)"],
  "conclusionArticle": "string (Final summary and memory tips)"
}

Do not include any text outside this JSON.`;

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // API Routes
  app.post("/api/ai/vision-ocr", async (req, res) => {
    try {
      const { image } = req.body; // base64 image
      const content = await callAI({
        model: "qwen/qwen2.5-vl-72b-instruct",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Extract all text from this image. If the text is in Hindi, extract it accurately in Devanagari script. If it is mixed (Hinglish), preserve the context. Return ONLY the raw extracted text as a continuous string. Do not summarize or add notes."
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${image}`
                }
              }
            ]
          }
        ],
        max_tokens: 1500,
      });

      res.json({ text: content || "" });
    } catch (error: any) {
      console.error("Vision OCR Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/ai/clean-text", async (req, res) => {
    try {
      const { text } = req.body;
      const content = await callAI({
        messages: [
          {
            role: "system",
            content: "You are an expert polyglot editor specializing in correcting messy OCR text. Your task is to clean up typos, fix grammar, and restore the natural flow of the text while staying 100% faithful to the original data. If the text is Hindi, use natural, high-quality, professional Hindi characters (Devanagari). If it is mixed, preserve the context. Return ONLY the cleaned, professional version of the text without any introduction or commentary.",
          },
          { role: "user", content: text },
        ],
        temperature: 0.1,
        max_tokens: 1500,
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
      const rapidApiKey = process.env.RAPIDAPI_KEY;
      const rapidApiHost = process.env.RAPIDAPI_HOST || "current-affairs-of-india.p.rapidapi.com";

      let newsContext = "";
      
      // 1. Fetch real-time news from RapidAPI if key is available
      if (rapidApiKey) {
        try {
          const newsResponse = await fetch("https://current-affairs-of-india.p.rapidapi.com/recent", {
            method: "GET",
            headers: {
              "x-rapidapi-key": rapidApiKey,
              "x-rapidapi-host": rapidApiHost,
              "Content-Type": "application/json",
            },
          });

          if (newsResponse.ok) {
            const newsData = await newsResponse.json();
            // Assuming the API returns an array of news objects or a content field
            // We'll stringify it to pass as context to the AI
            newsContext = JSON.stringify(newsData);
          }
        } catch (newsError) {
          console.warn("Failed to fetch real-time news from RapidAPI, falling back to AI baseline:", newsError);
        }
      }

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
            
            ${newsContext ? `Use the following real-time news data as your primary source:\n\n${newsContext.substring(0, 6000)}` : "Focus on the latest news, events, government schemes, sports, and economy related to India from the last 24-48 hours."}
            `,
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

  app.post("/api/ai/random-quiz", async (req, res) => {
    try {
      const { category, numQuestions, language, difficulty } = req.body;
      const content = await callAI({
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: `Please generate a comprehensive study package for the following category.
            Category: ${category}
            Requested Language: ${language}
            Difficulty: ${difficulty}
            Number of questions: ${numQuestions}
            
            Ensure the content is accurate, educational, and professionally presented in ${language}.`,
          },
        ],
        temperature: 0.1,
        max_tokens: 2000,
        response_format: { type: "json_object" },
      });

      if (!content) throw new Error("Failed to generate category quiz.");
      res.json(JSON.parse(content));
    } catch (error: any) {
      console.error("AI Error (Random Quiz):", error);
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
