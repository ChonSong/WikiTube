import React, { useState } from 'react';
import { Search, Database, Cpu, FileText, Share2 } from 'lucide-react';
import { AuthUser } from '../types';

interface LandingProps {
  onStart: (name: string) => void;
  error: string | null;
  user: AuthUser | null;
  onLogin: () => void;
}

export const Landing: React.FC<LandingProps> = ({ onStart, error, user, onLogin }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onStart(input.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex flex-col justify-center items-center relative overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-3xl w-full px-6 relative z-10 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 mb-8 backdrop-blur-sm animate-fade-in-up">
          <Database size={16} />
          <span className="text-sm font-medium tracking-wide uppercase">Automated Archival Pipeline v2.0</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
          Wiki<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Tube</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed">
          Transform any YouTube channel into a structured, searchable encyclopaedia using advanced Natural Language Processing.
        </p>

        <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto mb-16">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-200"></div>
            <div className="relative flex items-center bg-white rounded-xl shadow-2xl overflow-hidden">
              <div className="pl-4 text-slate-400">
                <Search size={24} />
              </div>
              <input
                type="text"
                className="w-full p-5 outline-none text-lg text-slate-800 placeholder:text-slate-400"
                placeholder="Enter Channel Name (e.g., 'Fireship')"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button 
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-5 font-semibold transition-colors flex items-center gap-2"
              >
                Generate
              </button>
            </div>
          </div>
          {error && (
             <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
               {error}
             </div>
          )}
        </form>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="bg-white/5 backdrop-blur border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-colors">
            <Cpu className="text-blue-400 mb-4" size={32} />
            <h3 className="text-white font-semibold mb-2">AI-Powered Extraction</h3>
            <p className="text-slate-400 text-sm">Uses Gemini to transcribe, summarize, and extract entities from video content automatically.</p>
          </div>
          <div className="bg-white/5 backdrop-blur border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-colors">
            <FileText className="text-blue-400 mb-4" size={32} />
            <h3 className="text-white font-semibold mb-2">Structured Wiki</h3>
            <p className="text-slate-400 text-sm">Automatically generates cross-linked encyclopaedia pages categorized by topic and sentiment.</p>
          </div>
          <div className="bg-white/5 backdrop-blur border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-colors">
            <Share2 className="text-blue-400 mb-4" size={32} />
            <h3 className="text-white font-semibold mb-2">Social Knowledge</h3>
            <p className="text-slate-400 text-sm">Authenticate with Google to save articles and share knowledge graphs with friends.</p>
          </div>
        </div>
      </div>
    </div>
  );
};