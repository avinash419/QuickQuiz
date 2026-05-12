
import Tesseract from "tesseract.js";

/**
 * Pre-processes the image using canvas to improve OCR accuracy.
 * Converts to grayscale and boosts contrast.
 */
const preprocessImage = (base64Image: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(base64Image);
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;

      // Draw original image
      ctx.drawImage(img, 0, 0);

      // Get image data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Apply Grayscale and Contrast enhancement
      for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        
        // Simple threshold/contrast boost
        const threshold = 128;
        const val = avg > threshold ? 255 : (avg * 0.8); // Darken darks, keep whites white
        
        data[i] = val;     // R
        data[i + 1] = val; // G
        data[i + 2] = val; // B
      }

      ctx.putImageData(imageData, 0, 0);
      resolve(canvas.toDataURL("image/jpeg", 0.9));
    };
    img.onerror = () => resolve(base64Image);
    img.src = base64Image;
  });
};

export const extractTextFromImage = async (
  base64Image: string,
  onProgress?: (progress: number, status: string) => void
): Promise<string> => {
  try {
    // 1. Pre-process the image for better results
    if (onProgress) onProgress(0, "Optimizing image...");
    const processedImage = await preprocessImage(`data:image/jpeg;base64,${base64Image}`);

    // 2. Run Tesseract recognition
    const {
      data: { text },
    } = await Tesseract.recognize(processedImage, "eng+hin", {
      logger: (m) => {
        if (m.status === "recognizing text" && onProgress) {
          onProgress(m.progress, m.status);
        } else if (onProgress) {
          onProgress(0, m.status);
        }
      },
    });

    if (!text || text.trim().length < 5) {
      throw new Error("Could not extract enough text from the image. Please try a clearer photo.");
    }

    return text;
  } catch (error) {
    console.error("OCR Error:", error);
    throw error;
  }
};
