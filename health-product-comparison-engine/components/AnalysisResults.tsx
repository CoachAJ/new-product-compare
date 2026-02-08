
import React, { useState } from 'react';
import { ComparisonAnalysis, ProductData, UserProfile } from '../types';
import { ImageGenerator } from './ImageGenerator';
import { 
  CheckCircle, 
  XCircle, 
  Copy, 
  Facebook, 
  Linkedin, 
  Youtube, 
  Twitter,
  Video,
  BarChart,
  ArrowRight,
  Clipboard
} from 'lucide-react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface AnalysisResultsProps {
  analysis: ComparisonAnalysis;
  homeProduct: ProductData;
  competitorProduct: ProductData;
  userProfile: UserProfile;
  onNewComparison: () => void;
}

const CopyButton = ({ text, className = "" }: { text: string, className?: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button 
      onClick={handleCopy}
      className={`p-1.5 rounded-full hover:bg-slate-100 transition-colors text-slate-400 hover:text-teal-600 ${className}`}
      title="Copy to clipboard"
    >
      {copied ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Clipboard className="w-4 h-4" />}
    </button>
  );
};

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({
  analysis,
  homeProduct,
  competitorProduct,
  userProfile,
  onNewComparison
}) => {
  const [activeTab, setActiveTab] = useState<'facebook' | 'linkedin' | 'twitter' | 'youtube' | 'tiktok'>('facebook');
  const [socialCopied, setSocialCopied] = useState(false);

  const handleSocialCopy = () => {
    navigator.clipboard.writeText(analysis.socialCopy[activeTab]);
    setSocialCopied(true);
    setTimeout(() => setSocialCopied(false), 2000);
  };

  const chartData = [
    { name: 'Quality Score', [homeProduct.name]: analysis.scoreHome, [competitorProduct.name]: analysis.scoreCompetitor },
  ];

  const winner: 'home' | 'competitor' = analysis.scoreHome >= analysis.scoreCompetitor ? 'home' : 'competitor';

  return (
    <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-700">
      
      {/* Verdict Section */}
      <section className="bg-white rounded-2xl shadow-xl border-t-8 border-teal-500 overflow-hidden relative group">
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <CopyButton text={`Verdict: ${analysis.verdict}\n\nSummary: ${analysis.summary}`} />
        </div>
        <div className="p-8">
          <h2 className="text-sm font-bold text-teal-600 uppercase tracking-widest mb-2">The Honest Verdict</h2>
          <p className="text-3xl font-bold text-slate-900 leading-tight mb-6">"{analysis.verdict}"</p>
          
          <div className="grid md:grid-cols-2 gap-8 mt-8">
             <div className="bg-teal-50 p-6 rounded-xl border border-teal-100 relative group/card">
               <div className="absolute top-2 right-2 opacity-0 group-hover/card:opacity-100 transition-opacity">
                 <CopyButton text={`${homeProduct.name} Wins:\n${analysis.pros.map(p => `- ${p}`).join('\n')}`} />
               </div>
               <div className="flex items-center gap-2 mb-4">
                 <CheckCircle className="w-5 h-5 text-teal-600" />
                 <h3 className="font-bold text-teal-900">{homeProduct.name} Wins</h3>
               </div>
               <ul className="space-y-2">
                 {analysis.pros.map((pro, i) => (
                   <li key={i} className="flex items-start gap-2 text-sm text-teal-800">
                     <span className="mt-1 block w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0" />
                     {pro}
                   </li>
                 ))}
               </ul>
             </div>

             <div className="bg-rose-50 p-6 rounded-xl border border-rose-100 relative group/card">
               <div className="absolute top-2 right-2 opacity-0 group-hover/card:opacity-100 transition-opacity">
                 <CopyButton text={`Competitor Drawbacks:\n${analysis.cons.map(c => `- ${c}`).join('\n')}`} />
               </div>
               <div className="flex items-center gap-2 mb-4">
                 <XCircle className="w-5 h-5 text-rose-600" />
                 <h3 className="font-bold text-rose-900">Competitor Drawbacks</h3>
               </div>
               <ul className="space-y-2">
                 {analysis.cons.map((con, i) => (
                   <li key={i} className="flex items-start gap-2 text-sm text-rose-800">
                     <span className="mt-1 block w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                     {con}
                   </li>
                 ))}
               </ul>
             </div>
          </div>
        </div>
      </section>

      {/* Deep Dive & Charts */}
      <section className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200 relative group">
           <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
             <CopyButton text={`Nutrient Breakdown:\n${analysis.nutrientComparison.map(n => `${n.nutrient}: ${homeProduct.name}(${n.homeValue}) vs ${competitorProduct.name}(${n.competitorValue})`).join('\n')}`} />
           </div>
           <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
             <BarChart className="w-5 h-5 text-slate-400" /> Nutrient Breakdown
           </h3>
           <div className="overflow-x-auto">
             <table className="w-full text-sm">
               <thead>
                 <tr className="border-b border-slate-100 text-left text-slate-500">
                   <th className="pb-3 font-medium pl-2">Nutrient</th>
                   <th className="pb-3 font-medium text-teal-600">{homeProduct.name}</th>
                   <th className="pb-3 font-medium text-rose-500">{competitorProduct.name}</th>
                 </tr>
               </thead>
               <tbody>
                 {analysis.nutrientComparison.map((row, i) => (
                   <tr key={i} className="border-b border-slate-50 hover:bg-slate-50">
                     <td className="py-3 pl-2 font-medium text-slate-700">{row.nutrient}</td>
                     <td className={`py-3 ${row.advantage === 'home' ? 'font-bold text-teal-700' : 'text-slate-600'}`}>
                       {row.homeValue}
                     </td>
                     <td className={`py-3 ${row.advantage === 'competitor' ? 'font-bold text-rose-700' : 'text-slate-600'}`}>
                       {row.competitorValue}
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-center">
            <h3 className="font-bold text-slate-900 mb-6 text-center">Overall Score</h3>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={chartData}>
                  <XAxis dataKey="name" hide />
                  <YAxis domain={[0, 100]} hide />
                  <Tooltip />
                  <Bar dataKey={homeProduct.name} fill="#0d9488" radius={[4, 4, 0, 0]} name={homeProduct.name} label={{ position: 'top', fill: '#0d9488', fontSize: 12 }} />
                  <Bar dataKey={competitorProduct.name} fill="#e11d48" radius={[4, 4, 0, 0]} name={competitorProduct.name} label={{ position: 'top', fill: '#e11d48', fontSize: 12 }} />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
        </div>
      </section>

      {/* Social Media Generator */}
      <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
           <h3 className="font-bold text-slate-800">Ready-to-Post Copy</h3>
           <div className="flex gap-1">
             <button onClick={() => setActiveTab('facebook')} className={`p-2 rounded-lg ${activeTab === 'facebook' ? 'bg-blue-100 text-blue-600' : 'text-slate-400 hover:bg-slate-200'}`}><Facebook className="w-5 h-5" /></button>
             <button onClick={() => setActiveTab('twitter')} className={`p-2 rounded-lg ${activeTab === 'twitter' ? 'bg-sky-100 text-sky-600' : 'text-slate-400 hover:bg-slate-200'}`}><Twitter className="w-5 h-5" /></button>
             <button onClick={() => setActiveTab('linkedin')} className={`p-2 rounded-lg ${activeTab === 'linkedin' ? 'bg-blue-100 text-blue-700' : 'text-slate-400 hover:bg-slate-200'}`}><Linkedin className="w-5 h-5" /></button>
             <button onClick={() => setActiveTab('youtube')} className={`p-2 rounded-lg ${activeTab === 'youtube' ? 'bg-red-100 text-red-600' : 'text-slate-400 hover:bg-slate-200'}`}><Youtube className="w-5 h-5" /></button>
             <button onClick={() => setActiveTab('tiktok')} className={`p-2 rounded-lg ${activeTab === 'tiktok' ? 'bg-pink-100 text-pink-600' : 'text-slate-400 hover:bg-slate-200'}`}><Video className="w-5 h-5" /></button>
           </div>
        </div>
        <div className="p-6">
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-slate-700 whitespace-pre-wrap font-sans text-sm leading-relaxed min-h-[150px]">
            {analysis.socialCopy[activeTab]}
          </div>
          <div className="mt-4 flex justify-end">
            <button 
              onClick={handleSocialCopy}
              className="flex items-center gap-2 text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors"
            >
              {socialCopied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {socialCopied ? 'Copied to Clipboard' : 'Copy Text'}
            </button>
          </div>
        </div>
      </section>

      {/* Image Generation */}
      <ImageGenerator 
        homeProduct={homeProduct} 
        competitorProduct={competitorProduct} 
        userProfile={userProfile}
        winner={winner}
      />

      <div className="text-center pt-8">
        <button
          onClick={onNewComparison}
          className="text-slate-400 hover:text-teal-600 font-medium text-sm flex items-center justify-center gap-2 mx-auto transition-colors"
        >
          Start New Comparison <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
