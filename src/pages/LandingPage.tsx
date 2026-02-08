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
import { Leaf, LogOut } from 'lucide-react';
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
        <div className="min-h-screen text-slate-800" style={{ background: '#f8fafc' }}>
            <header
                className="fixed top-0 inset-x-0 z-50 py-4"
                style={{
                    background: '#fff',
                    borderBottom: '1px solid #f1f5f9'
                }}
            >
                <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{ background: '#0d9488' }}
                        >
                            <Leaf className="text-white w-4 h-4" />
                        </div>
                        <span className="font-bold text-lg tracking-tight text-slate-900">
                            HealthCompare<span className="text-teal-600">AI</span>
                        </span>
                    </div>
                    {profile && (
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-slate-500">{profile.name}</span>
                            <button
                                onClick={handleLogout}
                                className="p-2 hover:bg-slate-100 rounded-lg transition-all"
                                title="Logout"
                            >
                                <LogOut className="w-4 h-4 text-slate-400" />
                            </button>
                        </div>
                    )}
                </div>
            </header>

            <main className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                {!profile ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="text-center mb-12">
                            <h1 className="text-4xl sm:text-6xl font-black mb-4 tracking-tighter">
                                TRANSFORM LABELS INTO <br />
                                <span className="text-brand-gold gold-text-glow">CONVERSION ASSETS</span>
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
                        >
                            <MultimodalInput onImagesReady={handleRunAnalysis} isProcessing={isProcessing} />
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
