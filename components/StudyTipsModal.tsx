
import React from 'react';

interface StudyTipsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const tips = [
  {
    title: "Active Recall",
    icon: "🧠",
    color: "from-purple-500 to-indigo-600",
    description: "Testing yourself is the most efficient way to store information in long-term memory. Don't just re-read; reconstruct the information from scratch in your mind."
  },
  {
    title: "Spaced Repetition",
    icon: "📅",
    color: "from-blue-500 to-cyan-500",
    description: "Review material at increasing intervals (1 day, 1 week, 1 month). This combats the 'forgetting curve' and ensures knowledge sticks long-term."
  },
  {
    title: "Feynman Technique",
    icon: "🗣️",
    color: "from-orange-500 to-rose-500",
    description: "Try explaining a complex concept to someone else in simple terms. If you struggle to explain it simply, you've found a gap in your own understanding."
  },
  {
    title: "Pomodoro Focus",
    icon: "🍅",
    color: "from-rose-500 to-red-600",
    description: "Study in blocks of 25 minutes, followed by a 5-minute break. This keeps your brain fresh and prevents the 'mental fog' that comes with marathons."
  },
  {
    title: "Interleaving",
    icon: "🔀",
    color: "from-emerald-500 to-teal-600",
    description: "Mix different topics in a single study session. This forces your brain to work harder to differentiate concepts, resulting in deeper neural connections."
  }
];

const StudyTipsModal: React.FC<StudyTipsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn" onClick={onClose}>
      <div 
        className="bg-white md:rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] max-w-3xl w-full h-full md:h-auto md:max-h-[90vh] overflow-hidden flex flex-col border border-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 md:p-8 border-b border-slate-50 flex justify-between items-center bg-gradient-to-r from-slate-50 to-white">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Master Study Habits</h2>
            <p className="text-slate-500 font-bold text-[10px] md:text-sm uppercase tracking-widest mt-1">Science-backed learning techniques</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 md:p-3 hover:bg-slate-100 rounded-full transition-all text-slate-400 hover:text-slate-900 group"
          >
            <svg className="w-6 h-6 md:w-8 md:h-8 group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="overflow-y-auto p-6 md:p-8 space-y-4 md:space-y-6">
          {tips.map((tip, index) => (
            <div key={index} className="flex flex-col sm:flex-row gap-4 md:gap-6 p-4 md:p-6 rounded-2xl md:rounded-3xl hover:bg-slate-50/50 transition-all border-2 border-transparent hover:border-slate-50 group">
              <div className={`text-3xl md:text-4xl flex-shrink-0 bg-gradient-to-br ${tip.color} w-16 h-16 md:w-20 md:h-20 rounded-xl md:rounded-2xl flex items-center justify-center text-white shadow-xl group-hover:scale-105 transition-transform`}>
                {tip.icon}
              </div>
              <div className="flex-grow">
                <h3 className="text-lg md:text-xl font-black text-slate-900 mb-1 md:mb-2">{tip.title}</h3>
                <p className="text-slate-600 leading-relaxed font-medium text-sm md:text-base">{tip.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 md:p-8 border-t border-slate-50 bg-slate-50/50 flex justify-center safe-area-bottom">
          <button 
            onClick={onClose}
            className="w-full md:w-auto px-10 py-4 bg-slate-900 text-white font-black rounded-xl md:rounded-2xl hover:bg-slate-800 transition-all shadow-xl active:scale-95"
          >
            I'm Ready to Learn
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudyTipsModal;
