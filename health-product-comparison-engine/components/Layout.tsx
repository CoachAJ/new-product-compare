import React from 'react';
import { Leaf, User } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  onProfileClick: () => void;
  showProfile: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, onProfileClick, showProfile }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-teal-600">
            <Leaf className="w-6 h-6" />
            <h1 className="font-bold text-lg tracking-tight text-slate-900">HealthCompare<span className="text-teal-600">AI</span></h1>
          </div>
          {showProfile && (
            <button 
              onClick={onProfileClick}
              className="p-2 text-slate-500 hover:text-teal-600 hover:bg-slate-50 rounded-full transition-colors"
              aria-label="Profile Settings"
            >
              <User className="w-5 h-5" />
            </button>
          )}
        </div>
      </header>
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6">
        {children}
      </main>
      <footer className="bg-slate-50 border-t border-slate-200 py-6 text-center text-slate-400 text-sm">
        <p>© {new Date().getFullYear()} Health Comparison Engine</p>
      </footer>
    </div>
  );
};
