'use client';

import React from 'react';
import GeminiChat from '@/components/GeminiChat';
import Link from 'next/link';

const GeminiPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/"
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mb-4 inline-block"
          >
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Gemini AI Chat
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Powered by Google Gemini 2.5 Flash
          </p>
        </div>

        {/* Chat Component */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl">
          <GeminiChat />
        </div>

        {/* Info Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
              💡 Features
            </h3>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Advanced AI conversations</li>
              <li>• Code explanations</li>
              <li>• Technical assistance</li>
              <li>• Real-time responses</li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
              🎯 Try Asking
            </h3>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>• "Explain React hooks"</li>
              <li>• "What are C++ race conditions?"</li>
              <li>• "Debug this TypeScript code"</li>
              <li>• "Best practices for Next.js"</li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
              ⚙️ Model Info
            </h3>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Model: Gemini 2.5 Flash</li>
              <li>• Latest & fastest</li>
              <li>• Enhanced reasoning</li>
              <li>• Multimodal capable</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeminiPage;
