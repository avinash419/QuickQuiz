
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GraduationCap, Lightbulb, Menu, X, ArrowRight, BookOpen, Target, Zap, FileText, Sparkles, Clock, ChevronLeft } from 'lucide-react';

interface HeaderProps {
  onShowTips: () => void;
  onShowArticles: () => void;
  onGoHome: () => void;
  onNavigate: (page: string) => void;
  logoUrl?: string;
}

const Header: React.FC<HeaderProps> = ({ onShowTips, onShowArticles, onGoHome, onNavigate, logoUrl }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { label: "Home", action: onGoHome },
    { label: "GK Quiz", action: () => onNavigate("GK_QUIZ") },
    { label: "Science Quiz", action: () => onNavigate("SCIENCE_QUIZ") },
    { label: "History Quiz", action: () => onNavigate("HISTORY_QUIZ") },
    { label: "Blog", action: onShowArticles },
    { label: "About", action: () => onNavigate("ABOUT") },
    { label: "Contact", action: () => onNavigate("CONTACT") }
  ];

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  return (
    <header className="glass border-b border-slate-200/60 sticky top-0 z-50 py-3 px-4 md:px-6 no-print">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div 
          className="flex items-center gap-2 sm:gap-3 cursor-pointer group shrink-0"
          onClick={() => { onGoHome(); setIsMenuOpen(false); }}
        >
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-2 sm:p-2.5 rounded-xl shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-all duration-300 group-hover:rotate-3 overflow-hidden flex items-center justify-center">
            {logoUrl ? (
              <img src={logoUrl} alt="QuickQuiz Logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
            ) : (
              <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            )}
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-none font-display">QuickQuiz</h1>
            <p className="text-[8px] sm:text-[10px] text-blue-600 font-black uppercase tracking-[0.2em] mt-0.5 sm:mt-1">AI Study Engine</p>
          </div>
        </div>

        <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-sm font-bold text-slate-600">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={(e) => { e.preventDefault(); item.action(); }}
              className="px-4 py-2 rounded-lg hover:bg-slate-100 hover:text-blue-600 transition-all duration-200"
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <button 
            onClick={(e) => { e.preventDefault(); onShowTips(); }}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-blue-50 text-blue-700 text-xs sm:text-sm font-black hover:bg-blue-100 transition-all border border-blue-200/50 shadow-sm shadow-blue-500/5"
          >
            <Lightbulb className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline">Study Tips</span>
          </button>
          
          <button 
            className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors relative z-[100]"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[60] lg:hidden"
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 h-[100dvh] w-[300px] bg-white z-[70] lg:hidden shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <span className="font-black text-slate-900 tracking-tight">Navigation</span>
                <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
              <div className="p-4 flex-grow overflow-y-auto">
                {navItems.map((item, index) => (
                  <motion.button
                    key={item.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => { item.action(); setIsMenuOpen(false); }}
                    className="w-full text-left px-5 py-4 rounded-2xl font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-all mb-2 flex items-center justify-between group"
                  >
                    {item.label}
                    <ArrowRight className="w-4 h-4 opacity-40 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                  </motion.button>
                ))}
              </div>
              <div className="p-6 border-t border-slate-100 bg-slate-50">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">© 2026 QuickQuiz AI</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
