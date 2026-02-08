import React, { useRef, useState } from 'react';
import { Camera, Upload, CheckCircle2, Loader2, Sparkles, Star, Users } from 'lucide-react';
import { MimeGuard } from '../utils/MimeGuard';

interface ImageInputProps {
    label: string;
    onImageCaptured: (dataUrl: string) => void;
    captured: boolean;
    variant: 'gold' | 'slate';
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
    const accentColor = isGold ? '#b45309' : '#475569';
    const bgColor = isGold ? 'rgba(254, 243, 199, 0.5)' : 'rgba(241, 245, 249, 0.5)';
    const borderColor = captured
        ? (isGold ? '#f59e0b' : '#94a3b8')
        : (isGold ? 'rgba(245, 158, 11, 0.3)' : 'rgba(148, 163, 184, 0.3)');

    return (
        <div
            onClick={() => fileInputRef.current?.click()}
            className="rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md group overflow-hidden"
            style={{
                border: `2px ${captured ? 'solid' : 'dashed'} ${borderColor}`,
                background: captured ? bgColor : 'rgba(255, 255, 255, 0.6)',
            }}
        >
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
            />

            {/* Compact Preview/Placeholder */}
            <div className="aspect-[3/2] relative p-3">
                {preview ? (
                    <img src={preview} alt={label} className="w-full h-full object-cover rounded-lg" />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                        <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                            style={{ backgroundColor: `${accentColor}15` }}
                        >
                            <Camera className="w-5 h-5" style={{ color: accentColor }} />
                        </div>
                        <span className="text-xs font-semibold" style={{ color: accentColor }}>{label}</span>
                    </div>
                )}

                {loading && (
                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-lg">
                        <Loader2 className="w-6 h-6 animate-spin" style={{ color: accentColor }} />
                    </div>
                )}

                {captured && !loading && (
                    <div
                        className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center shadow-sm"
                        style={{ backgroundColor: isGold ? '#22c55e' : '#22c55e' }}
                    >
                        <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                )}
            </div>

            {/* Compact Footer */}
            <div
                className="px-3 py-2 border-t flex items-center justify-center gap-1.5"
                style={{
                    borderColor: `${accentColor}20`,
                    backgroundColor: `${accentColor}05`
                }}
            >
                <Upload className="w-3 h-3" style={{ color: accentColor }} />
                <span className="text-xs font-medium" style={{ color: accentColor }}>
                    {captured ? 'Replace' : 'Upload'}
                </span>
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
        <div className="w-full max-w-5xl mx-auto px-4">
            {/* Header */}
            <div className="text-center mb-8">
                <div
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4"
                    style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)' }}
                >
                    <Sparkles className="w-4 h-4" style={{ color: '#f59e0b' }} />
                    <span className="text-sm font-semibold" style={{ color: '#b45309' }}>
                        AI Clinical Analysis
                    </span>
                </div>
                <h1 className="heading-xl mb-2">Product Comparison</h1>
                <p className="text-sm text-slate-500 max-w-md mx-auto">
                    Upload images of both products for head-to-head analysis
                </p>
            </div>

            {/* Side-by-Side Comparison */}
            <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-stretch">

