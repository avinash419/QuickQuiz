
import React, { useState, useEffect } from 'react';
import { Quiz, QuizResult } from '../types';

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
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="mb-10 flex flex-wrap gap-4 justify-between items-center no-print">
        <button 
          onClick={onExit}
          className="px-4 py-2 flex items-center gap-2 text-slate-500 hover:text-rose-600 transition-colors font-bold text-sm bg-white rounded-full border border-slate-100 shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Quit Practice
        </button>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white px-4 py-2 border border-slate-100 rounded-full shadow-sm text-xs font-black text-slate-700">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></span>
            {formatTime(timer)}
          </div>
          <div className="bg-slate-900 px-4 py-2 rounded-full shadow-sm text-xs font-black text-white">
            Q {currentIndex + 1} OF {quiz.questions.length}
          </div>
        </div>
      </div>

      <div className="w-full h-3 bg-slate-100 rounded-full mb-12 overflow-hidden shadow-inner p-0.5">
        <div 
          className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-700 ease-out" 
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.06)] border border-slate-50 overflow-hidden">
        <div className="p-8 md:p-12">
          <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-10 leading-snug">
            {currentQuestion.question}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = selectedAnswers[currentIndex] === idx;
              const isCorrect = currentQuestion.correctAnswer === idx;
              
              let classes = "w-full p-6 rounded-3xl border-2 text-left transition-all duration-200 font-bold relative flex items-center gap-4 ";
              
              if (isAnswered) {
                if (isCorrect) classes += "border-emerald-500 bg-emerald-50 text-emerald-900 ring-4 ring-emerald-500/10";
                else if (isSelected) classes += "border-rose-500 bg-rose-50 text-rose-900 ring-4 ring-rose-500/10";
                else classes += "border-slate-50 bg-slate-50 text-slate-300";
              } else {
                classes += isSelected 
                  ? "border-blue-600 bg-blue-50 text-blue-900 shadow-lg -translate-y-1" 
                  : "border-slate-100 bg-white hover:border-blue-200 text-slate-700 hover:bg-slate-50/50 hover:-translate-y-0.5";
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswered}
                  onClick={() => handleSelect(idx)}
                  className={classes}
                >
                  <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs border-2 ${
                    isSelected ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-400 border-slate-100'
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="flex-grow">{option}</span>
                  {isAnswered && (isCorrect || isSelected) && (
                    <span className="flex-shrink-0">
                      {isCorrect ? (
                        <div className="bg-emerald-500 p-1.5 rounded-full text-white">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path></svg>
                        </div>
                      ) : (
                        <div className="bg-rose-500 p-1.5 rounded-full text-white">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </div>
                      )}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {isAnswered && (
            <div className="bg-blue-50/50 border-2 border-blue-100/50 p-8 rounded-[2rem] mb-12 animate-fadeIn relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                 <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
               </div>
               <h4 className="font-black text-blue-900 text-xs uppercase tracking-[0.2em] mb-3">AI Deep Explanation</h4>
               <p className="text-slate-700 leading-relaxed text-lg font-medium">{currentQuestion.explanation}</p>
            </div>
          )}

          <div className="flex justify-between items-center border-t border-slate-50 pt-10">
             <div className="text-slate-400 font-bold text-sm px-2">
               Don't rush, think carefully!
             </div>
             
             {!isAnswered ? (
                <button
                  disabled={selectedAnswers[currentIndex] === -1}
                  onClick={handleConfirm}
                  className={`px-12 py-4 rounded-2xl font-black transition-all ${
                    selectedAnswers[currentIndex] === -1 
                      ? 'bg-slate-100 text-slate-400' 
                      : 'bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-500/20 transform hover:-translate-y-1'
                  }`}
                >
                  Verify Answer
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="px-12 py-4 rounded-2xl bg-slate-900 text-white font-black hover:bg-slate-800 transition-all flex items-center gap-3 shadow-2xl transform hover:-translate-y-1"
                >
                  {currentIndex === quiz.questions.length - 1 ? 'Show My Results' : 'Continue'}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </button>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizPlayer;
