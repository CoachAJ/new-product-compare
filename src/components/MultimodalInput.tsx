import React, { useRef, useState } from 'react';
import { Camera, Upload, CheckCircle2, Loader2, Sparkles, Zap } from 'lucide-react';
import { MimeGuard } from '../utils/MimeGuard';

interface ImageInputProps {
    label: string;
    description: string;
    onImageCaptured: (dataUrl: string) => void;
    captured: boolean;
    accentColor: 'gold' | 'neutral';
}

const ImageItem: React.FC<ImageInputProps> = ({ label, description, onImageCaptured, captured, accentColor }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && MimeGuard.isValidImage(file)) {
            setLoading(true);
            const base64 = await MimeGuard.fileToBase64(file);
            onImageCaptured(base64);
            setLoading(false);
        }
    };

    const isGold = accentColor === 'gold';

    return (
        <div
            onClick={() => fileInputRef.current?.click()}
            className={`upload-zone ${captured ? 'captured' : ''} group cursor-pointer`}
        >
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
            />

            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                    {captured ? (
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isGold ? 'bg-yellow-500/20' : 'bg-green-500/20'}`}>
                            <CheckCircle2 className={`w-5 h-5 ${isGold ? 'text-yellow-400' : 'text-green-400'}`} />
                        </div>
                    ) : (
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                            <Camera className="w-4 h-4 opacity-40 group-hover:opacity-70 transition-opacity" />
                        </div>
                    )}
                    <div>
                        <h4 className="font-bold text-sm">{label}</h4>
                        <p className="text-xs opacity-40">{description}</p>
                    </div>
                </div>
            </div>

            <div className={`flex items-center justify-center gap-2 py-3 rounded-lg border transition-all ${captured
                    ? `border-transparent bg-gradient-to-r ${isGold ? 'from-yellow-500/10 to-orange-500/10' : 'from-green-500/10 to-emerald-500/10'}`
                    : 'border-dashed border-white/10 group-hover:border-white/20'
                }`}>
                {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    <>
                        <Upload className={`w-4 h-4 ${captured ? (isGold ? 'text-yellow-400' : 'text-green-400') : 'opacity-40 group-hover:opacity-70'} transition-all`} />
                        <span className={`text-sm font-medium ${captured ? '' : 'opacity-50 group-hover:opacity-80'} transition-all`}>
                            {captured ? 'Replace' : 'Upload'}
                        </span>
                    </>
                )}
            </div>
        </div>
    );
};

interface MultimodalInputProps {
    onImagesReady: (
        images: {
            homeFront: string;
            homeLabel: string;
            compFront: string;
            compLabel: string;
        },
        context: {
            homeContext: string;
            compContext: string;
        }
    ) => void;
    isProcessing: boolean;
}

export const MultimodalInput: React.FC<MultimodalInputProps> = ({ onImagesReady, isProcessing }) => {
    const [images, setImages] = useState({
        homeFront: '',
        homeLabel: '',
        compFront: '',
        compLabel: '',
    });
    const [context, setContext] = useState({
        homeContext: '',
        compContext: '',
    });

    const isComplete = !!(images.homeFront && images.homeLabel && images.compFront && images.compLabel);
    const homeComplete = !!(images.homeFront && images.homeLabel);
    const compComplete = !!(images.compFront && images.compLabel);

    return (
        <div className="w-full max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <div className="text-center space-y-3">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20">
                    <Sparkles className="w-4 h-4 text-yellow-400" />
                    <span className="text-xs font-bold text-yellow-400 uppercase tracking-widest">Clinical Comparison Engine</span>
                </div>
                <h1 className="heading-xl text-white gold-text-glow">
                    Tale of the Tape
                </h1>
                <p className="text-sm opacity-50 max-w-md mx-auto">
                    Upload product images for AI-powered clinical analysis. Compare bioavailability, standardization, and quality metrics.
                </p>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Home Product */}
                <div className="glass-card-gold p-6 space-y-5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg shadow-yellow-500/20">
                            <Zap className="w-5 h-5 text-black" />
                        </div>
                        <div>
                            <h2 className="font-bold text-lg text-yellow-400">Your Product</h2>
                            <p className="text-xs opacity-50">The product you're promoting</p>
                        </div>
                        {homeComplete && (
                            <div className="ml-auto px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30">
                                <span className="text-xs font-bold text-yellow-400">Ready</span>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <ImageItem
                            label="Front Label"
                            description="Brand & marketing"
                            captured={!!images.homeFront}
                            onImageCaptured={(val) => setImages({ ...images, homeFront: val })}
                            accentColor="gold"
                        />
                        <ImageItem
                            label="Nutrition Facts"
                            description="Ingredients list"
                            captured={!!images.homeLabel}
                            onImageCaptured={(val) => setImages({ ...images, homeLabel: val })}
                            accentColor="gold"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="label-sm text-yellow-400/70">Additional Context (Optional)</label>
                        <textarea
                            placeholder="e.g. Patented extraction method, third-party testing results, sourcing details..."
                            className="w-full h-20 bg-black/30 border border-yellow-500/10 rounded-xl p-3 text-sm placeholder:opacity-30 focus:border-yellow-500/30 focus:ring-0 outline-none transition-colors resize-none custom-scrollbar"
                            value={context.homeContext}
                            onChange={(e) => setContext({ ...context, homeContext: e.target.value })}
                        />
                    </div>
                </div>

                {/* Competitor Product */}
                <div className="glass-card-neutral p-6 space-y-5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-500 to-gray-700 flex items-center justify-center">
                            <span className="text-lg font-black text-white/80">VS</span>
                        </div>
                        <div>
                            <h2 className="font-bold text-lg text-white/80">Competitor</h2>
                            <p className="text-xs opacity-50">The product you're comparing against</p>
                        </div>
                        {compComplete && (
                            <div className="ml-auto px-3 py-1 rounded-full bg-white/10 border border-white/20">
                                <span className="text-xs font-bold text-white/70">Ready</span>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <ImageItem
                            label="Front Label"
                            description="Brand & marketing"
                            captured={!!images.compFront}
                            onImageCaptured={(val) => setImages({ ...images, compFront: val })}
                            accentColor="neutral"
                        />
                        <ImageItem
                            label="Nutrition Facts"
                            description="Ingredients list"
                            captured={!!images.compLabel}
                            onImageCaptured={(val) => setImages({ ...images, compLabel: val })}
                            accentColor="neutral"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="label-sm">Comparison Notes (Optional)</label>
                        <textarea
                            placeholder="e.g. Customer asked about this brand, known quality concerns..."
                            className="w-full h-20 bg-black/30 border border-white/5 rounded-xl p-3 text-sm placeholder:opacity-30 focus:border-white/20 focus:ring-0 outline-none transition-colors resize-none custom-scrollbar"
                            value={context.compContext}
                            onChange={(e) => setContext({ ...context, compContext: e.target.value })}
                        />
                    </div>
                </div>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col items-center gap-4 pt-4">
                <button
                    onClick={() => onImagesReady(images, context)}
                    disabled={!isComplete || isProcessing}
                    className="btn-primary text-lg px-12 py-5 rounded-2xl flex items-center gap-3 disabled:opacity-30 disabled:cursor-not-allowed disabled:transform-none"
                >
                    {isProcessing ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Analyzing Clinical Data...
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-5 h-5" />
                            Run Expert Analysis
                        </>
                    )}
                </button>

                {!isComplete && (
                    <p className="text-xs opacity-30 text-center">
                        Upload all 4 images to enable analysis
                    </p>
                )}
            </div>
        </div>
    );
};
