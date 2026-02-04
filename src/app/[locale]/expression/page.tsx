'use client';

import { useState } from 'react';

const ExpressionCalculator = () => {
  const [expression, setExpression] = useState<string>('');
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const evaluateExpression = () => {
    try {
      // Remove any whitespace and validate that we only have valid mathematical expressions
      const cleanExpression = expression.replace(/\s/g, '');
      if (!/^[0-9+\-*/(). ]*$/.test(cleanExpression)) {
        throw new Error('Invalid characters in expression');
      }
      
      // const evalResult = eval(cleanExpression);
      const evalResult = Function(`'use strict'; return (${cleanExpression})`)();
      setResult(String(evalResult));
      setError(null);
    } catch (err) {
      setError('Invalid expression');
      setResult(null);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="bg-white shadow-lg rounded-lg p-8 space-y-6 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Expression Calculator</h1>
        
        <div className="flex space-x-4">
          <input
            type="text"
            value={expression}
            onChange={(e) => setExpression(e.target.value)}
            placeholder="Enter expression (e.g., (3+5)*2)"
            className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={evaluateExpression}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Calculate
          </button>
        </div>

        {result && (
          <div className="text-2xl font-mono text-center text-green-600">
            Result: {result}
          </div>
        )}
        
        {error && (
          <div className="text-red-500 text-center">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default function ExpressionPage() {
  return <ExpressionCalculator />;
}
