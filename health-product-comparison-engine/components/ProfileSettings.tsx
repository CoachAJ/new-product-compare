
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Save, UserCircle, Link as LinkIcon, MessageSquare, Key, CheckCircle, Eye, EyeOff, AlertTriangle, Info } from 'lucide-react';

interface ProfileSettingsProps {
  initialProfile: UserProfile | null;
  onSave: (profile: UserProfile) => void;
}

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({ initialProfile, onSave }) => {
  const [name, setName] = useState(initialProfile?.name || '');
  const [evalLink, setEvalLink] = useState(initialProfile?.evalLink || '');
  const [ctaPreference, setCtaPreference] = useState(initialProfile?.ctaPreference || 'Book a free discovery call');
  const [apiKey, setApiKey] = useState(initialProfile?.apiKey || '');
  const [showApiKey, setShowApiKey] = useState(false);
  const [keyConnected, setKeyConnected] = useState(false);
  const [keyError, setKeyError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setKeyError(null);

    // Basic API Key validation
    const trimmedKey = apiKey.trim();
    if (trimmedKey && !trimmedKey.startsWith('AIza')) {
      setKeyError("That doesn't look like a valid Google API Key (should start with 'AIza')");
      return;
    }

    if (name && evalLink && ctaPreference) {
      onSave({ 
        name, 
        evalLink, 
        ctaPreference, 
        apiKey: trimmedKey 
      });
    }
  };

  const handleConnectKey = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission
    try {
      if ((window as any).aistudio) {
        await (window as any).aistudio.openSelectKey();
        const hasKey = await (window as any).aistudio.hasSelectedApiKey();
        if (hasKey) {
          setKeyConnected(true);
          // If they successfully connect via studio, we can clear the manual field to avoid confusion, 
          // or keep it if they prefer manual. For now, let's keep the manual field independent.
        }
      } else {
        alert("Quick Connect is not available in this environment. Please enter your key manually below.");
      }
    } catch (err) {
      console.error("Failed to connect key", err);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-teal-600 p-6 text-white text-center">
        <UserCircle className="w-16 h-16 mx-auto mb-3 opacity-90" />
        <h2 className="text-xl font-bold">Coach Profile Setup</h2>
        <p className="text-teal-100 text-sm mt-1">Personalize your AI marketing engine</p>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700 flex items-center gap-2">
            <UserCircle className="w-4 h-4 text-teal-600" />
            Coach Name
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Coach AJ"
            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700 flex items-center gap-2">
            <LinkIcon className="w-4 h-4 text-teal-600" />
            Health Evaluation Link
          </label>
          <input
            type="text"
            required
            value={evalLink}
            onChange={(e) => setEvalLink(e.target.value)}
            placeholder="e.g. youngevity.com/eval/aj"
            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-teal-600" />
            Call-to-Action Preference
          </label>
          <select
            value={ctaPreference}
            onChange={(e) => setCtaPreference(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none bg-white"
          >
            <option value="Book a free discovery call">Book a free discovery call</option>
            <option value="Take the free health quiz">Take the free health quiz</option>
            <option value="DM me for details">DM me for details</option>
            <option value="Join my VIP group">Join my VIP group</option>
          </select>
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-100">
           <label className="block text-sm font-medium text-slate-700 flex items-center gap-2">
            <Key className="w-4 h-4 text-teal-600" />
            API Configuration
          </label>
          
          <div className="space-y-2">
            <label className="text-xs text-slate-500 font-medium">Option 1: Paste your API Key (Recommended)</label>
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 mb-2">
              <p className="text-xs text-blue-800 flex items-start gap-2">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  <strong>Free keys are supported!</strong> You don't need a paid plan for text analysis. 
                  <br/>
                  Get a free key from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline font-bold hover:text-blue-900">Google AI Studio</a>.
                </span>
              </p>
            </div>
            <div className="relative">
              <input
                type={showApiKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className={`w-full px-4 py-3 pr-10 rounded-lg border focus:ring-2 focus:border-transparent transition-all outline-none font-mono text-sm ${keyError ? 'border-red-300 focus:ring-red-200' : 'border-slate-300 focus:ring-teal-500'}`}
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {keyError && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> {keyError}
              </p>
            )}
            <p className="text-[10px] text-slate-400">
              Your key is saved locally in your browser and never sent to our servers.
            </p>
          </div>

          <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink-0 mx-4 text-slate-400 text-xs">OR</span>
              <div className="flex-grow border-t border-slate-200"></div>
          </div>

          <button
            onClick={handleConnectKey}
            className={`w-full py-3 px-4 rounded-lg text-sm font-medium border flex items-center justify-center gap-2 transition-all ${
              keyConnected 
                ? 'bg-green-50 text-green-700 border-green-200' 
                : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
            }`}
          >
             {keyConnected ? (
               <>
                 <CheckCircle className="w-4 h-4" />
                 API Key Connected via Studio
               </>
             ) : (
               <>
                 Quick Connect (Dev/Preview Only)
               </>
             )}
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-teal-600/20 mt-2"
        >
          <Save className="w-5 h-5" />
          Save Profile
        </button>
      </form>
    </div>
  );
};
