import React, { useRef, useState } from 'react';
import { Camera, Upload, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
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
    onImagesReady: (images: {
        homeFront: string;
        homeLabel: string;
        compFront: string;
        compLabel: string;
    }) => void;
    isProcessing: boolean;
}

export const MultimodalInput: React.FC<MultimodalInputProps> = ({ onImagesReady, isProcessing }) => {
    const [images, setImages] = useState({
        homeFront: '',
        homeLabel: '',
        compFront: '',
        compLabel: '',
    });

    const isComplete = !!(images.homeFront && images.homeLabel && images.compFront && images.compLabel);

    return (
        <div className="glass-card p-6 w-full max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Camera className="text-brand-gold" />
                Tale of the Tape: Visual Input
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                    <h3 className="text-brand-gold font-bold flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-brand-gold animate-pulse" />
                        Home Product (You)
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                        <ImageItem
                            label="Front branding"
                            description="Visual marketing shot"
                            captured={!!images.homeFront}
                            onImageCaptured={(val) => setImages({ ...images, homeFront: val })}
                        />
                        <ImageItem
                            label="Nutritional Label"
                            description="Clear shot of data"
                            captured={!!images.homeLabel}
                            onImageCaptured={(val) => setImages({ ...images, homeLabel: val })}
                        />
                    </div>
                </div>

                <div className="space-y-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                    <h3 className="text-white font-bold flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-white opacity-50" />
                        Competitor
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                        <ImageItem
                            label="Front branding"
                            description="Visual marketing shot"
                            captured={!!images.compFront}
                            onImageCaptured={(val) => setImages({ ...images, compFront: val })}
                        />
                        <ImageItem
                            label="Nutritional Label"
                            description="Clear shot of data"
                            captured={!!images.compLabel}
                            onImageCaptured={(val) => setImages({ ...images, compLabel: val })}
                        />
                    </div>
                </div>
            </div>

            <button
                onClick={() => onImagesReady(images)}
                disabled={!isComplete || isProcessing}
                className="w-full bg-white text-black font-black py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-200 transition-all disabled:opacity-30 disabled:cursor-not-allowed group relative overflow-hidden"
            >
                {isProcessing ? (
                    <>
                        <Loader2 className="animate-spin" />
                        Clinical Analysis in Progress...
                    </>
                ) : (
                    <>
                        RUN EXPERT ANALYSIS
                        <Upload className="group-hover:-translate-y-1 transition-transform" />
                    </>
                )}
            </button>
            {!isComplete && (
                <p className="text-center text-xs opacity-50 mt-4">
                    All 4 images are required to execute clinical comparison logic.
                </p>
            )}
        </div>
    );
};
