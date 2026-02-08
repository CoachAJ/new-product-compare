
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { ProfileSettings } from './components/ProfileSettings';
import { ProductInput } from './components/ProductInput';
import { AnalysisResults } from './components/AnalysisResults';
import { AppPhase, UserProfile, ProductData, ComparisonAnalysis } from './types';
import { analyzeProducts } from './services/geminiService';
import { Loader2 } from 'lucide-react';

const STORAGE_KEY = 'health_compare_user_profile';

const App: React.FC = () => {
  const [phase, setPhase] = useState<AppPhase>(AppPhase.ONBOARDING);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [homeProduct, setHomeProduct] = useState<ProductData | null>(null);
  const [competitorProduct, setCompetitorProduct] = useState<ProductData | null>(null);
  const [analysis, setAnalysis] = useState<ComparisonAnalysis | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setUserProfile(parsed);
        setPhase(AppPhase.INPUT);
      }
    } catch (e) {
      console.warn("Storage access failed.", e);
    }
  }, []);

  const handleSaveProfile = (profile: UserProfile) => {
    setUserProfile(profile);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch (e) {
      console.warn("Save failed.", e);
    }
    setPhase(AppPhase.INPUT);
  };

  const handleStartAnalysis = async (home: ProductData, competitor: ProductData) => {
    if (!userProfile) return;
    
    setHomeProduct(home);
    setCompetitorProduct(competitor);
    setPhase(AppPhase.PROCESSING);

    try {
      const result = await analyzeProducts(home, competitor, userProfile);
      setAnalysis(result);
      setPhase(AppPhase.RESULTS);
    } catch (error: any) {
      console.error("Analysis Failed:", error);
      const msg = error.message || error.toString();
      
      if (msg.includes('403') || msg.includes('401') || msg.includes('API Key') || msg.includes('permission denied')) {
        alert("Authentication Error: Your API key was rejected. Please check your key in Profile Settings.");
        setPhase(AppPhase.ONBOARDING);
      } else {
        alert("Analysis Error: " + msg);
        setPhase(AppPhase.INPUT);
      }
    }
  };

  const handleReset = () => {
    setHomeProduct(null);
    setCompetitorProduct(null);
    setAnalysis(null);
    setPhase(AppPhase.INPUT);
  };

  const renderContent = () => {
    switch (phase) {
      case AppPhase.ONBOARDING:
        return (
          <div className="py-8">
            <ProfileSettings initialProfile={userProfile} onSave={handleSaveProfile} />
          </div>
        );
      case AppPhase.INPUT:
        return <ProductInput onStartAnalysis={handleStartAnalysis} />;
      case AppPhase.PROCESSING:
        return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
            <div className="relative">
              <div className="absolute inset-0 bg-teal-200 rounded-full animate-ping opacity-25"></div>
              <div className="relative bg-white p-6 rounded-full shadow-xl">
                <Loader2 className="w-12 h-12 text-teal-600 animate-spin" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Analyzing Products...</h2>
              <p className="text-slate-500 mt-2 max-w-md mx-auto">
                Reading labels and verifying nutritional bio-availability.
              </p>
            </div>
          </div>
        );
      case AppPhase.RESULTS:
        if (!analysis || !homeProduct || !competitorProduct || !userProfile) return null;
        return (
          <AnalysisResults 
            analysis={analysis} 
            homeProduct={homeProduct} 
            competitorProduct={competitorProduct}
            userProfile={userProfile}
            onNewComparison={handleReset}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Layout 
      onProfileClick={() => setPhase(AppPhase.ONBOARDING)} 
      showProfile={phase !== AppPhase.ONBOARDING && phase !== AppPhase.PROCESSING}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