                {/* Your Product */}
                <div className="flex-1">
                    <div
                        className="rounded-2xl p-5 h-full"
                        style={{
                            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 251, 235, 0.8) 100%)',
                            border: '1px solid rgba(245, 158, 11, 0.2)',
                            boxShadow: '0 4px 20px rgba(245, 158, 11, 0.08)'
                        }}
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center"
                                style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}
                            >
                                <Star className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                                <h2 className="font-bold text-base" style={{ color: '#b45309' }}>Your Product</h2>
                                <p className="text-xs text-slate-500">The product you're promoting</p>
                            </div>
                            <span
                                className="text-xs font-semibold px-2 py-1 rounded-full"
                                style={{
                                    background: homeProgress === 2 ? 'rgba(34, 197, 94, 0.1)' : 'rgba(0,0,0,0.05)',
                                    color: homeProgress === 2 ? '#16a34a' : '#64748b'
                                }}
                            >
                                {homeProgress}/2
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-4">
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

                        <textarea
                            placeholder="Additional context (optional)..."
                            className="w-full h-16 rounded-lg p-3 text-sm placeholder:text-slate-400 outline-none resize-none"
                            style={{
                                background: 'rgba(255, 255, 255, 0.7)',
                                border: '1px solid rgba(245, 158, 11, 0.15)'
                            }}
                            value={context.homeContext}
                            onChange={(e) => setContext({ ...context, homeContext: e.target.value })}
                        />
                    </div>
                </div>

                {/* VS Badge */}
                <div className="flex lg:flex-col items-center justify-center py-2 lg:py-0 lg:px-2">
                    <div
                        className="w-12 h-12 rounded-full flex items-center justify-center font-black text-lg"
                        style={{
                            background: 'linear-gradient(135deg, #f8fafc, #e2e8f0)',
                            border: '2px solid #e2e8f0',
                            color: '#64748b',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                        }}
                    >
                        VS
                    </div>
                </div>

                {/* Competitor */}
                <div className="flex-1">
                    <div
                        className="rounded-2xl p-5 h-full"
                        style={{
                            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)',
                            border: '1px solid rgba(148, 163, 184, 0.2)',
                            boxShadow: '0 4px 20px rgba(100, 116, 139, 0.06)'
                        }}
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center"
                                style={{ background: 'linear-gradient(135deg, #64748b, #475569)' }}
                            >
                                <Users className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                                <h2 className="font-bold text-base" style={{ color: '#475569' }}>Competitor</h2>
                                <p className="text-xs text-slate-500">The product to compare against</p>
                            </div>
                            <span
                                className="text-xs font-semibold px-2 py-1 rounded-full"
                                style={{
                                    background: compProgress === 2 ? 'rgba(34, 197, 94, 0.1)' : 'rgba(0,0,0,0.05)',
                                    color: compProgress === 2 ? '#16a34a' : '#64748b'
                                }}
                            >
                                {compProgress}/2
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-4">
                            <ImageUploadCard
                                label="Front Label"
                                captured={!!images.compFront}
                                onImageCaptured={(val) => setImages({ ...images, compFront: val })}
                                variant="slate"
                            />
                            <ImageUploadCard
                                label="Nutrition Facts"
                                captured={!!images.compLabel}
                                onImageCaptured={(val) => setImages({ ...images, compLabel: val })}
                                variant="slate"
                            />
                        </div>

                        <textarea
                            placeholder="Comparison notes (optional)..."
                            className="w-full h-16 rounded-lg p-3 text-sm placeholder:text-slate-400 outline-none resize-none"
                            style={{
                                background: 'rgba(255, 255, 255, 0.7)',
                                border: '1px solid rgba(148, 163, 184, 0.15)'
                            }}
                            value={context.compContext}
                            onChange={(e) => setContext({ ...context, compContext: e.target.value })}
                        />
                    </div>
                </div>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col items-center gap-3 mt-8">
                <button
                    onClick={() => onImagesReady(images, context)}
                    disabled={!isComplete || isProcessing}
                    className="px-8 py-3.5 rounded-xl font-bold text-base transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{
                        background: isComplete && !isProcessing
                            ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                            : '#e2e8f0',
                        color: isComplete && !isProcessing ? '#fff' : '#94a3b8',
                        boxShadow: isComplete && !isProcessing ? '0 4px 16px rgba(245, 158, 11, 0.3)' : 'none',
                    }}
                >
                    <span className="flex items-center gap-2">
                        {isProcessing ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Analyzing...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-4 h-4" />
                                Run Analysis
                            </>
                        )}
                    </span>
                </button>

                {!isComplete && (
                    <p className="text-xs text-slate-400">
                        Upload all 4 images to continue
                    </p>
                )}
            </div>
        </div>
    );
};
