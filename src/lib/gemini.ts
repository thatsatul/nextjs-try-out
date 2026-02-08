import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export interface GenerateContentOptions {
  model?: string;
  temperature?: number;
  maxOutputTokens?: number;
}

export async function generateContent(
  prompt: string, 
  options: GenerateContentOptions = {}
): Promise<string> {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    // Get the generative model
    const model = genAI.getGenerativeModel({ 
      model: options.model || "gemini-2.5-flash",
    });

    // Generate content
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    return text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error(
      error instanceof Error 
        ? error.message 
        : "Failed to generate content"
    );
  }
}

export async function generateContentStream(
  prompt: string,
  options: GenerateContentOptions = {}
): Promise<AsyncIterable<string>> {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    const model = genAI.getGenerativeModel({ 
      model: options.model || "gemini-2.5-flash",
    });

    const result = await model.generateContentStream(prompt);
    
    async function* streamText() {
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        yield chunkText;
      }
    }

    return streamText();
  } catch (error) {
    console.error("Gemini Streaming Error:", error);
    throw new Error(
      error instanceof Error 
        ? error.message 
        : "Failed to generate streaming content"
    );
  }
}