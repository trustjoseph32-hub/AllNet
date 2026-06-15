
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateLogo = async (style: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [{ text: `Minimalist professional logo for "AllergyNet" platform. Style: ${style}. Vector, flat design, white background.` }]
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1"
      }
    }
  });
  
  // Логика извлечения изображения...
};
