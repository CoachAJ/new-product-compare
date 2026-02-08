import React, { useRef, useState } from 'react';
import { Upload, Loader2, Sparkles, Package, Target, Image, FileText, ArrowRight } from 'lucide-react';
import { MimeGuard } from '../utils/MimeGuard';

interface ImageUploadProps {
    label: string;
    onImageCaptured: (dataUrl: string) => void;
    captured: boolean;
}

const ImageUploadBox: React.FC<ImageUploadProps> = ({ onImageCaptured, captured }) => {
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
        <div
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center gap-2 p-6 rounded-xl cursor-pointer transition-all hover:border-slate-300"
            style={{
                border: captured ? '2px solid #10b981' : '2px dashed #e2e8f0',
                background: captured ? 'rgba(16, 185, 129, 0.05)' : 'transparent',
                minHeight: '120px'
            }}
        >
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
            />

            {loading ? (
                <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
            ) : (
                <>
                    <div
                        className="w-12 h-12 rounded-full flex items-center justify-center"
                        style={{ background: captured ? '#10b981' : '#f1f5f9' }}
                    >
                        <Upload className={`w-5 h-5 ${captured ? 'text-white' : 'text-slate-400'}`} />
                    </div>
                    <span className="text-sm text-slate-500">
                        {captured ? 'Uploaded ✓' : 'Click or Paste'}
                    </span>
                </>
            )}
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
    const [homeName, setHomeName] = useState('');
    const [compName, setCompName] = useState('');

    const isComplete = !!(images.homeFront && images.homeLabel && images.compFront && images.compLabel);

    return (
        <div className="w-full max-w-5xl mx-auto px-4">
            {/* Side-by-Side Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Your Product Card */}
                <div
                    className="rounded-2xl overflow-hidden"
                    style={{
                        background: '#fff',
                        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
                        border: '1px solid #f1f5f9'
                    }}
                >
                    {/* Green Top Border */}
                    <div style={{ height: '4px', background: 'linear-gradient(90deg, #10b981, #34d399)' }} />

                    <div className="p-6">
                        {/* Header */}
                        <div className="flex items-center gap-3 mb-5">
                            <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center"
                                style={{ background: 'rgba(16, 185, 129, 0.1)' }}
                            >
                                <Package className="w-5 h-5" style={{ color: '#10b981' }} />
                            </div>
                            <h2 className="font-semibold text-lg text-slate-800">Your Product</h2>
                        </div>

                        {/* Product Name Input */}
                        <input
                            type="text"
                            placeholder="Product Name"
                            value={homeName}
                            onChange={(e) => setHomeName(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                            style={{
                                border: '1px solid #e2e8f0',
                                background: '#fff'
                            }}
                        />

                        {/* Upload Labels */}
                        <div className="grid grid-cols-2 gap-4 mt-5">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <Image className="w-4 h-4 text-slate-400" />
                                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Product Shot</span>
                                </div>
                                <ImageUploadBox
                                    label="Product Shot"
                                    captured={!!images.homeFront}
                                    onImageCaptured={(val) => setImages({ ...images, homeFront: val })}
                                />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <FileText className="w-4 h-4 text-slate-400" />
                                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Ingredients</span>
                                </div>
                                <ImageUploadBox
                                    label="Ingredients"
                                    captured={!!images.homeLabel}
                                    onImageCaptured={(val) => setImages({ ...images, homeLabel: val })}
                                />
                            </div>
                        </div>

                        {/* Key Benefits Textarea */}
                        <textarea
                            placeholder="Key Benefits..."
                            value={context.homeContext}
                            onChange={(e) => setContext({ ...context, homeContext: e.target.value })}
                            className="w-full mt-5 px-4 py-3 rounded-xl text-sm outline-none resize-none h-24"
                            style={{
                                border: '1px solid #e2e8f0',
                                background: '#fff'
                            }}
                        />
                    </div>
                </div>

                {/* Competitor Card */}
                <div
                    className="rounded-2xl overflow-hidden"
                    style={{
                        background: '#fff',
                        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
                        border: '1px solid #f1f5f9'
                    }}
                >
                    {/* Pink/Red Top Border */}
                    <div style={{ height: '4px', background: 'linear-gradient(90deg, #f43f5e, #fb7185)' }} />

                    <div className="p-6">
                        {/* Header */}
                        <div className="flex items-center gap-3 mb-5">
                            <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center"
                                style={{ background: 'rgba(244, 63, 94, 0.1)' }}
                            >
                                <Target className="w-5 h-5" style={{ color: '#f43f5e' }} />
                            </div>
                            <h2 className="font-semibold text-lg text-slate-800">Competitor</h2>
                        </div>

                        {/* Product Name and Price Inputs */}
                        <div className="grid grid-cols-3 gap-3">
                            <input
                                type="text"
                                placeholder="Competitor Name"
                                value={compName}
                                onChange={(e) => setCompName(e.target.value)}
                                className="col-span-2 px-4 py-3 rounded-xl text-sm outline-none"
                                style={{
                                    border: '1px solid #e2e8f0',
                                    background: '#fff'
                                }}
                            />
                            <input
                                type="text"
                                placeholder="Price"
                                className="px-4 py-3 rounded-xl text-sm outline-none"
                                style={{
                                    border: '1px solid #e2e8f0',
                                    background: '#fff'
                                }}
                            />
                        </div>

                        {/* Upload Labels */}
                        <div className="grid grid-cols-2 gap-4 mt-5">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <Image className="w-4 h-4 text-slate-400" />
                                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Product Shot</span>
                                </div>
                                <ImageUploadBox
                                    label="Product Shot"
                                    captured={!!images.compFront}
                                    onImageCaptured={(val) => setImages({ ...images, compFront: val })}
                                />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <FileText className="w-4 h-4 text-slate-400" />
                                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Ingredients</span>
                                </div>
                                <ImageUploadBox
                                    label="Ingredients"
                                    captured={!!images.compLabel}
                                    onImageCaptured={(val) => setImages({ ...images, compLabel: val })}
                                />
                            </div>
                        </div>

                        {/* Weaknesses Textarea */}
                        <textarea
                            placeholder="Weaknesses..."
                            value={context.compContext}
                            onChange={(e) => setContext({ ...context, compContext: e.target.value })}
                            className="w-full mt-5 px-4 py-3 rounded-xl text-sm outline-none resize-none h-24"
                            style={{
                                border: '1px solid #e2e8f0',
                                background: '#fff'
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Compare Button */}
            <div className="flex justify-center mt-10">
                <button
                    onClick={() => onImagesReady(images, context)}
                    disabled={!isComplete || isProcessing}
                    className="flex items-center gap-3 px-8 py-4 rounded-full font-semibold text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
                    style={{
                        background: isComplete && !isProcessing ? '#0f172a' : '#cbd5e1',
                        color: '#fff',
                    }}
                >
                    {isProcessing ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Analyzing...
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-5 h-5" />
                            Compare & Analyze
                            <ArrowRight className="w-5 h-5" />
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};
