"use client";
import { useState, FormEvent } from "react";

interface ImagePromptState {
  prompt: string;
  imageUrl: string | null;
  loading: boolean;
  error: string | null;
}

export default function ImagePrompt() {
  const [state, setState] = useState<ImagePromptState>({
    prompt: "",
    imageUrl: null,
    loading: false,
    error: null,
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!state.prompt.trim()) return;

    setState(prev => ({ ...prev, loading: true, error: null, imageUrl: null }));
    
    try {
      const res = await fetch("/api/promptImage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: state.prompt }),
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
    setState({
      prompt: "",
      imageUrl: null,
      loading: false,
      error: null,
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          AI Image Generator
        </h1>
        <p className="text-gray-600 mb-2">
          Powered by Pollinations.AI (Flux Model) - Create stunning images from text
        </p>
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
          <p>💡 <strong>Tip:</strong> Be specific with your descriptions for best results. Generation typically takes 5-10 seconds.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
            Image Description
          </label>
          <textarea
            id="prompt"
            value={state.prompt}
            onChange={(e) => setState(prev => ({ ...prev, prompt: e.target.value }))}
            placeholder="Example: A serene mountain landscape at sunset with a lake in the foreground, painted in watercolor style"
            className="w-full p-4 border border-gray-300 rounded-lg resize-vertical focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={4}
            disabled={state.loading}
          />
        </div>
        
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={state.loading || !state.prompt.trim()}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
          >
            {state.loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Generating...
              </span>
            ) : (
              "🎨 Generate Image"
            )}
          </button>
          
          {(state.imageUrl || state.error) && (
            <button
              type="button"
              onClick={handleClear}
              className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </form>

      {state.error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
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

      {state.imageUrl && (
        <div className="mt-8 space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Generated Image</h2>
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
              download="generated-image.png"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download Image
            </a>
            <button
              onClick={() => window.open(state.imageUrl!, '_blank')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Open in New Tab
            </button>
          </div>
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Prompt:</span> {state.prompt}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
