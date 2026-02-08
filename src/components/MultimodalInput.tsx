import React, { useState, useRef } from 'react';
import { Upload, X, Package, ArrowRight, FileText, Image as ImageIcon, Sparkles, Clipboard, Loader2 } from 'lucide-react';

interface MultimodalInputProps {
    onImagesReady: (
        images: { homeFront: string; homeLabel: string; compFront: string; compLabel: string },
        context: { homeContext: string; compContext: string },
        names: { homeName: string; compName: string; compPrice: string }
    ) => void;
    isProcessing: boolean;
}

/**
 * Aggressive resize to prevent "Failed to fetch" errors.
 * Max width 800px, 0.7 quality.
 */
const resizeImage = (base64Str: string, maxWidth = 800): Promise<string> => {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = base64Str;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;

            if (width > maxWidth) {
                height = Math.round((height * maxWidth) / width);
                width = maxWidth;
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.fillStyle = "#FFFFFF";
                ctx.fillRect(0, 0, width, height);
                ctx.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL('image/jpeg', 0.7));
            } else {
                resolve(base64Str);
            }
        };
        img.onerror = () => resolve(base64Str);
    });
};

interface ImageUploadBoxProps {
    label: string;
    subLabel?: string;
    image: string | null;
    onImageChange: (img: string | null) => void;
    icon: React.ReactNode;
    colorClass: 'teal' | 'rose';
}

const ImageUploadBox: React.FC<ImageUploadBoxProps> = ({
    label,
    subLabel,
    image,
    onImageChange,
    icon,
    colorClass
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isFocused, setIsFocused] = useState(false);

    const processAndSetImage = async (data: string) => {
        if (!data.startsWith('data:image/')) {
            console.warn("Skipping non-image data");
            return;
        }
        const resized = await resizeImage(data);
        onImageChange(resized);
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        const items = e.clipboardData.items;
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf("image") !== -1) {
                const blob = items[i].getAsFile();
                if (blob) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        processAndSetImage(event.target?.result as string);
                    };
                    reader.readAsDataURL(blob);
                    e.preventDefault();
                    break;
                }
            }
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                alert("Please select a valid image file.");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                processAndSetImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const bgColor = colorClass === 'teal' ? 'bg-teal-50' : 'bg-rose-50';
    const ringColor = colorClass === 'teal' ? 'ring-teal-100' : 'ring-rose-100';
    const borderColor = colorClass === 'teal' ? 'border-teal-500' : 'border-rose-500';
    const iconBg = colorClass === 'teal' ? 'bg-teal-100 text-teal-600' : 'bg-rose-100 text-rose-600';

    return (
        <div className="flex-1 min-w-[140px]">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-1">
                {icon} {label}
            </label>
            <div
                tabIndex={0}
                onPaste={handlePaste}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onClick={() => fileInputRef.current?.click()}
                className={`
                    cursor-pointer h-40 border-2 border-dashed rounded-xl flex flex-col items-center justify-center 
                    transition-all relative overflow-hidden outline-none group
                    ${isFocused ? `${borderColor} ring-4 ${ringColor} ${bgColor}` : 'border-slate-300 bg-white hover:bg-slate-50'}
                `}
            >
                {image ? (
                    <>
                        <img src={image} alt="Uploaded" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                                onClick={(e) => { e.stopPropagation(); onImageChange(null); }}
                                className="bg-white/90 p-2 rounded-full text-slate-900 hover:bg-white transition-colors shadow-lg"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="text-center p-4">
                        <div className={`mx-auto w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-colors ${isFocused ? iconBg : 'bg-slate-100 text-slate-400'}`}>
                            {isFocused ? <Clipboard className="w-5 h-5" /> : <Upload className="w-5 h-5" />}
                        </div>
                        <p className="text-xs font-medium text-slate-600">
                            {isFocused ? 'Paste Image' : 'Click or Paste'}
                        </p>
                        {subLabel && <p className="text-[10px] text-slate-400 mt-1">{subLabel}</p>}
                    </div>
                )}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                />
            </div>
        </div>
    );
};

