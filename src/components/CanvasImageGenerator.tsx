'use client';

import { useState, useRef, useEffect } from 'react';

export default function CanvasImageGenerator() {
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateCanvasImage = () => {
    if (!prompt.trim() || !canvasRef.current) return;

    setIsGenerating(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;

    // Set canvas size
    canvas.width = 1024;
    canvas.height = 1024;

    // Parse the prompt for keywords to determine style
    const lowerPrompt = prompt.toLowerCase();
    
    // Determine color scheme based on keywords
    let colors = {
      bg: ['#1a1a2e', '#16213e', '#0f3460'],
      accent: ['#e94560', '#f97068', '#f9c74f'],
      highlight: ['#90e0ef', '#00b4d8', '#0077b6']
    };

    if (lowerPrompt.includes('sunset') || lowerPrompt.includes('beach')) {
      colors = {
        bg: ['#FF6B6B', '#FFE66D', '#FF8E53'],
        accent: ['#FF6B9D', '#C73E1D', '#FAA916'],
        highlight: ['#FFD93D', '#FCF6B1', '#F7B787']
      };
    } else if (lowerPrompt.includes('forest') || lowerPrompt.includes('nature')) {
      colors = {
        bg: ['#2D4A3E', '#1B5E20', '#4A7C59'],
        accent: ['#8BC34A', '#4CAF50', '#81C784'],
        highlight: ['#C8E6C9', '#AED581', '#9CCC65']
      };
    } else if (lowerPrompt.includes('ocean') || lowerPrompt.includes('sea')) {
      colors = {
        bg: ['#003B73', '#0074B7', '#60A3D9'],
        accent: ['#0A2463', '#3E92CC', '#1E3D59'],
        highlight: ['#BFD7ED', '#A8DADC', '#457B9D']
      };
    } else if (lowerPrompt.includes('romantic') || lowerPrompt.includes('love')) {
      colors = {
        bg: ['#FF69B4', '#FFB6C1', '#FFC0CB'],
        accent: ['#FF1493', '#C71585', '#DB7093'],
        highlight: ['#FFE4E1', '#FFF0F5', '#FFDEE9']
      };
    }

    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, colors.bg[0]);
    gradient.addColorStop(0.5, colors.bg[1]);
    gradient.addColorStop(1, colors.bg[2]);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add abstract shapes based on prompt
    const shapeCount = 15 + Math.floor(Math.random() * 15);
    
    for (let i = 0; i < shapeCount; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const size = 50 + Math.random() * 200;
      const colorArray = i % 2 === 0 ? colors.accent : colors.highlight;
      const color = colorArray[Math.floor(Math.random() * colorArray.length)];
      
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.15 + Math.random() * 0.3;
      
      // Randomly choose shape
      const shapeType = Math.floor(Math.random() * 3);
      
      if (shapeType === 0) {
        // Circle
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      } else if (shapeType === 1) {
        // Rectangle
        ctx.fillRect(x, y, size, size);
      } else {
        // Triangle
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + size, y + size);
        ctx.lineTo(x - size, y + size);
        ctx.closePath();
        ctx.fill();
      }
    }

    // Add blur effect with multiple layers
    ctx.globalAlpha = 0.05;
    for (let i = 0; i < 5; i++) {
      ctx.fillStyle = colors.bg[1];
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Add central focus area for "couple"
    if (lowerPrompt.includes('couple') || lowerPrompt.includes('two people')) {
      ctx.globalAlpha = 0.8;
      
      // Create two circular shapes representing people
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      // Person 1
      const radialGrad1 = ctx.createRadialGradient(
        centerX - 150, centerY, 20,
        centerX - 150, centerY, 180
      );
      radialGrad1.addColorStop(0, colors.highlight[0]);
      radialGrad1.addColorStop(1, 'transparent');
      ctx.fillStyle = radialGrad1;
      ctx.beginPath();
      ctx.arc(centerX - 150, centerY, 180, 0, Math.PI * 2);
      ctx.fill();
      
      // Person 2
      const radialGrad2 = ctx.createRadialGradient(
        centerX + 150, centerY, 20,
        centerX + 150, centerY, 180
      );
      radialGrad2.addColorStop(0, colors.highlight[1]);
      radialGrad2.addColorStop(1, 'transparent');
      ctx.fillStyle = radialGrad2;
      ctx.beginPath();
      ctx.arc(centerX + 150, centerY, 180, 0, Math.PI * 2);
      ctx.fill();
      
      // Connection between them (heart shape area)
      ctx.globalAlpha = 0.3;
      ctx.fillStyle = colors.accent[0];
      ctx.beginPath();
      ctx.moveTo(centerX, centerY - 50);
      ctx.bezierCurveTo(centerX - 100, centerY - 150, centerX - 200, centerY, centerX, centerY + 100);
      ctx.bezierCurveTo(centerX + 200, centerY, centerX + 100, centerY - 150, centerX, centerY - 50);
      ctx.fill();
    }

    // Add decorative particles
    ctx.globalAlpha = 0.6;
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const size = Math.random() * 3;
      
      ctx.fillStyle = colors.highlight[Math.floor(Math.random() * colors.highlight.length)];
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }

    // Add text overlay with the prompt
    ctx.globalAlpha = 0.8;
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 10;
    
    // Word wrap the prompt
    const maxWidth = canvas.width - 200;
    const words = prompt.split(' ');
    let line = '';
    let y = 100;
    
    for (const word of words) {
      const testLine = line + word + ' ';
      const metrics = ctx.measureText(testLine);
      
      if (metrics.width > maxWidth && line !== '') {
        ctx.fillText(line, canvas.width / 2, y);
        line = word + ' ';
        y += 40;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, canvas.width / 2, y);

    // Convert to image
    const imageDataUrl = canvas.toDataURL('image/png');
    setGeneratedImage(imageDataUrl);
    setIsGenerating(false);
  };

  const downloadImage = () => {
    if (!generatedImage) return;
    
    const link = document.createElement('a');
    link.download = `canvas-art-${Date.now()}.png`;
    link.href = generatedImage;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
          <h1 className="text-4xl font-bold text-white mb-2 text-center">
            🎨 Canvas Art Generator
          </h1>
          <p className="text-white/80 text-center mb-8">
            100% client-side, no API calls, works offline!
          </p>

          <div className="space-y-6">
            <div>
              <label className="block text-white font-semibold mb-2">
                Describe your scene:
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., romantic sunset on beach with couple holding hands, ocean waves, golden hour"
                className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/50 border border-white/30 focus:border-white/60 focus:outline-none resize-none"
                rows={4}
              />
            </div>

            <button
              onClick={generateCanvasImage}
              disabled={!prompt.trim() || isGenerating}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold py-4 rounded-lg hover:from-pink-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
            >
              {isGenerating ? '🎨 Generating...' : '✨ Generate Canvas Art'}
            </button>

            {generatedImage && (
              <div className="space-y-4 mt-8">
                <div className="relative rounded-lg overflow-hidden shadow-2xl border-4 border-white/20">
                  <img
                    src={generatedImage}
                    alt="Generated canvas art"
                    className="w-full h-auto"
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={downloadImage}
                    className="flex-1 bg-green-500 text-white font-bold py-3 rounded-lg hover:bg-green-600 transition-all"
                  >
                    💾 Download Image
                  </button>
                  <button
                    onClick={() => setGeneratedImage(null)}
                    className="flex-1 bg-red-500 text-white font-bold py-3 rounded-lg hover:bg-red-600 transition-all"
                  >
                    🗑️ Clear
                  </button>
                </div>

                <div className="bg-blue-500/20 border border-blue-400/50 rounded-lg p-4 text-white text-sm">
                  <p className="font-semibold mb-2">💡 How this works:</p>
                  <ul className="list-disc list-inside space-y-1 text-white/90">
                    <li>100% generated in your browser using HTML5 Canvas</li>
                    <li>No external APIs, works completely offline</li>
                    <li>Creates abstract art based on your prompt keywords</li>
                    <li>Instant generation, unlimited images, totally free!</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Hidden canvas for generation */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}
