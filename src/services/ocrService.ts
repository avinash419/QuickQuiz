
/**
 * AI-powered OCR extraction using OpenRouter Vision Models.
 */
export const extractTextFromImage = async (
  base64Image: string,
  onProgress?: (progress: number, status: string) => void
): Promise<string> => {
  if (onProgress) onProgress(0, "AI analyzing image...");
  
  try {
    const response = await fetch("/api/ai/vision-ocr", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: base64Image }),
    });

    if (!response.ok) {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const err = await response.json();
        throw new Error(err.error || "Vision OCR failed");
      } else {
        throw new Error("Server error: AI Vision service is busy or restarting. Please try again in a moment.");
      }
    }

    const data = await response.json();
    if (!data.text || data.text.trim().length < 2) {
      throw new Error("AI could not find clear text in the image. Please try a cleaner photo.");
    }

    return data.text;
  } catch (error: any) {
    console.error("Vision OCR Error:", error);
    throw error;
  }
};
