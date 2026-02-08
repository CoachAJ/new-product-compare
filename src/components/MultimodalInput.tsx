import React, { useRef, useState } from 'react';
import { Camera, Upload, CheckCircle2, Loader2, Sparkles, Crown, Target, Zap } from 'lucide-react';
import { MimeGuard } from '../utils/MimeGuard';

interface ImageInputProps {
    label: string;
    onImageCaptured: (dataUrl: string) => void;
    captured: boolean;
    variant: 'gold' | 'silver';
}

const ImageUploadCard: React.FC<ImageInputProps> = ({ label, onImageCaptured, captured, variant }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && MimeGuard.isValidImage(file)) {
            setLoading(true);
            const base64 = await MimeGuard.fileToBase64(file);
            setPreview(base64);
            onImageCaptured(base64);
            setLoading(false);
        }
    };

    const isGold = variant === 'gold';
    const borderColor = isGold ? 'border-yellow-500/30' : 'border-cyan-500/30';
    const hoverBorder = isGold ? 'hover:border-yellow-400' : 'hover:border-cyan-400';
    const glowColor = isGold ? 'shadow-yellow-500/20' : 'shadow-cyan-500/20';
    const accentColor = isGold ? 'text-yellow-400' : 'text-cyan-400';
    const bgGradient = isGold
        ? 'bg-gradient-to-br from-yellow-500/10 via-orange-500/5 to-transparent'
        : 'bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-transparent';

    return (
        <div
            onClick={() => fileInputRef.current?.click()}
            className={`
                relative overflow-hidden rounded-2xl border-2 ${borderColor} ${hoverBorder}
                ${captured ? `shadow-lg ${glowColor}` : ''} 
                ${bgGradient}
                cursor-pointer transition-all duration-300 group
                hover:scale-[1.02] hover:shadow-xl
            `}
        >
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
            />

            {/* Preview or Placeholder */}
            <div className="aspect-[4/3] relative">
                {preview ? (
                    <img src={preview} alt={label} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-3 p-4">
                        <div className={`w-16 h-16 rounded-2xl ${isGold ? 'bg-yellow-500/10' : 'bg-cyan-500/10'} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                            <Camera className={`w-8 h-8 ${accentColor} opacity-50 group-hover:opacity-100 transition-opacity`} />
                        </div>
                        <div className="text-center">
                            <p className={`font-bold text-sm ${accentColor}`}>{label}</p>
                            <p className="text-xs opacity-40 mt-1">Click to upload</p>
                        </div>
                    </div>
                )}

                {/* Loading Overlay */}
                {loading && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <Loader2 className={`w-8 h-8 animate-spin ${accentColor}`} />
                    </div>
                )}

                {/* Captured Badge */}
                {captured && !loading && (
                    <div className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center ${isGold ? 'bg-yellow-500' : 'bg-cyan-500'} shadow-lg`}>
                        <CheckCircle2 className="w-5 h-5 text-black" />
                    </div>
                )}
            </div>

            {/* Bottom Action Bar */}
            <div className={`px-4 py-3 border-t ${isGold ? 'border-yellow-500/20 bg-yellow-500/5' : 'border-cyan-500/20 bg-cyan-500/5'}`}>
                <div className="flex items-center justify-center gap-2">
                    <Upload className={`w-4 h-4 ${accentColor}`} />
                    <span className={`text-xs font-bold uppercase tracking-wider ${accentColor}`}>
                        {captured ? 'Replace' : 'Upload'}
                    </span>
                </div>
            </div>
        </div>
    );
};

