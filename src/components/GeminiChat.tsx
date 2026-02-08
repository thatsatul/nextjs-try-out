"use client";
import { useState, FormEvent } from "react";
import { generateContent } from "@/lib/gemini";

interface GeminiChatState {
  prompt: string;
  response: string;
  loading: boolean;
  error: string | null;
}

// Simple Markdown to HTML converter
function formatMarkdown(text: string): string {
  let html = text;
  
  // Convert headers (### Header -> <h3>Header</h3>)
  html = html.replace(/^### (.+)$/gm, '<h3 class="text-lg font-bold mt-4 mb-2">$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold mt-5 mb-3">$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mt-6 mb-4">$1</h1>');
  
  // Convert bold (**text** -> <strong>text</strong>)
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold">$1</strong>');
  
  // Convert italic (*text* -> <em>text</em>)
  html = html.replace(/\*(.+?)\*/g, '<em class="italic">$1</em>');
  
  // Convert unordered lists
  html = html.replace(/^\*   (.+)$/gm, '<li class="ml-8">$1</li>');
  html = html.replace(/^    \*   (.+)$/gm, '<li class="ml-12">$1</li>');
  
  // Wrap consecutive <li> in <ul>
  html = html.replace(/(<li.*?<\/li>\n?)+/g, (match) => {
    return '<ul class="list-disc space-y-1 my-2">' + match + '</ul>';
  });
  
  // Convert line breaks to <br> for better formatting
  html = html.replace(/\n\n/g, '<br/><br/>');
  html = html.replace(/\n/g, '<br/>');
  
  return html;
}

export default function GeminiChat() {
  const [state, setState] = useState<GeminiChatState>({
    prompt: "",
    response: "",
    loading: false,
    error: null,
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!state.prompt.trim()) return;

    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: state.prompt }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "API request failed");
      }
      
      setState(prev => ({ ...prev, response: data.result }));
    } catch (error) {
      setState(prev => ({
        ...prev, 
        error: error instanceof Error ? error.message : "Unknown error"
      }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={state.prompt}
          onChange={(e) => setState(prev => ({ ...prev, prompt: e.target.value }))}
          placeholder="Ask Gemini anything... (C++ race conditions, React patterns, etc.)"
          className="w-full p-3 border rounded-lg resize-vertical"
          rows={4}
          disabled={state.loading}
        />
        <button
          type="submit"
          disabled={state.loading || !state.prompt.trim()}
          className="w-full px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {state.loading ? "Generating..." : "Generate Response"}
        </button>
      </form>

      {state.error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          Error: {state.error}
        </div>
      )}

      {state.response && (
        <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border rounded-xl">
          <h3 className="font-semibold text-gray-900 mb-3">Gemini Response:</h3>
          <div 
            className="prose prose-sm max-w-none prose-headings:text-gray-900 prose-p:text-gray-800 prose-strong:text-gray-900 prose-ul:text-gray-800 prose-li:text-gray-800"
            dangerouslySetInnerHTML={{ 
              __html: formatMarkdown(state.response) 
            }}
          />
          <button
            onClick={() => setState(prev => ({ ...prev, response: "" }))}
            className="mt-3 text-sm text-blue-600 hover:underline"
          >
            Clear Response
          </button>
        </div>
      )}
    </div>
  );
}
