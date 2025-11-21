import React, { useState } from 'react';
import { WikiEntry, AuthUser } from '../types';
import { Share2, Bookmark, Youtube, Link as LinkIcon, Check, Mail, Twitter, Linkedin } from 'lucide-react';

interface ArticleViewProps {
  entry: WikiEntry;
  channelName: string;
  user: AuthUser | null;
  onLogin: () => void;
}

export const ArticleView: React.FC<ArticleViewProps> = ({ entry, channelName, user, onLogin }) => {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const currentUrl = window.location.href;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}#article=${entry.id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    setShowShareMenu(false);
  };

  const handleShareClick = () => {
    setShowShareMenu(!showShareMenu);
  };

  const handleSocialShare = (platform: 'twitter' | 'linkedin' | 'email') => {
    const text = `Check out this encyclopaedia entry for "${entry.title}" from ${channelName}`;
    const url = currentUrl;
    
    let shareUrl = '';
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${encodeURIComponent(entry.title)}&body=${encodeURIComponent(text + '\n\n' + entry.summary + '\n\n' + url)}`;
        break;
    }
    
    if (platform === 'email') {
      window.location.href = shareUrl;
    } else {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
    setShowShareMenu(false);
  };

  const handleSave = () => {
    if (!user) {
      onLogin();
      return;
    }
    setSaved(!saved);
  };

  return (
    <article className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden relative">
      <div className="h-32 bg-gradient-to-r from-slate-800 to-blue-900 relative">
        <div className="absolute -bottom-6 left-8">
           <div className="h-16 w-16 bg-white rounded-lg shadow-md flex items-center justify-center text-2xl border-2 border-white">
              📚
           </div>
        </div>
      </div>

      <div className="p-8 pt-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-2">{entry.title}</h1>
            <div className="flex items-center gap-3 text-sm text-slate-500 flex-wrap">
               <span>From channel <strong className="text-slate-700">{channelName}</strong></span>
               <span>•</span>
               <span>Published {entry.publishDate}</span>
               <span>•</span>
               <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">{entry.category}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 relative">
             <button 
               onClick={handleSave}
               className={`p-2.5 rounded-full border transition-colors ${saved ? 'bg-yellow-50 border-yellow-400 text-yellow-600' : 'bg-white border-slate-200 text-slate-400 hover:border-blue-400 hover:text-blue-600'}`}
               title={user ? (saved ? "Remove from Library" : "Save to Library") : "Login to Save"}
             >
                <Bookmark fill={saved ? "currentColor" : "none"} size={20} />
             </button>
             
             <div className="relative">
               <button 
                 onClick={handleShareClick}
                 className={`p-2.5 rounded-full border transition-colors ${showShareMenu ? 'bg-blue-50 border-blue-400 text-blue-600' : 'bg-white border-slate-200 text-slate-400 hover:border-green-400 hover:text-green-600'}`}
                 title="Share Page"
               >
                  <Share2 size={20} />
               </button>

               {/* Share Menu */}
               {showShareMenu && (
                 <div className="absolute right-0 top-12 w-48 bg-white rounded-lg shadow-xl border border-slate-200 z-20 animate-fade-in p-2">
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 px-2">Share via</div>
                    <button onClick={handleCopyLink} className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-md flex items-center gap-3 text-slate-600 transition-colors">
                      {copied ? <Check size={16} className="text-green-600"/> : <LinkIcon size={16}/>}
                      <span className="text-sm">{copied ? 'Copied!' : 'Copy Link'}</span>
                    </button>
                    <button onClick={() => handleSocialShare('email')} className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-md flex items-center gap-3 text-slate-600 transition-colors">
                      <Mail size={16}/>
                      <span className="text-sm">Email</span>
                    </button>
                    <button onClick={() => handleSocialShare('twitter')} className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-md flex items-center gap-3 text-slate-600 transition-colors">
                      <Twitter size={16}/>
                      <span className="text-sm">Twitter / X</span>
                    </button>
                    <button onClick={() => handleSocialShare('linkedin')} className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-md flex items-center gap-3 text-slate-600 transition-colors">
                      <Linkedin size={16}/>
                      <span className="text-sm">LinkedIn</span>
                    </button>
                 </div>
               )}
             </div>

             <a 
               href={`https://youtube.com`} // Dummy link for demo
               target="_blank" 
               rel="noopener noreferrer"
               className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-full text-sm font-medium transition-colors shadow-sm"
             >
                <Youtube size={18} />
                Watch
             </a>
          </div>
        </div>

        {/* Summary Box */}
        <div className="bg-slate-50 border-l-4 border-blue-500 p-6 rounded-r-lg mb-8">
           <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-2">Encyclopaedia Summary</h3>
           <p className="text-slate-700 leading-relaxed">{entry.summary}</p>
        </div>

        {/* Main Content */}
        <div className="prose prose-slate max-w-none font-serif mb-10">
           {entry.fullContent.split('\n').map((para, i) => (
             <p key={i} className="mb-4 leading-7 text-slate-800 text-lg">{para}</p>
           ))}
        </div>

        {/* Entities / Knowledge Graph Node */}
        <div className="border-t border-slate-200 pt-8">
           <h3 className="font-sans font-bold text-slate-900 mb-4">Extracted Entities & Keywords</h3>
           <div className="flex flex-wrap gap-3">
              {entry.entities.map((ent, idx) => (
                <div key={idx} className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-md shadow-sm hover:border-blue-300 transition-colors">
                   <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                   <span className="text-sm font-medium text-slate-700">{ent.name}</span>
                   <span className="text-xs text-slate-400 ml-1 border-l border-slate-200 pl-2">{ent.type}</span>
                </div>
              ))}
           </div>
        </div>
      </div>
    </article>
  );
};