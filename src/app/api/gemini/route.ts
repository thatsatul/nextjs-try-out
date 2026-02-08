import { generateContent } from "@/lib/gemini";
import { NextRequest, NextResponse } from "next/server";


export interface GenerateContentRequest {
  prompt: string;
  model?: string;
}

export interface GenerateContentResponse {
  result: string;
}

export interface GeminiError {
  error: string;
}

export async function POST(request: NextRequest) {
  try {
    const { prompt, model }: GenerateContentRequest = await request.json();
    
    if (!prompt?.trim()) {
      return NextResponse.json<GeminiError>(
        { error: "Prompt is required" }, 
        { status: 400 }
      );
    }

    const result = await generateContent(prompt, { model });
    return NextResponse.json<GenerateContentResponse>({ result });
  } catch (error) {
    return NextResponse.json<GeminiError>(
      { error: (error as Error).message }, 
      { status: 500 }
    );
  }
}
