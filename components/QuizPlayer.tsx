
import React, { useState, useEffect } from 'react';
import { Quiz, QuizResult } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Timer, CheckCircle2, XCircle, ArrowRight, Info } from 'lucide-react';

interface QuizPlayerProps {
  quiz: Quiz;
  onFinish: (result: QuizResult) => void;
  onExit: () => void;
}

const QuizPlayer: React.FC<QuizPlayerProps> = ({ quiz, onFinish, onExit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(new Array(quiz.questions.length).fill(-1));
  const [isAnswered, setIsAnswered] = useState(false);
  const [timer, setTimer] = useState(0);

  const currentQuestion = quiz.questions[currentIndex];
  const progress = ((currentIndex + 1) / quiz.questions.length) * 100;

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    const newAnswers = [...selectedAnswers];
    newAnswers[currentIndex] = idx;
    setSelectedAnswers(newAnswers);
  };

  const handleConfirm = () => {
    setIsAnswered(true);
  };

  const handleNext = () => {
    if (currentIndex < quiz.questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsAnswered(false);
    } else {
      const correctCount = selectedAnswers.reduce((acc, ans, idx) => {
        return ans === quiz.questions[idx].correctAnswer ? acc + 1 : acc;
      }, 0);
      onFinish({
        score: correctCount,
        total: quiz.questions.length,
        answers: selectedAnswers,
        timeTaken: timer
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto py-6 md:py-12 px-4 md:px-6">
      <div className="mb-8 md:mb-10 flex flex-wrap gap-3 md:gap-4 justify-between items-center no-print">
        <button 
          onClick={onExit}
          className="px-4 md:px-5 py-2 md:py-2.5 flex items-center gap-2 text-slate-500 hover:text-rose-600 transition-all font-black text-[10px] md:text-xs uppercase tracking-widest bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md"
        >
          <ArrowLeft className="w-3.5 h-3.5 md:w-4 md:h-4" />
          Quit
        </button>
        
        <div className="flex items-center gap-2 md:gap-3">
          <div className="flex items-center gap-2 bg-white px-4 md:px-5 py-2 md:py-2.5 border border-slate-200 rounded-xl shadow-sm text-[10px] md:text-xs font-black text-slate-700">
            <Timer className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-600" />
            {formatTime(timer)}
          </div>
          <div className="bg-slate-900 px-4 md:px-5 py-2 md:py-2.5 rounded-xl shadow-lg text-[10px] md:text-xs font-black text-white tracking-widest">
            {currentIndex + 1} / {quiz.questions.length}
          </div>
        </div>
      </div>

      <div className="w-full h-2.5 md:h-3 bg-slate-100 rounded-full mb-8 md:mb-12 overflow-hidden shadow-inner p-0.5">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 rounded-full" 
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-white rounded-[2rem] md:rounded-[3rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] border border-slate-200/60 overflow-hidden"
        >
          <div className="p-6 md:p-16">
            <h3 className="text-xl md:text-4xl font-black text-slate-900 mb-8 md:mb-12 leading-tight font-display">
              {currentQuestion.question}
            </h3>

            <div className="grid grid-cols-1 gap-3 md:gap-4 mb-8 md:mb-12">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = selectedAnswers[currentIndex] === idx;
                const isCorrect = currentQuestion.correctAnswer === idx;
                
                let classes = "w-full p-5 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border-2 text-left transition-all duration-300 font-bold relative flex items-center gap-4 md:gap-5 ";
                
                if (isAnswered) {
                  if (isCorrect) classes += "border-emerald-500 bg-emerald-50 text-emerald-900 ring-8 ring-emerald-500/5";
                  else if (isSelected) classes += "border-rose-500 bg-rose-50 text-rose-900 ring-8 ring-rose-500/5";
                  else classes += "border-slate-50 bg-slate-50 text-slate-300";
                } else {
                  classes += isSelected 
                     ? "border-blue-600 bg-blue-50 text-blue-900 shadow-xl -translate-y-1" 
                     : "border-slate-100 bg-white hover:border-blue-200 text-slate-700 hover:bg-slate-50/50 hover:shadow-lg";
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => handleSelect(idx)}
                    className={classes}
                  >
                    <span className={`flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-xl md:rounded-2xl flex items-center justify-center text-xs md:text-sm border-2 transition-colors ${
                      isSelected ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-400 border-slate-100'
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="flex-grow text-base md:text-xl">{option}</span>
                    {isAnswered && (isCorrect || isSelected) && (
                      <motion.span 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex-shrink-0"
                      >
                        {isCorrect ? (
                          <CheckCircle2 className="w-6 h-6 md:w-8 md:h-8 text-emerald-500" />
                        ) : (
                          <XCircle className="w-6 h-6 md:w-8 md:h-8 text-rose-500" />
                        )}
                      </motion.span>
                    )}
                  </button>
                );
              })}
            </div>

            <AnimatePresence>
              {isAnswered && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-blue-50/50 border-2 border-blue-100/50 p-6 md:p-10 rounded-[1.5rem] md:rounded-[2.5rem] mb-8 md:mb-12 relative overflow-hidden"
                >
                   <div className="absolute top-0 right-0 p-4 md:p-6 opacity-5">
                     <Info className="w-16 h-16 md:w-24 md:h-24" />
                   </div>
                   <h4 className="font-black text-blue-900 text-[8px] md:text-[10px] uppercase tracking-[0.3em] mb-3 md:mb-4">AI Deep Explanation</h4>
                   <p className="text-slate-700 leading-relaxed text-base md:text-xl font-medium">{currentQuestion.explanation}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex flex-col sm:flex-row justify-between items-center border-t border-slate-100 pt-8 md:pt-10 gap-6 md:gap-8">
               <div className="text-slate-400 font-bold text-xs md:text-sm px-2 text-center sm:text-left">
                 Take your time, accuracy matters most.
               </div>
               
               <div className="w-full sm:w-auto">
                 {!isAnswered ? (
                    <button
                      disabled={selectedAnswers[currentIndex] === -1}
                      onClick={handleConfirm}
                      className={`w-full sm:w-auto px-10 md:px-12 py-4 md:py-5 rounded-xl md:rounded-2xl font-black text-lg md:text-xl transition-all ${
                        selectedAnswers[currentIndex] === -1 
                          ? 'bg-slate-100 text-slate-400' 
                          : 'bg-blue-600 text-white hover:bg-blue-700 shadow-2xl shadow-blue-500/20 transform active:scale-95'
                      }`}
                    >
                      Verify Answer
                    </button>
                  ) : (
                    <button
                      onClick={handleNext}
                      className="w-full sm:w-auto px-10 md:px-12 py-4 md:py-5 rounded-xl md:rounded-2xl bg-slate-900 text-white font-black hover:bg-slate-800 transition-all flex items-center justify-center gap-4 shadow-2xl transform active:scale-95 text-lg md:text-xl"
                    >
                      {currentIndex === quiz.questions.length - 1 ? 'Show Results' : 'Next Question'}
                      <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
                    </button>
                  )}
               </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default QuizPlayer;