export const MultimodalInput: React.FC<MultimodalInputProps> = ({ onImagesReady, isProcessing }) => {
    const [homeName, setHomeName] = useState('');
    const [homeProductImage, setHomeProductImage] = useState<string | null>(null);
    const [homeIngredientsImage, setHomeIngredientsImage] = useState<string | null>(null);
    const [homeNotes, setHomeNotes] = useState('');

    const [compName, setCompName] = useState('');
    const [compProductImage, setCompProductImage] = useState<string | null>(null);
    const [compIngredientsImage, setCompIngredientsImage] = useState<string | null>(null);
    const [compPrice, setCompPrice] = useState('');
    const [compNotes, setCompNotes] = useState('');

    const handleStart = () => {
        if (!homeName || !compName) {
            alert("Please enter product names.");
            return;
        }
        if (!homeIngredientsImage || !compIngredientsImage) {
            alert("Please upload at least the ingredients label for each product.");
            return;
        }
        onImagesReady(
            {
                homeFront: homeProductImage || '',
                homeLabel: homeIngredientsImage,
                compFront: compProductImage || '',
                compLabel: compIngredientsImage
            },
            {
                homeContext: homeNotes,
                compContext: compNotes
            },
            {
                homeName,
                compName,
                compPrice
            }
        );
    };

    return (
        <div className="space-y-8">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-slate-900">Health Product Analysis</h2>
                <p className="text-slate-500">Paste images of your product labels for an expert breakdown.</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Your Product Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-teal-500" />
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center text-teal-600">
                            <Package className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-lg text-slate-800">Your Product</h3>
                    </div>
                    <div className="space-y-5">
                        <input
                            type="text"
                            value={homeName}
                            onChange={(e) => setHomeName(e.target.value)}
                            placeholder="Product Name"
                            className="w-full px-4 py-2 rounded-lg border border-slate-300 outline-none focus:ring-2 focus:ring-teal-500"
                        />
                        <div className="flex gap-4">
                            <ImageUploadBox
                                label="Product Shot"
                                image={homeProductImage}
                                onImageChange={setHomeProductImage}
                                icon={<ImageIcon className="w-3 h-3" />}
                                colorClass="teal"
                            />
                            <ImageUploadBox
                                label="Ingredients"
                                image={homeIngredientsImage}
                                onImageChange={setHomeIngredientsImage}
                                icon={<FileText className="w-3 h-3" />}
                                colorClass="teal"
                            />
                        </div>
                        <textarea
                            value={homeNotes}
                            onChange={(e) => setHomeNotes(e.target.value)}
                            placeholder="Key Benefits..."
                            className="w-full px-4 py-2 rounded-lg border border-slate-300 h-24 text-sm resize-none"
                        />
                    </div>
                </div>

                {/* Competitor Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-rose-500" />
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-8 h-8 bg-rose-100 rounded-lg flex items-center justify-center text-rose-600">
                            <Package className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-lg text-slate-800">Competitor</h3>
                    </div>
                    <div className="space-y-5">
                        <div className="grid grid-cols-3 gap-4">
                            <input
                                type="text"
                                value={compName}
                                onChange={(e) => setCompName(e.target.value)}
                                placeholder="Competitor Name"
                                className="col-span-2 w-full px-4 py-2 rounded-lg border border-slate-300 outline-none focus:ring-2 focus:ring-rose-500"
                            />
                            <input
                                type="text"
                                value={compPrice}
                                onChange={(e) => setCompPrice(e.target.value)}
                                placeholder="Price"
                                className="w-full px-4 py-2 rounded-lg border border-slate-300 outline-none focus:ring-2 focus:ring-rose-500"
                            />
                        </div>
                        <div className="flex gap-4">
                            <ImageUploadBox
                                label="Product Shot"
                                image={compProductImage}
                                onImageChange={setCompProductImage}
                                icon={<ImageIcon className="w-3 h-3" />}
                                colorClass="rose"
                            />
                            <ImageUploadBox
                                label="Ingredients"
                                image={compIngredientsImage}
                                onImageChange={setCompIngredientsImage}
                                icon={<FileText className="w-3 h-3" />}
                                colorClass="rose"
                            />
                        </div>
                        <textarea
                            value={compNotes}
                            onChange={(e) => setCompNotes(e.target.value)}
                            placeholder="Weaknesses..."
                            className="w-full px-4 py-2 rounded-lg border border-slate-300 h-24 text-sm resize-none"
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-center pt-4 pb-12">
                <button
                    onClick={handleStart}
                    disabled={isProcessing}
                    className="bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-lg font-bold py-4 px-12 rounded-full shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center gap-3"
                >
                    {isProcessing ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                        <Sparkles className="w-6 h-6 text-teal-400" />
                    )}
                    {isProcessing ? 'Analyzing...' : 'Compare & Analyze'}
                    {!isProcessing && <ArrowRight className="w-5 h-5" />}
                </button>
            </div>
        </div>
    );
};
