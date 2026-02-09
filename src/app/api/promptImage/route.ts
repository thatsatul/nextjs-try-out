import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Prompt is required and must be a string" },
        { status: 400 }
      );
    }

    let imageUrl = null;
    let modelUsed = "";
    
    // Option 1: Try DeepAI's completely free public API (no key needed!)
    try {
      console.log("Trying DeepAI public endpoint...");
      const deepAIResponse = await fetch('https://api.deepai.org/api/text2img', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `text=${encodeURIComponent(prompt)}`,
      });

      if (deepAIResponse.ok) {
        const result = await deepAIResponse.json();
        if (result.output_url) {
          // Convert URL to base64
          const imgResponse = await fetch(result.output_url);
          const imgBlob = await imgResponse.blob();
          const imgBuffer = await imgBlob.arrayBuffer();
          const base64 = Buffer.from(imgBuffer).toString('base64');
          imageUrl = `data:image/png;base64,${base64}`;
          modelUsed = "DeepAI (Free)";
          console.log("✅ DeepAI generation successful!");
        }
      }
    } catch (deepAIError) {
      console.log("DeepAI failed:", (deepAIError as Error).message);
    }
    
    // Option 2: Try Replicate SDXL if you have a token (Best quality)
    if (!imageUrl && process.env.REPLICATE_API_TOKEN) {
      const Replicate = require('replicate').default;
      
      try {
        console.log("Using Replicate SDXL...");
        const replicate = new Replicate({
          auth: process.env.REPLICATE_API_TOKEN,
        });

        const output = await replicate.run(
          "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
          {
            input: {
              prompt: prompt,
              negative_prompt: "blurry, low quality, distorted, ugly",
              width: 1024,
              height: 1024,
              num_outputs: 1,
              num_inference_steps: 25,
            }
          }
        );

        if (output?.[0]) {
          // Convert to base64
          const imageResponse = await fetch(output[0]);
          const imageBlob = await imageResponse.blob();
          const imageBuffer = await imageBlob.arrayBuffer();
          const base64 = Buffer.from(imageBuffer).toString('base64');
          imageUrl = `data:image/png;base64,${base64}`;
          modelUsed = "Replicate SDXL";
          console.log("✅ Replicate generation successful!");
        }
      } catch (replicateError) {
        console.log("Replicate failed:", (replicateError as Error).message);
      }
    }
    
    // Option 3: Fallback to Hugging Face Inference API
    if (!imageUrl && process.env.HUGGINGFACE_API_KEY) {
      try {
        console.log("Trying Hugging Face Inference API...");
        const hfResponse = await fetch(
          'https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5',
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
            },
            body: JSON.stringify({
              inputs: prompt,
            }),
          }
        );

        if (hfResponse.ok) {
          const blob = await hfResponse.blob();
          const buffer = await blob.arrayBuffer();
          const base64 = Buffer.from(buffer).toString('base64');
          imageUrl = `data:image/png;base64,${base64}`;
          modelUsed = "Hugging Face SD 1.5";
          console.log("✅ Hugging Face generation successful!");
        } else {
          const errorText = await hfResponse.text();
          console.log("Hugging Face error:", errorText);
        }
      } catch (hfError) {
        console.log("Hugging Face failed:", (hfError as Error).message);
      }
    }

    if (!imageUrl) {
      throw new Error("All image generation services failed temporarily. Please try again in a moment.");
    }

    // The URL is directly usable, so we return it
    return NextResponse.json({
      imageUrl,
      prompt,
      model: modelUsed,
      directUrl: modelUsed === "Hugging Face SD 2.1", // base64 for HF
    });

  } catch (error) {
    console.error("Image generation error:", error);
    
    const errorMessage = error instanceof Error 
      ? error.message 
      : "Failed to generate image";

    return NextResponse.json(
      { 
        error: errorMessage,
        details: error instanceof Error ? error.stack : undefined 
      },
      { status: 500 }
    );
  }
}
