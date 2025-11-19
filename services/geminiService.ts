import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { MODELS } from "../constants";

// Initialize client with safe fallback if env is missing (though strictly required by prompt)
const apiKey = process.env.API_KEY || ''; 
const ai = new GoogleGenAI({ apiKey });

/**
 * Generates text using a chat model (Gemini 2.5 Flash or 3.0 Pro)
 */
export const generateChatResponseStream = async (
  prompt: string,
  history: { role: string; parts: { text: string }[] }[],
  onChunk: (text: string) => void
) => {
  try {
    const chat = ai.chats.create({
      model: MODELS.TEXT_FAST,
      history: history,
      config: {
        temperature: 0.7,
      }
    });

    const resultStream = await chat.sendMessageStream({ message: prompt });

    for await (const chunk of resultStream) {
       const c = chunk as GenerateContentResponse;
       if (c.text) {
         onChunk(c.text);
       }
    }
  } catch (error) {
    console.error("Chat Error:", error);
    throw error;
  }
};

/**
 * Generates an image using Imagen 3/4
 */
export const generateImage = async (prompt: string, aspectRatio: '1:1' | '16:9' | '9:16' = '1:1') => {
  try {
    const response = await ai.models.generateImages({
      model: MODELS.IMAGE_GEN,
      prompt,
      config: {
        numberOfImages: 1,
        aspectRatio: aspectRatio,
        outputMimeType: 'image/jpeg',
      }
    });
    
    const base64Image = response.generatedImages[0]?.image?.imageBytes;
    if (!base64Image) throw new Error("No image generated");
    
    return `data:image/jpeg;base64,${base64Image}`;
  } catch (error) {
    console.error("Image Gen Error:", error);
    throw error;
  }
};

/**
 * Analyzes an image (Vision)
 */
export const analyzeImage = async (base64Data: string, mimeType: string, prompt: string) => {
  try {
    const response = await ai.models.generateContent({
      model: MODELS.TEXT_FAST,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType,
              data: base64Data
            }
          },
          { text: prompt }
        ]
      }
    });
    return response.text;
  } catch (error) {
    console.error("Vision Error:", error);
    throw error;
  }
};