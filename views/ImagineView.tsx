import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Icons } from '../constants';
import { generateImage } from '../services/geminiService';

export const ImagineView: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '16:9' | '9:16'>('1:1');

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    setGeneratedImage(null);

    try {
      const imageBase64 = await generateImage(prompt, aspectRatio);
      setGeneratedImage(imageBase64);
    } catch (error) {
      alert("Failed to generate image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col md:flex-row gap-6 p-6 max-w-6xl mx-auto">
      {/* Left Panel: Controls */}
      <div className="w-full md:w-1/3 flex flex-col gap-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white tracking-tight">Imagine</h2>
          <p className="text-zinc-400 text-sm">Generate studio-quality images with Imagen 3.</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-medium text-zinc-300 uppercase tracking-wider">Prompt</label>
            <textarea
              className="w-full bg-surface border border-zinc-800 rounded-lg p-3 text-sm text-zinc-200 focus:ring-2 focus:ring-primary/50 focus:border-transparent outline-none resize-none h-32"
              placeholder="A futuristic city with neon lights, cinematic lighting, 8k..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-zinc-300 uppercase tracking-wider">Aspect Ratio</label>
            <div className="grid grid-cols-3 gap-2">
              {['1:1', '16:9', '9:16'].map((ratio) => (
                <button
                  key={ratio}
                  onClick={() => setAspectRatio(ratio as any)}
                  className={`py-2 px-3 rounded-md text-xs font-medium border transition-all ${
                    aspectRatio === ratio
                      ? 'bg-primary/10 border-primary text-primary'
                      : 'bg-surface border-zinc-800 text-zinc-400 hover:bg-surfaceHover'
                  }`}
                >
                  {ratio}
                </button>
              ))}
            </div>
          </div>

          <Button 
            className="w-full h-12 text-base font-semibold" 
            onClick={handleGenerate}
            isLoading={isLoading}
            disabled={!prompt.trim()}
            icon={<Icons.Sparkles className="w-5 h-5" />}
          >
            {isLoading ? 'Generating...' : 'Generate Art'}
          </Button>
        </div>
      </div>

      {/* Right Panel: Preview */}
      <div className="w-full md:w-2/3 bg-[#050506] border-2 border-dashed border-zinc-800 rounded-2xl flex items-center justify-center relative overflow-hidden group">
        {isLoading ? (
             <div className="text-center space-y-4">
                <div className="relative w-16 h-16 mx-auto">
                    <div className="absolute inset-0 border-4 border-zinc-800 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className="text-zinc-500 animate-pulse">Dreaming up your image...</p>
             </div>
        ) : generatedImage ? (
            <>
                <img 
                    src={generatedImage} 
                    alt="Generated" 
                    className="max-w-full max-h-full object-contain shadow-2xl" 
                />
                <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <a href={generatedImage} download={`lumina-${Date.now()}.jpg`}>
                        <Button variant="secondary" icon={<Icons.Download className="w-4 h-4"/>}>
                            Download
                        </Button>
                    </a>
                </div>
            </>
        ) : (
            <div className="text-center text-zinc-600">
                <Icons.Image className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p>Enter a prompt to begin</p>
            </div>
        )}
      </div>
    </div>
  );
};