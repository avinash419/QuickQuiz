
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Brain, Calendar, MessageSquare, Timer, Shuffle, Sparkles } from 'lucide-react';

interface StudyTipsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const tips = [
  {
    title: "Active Recall",
    icon: <Brain className="w-8 h-8" />,
    color: "from-purple-500 to-indigo-600",
    description: "Testing yourself is the most efficient way to store information in long-term memory. Don't just re-read; reconstruct the information from scratch in your mind."
  },
  {
    title: "Spaced Repetition",
    icon: <Calendar className="w-8 h-8" />,
    color: "from-blue-500 to-cyan-500",
    description: "Review material at increasing intervals (1 day, 1 week, 1 month). This combats the 'forgetting curve' and ensures knowledge sticks long-term."
  },
  {
    title: "Feynman Technique",
    icon: <MessageSquare className="w-8 h-8" />,
    color: "from-orange-500 to-rose-500",
    description: "Try explaining a complex concept to someone else in simple terms. If you struggle to explain it simply, you've found a gap in your own understanding."
  },
  {
    title: "Pomodoro Focus",
    icon: <Timer className="w-8 h-8" />,
    color: "from-rose-500 to-red-600",
    description: "Study in blocks of 25 minutes, followed by a 5-minute break. This keeps your brain fresh and prevents the 'mental fog' that comes with marathons."
  },
  {
    title: "Interleaving",
    icon: <Shuffle className="w-8 h-8" />,
    color: "from-emerald-500 to-teal-600",
    description: "Mix different topics in a single study session. This forces your brain to work harder to differentiate concepts, resulting in deeper neural connections."
  }
];

const StudyTipsModal: React.FC<StudyTipsModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-8 bg-slate-950/90 backdrop-blur-2xl" onClick={onClose}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            className="bg-white md:rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] max-w-4xl w-full h-full md:h-auto md:max-h-[85vh] overflow-hidden flex flex-col border border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 md:p-12 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
                  <Sparkles className="w-4 h-4 md:w-6 md:h-6 text-blue-600" />
                  <span className="text-blue-600 font-black text-[8px] md:text-[10px] uppercase tracking-[0.4em]">Learning Science</span>
                </div>
                <h2 className="text-2xl md:text-5xl font-black text-slate-900 tracking-tight font-display">Master Study Habits</h2>
              </div>
              <button 
                onClick={onClose}
                className="p-2.5 md:p-4 hover:bg-slate-100 rounded-xl md:rounded-3xl transition-all text-slate-400 hover:text-slate-900 group border border-slate-200"
              >
                <X className="w-5 h-5 md:w-8 md:h-8 group-hover:rotate-90 transition-transform" />
              </button>
            </div>
            
            <div className="overflow-y-auto p-6 md:p-12 space-y-6 md:space-y-8">
              {tips.map((tip, index) => (
                <motion.div 
                  key={index} 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex flex-col sm:flex-row gap-4 md:gap-8 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] hover:bg-slate-50 transition-all border-2 border-transparent hover:border-slate-100 group"
                >
                  <div className={`flex-shrink-0 bg-gradient-to-br ${tip.color} w-14 h-14 md:w-20 md:h-20 rounded-2xl md:rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-blue-500/20 group-hover:scale-110 transition-transform group-hover:rotate-6 [&>svg]:w-6 [&>svg]:h-6 md:[&>svg]:w-8 md:[&>svg]:h-8`}>
                    {tip.icon}
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-2 md:mb-3 font-display">{tip.title}</h3>
                    <p className="text-slate-600 leading-relaxed font-medium text-base md:text-xl">{tip.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="p-6 md:p-12 border-t border-slate-100 bg-white flex justify-center">
              <button 
                onClick={onClose}
                className="w-full md:w-auto px-10 md:px-16 py-4 md:py-6 bg-slate-900 text-white font-black rounded-xl md:rounded-[2rem] hover:bg-slate-800 transition-all shadow-2xl active:scale-95 text-lg md:text-xl"
              >
                I'm Ready to Learn
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default StudyTipsModal;
