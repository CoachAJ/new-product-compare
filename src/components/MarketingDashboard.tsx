import React, { useState } from 'react';
import type { AnalysisResult } from '../services/GeminiService';
import { Share2, Linkedin, Facebook, Copy, Check, MessageCircle, Hash } from 'lucide-react';

interface MarketingDashboardProps {
    analysis: AnalysisResult;
}

const SocialTabs: React.FC<{
    platform: 'tiktok' | 'linkedin' | 'facebook',
    content: string,
    hashtags: string[]
}> = ({ platform, content, hashtags }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(`${content}\n\n${hashtags.join(' ')}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const icons = {
        tiktok: <MessageCircle className="w-5 h-5" />,
        linkedin: <Linkedin className="w-5 h-5" />,
        facebook: <Facebook className="w-5 h-5" />
    };

    return (
        <div className="glass-card p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                {icons[platform]}
            </div>

            <div className="flex items-center gap-2 mb-4">
                <span className="capitalize font-bold text-lg">{platform} Hook</span>
            </div>

            <div className="bg-black/20 rounded-lg p-4 mb-4 text-sm leading-relaxed border border-white/5">
                {content}
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
                {hashtags.map((tag, i) => (
                    <span key={i} className="text-[10px] bg-brand-gold/10 text-brand-gold px-2 py-1 rounded border border-brand-gold/20 flex items-center gap-1">
                        <Hash className="w-3 h-3" />
                        {tag.replace('#', '')}
                    </span>
                ))}
            </div>

            <button
                onClick={handleCopy}
                className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center gap-2 transition-all text-sm font-medium"
            >
                {copied ? (
                    <>
                        <Check className="w-4 h-4 text-green-400" />
                        Copied to Clipboard
                    </>
                ) : (
                    <>
                        <Copy className="w-4 h-4" />
                        Copy Full Caption
                    </>
                )}
            </button>
        </div>
    );
};

export const MarketingDashboard: React.FC<MarketingDashboardProps> = ({ analysis }) => {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
                <Share2 className="text-brand-gold" />
                High-Conversion Social Assets
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <SocialTabs platform="tiktok" content={analysis.marketingCopy.tiktok} hashtags={analysis.hashtags} />
                <SocialTabs platform="linkedin" content={analysis.marketingCopy.linkedin} hashtags={analysis.hashtags} />
                <SocialTabs platform="facebook" content={analysis.marketingCopy.facebook} hashtags={analysis.hashtags} />
            </div>

            <div className="flex items-center justify-center gap-2 text-xs opacity-50 mt-4 italic">
                <Check className="w-3 h-3 text-green-500" />
                Rule of 5 Hashtags Enforced
                <span className="mx-2">•</span>
                <Check className="w-3 h-3 text-green-500" />
                Personalized Links Injected
            </div>
        </div>
    );
};
