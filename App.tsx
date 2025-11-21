import React, { useState, useEffect } from 'react';
import { Landing } from './components/Landing';
import { ProcessingPipeline } from './components/ProcessingPipeline';
import { WikiLayout } from './components/WikiLayout';
import { generateChannelContent } from './services/geminiService';
import { WikiData, AppState, AuthUser } from './types';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';

export default function App() {
  // Global State
  const [appState, setAppState] = useState<AppState>('landing');
  const [channelName, setChannelName] = useState<string>('');
  const [wikiData, setWikiData] = useState<WikiData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);

  // Authentication Mock
  const login = () => {
    setUser({
      id: 'u_123',
      name: 'Researcher User',
      email: 'researcher@example.com',
      avatar: 'https://picsum.photos/id/64/200/200'
    });
  };

  const logout = () => {
    setUser(null);
  };

  // Process Handler
  const handleStartProcessing = async (inputName: string) => {
    setChannelName(inputName);
    setAppState('processing');
    setError(null);

    try {
      // We initiate the AI generation here, but the visual ProcessingPipeline component
      // will show a simulated progress bar while waiting for this promise.
      const data = await generateChannelContent(inputName);
      setWikiData(data);
      // ProcessingPipeline component controls when to switch to 'wiki' 
      // effectively waiting for both the animation and the data.
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to generate encyclopaedia content.");
      setAppState('landing');
    }
  };

  const handleProcessingComplete = () => {
    if (wikiData) {
      setAppState('wiki');
    }
  };

  const handleReset = () => {
    setAppState('landing');
    setWikiData(null);
    setChannelName('');
    setError(null);
  };

  return (
    <HashRouter>
       <div className="min-h-screen flex flex-col">
        {/* Simple Auth Header for Demo Purposes */}
        {appState === 'landing' && (
          <header className="absolute top-0 right-0 p-6 z-50">
            {user ? (
              <div className="flex items-center gap-3 bg-white/80 backdrop-blur px-4 py-2 rounded-full shadow-sm border border-slate-200">
                 <img src={user.avatar} alt="User" className="w-8 h-8 rounded-full" />
                 <span className="text-sm font-medium text-slate-700">{user.name}</span>
                 <button onClick={logout} className="text-xs text-red-600 hover:underline ml-2">Sign Out</button>
              </div>
            ) : (
              <button 
                onClick={login}
                className="flex items-center gap-2 bg-white px-5 py-2.5 rounded-full shadow-sm border border-slate-200 hover:border-blue-400 transition-colors text-sm font-medium text-slate-700"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/></svg>
                Sign in with Google
              </button>
            )}
          </header>
        )}

        <main className="flex-grow">
          {appState === 'landing' && (
            <Landing 
              onStart={handleStartProcessing} 
              error={error} 
              user={user}
              onLogin={login}
            />
          )}
          
          {appState === 'processing' && (
            <ProcessingPipeline 
              channelName={channelName} 
              dataReady={!!wikiData} 
              onComplete={handleProcessingComplete} 
            />
          )}

          {appState === 'wiki' && wikiData && (
            <WikiLayout 
              data={wikiData} 
              onReset={handleReset}
              user={user}
              onLogin={login}
              onLogout={logout}
            />
          )}
        </main>
      </div>
    </HashRouter>
  );
}