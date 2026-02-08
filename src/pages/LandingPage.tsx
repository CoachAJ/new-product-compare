import React, { useState } from 'react';
import { ProfileManager } from '../utils/ProfileManager';
import type { CoachProfile } from '../utils/ProfileManager';
import { ProfileForm } from '../components/ProfileForm';
import { MultimodalInput } from '../components/MultimodalInput';
import { GeminiService } from '../services/GeminiService';
import type { AnalysisResult } from '../services/GeminiService';
import { ScoreCard } from '../components/ScoreCard';
import { MarketingDashboard } from '../components/MarketingDashboard';
import { VisualAssetGenerator } from '../components/VisualAssetGenerator';
import { ShieldCheck, Zap, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const LandingPage: React.FC = () => {
    const [profile, setProfile] = useState<CoachProfile | null>(ProfileManager.getProfile());
    const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSaveProfile = (newProfile: CoachProfile) => {
        ProfileManager.saveProfile(newProfile);
        setProfile(newProfile);
    };

    const handleRunAnalysis = async (images: any) => {
        if (!profile) return;
        setIsProcessing(true);
        try {
            const result = await GeminiService.analyzeProducts(profile.apiKey, profile, images);
            setAnalysis(result);
            // Scroll to results
            setTimeout(() => {
                document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } catch (error) {
            console.error(error);
            alert('Analysis failed. Please check your API key and images.');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleLogout = () => {
        if (confirm('Logout? Profile and API Key will be removed from this browser.')) {
            ProfileManager.clearProfile();
            setProfile(null);
            setAnalysis(null);
        }
    };

    return (
        <div className="min-h-screen bg-brand-dark text-white selection:bg-brand-gold selection:text-black">
            {/* Header */}
            <nav className="border-b border-white/5 bg-black/20 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-brand-gold flex items-center justify-center">
                            <Zap className="text-black w-5 h-5" fill="black" />
                        </div>
                        <span className="font-extrabold text-xl tracking-tight uppercase">
                            HealthCompare <span className="text-brand-gold">AI</span>
                        </span>
                    </div>
                    {profile && (
                        <div className="flex items-center gap-4">
                            <span className="text-xs opacity-50 hidden sm:inline">Coach: {profile.name}</span>
                            <button
                                onClick={handleLogout}
                                className="p-2 hover:bg-white/5 rounded-full transition-colors text-red-500"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
                {!profile ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="text-center mb-12">
                            <h1 className="text-4xl sm:text-6xl font-black mb-4 tracking-tighter">
                                TRANSFORM LABELS INTO <br />
                                <span className="text-brand-gold">CONVERSION ASSETS</span>
                            </h1>
                            <p className="text-lg opacity-60 max-w-2xl mx-auto">
                                The specialized "Tale of the Tape" comparison engine for Health Coaches.
                                Clinically-driven analysis, instantly ready for social media.
                            </p>
                        </div>
                        <ProfileForm initialProfile={null} onSave={handleSaveProfile} />
                    </motion.div>
                ) : (
                    <div className="space-y-16">
                        <motion.section
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-8"
                        >
                            <div className="flex flex-col items-center">
                                <div className="flex items-center gap-4 mb-8 text-xs font-bold uppercase tracking-widest opacity-40">
                                    <ShieldCheck className="w-4 h-4" />
                                    MIME-GUARD PROTECTED
                                    <span className="h-px w-8 bg-white/20" />
                                    GEMINI 3 PRO PREVIEW
                                </div>
                                <MultimodalInput onImagesReady={handleRunAnalysis} isProcessing={isProcessing} />
                            </div>
                        </motion.section>

                        <AnimatePresence>
                            {analysis && (
                                <motion.div
                                    id="results-section"
                                    initial={{ opacity: 0, y: 40 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-16 py-12 border-t border-white/5"
                                >
                                    <div className="text-center space-y-2">
                                        <span className="text-brand-gold font-bold tracking-widest text-xs uppercase">Analysis Complete</span>
                                        <h2 className="text-3xl font-black uppercase">The Verdict is In</h2>
                                    </div>

                                    <ScoreCard analysis={analysis} />

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                        <MarketingDashboard analysis={analysis} />
                                        <VisualAssetGenerator analysis={analysis} profile={profile} />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="border-t border-white/5 py-12 mt-24">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className="text-xs opacity-30">
                        &copy; 2026 HealthCompare AI. Clinically-backed reasoning by Gemini 3 Pro multimodal architecture.
                    </p>
                </div>
            </footer>
        </div>
    );
};
