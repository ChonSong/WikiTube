import React, { useState, useMemo } from 'react';
import { WikiData, WikiEntry, AuthUser } from '../types';
import { Book, Search, BarChart3, LayoutGrid, Menu, X, LogOut, User, Share2, ArrowLeft } from 'lucide-react';
import { ArticleView } from './ArticleView';
import { Dashboard } from './Dashboard';

interface WikiLayoutProps {
  data: WikiData;
  onReset: () => void;
  user: AuthUser | null;
  onLogin: () => void;
  onLogout: () => void;
}

type ViewMode = 'dashboard' | 'article';

export const WikiLayout: React.FC<WikiLayoutProps> = ({ data, onReset, user, onLogin, onLogout }) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [currentEntry, setCurrentEntry] = useState<WikiEntry | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const categories = useMemo(() => {
    const cats = new Set(data.entries.map(e => e.category));
    return ['All', ...Array.from(cats)];
  }, [data]);

  const filteredEntries = useMemo(() => {
    return data.entries.filter(entry => {
      const matchesSearch = entry.title.toLowerCase().includes(search.toLowerCase()) || 
                            entry.summary.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || entry.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [data, search, selectedCategory]);

  const handleEntryClick = (entry: WikiEntry) => {
    setCurrentEntry(entry);
    setViewMode('article');
    setSidebarOpen(false); // Close mobile sidebar on selection
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goHome = () => {
    setViewMode('dashboard');
    setCurrentEntry(null);
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0
      `}>
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2 cursor-pointer" onClick={goHome}>
              <div className="bg-blue-600 text-white p-1.5 rounded-md">
                <Book size={20} />
              </div>
              <span className="font-serif font-bold text-lg text-slate-800">WikiTube</span>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="md:hidden text-slate-500">
              <X size={24} />
            </button>
          </div>

          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search encyclopaedia..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-100 border-transparent focus:bg-white focus:border-blue-500 rounded-lg text-sm transition-all outline-none border"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-1">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2">Categories</div>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedCategory === cat 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}

             <div className="mt-6 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2">Featured Articles</div>
             {data.entries.slice(0, 5).map(entry => (
                 <button
                    key={entry.id}
                    onClick={() => handleEntryClick(entry)}
                    className="w-full text-left px-3 py-2 rounded-md text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900 truncate"
                 >
                    {entry.title}
                 </button>
             ))}
          </nav>

          <div className="p-4 border-t border-slate-200 bg-slate-50">
            {user ? (
              <div className="flex items-center gap-3 mb-3">
                <img src={user.avatar} alt="User" className="w-8 h-8 rounded-full" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{user.name}</p>
                  <p className="text-xs text-slate-500 truncate">Authenticated</p>
                </div>
                <button onClick={onLogout} className="text-slate-400 hover:text-red-600 transition-colors" title="Logout">
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <button 
                onClick={onLogin}
                className="w-full flex items-center justify-center gap-2 bg-white border border-slate-300 text-slate-700 py-2 rounded-lg text-sm hover:bg-slate-50 transition-colors mb-3"
              >
                <User size={16} />
                Sign In
              </button>
            )}
             <button 
                onClick={onReset}
                className="w-full text-xs text-slate-500 hover:text-slate-800 underline text-center"
              >
                Process Another Channel
              </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto h-full relative">
        {/* Mobile Header */}
        <div className="md:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between sticky top-0 z-30">
           <button onClick={() => setSidebarOpen(true)} className="text-slate-600">
             <Menu size={24} />
           </button>
           <span className="font-serif font-bold text-slate-800">WikiTube</span>
           <div className="w-6"></div> {/* Spacer */}
        </div>

        <div className="max-w-5xl mx-auto p-6 md:p-12">
          {viewMode === 'dashboard' ? (
             <>
                <div className="mb-10">
                   <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-2">{data.channelName}</h1>
                   <p className="text-slate-600 leading-relaxed max-w-3xl">{data.channelDescription}</p>
                   <div className="flex gap-4 mt-4 text-sm text-slate-500 font-mono">
                      <span>{data.subscribers} Subscribers</span>
                      <span>•</span>
                      <span>{data.totalVideos} Videos Indexed</span>
                   </div>
                </div>

                {/* Analytics Dashboard */}
                <div className="mb-12">
                   <Dashboard data={data} />
                </div>
                
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <LayoutGrid size={20} className="text-blue-600" />
                    Encyclopaedia Entries
                  </h2>
                  <span className="text-sm text-slate-500">{filteredEntries.length} results</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {filteredEntries.map(entry => (
                     <div 
                        key={entry.id} 
                        onClick={() => handleEntryClick(entry)}
                        className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg hover:border-blue-300 transition-all cursor-pointer group flex flex-col h-full"
                     >
                        <div className="flex justify-between items-start mb-4">
                           <span className="text-xs font-semibold px-2 py-1 bg-slate-100 text-slate-600 rounded">{entry.category}</span>
                           <span className="text-xs text-slate-400">{entry.publishDate}</span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-3 font-serif group-hover:text-blue-700 leading-tight">
                          {entry.title}
                        </h3>
                        <p className="text-sm text-slate-600 line-clamp-3 mb-4 flex-1">
                          {entry.summary}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-auto">
                           {entry.entities.slice(0, 2).map((ent, i) => (
                             <span key={i} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                               #{ent.name}
                             </span>
                           ))}
                        </div>
                     </div>
                   ))}
                </div>
             </>
          ) : (
             // Article View
             currentEntry && (
               <div className="animate-fade-in">
                 <button 
                   onClick={goHome}
                   className="mb-6 flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors"
                 >
                   <ArrowLeft size={18} />
                   Back to Dashboard
                 </button>
                 <ArticleView entry={currentEntry} channelName={data.channelName} user={user} onLogin={onLogin} />
               </div>
             )
          )}
        </div>
      </main>
    </div>
  );
};