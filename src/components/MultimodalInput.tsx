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
    image: string | null;
    onImageChange: (img: string | null) => void;
    accentColor: string;
}

const ImageUploadBox: React.FC<ImageUploadBoxProps> = ({
    label,
    image,
    onImageChange,
    accentColor
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

    return (
        <div style={{ flex: 1, minWidth: '140px' }}>
            <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '11px',
                fontWeight: 600,
                color: '#64748b',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '8px'
            }}>
                {label === 'Product Shot' ? <ImageIcon style={{ width: 12, height: 12 }} /> : <FileText style={{ width: 12, height: 12 }} />}
                {label}
            </label>
            <div
                tabIndex={0}
                onPaste={handlePaste}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onClick={() => fileInputRef.current?.click()}
                style={{
                    cursor: 'pointer',
                    height: '160px',
                    border: isFocused ? `2px solid ${accentColor}` : '2px dashed #cbd5e1',
                    borderRadius: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    background: isFocused ? `${accentColor}10` : '#fff',
                    transition: 'all 0.2s ease',
                    outline: 'none'
                }}
            >
                {image ? (
                    <>
                        <img src={image} alt="Uploaded" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div
                            onClick={(e) => { e.stopPropagation(); onImageChange(null); }}
                            style={{
                                position: 'absolute',
                                inset: 0,
                                background: 'rgba(0,0,0,0.4)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                opacity: 0,
                                transition: 'opacity 0.2s'
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                            onMouseLeave={(e) => (e.currentTarget.style.opacity = '0')}
                        >
                            <button style={{
                                background: 'rgba(255,255,255,0.9)',
                                padding: '8px',
                                borderRadius: '50%',
                                border: 'none',
                                cursor: 'pointer'
                            }}>
                                <X style={{ width: 20, height: 20, color: '#1e293b' }} />
                            </button>
                        </div>
                    </>
                ) : (
                    <div style={{ textAlign: 'center', padding: '16px' }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 8px',
                            background: isFocused ? `${accentColor}20` : '#f1f5f9',
                            color: isFocused ? accentColor : '#94a3b8'
                        }}>
                            {isFocused ? <Clipboard style={{ width: 20, height: 20 }} /> : <Upload style={{ width: 20, height: 20 }} />}
                        </div>
                        <p style={{ fontSize: '12px', fontWeight: 500, color: '#475569' }}>
                            {isFocused ? 'Paste Image' : 'Click or Paste'}
                        </p>
                    </div>
                )}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
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

    const inputStyle: React.CSSProperties = {
        width: '100%',
        padding: '10px 16px',
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
        outline: 'none',
        fontSize: '14px'
    };

    const textareaStyle: React.CSSProperties = {
        ...inputStyle,
        height: '80px',
        resize: 'none'
    };

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 16px' }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
                    Health Product Analysis
                </h2>
                <p style={{ color: '#64748b', fontSize: '16px' }}>
                    Paste images of your product labels for an expert breakdown.
                </p>
            </div>

            {/* Cards Grid - Side by Side */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                gap: '24px',
                marginBottom: '32px'
            }}>
                {/* Your Product Card */}
                <div style={{
                    background: '#ffffff',
                    borderRadius: '16px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    border: '1px solid #e2e8f0',
                    overflow: 'hidden'
                }}>
                    {/* Teal Top Border */}
                    <div style={{ height: '4px', background: 'linear-gradient(90deg, #0d9488, #14b8a6)' }} />

                    <div style={{ padding: '24px' }}>
                        {/* Card Header */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                background: '#ccfbf1',
                                borderRadius: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Package style={{ width: 22, height: 22, color: '#0d9488' }} />
                            </div>
                            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>Your Product</h3>
                        </div>

                        {/* Product Name Input */}
                        <input
                            type="text"
                            value={homeName}
                            onChange={(e) => setHomeName(e.target.value)}
                            placeholder="Product Name"
                            style={{ ...inputStyle, marginBottom: '16px' }}
                            onFocus={(e) => e.target.style.borderColor = '#0d9488'}
                            onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                        />

                        {/* Image Upload Boxes */}
                        <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                            <ImageUploadBox
                                label="Product Shot"
                                image={homeProductImage}
                                onImageChange={setHomeProductImage}
                                accentColor="#0d9488"
                            />
                            <ImageUploadBox
                                label="Ingredients"
                                image={homeIngredientsImage}
                                onImageChange={setHomeIngredientsImage}
                                accentColor="#0d9488"
                            />
                        </div>

                        {/* Notes */}
                        <textarea
                            value={homeNotes}
                            onChange={(e) => setHomeNotes(e.target.value)}
                            placeholder="Key Benefits..."
                            style={textareaStyle}
                            onFocus={(e) => e.target.style.borderColor = '#0d9488'}
                            onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                        />
                    </div>
                </div>

                {/* Competitor Card */}
                <div style={{
                    background: '#ffffff',
                    borderRadius: '16px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    border: '1px solid #e2e8f0',
                    overflow: 'hidden'
                }}>
                    {/* Rose Top Border */}
                    <div style={{ height: '4px', background: 'linear-gradient(90deg, #e11d48, #f43f5e)' }} />

                    <div style={{ padding: '24px' }}>
                        {/* Card Header */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                background: '#ffe4e6',
                                borderRadius: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Package style={{ width: 22, height: 22, color: '#e11d48' }} />
                            </div>
                            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>Competitor</h3>
                        </div>

                        {/* Name + Price Row */}
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px', marginBottom: '16px' }}>
                            <input
                                type="text"
                                value={compName}
                                onChange={(e) => setCompName(e.target.value)}
                                placeholder="Competitor Name"
                                style={inputStyle}
                                onFocus={(e) => e.target.style.borderColor = '#e11d48'}
                                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                            />
                            <input
                                type="text"
                                value={compPrice}
                                onChange={(e) => setCompPrice(e.target.value)}
                                placeholder="Price"
                                style={inputStyle}
                                onFocus={(e) => e.target.style.borderColor = '#e11d48'}
                                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                            />
                        </div>

                        {/* Image Upload Boxes */}
                        <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                            <ImageUploadBox
                                label="Product Shot"
                                image={compProductImage}
                                onImageChange={setCompProductImage}
                                accentColor="#e11d48"
                            />
                            <ImageUploadBox
                                label="Ingredients"
                                image={compIngredientsImage}
                                onImageChange={setCompIngredientsImage}
                                accentColor="#e11d48"
                            />
                        </div>

                        {/* Notes */}
                        <textarea
                            value={compNotes}
                            onChange={(e) => setCompNotes(e.target.value)}
                            placeholder="Weaknesses..."
                            style={textareaStyle}
                            onFocus={(e) => e.target.style.borderColor = '#e11d48'}
                            onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                        />
                    </div>
                </div>
            </div>

            {/* Compare Button */}
            <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: '48px' }}>
                <button
                    onClick={handleStart}
                    disabled={isProcessing}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        background: isProcessing ? '#94a3b8' : 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                        color: '#ffffff',
                        fontSize: '18px',
                        fontWeight: 700,
                        padding: '16px 48px',
                        borderRadius: '50px',
                        border: 'none',
                        cursor: isProcessing ? 'not-allowed' : 'pointer',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
                        transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => !isProcessing && (e.currentTarget.style.transform = 'scale(1.05)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                >
                    {isProcessing ? (
                        <Loader2 style={{ width: 24, height: 24, animation: 'spin 1s linear infinite' }} />
                    ) : (
                        <Sparkles style={{ width: 24, height: 24, color: '#14b8a6' }} />
                    )}
                    {isProcessing ? 'Analyzing...' : 'Compare & Analyze'}
                    {!isProcessing && <ArrowRight style={{ width: 20, height: 20 }} />}
                </button>
            </div>
        </div>
    );
};
