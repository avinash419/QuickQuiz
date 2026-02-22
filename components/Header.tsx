
import React from 'react';

interface HeaderProps {
  onShowTips: () => void;
}

const Header: React.FC<HeaderProps> = ({ onShowTips }) => {
  return (
    <header className="glass border-b border-white/40 sticky top-0 z-50 py-2 md:py-3 px-4 md:px-6 no-print">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-lg md:rounded-xl shadow-lg shadow-blue-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-extrabold text-slate-900 tracking-tight leading-none">QuickQuiz</h1>
            <p className="text-[9px] md:text-[10px] text-blue-600 font-bold uppercase tracking-wider mt-0.5 md:mt-1">AI Study Engine</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 md:gap-4">
          <button 
            onClick={(e) => { e.preventDefault(); onShowTips(); }}
            className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-blue-50 text-blue-700 text-xs md:text-sm font-bold hover:bg-blue-100 transition-all border border-blue-200/50"
          >
            <span className="text-sm md:text-base">💡</span>
            <span className="hidden xs:inline">Tips</span>
            <span className="hidden sm:inline">Study Tips</span>
          </button>
          
          <nav className="hidden md:flex gap-6 text-sm font-semibold text-slate-600 ml-4">
            <a href="#" className="hover:text-blue-600 transition-colors">How it works</a>
            <a href="https://github.com" className="hover:text-blue-600 transition-colors">Feedback</a>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
