
import React from 'react';
import { motion } from 'motion/react';
import { Trophy, Clock, Target, RotateCcw, Home, Share2, Download, CheckCircle2, XCircle, Info } from 'lucide-react';
import { QuizData, QuizResult } from '../types';

interface ResultProps {
  quiz: QuizData;
  result: QuizResult;
  onRetry: () => void;
  onHome: () => void;
}

const Result: React.FC<ResultProps> = ({ quiz, result, onRetry, onHome }) => {
  const scorePercentage = Math.round((result.score / result.total) * 100);
  
  const getFeedback = () => {
    if (scorePercentage >= 90) return { title: "Mastery Achieved!", color: "text-emerald-600", bg: "bg-emerald-50", icon: Trophy };
    if (scorePercentage >= 70) return { title: "Great Progress!", color: "text-blue-600", bg: "bg-blue-50", icon: Target };
    if (scorePercentage >= 50) return { title: "Getting There!", color: "text-amber-600", bg: "bg-amber-50", icon: Target };
    return { title: "Keep Practicing!", color: "text-rose-600", bg: "bg-rose-50", icon: Target };
  };

  const feedback = getFeedback();
  const Icon = feedback.icon;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'QuickQuiz Result',
          text: `I scored ${result.score}/${result.total} on the ${quiz.title} quiz! Try it on QuickQuiz.`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 md:px-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-[3rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] border border-slate-200/60 overflow-hidden mb-12"
      >
        <div className="p-10 md:p-20 text-center">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={`w-24 h-24 md:w-32 md:h-32 ${feedback.bg} rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-xl shadow-slate-200/50`}
          >
            <Icon className={`w-12 h-12 md:w-16 md:h-16 ${feedback.color}`} />
          </motion.div>

          <h2 className={`text-3xl md:text-6xl font-black mb-4 font-display ${feedback.color}`}>{feedback.title}</h2>
          <p className="text-slate-500 text-lg md:text-2xl font-bold mb-12">You scored {result.score} out of {result.total} questions correctly.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="bg-slate-50 p-8 rounded-[2rem] border-2 border-slate-100/50">
              <div className="flex items-center justify-center gap-3 mb-3 text-slate-400">
                <Target className="w-5 h-5" />
                <span className="font-black text-xs uppercase tracking-widest">Accuracy</span>
              </div>
              <div className="text-4xl font-black text-slate-900 font-display">{scorePercentage}%</div>
            </div>
            <div className="bg-slate-50 p-8 rounded-[2rem] border-2 border-slate-100/50">
              <div className="flex items-center justify-center gap-3 mb-3 text-slate-400">
                <Clock className="w-5 h-5" />
                <span className="font-black text-xs uppercase tracking-widest">Time Taken</span>
              </div>
              <div className="text-4xl font-black text-slate-900 font-display">{formatTime(result.timeTaken)}</div>
            </div>
            <div className="bg-slate-50 p-8 rounded-[2rem] border-2 border-slate-100/50">
              <div className="flex items-center justify-center gap-3 mb-3 text-slate-400">
                <Trophy className="w-5 h-5" />
                <span className="font-black text-xs uppercase tracking-widest">Points</span>
              </div>
              <div className="text-4xl font-black text-slate-900 font-display">{result.score * 10}</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={onRetry}
              className="px-10 py-6 bg-blue-600 text-white font-black rounded-3xl hover:bg-blue-700 transition-all shadow-2xl shadow-blue-500/20 active:scale-95 flex items-center justify-center gap-3 text-xl"
            >
              <RotateCcw className="w-6 h-6" />
              Try Again
            </button>
            <button 
              onClick={onHome}
              className="px-10 py-6 bg-slate-900 text-white font-black rounded-3xl hover:bg-slate-800 transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-3 text-xl"
            >
              <Home className="w-6 h-6" />
              Back to Home
            </button>
            <button 
              onClick={handleShare}
              className="px-10 py-6 bg-slate-100 text-slate-600 font-black rounded-3xl hover:bg-slate-200 transition-all active:scale-95 flex items-center justify-center gap-3 text-xl"
            >
              <Share2 className="w-6 h-6" />
              Share
            </button>
          </div>
        </div>
      </motion.div>

      {/* Review Section */}
      <div className="space-y-8">
        <div className="flex items-center justify-between px-4">
          <h3 className="text-2xl md:text-4xl font-black text-slate-900 font-display">Review Answers</h3>
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-2 text-slate-400 hover:text-slate-900 font-black text-xs uppercase tracking-widest transition-all no-print"
          >
            <Download className="w-4 h-4" />
            Save as PDF
          </button>
        </div>

        {quiz.questions.map((q, idx) => {
          const isCorrect = result.answers[idx] === q.correctAnswer;
          return (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`bg-white p-8 md:p-12 rounded-[2.5rem] border-2 ${isCorrect ? 'border-emerald-100' : 'border-rose-100'} shadow-sm relative overflow-hidden`}
            >
              <div className="absolute top-0 right-0 p-8 opacity-10">
                {isCorrect ? <CheckCircle2 className="w-16 h-16 text-emerald-500" /> : <XCircle className="w-16 h-16 text-rose-500" />}
              </div>

              <div className="flex items-center gap-4 mb-6">
                <span className={`w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-black ${isCorrect ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                  {idx + 1}
                </span>
                <h4 className="text-xl md:text-2xl font-black text-slate-900 leading-tight pr-12">{q.question}</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {q.options.map((opt, oIdx) => {
                  const isSelected = result.answers[idx] === oIdx;
                  const isCorrectOpt = q.correctAnswer === oIdx;
                  
                  let className = "p-5 rounded-2xl border-2 font-bold text-sm md:text-base flex items-center gap-3 ";
                  if (isCorrectOpt) className += "border-emerald-500 bg-emerald-50 text-emerald-900";
                  else if (isSelected) className += "border-rose-500 bg-rose-50 text-rose-900";
                  else className += "border-slate-50 bg-slate-50 text-slate-400";

                  return (
                    <div key={oIdx} className={className}>
                      <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs border-2 ${isCorrectOpt ? 'bg-emerald-500 text-white border-emerald-500' : isSelected ? 'bg-rose-500 text-white border-rose-500' : 'bg-white text-slate-300 border-slate-100'}`}>
                        {String.fromCharCode(65 + oIdx)}
                      </span>
                      {opt}
                    </div>
                  );
                })}
              </div>

              <div className="bg-slate-50 p-6 md:p-8 rounded-3xl border border-slate-100 relative">
                <div className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-widest mb-3">
                  <Info className="w-3.5 h-3.5" />
                  Explanation
                </div>
                <p className="text-slate-600 text-base md:text-lg font-medium leading-relaxed">
                  {q.explanation}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Conclusion Article */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-16 bg-slate-900 text-white p-10 md:p-20 rounded-[3rem] shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10">
          <h3 className="text-3xl md:text-5xl font-black mb-8 font-display">Summary & Key Takeaways</h3>
          <div className="prose prose-invert prose-lg max-w-none">
            <p className="text-slate-300 text-lg md:text-xl leading-relaxed font-medium whitespace-pre-wrap">
              {quiz.conclusionArticle}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Result;
