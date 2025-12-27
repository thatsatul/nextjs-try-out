'use client';

import { useState, useEffect } from 'react';

const Timer = () => {
  const [inputSeconds, setInputSeconds] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    if (timeLeft === null) return;
    
    const interval = setInterval(() => {
      setTimeLeft(prev => prev !== null && prev > 0 ? prev - 1 : null);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  const startTimer = () => {
    const seconds = parseInt(inputSeconds);
    if (!isNaN(seconds) && seconds > 0) {
      setTimeLeft(seconds);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="bg-white shadow-lg rounded-lg p-8 space-y-6 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Timer</h1>
        
        <div className="flex space-x-4">
          <input
            type="number"
            value={inputSeconds}
            onChange={(e) => setInputSeconds(e.target.value)}
            placeholder="Enter seconds"
            className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={startTimer}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Start
          </button>
        </div>
        
        {timeLeft !== null && (
          <div className="text-4xl font-mono text-center">
            {timeLeft}
          </div>
        )}
      </div>
    </div>
  );
};

export default function TimerPage() {
  return <Timer />;
}
