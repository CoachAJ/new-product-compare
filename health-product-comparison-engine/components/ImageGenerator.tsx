
import React, { useState } from 'react';
import { ProductData, UserProfile, ImageSize } from '../types';
import { generateMarketingImage } from '../services/geminiService';
import { Image as ImageIcon, Download, Loader2, Sparkles, Key, Settings, AlertTriangle } from 'lucide-react';

interface ImageGeneratorProps {
  homeProduct: ProductData;
  competitorProduct: ProductData;
  userProfile: UserProfile;
  winner: 'home' | 'competitor';
}

export const ImageGenerator: React.FC<ImageGeneratorProps> = ({
  homeProduct,
  competitorProduct,
  userProfile,
  winner
}) => {
  const [size, setSize] = useState<ImageSize>(ImageSize.SIZE_1K);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsApiKey, setNeedsApiKey] = useState(false);

  const checkKeyAndGenerate = async () => {
    if (userProfile.apiKey) {
      await handleGenerate();
      return;
    }

    const aistudio = (window as any).aistudio;
    if (aistudio) {
      const hasKey = await aistudio.hasSelectedApiKey();
      if (!hasKey) {
        setNeedsApiKey(true);
        return;
      }
    }
    await handleGenerate();
  };

  const handleSelectKey = async () => {
    try {
      await (window as any).aistudio.openSelectKey();
      setNeedsApiKey(false);
      setIsGenerating(true);
      setTimeout(() => handleGenerate(), 500);
    } catch (e) {
      console.error("Key selection failed", e);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    setNeedsApiKey(false);

    try {
      const result = await generateMarketingImage(homeProduct, competitorProduct, userProfile, size, winner);
      setGeneratedImage(result);
    } catch (e: any) {
      console.error(e);
      const msg = e.message || '';
      if (msg.includes('permission') || msg.includes('403') || msg.includes('401') || msg.includes('Key')) {
         setNeedsApiKey(true);
         setError(userProfile.apiKey ? 'Your custom API Key was rejected.' : 'Authentication required for image generation.');
      } else {
         setError('Failed to generate image: ' + msg);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-slate-900 rounded-xl overflow-hidden shadow-xl text-white">
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-bold">Marketing Asset Generator</h3>
        </div>
        <p className="text-slate-400 text-sm">Create a "Tale of the Tape" visual for social media.</p>
      </div>

      <div className="p-6 grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <div className="space-y-2">
             <label className="block text-sm font-medium text-slate-300">Resolution</label>
             <div className="grid grid-cols-3 gap-2">
               {[ImageSize.SIZE_1K, ImageSize.SIZE_2K, ImageSize.SIZE_4K].map((s) => (
                 <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    size === s ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                 >
                   {s}
                 </button>
               ))}
             </div>
          </div>
          
          {needsApiKey ? (
            <div className="space-y-3 bg-slate-800 p-4 rounded-lg border border-slate-700">
              <p className="text-amber-400 font-medium text-sm flex items-center gap-2">
                 <Key className="w-4 h-4" /> Auth Required
              </p>
              <button
                onClick={handleSelectKey}
                className="w-full bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold py-2 rounded transition-all"
              >
                Quick Connect
              </button>
              <button
                onClick={() => document.querySelector('button[aria-label="Profile Settings"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))}
                className="w-full bg-slate-700 hover:bg-slate-600 text-white text-xs py-2 rounded transition-all"
              >
                Update Settings
              </button>
            </div>
          ) : (
            <button
              onClick={checkKeyAndGenerate}
              disabled={isGenerating}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 disabled:opacity-50 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
            >
              {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <ImageIcon className="w-5 h-5" />}
              {isGenerating ? 'Designing...' : 'Generate Visual'}
            </button>
          )}
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded p-3">
              <p className="text-red-400 text-xs flex gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                {error}
              </p>
            </div>
          )}
        </div>

        <div className="bg-slate-800 rounded-lg aspect-square flex items-center justify-center relative overflow-hidden border border-slate-700 group">
          {generatedImage ? (
            <>
              <img src={generatedImage} alt="Comparison" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <a href={generatedImage} download="comparison.png" className="bg-white text-slate-900 px-4 py-2 rounded-full font-bold flex items-center gap-2">
                  <Download className="w-4 h-4" /> Download
                </a>
              </div>
            </>
          ) : (
            <div className="text-center text-slate-500 p-8">
              <ImageIcon className="w-8 h-8 opacity-50 mx-auto mb-2" />
              <p className="text-xs">Visual preview</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