interface MultimodalInputProps {
    onImagesReady: (
        images: { homeFront: string; homeLabel: string; compFront: string; compLabel: string },
        context: { homeContext: string; compContext: string }
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
    const homeProgress = [images.homeFront, images.homeLabel].filter(Boolean).length;
    const compProgress = [images.compFront, images.compLabel].filter(Boolean).length;

    return (
        <div className="w-full max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-yellow-500/20 to-cyan-500/20 border border-white/10 mb-6">
                    <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
                    <span className="text-sm font-bold bg-gradient-to-r from-yellow-400 to-cyan-400 bg-clip-text text-transparent">
                        AI-POWERED CLINICAL ANALYSIS
                    </span>
                    <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                </div>
                <h1 className="text-5xl font-black tracking-tight mb-4">
                    <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
                        TALE OF THE TAPE
                    </span>
                </h1>
                <p className="text-lg opacity-50 max-w-xl mx-auto">
                    Upload product images for head-to-head clinical comparison
                </p>
            </div>

            {/* Main Comparison Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr,auto,1fr] gap-6 lg:gap-0 items-stretch">

                {/* YOUR PRODUCT - Left Side */}
                <div className="relative">
                    {/* Glow Effect */}
                    <div className="absolute -inset-4 bg-gradient-to-r from-yellow-500/20 via-orange-500/10 to-transparent blur-3xl opacity-50 -z-10" />

                    <div className="bg-gradient-to-br from-yellow-500/5 to-transparent border border-yellow-500/20 rounded-3xl p-6 h-full">
                        {/* Header */}
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg shadow-yellow-500/30">
                                <Crown className="w-7 h-7 text-black" />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-2xl font-black text-yellow-400">YOUR PRODUCT</h2>
                                <p className="text-sm opacity-50">The champion you're promoting</p>
                            </div>
                            {/* Progress Ring */}
                            <div className="relative w-12 h-12">
                                <svg className="w-full h-full -rotate-90">
                                    <circle cx="24" cy="24" r="20" stroke="rgba(255,255,255,0.1)" strokeWidth="4" fill="none" />
                                    <circle
                                        cx="24" cy="24" r="20"
                                        stroke="url(#goldGradient)"
                                        strokeWidth="4"
                                        fill="none"
                                        strokeDasharray={`${homeProgress * 62.8} 125.6`}
                                        strokeLinecap="round"
                                        className="transition-all duration-500"
                                    />
                                    <defs>
                                        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#EAB308" />
                                            <stop offset="100%" stopColor="#F97316" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                                <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-yellow-400">
                                    {homeProgress}/2
                                </span>
                            </div>
                        </div>

                        {/* Image Upload Grid */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <ImageUploadCard
                                label="Front Label"
                                captured={!!images.homeFront}
                                onImageCaptured={(val) => setImages({ ...images, homeFront: val })}
                                variant="gold"
                            />
                            <ImageUploadCard
                                label="Nutrition Facts"
                                captured={!!images.homeLabel}
                                onImageCaptured={(val) => setImages({ ...images, homeLabel: val })}
                                variant="gold"
                            />
                        </div>

                        {/* Context Input */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-yellow-400/60 flex items-center gap-2">
                                <Zap className="w-3 h-3" />
                                Additional Context
                            </label>
                            <textarea
                                placeholder="e.g. Patented extraction, third-party testing, sourcing details..."
                                className="w-full h-24 bg-black/40 border border-yellow-500/20 rounded-xl p-4 text-sm placeholder:opacity-30 focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all resize-none"
                                value={context.homeContext}
                                onChange={(e) => setContext({ ...context, homeContext: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                {/* VS Divider */}
                <div className="flex lg:flex-col items-center justify-center py-6 lg:py-0 lg:px-8">
                    <div className="hidden lg:block w-px h-20 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-cyan-500 blur-xl opacity-30 animate-pulse" />
                        <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-[#1a1a2e] to-[#0f0f1a] border-2 border-white/20 flex items-center justify-center shadow-2xl">
                            <span className="text-3xl font-black bg-gradient-to-r from-yellow-400 to-cyan-400 bg-clip-text text-transparent">
                                VS
                            </span>
                        </div>
                    </div>
                    <div className="hidden lg:block w-px h-20 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
                </div>

                {/* COMPETITOR - Right Side */}
                <div className="relative">
                    {/* Glow Effect */}
                    <div className="absolute -inset-4 bg-gradient-to-l from-cyan-500/20 via-blue-500/10 to-transparent blur-3xl opacity-50 -z-10" />

                    <div className="bg-gradient-to-bl from-cyan-500/5 to-transparent border border-cyan-500/20 rounded-3xl p-6 h-full">
                        {/* Header */}
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                                <Target className="w-7 h-7 text-black" />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-2xl font-black text-cyan-400">COMPETITOR</h2>
                                <p className="text-sm opacity-50">The challenger to compare against</p>
                            </div>
                            {/* Progress Ring */}
                            <div className="relative w-12 h-12">
                                <svg className="w-full h-full -rotate-90">
                                    <circle cx="24" cy="24" r="20" stroke="rgba(255,255,255,0.1)" strokeWidth="4" fill="none" />
                                    <circle
                                        cx="24" cy="24" r="20"
                                        stroke="url(#cyanGradient)"
                                        strokeWidth="4"
                                        fill="none"
                                        strokeDasharray={`${compProgress * 62.8} 125.6`}
                                        strokeLinecap="round"
                                        className="transition-all duration-500"
                                    />
                                    <defs>
                                        <linearGradient id="cyanGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#06B6D4" />
                                            <stop offset="100%" stopColor="#3B82F6" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                                <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-cyan-400">
                                    {compProgress}/2
                                </span>
                            </div>
                        </div>

                        {/* Image Upload Grid */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <ImageUploadCard
                                label="Front Label"
                                captured={!!images.compFront}
                                onImageCaptured={(val) => setImages({ ...images, compFront: val })}
                                variant="silver"
                            />
                            <ImageUploadCard
                                label="Nutrition Facts"
                                captured={!!images.compLabel}
                                onImageCaptured={(val) => setImages({ ...images, compLabel: val })}
                                variant="silver"
                            />
                        </div>

                        {/* Context Input */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-cyan-400/60 flex items-center gap-2">
                                <Target className="w-3 h-3" />
                                Comparison Notes
                            </label>
                            <textarea
                                placeholder="e.g. Customer asked about this brand, known quality concerns..."
                                className="w-full h-24 bg-black/40 border border-cyan-500/20 rounded-xl p-4 text-sm placeholder:opacity-30 focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all resize-none"
                                value={context.compContext}
                                onChange={(e) => setContext({ ...context, compContext: e.target.value })}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col items-center gap-4 mt-12">
                <button
                    onClick={() => onImagesReady(images, context)}
                    disabled={!isComplete || isProcessing}
                    className={`
                        relative overflow-hidden px-12 py-5 rounded-2xl font-black text-lg
                        transition-all duration-300 
                        ${isComplete && !isProcessing
                            ? 'bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 text-black hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/30 cursor-pointer'
                            : 'bg-white/5 text-white/30 cursor-not-allowed'
                        }
                    `}
                >
                    {/* Animated Shine Effect */}
                    {isComplete && !isProcessing && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                    )}

                    <span className="relative flex items-center gap-3">
                        {isProcessing ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Analyzing Clinical Data...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-5 h-5" />
                                RUN EXPERT ANALYSIS
                            </>
                        )}
                    </span>
                </button>

                {!isComplete && (
                    <div className="flex items-center gap-6 text-sm opacity-40">
                        <span className={homeProgress === 2 ? 'text-yellow-400' : ''}>
                            Your Product: {homeProgress}/2
                        </span>
                        <span className="w-1 h-1 rounded-full bg-white/30" />
                        <span className={compProgress === 2 ? 'text-cyan-400' : ''}>
                            Competitor: {compProgress}/2
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};
