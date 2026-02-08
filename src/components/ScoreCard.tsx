import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Trophy } from 'lucide-react';
import type { AnalysisResult } from '../services/GeminiService';

interface ScoreCardProps {
    analysis: AnalysisResult;
}

export const ScoreCard: React.FC<ScoreCardProps> = ({ analysis }) => {
    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="glass-card p-8 h-[450px]">
                    <h3 className="text-xl font-black mb-8 flex items-center gap-3 gold-text-glow uppercase tracking-tighter">
                        <Trophy className="text-brand-gold w-6 h-6" />
                        Clinical Metric Comparison
                    </h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={analysis.scores}
                            layout="vertical"
                            margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" horizontal={false} />
                            <XAxis type="number" domain={[0, 100]} hide />
                            <YAxis
                                type="category"
                                dataKey="category"
                                stroke="rgba(255,255,255,0.6)"
                                fontSize={12}
                                width={100}
                            />
                            <Tooltip
                                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                contentStyle={{
                                    backgroundColor: '#1A1A1A',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '0.5rem'
                                }}
                            />
                            <Bar dataKey="home" name="Home Product" fill="#FFD700" radius={[0, 4, 4, 0]} barSize={20} />
                            <Bar dataKey="competitor" name="Competitor" fill="#4B5563" radius={[0, 4, 4, 0]} barSize={20} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="glass-card p-8 flex flex-col justify-center relative overflow-hidden group">
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-gold/5 blur-3xl rounded-full group-hover:bg-brand-gold/10 transition-all duration-700" />

                    <div className="mb-8 p-6 rounded-2xl bg-brand-gold/5 border border-brand-gold/20 gold-aura relative">
                        <h3 className="text-brand-gold font-black text-3xl mb-3 flex items-center gap-3 tracking-tighter uppercase gold-text-glow">
                            <Trophy className="w-8 h-8" />
                            {analysis.winner === 'home' ? 'HOME PRODUCT WINS' : 'COMPETITOR WINS'}
                        </h3>
                        <p className="text-sm opacity-90 leading-relaxed italic font-medium">
                            "{analysis.verdict}"
                        </p>
                    </div>

                    <div className="space-y-4 overflow-y-auto max-h-[220px] pr-2 custom-scrollbar">
                        {analysis.scores.map((score, idx) => (
                            <div key={idx} className="p-3 rounded-lg bg-white/5 border border-white/10">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="font-bold text-xs uppercase text-brand-gold">{score.category} Logic</span>
                                    <div className="flex gap-2 text-[10px]">
                                        <span className="opacity-60">Home: {score.home}</span>
                                        <span className="opacity-60">Comp: {score.competitor}</span>
                                    </div>
                                </div>
                                <p className="text-xs opacity-70 italic">{score.reasoning}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
