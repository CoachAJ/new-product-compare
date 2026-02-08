import React, { useState } from 'react';
import type { CoachProfile } from '../utils/ProfileManager';
import { User, Link, MessageSquare, Key, Save } from 'lucide-react';

interface ProfileFormProps {
    initialProfile: CoachProfile | null;
    onSave: (profile: CoachProfile) => void;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({ initialProfile, onSave }) => {
    const [profile, setProfile] = useState<CoachProfile>(initialProfile || {
        name: '',
        evaluationLink: '',
        cta: 'Book your evaluation today!',
        apiKey: 'AIzaSyBXJQRwD9nt_uN1nuixX7WlSCnpwnxdle4'
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(profile);
    };

    return (
        <div className="glass-card p-6 w-full max-w-2xl mx-auto mb-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <User className="text-brand-gold" />
                Coach Personalization
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium opacity-70">Coach Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50" />
                            <input
                                type="text"
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 focus:ring-2 focus:ring-brand-gold outline-none transition-all"
                                value={profile.name}
                                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                placeholder="e.g. Dr. Jane Smith"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium opacity-70">Evaluation Link</label>
                        <div className="relative">
                            <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50" />
                            <input
                                type="url"
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 focus:ring-2 focus:ring-brand-gold outline-none transition-all"
                                value={profile.evaluationLink}
                                onChange={(e) => setProfile({ ...profile, evaluationLink: e.target.value })}
                                placeholder="https://eval.ygy.com/your-id"
                            />
                        </div>
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium opacity-70">Preferred CTA</label>
                    <div className="relative">
                        <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50" />
                        <input
                            type="text"
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 focus:ring-2 focus:ring-brand-gold outline-none transition-all"
                            value={profile.cta}
                            onChange={(e) => setProfile({ ...profile, cta: e.target.value })}
                            placeholder="e.g. Get started on your health journey!"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium opacity-70">Gemini API Key</label>
                    <div className="relative">
                        <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50" />
                        <input
                            type="password"
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 focus:ring-2 focus:ring-brand-gold outline-none transition-all"
                            value={profile.apiKey}
                            onChange={(e) => setProfile({ ...profile, apiKey: e.target.value })}
                            placeholder="API Key"
                        />
                    </div>
                </div>
                <button
                    type="submit"
                    className="w-full bg-brand-gold text-black font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-yellow-400 transition-colors mt-6 shadow-lg shadow-brand-gold/20"
                >
                    <Save className="w-5 h-5" />
                    Save & Lock Profile
                </button>
            </form>
        </div>
    );
};
