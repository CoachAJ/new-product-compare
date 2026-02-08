import React, { useRef, useState } from 'react';
import { Camera, Upload, CheckCircle2, Loader2, Sparkles, Crown, Target, Zap } from 'lucide-react';
import { MimeGuard } from '../utils/MimeGuard';

interface ImageInputProps {
    label: string;
    onImageCaptured: (dataUrl: string) => void;
    captured: boolean;
    variant: 'gold' | 'cyan';
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

    // Use inline styles for reliable color rendering
    const styles = {
        border: captured
            ? `2px solid ${isGold ? '#FFD700' : '#22D3EE'}`
            : `2px dashed ${isGold ? 'rgba(255, 215, 0, 0.3)' : 'rgba(34, 211, 238, 0.3)'}`,
        background: captured
            ? `linear-gradient(135deg, ${isGold ? 'rgba(255, 215, 0, 0.15)' : 'rgba(34, 211, 238, 0.15)'} 0%, transparent 100%)`
            : `linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, transparent 100%)`,
        boxShadow: captured
            ? `0 0 30px ${isGold ? 'rgba(255, 215, 0, 0.2)' : 'rgba(34, 211, 238, 0.2)'}`
            : 'none',
    };

    const accentColor = isGold ? '#FFD700' : '#22D3EE';

