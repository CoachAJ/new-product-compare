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

    const handleRunAnalysis = async (
        images: { homeFront: string; homeLabel: string; compFront: string; compLabel: string },
        context: { homeContext: string; compContext: string }
    ) => {
        if (!profile) return;
        setIsProcessing(true);
        try {
            const result = await GeminiService.analyzeProducts(profile.apiKey, profile, images, context);
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
            <header className="fixed top-0 inset-x-0 z-50 bg-black/60 backdrop-blur-2xl border-b border-white/5 py-4">
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    <div className="flex items-center gap-3 group cursor-default">
                        <div className="w-10 h-10 rounded-xl bg-brand-gold flex items-center justify-center rotate-3 group-hover:rotate-0 transition-all duration-500 shadow-[0_0_20px_rgba(255,215,0,0.3)]">
                            <Zap className="text-black w-6 h-6" fill="black" />
                        </div>
                        <h1 className="font-black text-2xl tracking-tighter uppercase gold-text-glow">HealthCompare AI</h1>
                    </div>
                    {profile && (
                        <div className="flex items-center gap-6">
                            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-gold/10 border border-brand-gold/20">
                                <ShieldCheck className="w-4 h-4 text-brand-gold" />
                                <span className="text-[10px] font-black text-brand-gold uppercase tracking-[0.2em]">Coach: {profile.name}</span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="p-2 hover:bg-white/10 rounded-xl transition-all group"
                                title="Lock Profile"
                            >
                                <LogOut className="w-5 h-5 opacity-40 group-hover:opacity-100 group-hover:text-red-400 transition-all" />
                            </button>
                        </div>
                    )}
                </div>
            </header>

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
                                    className="space-y-20 py-20 border-t border-white/5"
                                >
                                    <div className="text-center space-y-3">
                                        <span className="text-brand-gold font-black tracking-widest text-[#FFD700] text-[10px] uppercase bg-brand-gold/10 px-4 py-1.5 rounded-full border border-brand-gold/20">Analysis Complete</span>
                                        <h2 className="text-4xl font-black uppercase tracking-tighter gold-text-glow">The Clinical Verdict</h2>
                                    </div>

                                    <div className="space-y-24">
                                        <section>
                                            <ScoreCard analysis={analysis} />
                                        </section>

                                        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                                            <div className="glass-card p-1 bg-gradient-to-br from-brand-gold/10 to-transparent">
                                                <div className="bg-[#080808] rounded-[1.4rem] p-8">
                                                    <MarketingDashboard analysis={analysis} />
                                                </div>
                                            </div>
                                            <VisualAssetGenerator analysis={analysis} profile={profile} />
                                        </section>
                                    </div>

                                    <div className="text-center pt-20">
                                        <button
                                            onClick={() => setAnalysis(null)}
                                            className="text-[10px] opacity-30 hover:opacity-100 transition-opacity uppercase tracking-[0.3em] font-black border-b border-transparent hover:border-brand-gold/30 pb-1"
                                        >
                                            ← Execute new clinical assessment
                                        </button>
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
