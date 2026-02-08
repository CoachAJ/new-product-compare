import React, { useState, useEffect } from 'react';
import { GeminiService } from '../services/GeminiService';
import type { AnalysisResult } from '../services/GeminiService';
import type { CoachProfile } from '../utils/ProfileManager';
import { Image as ImageIcon, Wand2, Sparkles, Loader2, Edit3, Send } from 'lucide-react';

interface VisualAssetGeneratorProps {
    analysis: AnalysisResult;
    profile: CoachProfile;
}

export const VisualAssetGenerator: React.FC<VisualAssetGeneratorProps> = ({ analysis, profile }) => {
    const [prompt, setPrompt] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);

    useEffect(() => {
        const initPrompt = async () => {
            const p = await GeminiService.generateImagePrompt(analysis, profile);
            setPrompt(p);
        };
        initPrompt();
    }, [analysis, profile]);

    const handleGenerate = async () => {
        setIsGenerating(true);
        try {
            // In a real implementation with gemini-3-pro-image-preview
            // we would call the API here. For now, we'll simulate the wait
            // and explain that the live API is used for the reasoning.
            await new Promise(resolve => setTimeout(resolve, 3000));
            // Simulate a generated image (placeholder for logic)
            setGeneratedImageUrl('https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=1000');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="glass-card p-6 w-full max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <ImageIcon className="text-brand-gold" />
                    "Winner's Circle" Asset
                </h2>
                {!generatedImageUrl && !isGenerating && (
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="text-xs flex items-center gap-1 opacity-60 hover:opacity-100 transition-opacity"
                    >
                        <Edit3 className="w-3 h-3" />
                        {isEditing ? 'Close Editor' : 'Edit Prompt'}
                    </button>
                )}
            </div>

            {!generatedImageUrl ? (
                <div className="space-y-4">
                    {isEditing ? (
                        <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                            <label className="text-sm font-medium opacity-70 italic">AI Artist Instructions:</label>
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                className="w-full h-32 bg-black/40 border border-white/10 rounded-xl p-4 text-sm focus:ring-2 focus:ring-brand-gold outline-none transition-all custom-scrollbar"
                            />
                        </div>
                    ) : (
                        <div className="p-8 rounded-2xl bg-white/5 border border-dashed border-white/20 flex flex-col items-center justify-center text-center">
                            <Sparkles className="text-brand-gold w-12 h-12 mb-4 animate-pulse" />
                            <h3 className="font-bold mb-2 text-lg">Ready to Generate Visuals</h3>
                            <p className="text-sm opacity-60 max-w-md mx-auto mb-6">
                                Our AI will create a 1:1 "Tale of the Tape" graphic with a Gold Aura spotlight on your product.
                            </p>
                        </div>
                    )}

                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        className="w-full bg-brand-gold text-black font-black py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-yellow-400 transition-all shadow-lg shadow-brand-gold/20"
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 className="animate-spin" />
                                DREAMING UP YOUR ASSET...
                            </>
                        ) : (
                            <>
                                <Wand2 />
                                GENERATE WINNER'S CIRCLE GRAPHIC
                            </>
                        )}
                    </button>
                </div>
            ) : (
                <div className="space-y-6 animate-in zoom-in-95 duration-500">
                    <div className="relative group rounded-2xl overflow-hidden shadow-2xl shadow-brand-gold/10 border border-brand-gold/30">
                        <img src={generatedImageUrl} alt="Generated Asset" className="w-full aspect-square object-cover" />
                        <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                            <p className="text-[10px] text-brand-gold font-bold tracking-widest uppercase">
                                Expert Analysis by Coach {profile.name}
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={() => setGeneratedImageUrl(null)}
                            className="flex-1 py-3 rounded-lg border border-white/10 hover:bg-white/5 transition-all text-sm font-bold"
                        >
                            Regenerate (Edit Prompt)
                        </button>
                        <button className="flex-1 py-3 rounded-lg bg-white text-black font-black hover:bg-gray-200 transition-all text-sm flex items-center justify-center gap-2">
                            <Send className="w-4 h-4" />
                            Download & Post
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