    return (
        <div
            onClick={() => fileInputRef.current?.click()}
            style={styles}
            className="relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 hover:scale-[1.02] group"
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
                        <div
                            className="w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform"
                            style={{ backgroundColor: `${accentColor}15` }}
                        >
                            <Camera className="w-8 h-8 opacity-50 group-hover:opacity-100 transition-opacity" style={{ color: accentColor }} />
                        </div>
                        <div className="text-center">
                            <p className="font-bold text-sm" style={{ color: accentColor }}>{label}</p>
                            <p className="text-xs opacity-40 mt-1">Click to upload</p>
                        </div>
                    </div>
                )}

                {/* Loading Overlay */}
                {loading && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 animate-spin" style={{ color: accentColor }} />
                    </div>
                )}

                {/* Captured Badge */}
                {captured && !loading && (
                    <div
                        className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center shadow-lg"
                        style={{ backgroundColor: accentColor }}
                    >
                        <CheckCircle2 className="w-5 h-5 text-black" />
                    </div>
                )}
            </div>

            {/* Bottom Action Bar */}
            <div
                className="px-4 py-3 border-t"
                style={{
                    borderColor: `${accentColor}30`,
                    backgroundColor: `${accentColor}08`
                }}
            >
                <div className="flex items-center justify-center gap-2">
                    <Upload className="w-4 h-4" style={{ color: accentColor }} />
                    <span className="text-xs font-bold uppercase tracking-wider" style={{ color: accentColor }}>
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
        <div className="w-full max-w-7xl mx-auto px-4">
            {/* Header */}
            <div className="text-center mb-12">
                <div
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border mb-6"
                    style={{
                        background: 'linear-gradient(90deg, rgba(255, 215, 0, 0.1) 0%, rgba(34, 211, 238, 0.1) 100%)',
                        borderColor: 'rgba(255, 255, 255, 0.1)'
                    }}
                >
                    <Sparkles className="w-4 h-4 animate-pulse" style={{ color: '#FFD700' }} />
                    <span
                        className="text-sm font-bold"
                        style={{
                            background: 'linear-gradient(90deg, #FFD700, #22D3EE)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}
                    >
                        AI-POWERED CLINICAL ANALYSIS
                    </span>
                    <Sparkles className="w-4 h-4 animate-pulse" style={{ color: '#22D3EE' }} />
                </div>
                <h1
                    className="text-4xl md:text-5xl font-black tracking-tight mb-4"
                    style={{
                        background: 'linear-gradient(90deg, #FFD700, #FFA500, #FFD700)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}
                >
                    TALE OF THE TAPE
                </h1>
                <p className="text-lg opacity-50 max-w-xl mx-auto">
                    Upload product images for head-to-head clinical comparison
                </p>
            </div>

            {/* Main Comparison Grid - Side by Side */}
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-stretch">

                {/* YOUR PRODUCT - Left Side */}
                <div className="flex-1 relative">
                    {/* Glow Effect */}
                    <div
                        className="absolute -inset-4 blur-3xl opacity-30 -z-10"
                        style={{ background: 'radial-gradient(ellipse at center, rgba(255, 215, 0, 0.3) 0%, transparent 70%)' }}
                    />

                    <div
                        className="rounded-3xl p-6 h-full"
                        style={{
                            background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.08) 0%, transparent 100%)',
                            border: '1px solid rgba(255, 215, 0, 0.2)'
                        }}
                    >
                        {/* Header */}
                        <div className="flex items-center gap-4 mb-6">
                            <div
                                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                                style={{
                                    background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                                    boxShadow: '0 8px 32px rgba(255, 215, 0, 0.3)'
                                }}
                            >
                                <Crown className="w-7 h-7 text-black" />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-2xl font-black" style={{ color: '#FFD700' }}>YOUR PRODUCT</h2>
                                <p className="text-sm opacity-50">The champion you're promoting</p>
                            </div>
                            {/* Progress Indicator */}
                            <div
                                className="px-3 py-1.5 rounded-full text-xs font-bold"
                                style={{
                                    background: homeProgress === 2 ? 'rgba(255, 215, 0, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                                    color: homeProgress === 2 ? '#FFD700' : 'rgba(255, 255, 255, 0.5)',
                                    border: `1px solid ${homeProgress === 2 ? 'rgba(255, 215, 0, 0.3)' : 'rgba(255, 255, 255, 0.1)'}`
                                }}
                            >
                                {homeProgress}/2 READY
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
                            <label className="text-xs font-bold uppercase tracking-wider flex items-center gap-2" style={{ color: 'rgba(255, 215, 0, 0.6)' }}>
                                <Zap className="w-3 h-3" />
                                Additional Context
                            </label>
                            <textarea
                                placeholder="e.g. Patented extraction, third-party testing, sourcing details..."
                                className="w-full h-24 rounded-xl p-4 text-sm placeholder:opacity-30 outline-none transition-all resize-none"
                                style={{
                                    background: 'rgba(0, 0, 0, 0.4)',
                                    border: '1px solid rgba(255, 215, 0, 0.2)'
                                }}
                                value={context.homeContext}
                                onChange={(e) => setContext({ ...context, homeContext: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                {/* VS Divider */}
                <div className="flex lg:flex-col items-center justify-center py-4 lg:py-0 lg:px-4">
                    <div className="hidden lg:block w-px h-16 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
                    <div className="relative">
                        <div
                            className="absolute inset-0 blur-xl opacity-50 animate-pulse"
                            style={{ background: 'linear-gradient(90deg, #FFD700, #22D3EE)' }}
                        />
                        <div
                            className="relative w-16 h-16 lg:w-20 lg:h-20 rounded-full flex items-center justify-center"
                            style={{
                                background: 'linear-gradient(135deg, #1a1a2e, #0f0f1a)',
                                border: '2px solid rgba(255, 255, 255, 0.2)',
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)'
                            }}
                        >
                            <span
                                className="text-2xl lg:text-3xl font-black"
                                style={{
                                    background: 'linear-gradient(90deg, #FFD700, #22D3EE)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent'
                                }}
                            >
                                VS
                            </span>
                        </div>
                    </div>
                    <div className="hidden lg:block w-px h-16 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
                </div>

                {/* COMPETITOR - Right Side */}
                <div className="flex-1 relative">
                    {/* Glow Effect */}
                    <div
                        className="absolute -inset-4 blur-3xl opacity-30 -z-10"
                        style={{ background: 'radial-gradient(ellipse at center, rgba(34, 211, 238, 0.3) 0%, transparent 70%)' }}
                    />

                    <div
                        className="rounded-3xl p-6 h-full"
                        style={{
                            background: 'linear-gradient(135deg, rgba(34, 211, 238, 0.08) 0%, transparent 100%)',
                            border: '1px solid rgba(34, 211, 238, 0.2)'
                        }}
                    >
                        {/* Header */}
                        <div className="flex items-center gap-4 mb-6">
                            <div
                                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                                style={{
                                    background: 'linear-gradient(135deg, #22D3EE, #3B82F6)',
                                    boxShadow: '0 8px 32px rgba(34, 211, 238, 0.3)'
                                }}
                            >
                                <Target className="w-7 h-7 text-black" />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-2xl font-black" style={{ color: '#22D3EE' }}>COMPETITOR</h2>
                                <p className="text-sm opacity-50">The challenger to compare</p>
                            </div>
                            {/* Progress Indicator */}
                            <div
                                className="px-3 py-1.5 rounded-full text-xs font-bold"
                                style={{
                                    background: compProgress === 2 ? 'rgba(34, 211, 238, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                                    color: compProgress === 2 ? '#22D3EE' : 'rgba(255, 255, 255, 0.5)',
                                    border: `1px solid ${compProgress === 2 ? 'rgba(34, 211, 238, 0.3)' : 'rgba(255, 255, 255, 0.1)'}`
                                }}
                            >
                                {compProgress}/2 READY
                            </div>
                        </div>

                        {/* Image Upload Grid */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <ImageUploadCard
                                label="Front Label"
                                captured={!!images.compFront}
                                onImageCaptured={(val) => setImages({ ...images, compFront: val })}
                                variant="cyan"
                            />
                            <ImageUploadCard
                                label="Nutrition Facts"
                                captured={!!images.compLabel}
                                onImageCaptured={(val) => setImages({ ...images, compLabel: val })}
                                variant="cyan"
                            />
                        </div>

                        {/* Context Input */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider flex items-center gap-2" style={{ color: 'rgba(34, 211, 238, 0.6)' }}>
                                <Target className="w-3 h-3" />
                                Comparison Notes
                            </label>
                            <textarea
                                placeholder="e.g. Customer asked about this brand, known quality concerns..."
                                className="w-full h-24 rounded-xl p-4 text-sm placeholder:opacity-30 outline-none transition-all resize-none"
                                style={{
                                    background: 'rgba(0, 0, 0, 0.4)',
                                    border: '1px solid rgba(34, 211, 238, 0.2)'
                                }}
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
                    className="relative overflow-hidden px-12 py-5 rounded-2xl font-black text-lg transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
                    style={{
                        background: isComplete && !isProcessing
                            ? 'linear-gradient(135deg, #FFD700, #FFA500, #FFD700)'
                            : 'rgba(255, 255, 255, 0.05)',
                        color: isComplete && !isProcessing ? '#000' : 'rgba(255, 255, 255, 0.3)',
                        boxShadow: isComplete && !isProcessing ? '0 8px 32px rgba(255, 215, 0, 0.3)' : 'none',
                        transform: isComplete && !isProcessing ? 'scale(1)' : 'scale(1)',
                    }}
                    onMouseEnter={(e) => {
                        if (isComplete && !isProcessing) {
                            e.currentTarget.style.transform = 'scale(1.05)';
                        }
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                    }}
                >
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
                    <div className="flex items-center gap-6 text-sm opacity-50">
                        <span style={{ color: homeProgress === 2 ? '#FFD700' : undefined }}>
                            Your Product: {homeProgress}/2
                        </span>
                        <span className="w-1 h-1 rounded-full bg-white/30" />
                        <span style={{ color: compProgress === 2 ? '#22D3EE' : undefined }}>
                            Competitor: {compProgress}/2
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};
