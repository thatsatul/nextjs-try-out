"use client";
import { useState, FormEvent, ChangeEvent } from "react";

interface FaceImageState {
  prompt: string;
  face1: File | null;
  face2: File | null;
  face1Preview: string | null;
  face2Preview: string | null;
  imageUrl: string | null;
  loading: boolean;
  error: string | null;
}

export default function FaceImageGenerator() {
  const [state, setState] = useState<FaceImageState>({
    prompt: "",
    face1: null,
    face2: null,
    face1Preview: null,
    face2Preview: null,
    imageUrl: null,
    loading: false,
    error: null,
  });

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, faceNumber: 1 | 2) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setState(prev => ({
        ...prev,
        error: "Please select a valid image file"
      }));
      return;
    }

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);

    if (faceNumber === 1) {
      setState(prev => ({
        ...prev,
        face1: file,
        face1Preview: previewUrl,
        error: null,
      }));
    } else {
      setState(prev => ({
        ...prev,
        face2: file,
        face2Preview: previewUrl,
        error: null,
      }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!state.prompt.trim()) {
      setState(prev => ({ ...prev, error: "Please enter a prompt" }));
      return;
    }

    if (!state.face1 || !state.face2) {
      setState(prev => ({ ...prev, error: "Please upload both photos" }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null, imageUrl: null }));
    
    try {
      // Create FormData to send files
      const formData = new FormData();
      formData.append("prompt", state.prompt);
      formData.append("face1", state.face1);
      formData.append("face2", state.face2);

      const res = await fetch("/api/faceImage", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "API request failed");
      }
      
      setState(prev => ({ ...prev, imageUrl: data.imageUrl }));
    } catch (error) {
      setState(prev => ({
        ...prev, 
        error: error instanceof Error ? error.message : "Unknown error"
      }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const handleClear = () => {
    // Revoke preview URLs to free memory
    if (state.face1Preview) URL.revokeObjectURL(state.face1Preview);
    if (state.face2Preview) URL.revokeObjectURL(state.face2Preview);
    
    setState({
      prompt: "",
      face1: null,
      face2: null,
      face1Preview: null,
      face2Preview: null,
      imageUrl: null,
      loading: false,
      error: null,
    });
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          AI Face Image Generator
        </h1>
        <p className="text-gray-600 mb-2">
          Upload photos and create AI-generated images with your actual faces swapped in!
        </p>
        <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg text-sm">
          <p className="text-purple-900 mb-2">
            <strong>🎯 How it works:</strong>
          </p>
          <ol className="list-decimal list-inside space-y-1 text-purple-800">
            <li>Upload two clear face photos (front-facing works best)</li>
            <li>Describe the scene you want to create</li>
            <li>AI generates the scene and swaps in your actual faces</li>
            <li>Processing takes 20-40 seconds - please be patient!</li>
          </ol>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Photo Upload Section */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Face 1 Upload */}
          <div className="space-y-3">
            <label htmlFor="face1-upload" className="block text-sm font-medium text-gray-700">
              Photo 1 (e.g., Your Photo) *
            </label>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 1)}
                className="hidden"
                id="face1-upload"
                disabled={state.loading}
              />
              <label
                htmlFor="face1-upload"
                className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                {state.face1Preview ? (
                  <img
                    src={state.face1Preview}
                    alt="Face 1 preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="flex flex-col items-center text-gray-500">
                    <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <p className="text-sm">Click to upload photo 1</p>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Face 2 Upload */}
          <div className="space-y-3">
            <label htmlFor="face2-upload" className="block text-sm font-medium text-gray-700">
              Photo 2 (e.g., Wife's Photo) *
            </label>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 2)}
                className="hidden"
                id="face2-upload"
                disabled={state.loading}
              />
              <label
                htmlFor="face2-upload"
                className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-colors"
              >
                {state.face2Preview ? (
                  <img
                    src={state.face2Preview}
                    alt="Face 2 preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="flex flex-col items-center text-gray-500">
                    <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <p className="text-sm">Click to upload photo 2</p>
                  </div>
                )}
              </label>
            </div>
          </div>
        </div>

        {/* Prompt Input */}
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
            Scene Description *
          </label>
          <textarea
            id="prompt"
            value={state.prompt}
            onChange={(e) => setState(prev => ({ ...prev, prompt: e.target.value }))}
            placeholder="Example: A couple having a romantic dinner at a fancy restaurant with candles and wine, cinematic lighting, professional photography"
            className="w-full p-4 border border-gray-300 rounded-lg resize-vertical focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            rows={3}
            disabled={state.loading}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={state.loading || !state.prompt.trim() || !state.face1 || !state.face2}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
          >
            {state.loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing... (20-40s)
              </span>
            ) : (
              "✨ Generate Image with Face Swap"
            )}
          </button>
          
          {(state.face1Preview || state.face2Preview || state.imageUrl || state.error) && (
            <button
              type="button"
              onClick={handleClear}
              className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
            >
              Clear All
            </button>
          )}
        </div>
      </form>

      {/* Error Display */}
      {state.error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          <div className="flex items-start gap-2">
            <svg className="w-5 h-5 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-semibold">Error</p>
              <p className="text-sm">{state.error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Generated Image Display */}
      {state.imageUrl && (
        <div className="mt-8 space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">✨ Your Generated Image</h2>
          
          {/* Info Notice */}
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-900">
              <strong>ℹ️ Note:</strong> This is a high-quality AI-generated scene based on your prompt. 
              True face-swapping with your uploaded photos requires paid API services (fal.ai or Replicate with credits). 
              The current free version creates beautiful romantic scenes without actual face replacement.
            </p>
          </div>
          
          <div className="relative rounded-lg overflow-hidden shadow-2xl border border-gray-200 bg-gray-50">
            <img 
              src={state.imageUrl} 
              alt={state.prompt}
              className="w-full h-auto"
            />
          </div>
          <div className="flex gap-3">
            <a
              href={state.imageUrl}
              download="ai-generated-face-image.png"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download Image
            </a>
            <button
              onClick={() => window.open(state.imageUrl!, '_blank')}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Open in New Tab
            </button>
          </div>
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Prompt:</span> {state.prompt}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
