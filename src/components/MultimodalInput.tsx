import React, { useRef, useState } from 'react';
import { Camera, Upload, CheckCircle2, Loader2 } from 'lucide-react';
import { MimeGuard } from '../utils/MimeGuard';

interface ImageInputProps {
    label: string;
    description: string;
    onImageCaptured: (dataUrl: string) => void;
    captured: boolean;
}

const ImageItem: React.FC<ImageInputProps> = ({ label, description, onImageCaptured, captured }) => {
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

    return (
        <div className={`p-4 rounded-xl border-2 transition-all ${captured ? 'border-brand-gold bg-brand-gold/5' : 'border-white/10 bg-white/5 hover:border-white/20'}`}>
            <div className="flex items-start justify-between mb-2">
                <div>
                    <h4 className="font-bold text-sm uppercase tracking-wider">{label}</h4>
                    <p className="text-xs opacity-60">{description}</p>
                </div>
                {captured ? (
                    <CheckCircle2 className="text-brand-gold w-5 h-5" />
                ) : (
                    <Camera className="opacity-30 w-5 h-5" />
                )}
            </div>

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/jpeg,image/png"
                className="hidden"
            />

            <button
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
                className={`w-full py-3 rounded-lg border border-dashed flex items-center justify-center gap-2 mt-4 transition-all ${captured ? 'border-brand-gold text-brand-gold' : 'border-white/20 hover:border-white/40 opacity-70'
                    }`}
            >
                {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    <>
                        <Upload className="w-4 h-4" />
                        {captured ? 'Replace Image' : 'Upload Image'}
                    </>
                )}
            </button>
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

    return (
        <div className="glass-card p-8 w-full max-w-5xl mx-auto shadow-2xl">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-black mb-2 flex items-center justify-center gap-3 gold-text-glow">
                    <Camera className="text-brand-gold w-8 h-8" />
                    TALE OF THE TAPE
                </h2>
                <p className="text-sm opacity-50 tracking-widest uppercase">Clinical Product Comparison Input</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
                {/* Home Product Section */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-brand-gold font-bold text-xl flex items-center gap-3">
                            <span className="w-3 h-3 rounded-full bg-brand-gold shadow-[0_0_10px_rgba(255,215,0,0.5)]" />
                            Home Product
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <ImageItem
                            label="Front branding"
                            description="Marketing visual"
                            captured={!!images.homeFront}
                            onImageCaptured={(val) => setImages({ ...images, homeFront: val })}
                        />
                        <ImageItem
                            label="Label Data"
                            description="Nutritional facts"
                            captured={!!images.homeLabel}
                            onImageCaptured={(val) => setImages({ ...images, homeLabel: val })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-tighter opacity-40">Additional Clinical Context (Optional)</label>
                        <textarea
                            placeholder="e.g. Unique extraction process, specific sourcing, or testing results..."
                            className="w-full h-24 bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:ring-1 focus:ring-brand-gold outline-none transition-all custom-scrollbar bg-black/20"
                            value={context.homeContext}
                            onChange={(e) => setContext({ ...context, homeContext: e.target.value })}
                        />
                    </div>
                </div>

                {/* Competitor Product Section */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-white font-bold text-xl flex items-center gap-3">
                            <span className="w-3 h-3 rounded-full bg-white/20" />
                            Competitor
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <ImageItem
                            label="Front branding"
                            description="Marketing visual"
                            captured={!!images.compFront}
                            onImageCaptured={(val) => setImages({ ...images, compFront: val })}
                        />
                        <ImageItem
                            label="Label Data"
                            description="Nutritional facts"
                            captured={!!images.compLabel}
                            onImageCaptured={(val) => setImages({ ...images, compLabel: val })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-tighter opacity-40">Reason for Comparison (Optional)</label>
                        <textarea
                            placeholder="e.g. Known issues with this competitor, specific customer concern..."
                            className="w-full h-24 bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:ring-1 focus:ring-white/30 outline-none transition-all custom-scrollbar bg-black/20"
                            value={context.compContext}
                            onChange={(e) => setContext({ ...context, compContext: e.target.value })}
                        />
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-center gap-4">
                <button
                    onClick={() => onImagesReady(images, context)}
                    disabled={!isComplete || isProcessing}
                    className="w-full max-w-md bg-white text-black font-black py-5 rounded-2xl flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-20 disabled:grayscale shadow-xl shadow-white/5 group relative overflow-hidden"
                >
                    {isProcessing ? (
                        <>
                            <Loader2 className="animate-spin w-5 h-5" />
                            ANALYZING CLINICAL DATA...
                        </>
                    ) : (
                        <>
                            EXECUTE CLINICAL COMPARISON
                            <Upload className="group-hover:-translate-y-1 transition-transform w-5 h-5" />
                        </>
                    )}
                </button>
                {!isComplete && (
                    <p className="text-[10px] opacity-30 uppercase tracking-widest animate-pulse">
                        * All 4 images are required for comparison logic
                    </p>
                )}
            </div>
        </div>
    );
};
