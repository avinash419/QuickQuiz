
import React from 'react';
import { Quiz, QuizResult } from '../types';
import { motion } from 'motion/react';
import { Trophy, RotateCcw, Plus, Download, Printer, CheckCircle2, XCircle, Info, FileJson, Table } from 'lucide-react';

interface ResultViewProps {
  quiz: Quiz;
  result: QuizResult;
  onRetake: () => void;
  onNew: () => void;
}

const ResultView: React.FC<ResultViewProps> = ({ quiz, result, onRetake, onNew }) => {
  const percentage = Math.round((result.score / result.total) * 100);

  const getExportData = (format: 'json' | 'csv') => {
    if (format === 'json') {
      const data = JSON.stringify({ quiz, result }, null, 2);
      const blob = new Blob([data], { type: 'application/json' });
      return URL.createObjectURL(blob);
    } else {
      const headers = ['Question', 'User Answer', 'Correct Answer', 'Status'];
      const rows = quiz.questions.map((q, idx) => [
        q.question,
        q.options[result.answers[idx]],
        q.options[q.correctAnswer],
        result.answers[idx] === q.correctAnswer ? 'Correct' : 'Incorrect'
      ]);
      const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
      const blob = new Blob([csvContent], { type: 'text/csv' });
      return URL.createObjectURL(blob);
    }
  };

  const handleExport = (format: 'json' | 'csv') => {
    const link = document.createElement('a');
    link.href = getExportData(format);
    link.download = `quiz-results-${new Date().getTime()}.${format}`;
    link.click();
  };

  const getCelebrationMessage = () => {
    if (percentage >= 90) return "Masterful! You're a pro.";
    if (percentage >= 70) return "Great job! Keep learning.";
    if (percentage >= 50) return "Good start! Practice makes perfect.";
    return "Keep going! Review your notes again.";
  };

  return (
    <div className="max-w-5xl mx-auto py-8 md:py-12 px-4 md:px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[2.5rem] md:rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] border border-slate-200/60 overflow-hidden mb-8 md:mb-12"
      >
        <div className="bg-slate-900 p-8 md:p-20 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-indigo-600/20 to-violet-600/20 opacity-50"></div>
          <div className="absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-blue-500/10 rounded-full blur-[80px] md:blur-[120px]"></div>
          
          <div className="relative z-10">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 12, delay: 0.2 }}
              className="inline-flex p-4 md:p-5 bg-white/10 backdrop-blur-2xl rounded-2xl md:rounded-3xl mb-6 md:mb-10 border border-white/20 shadow-2xl"
            >
               <Trophy className="w-10 h-10 md:w-12 md:h-12 text-blue-400" />
            </motion.div>
            <h2 className="text-3xl md:text-6xl font-black mb-4 md:mb-6 tracking-tight leading-tight font-display">{getCelebrationMessage()}</h2>
            <p className="text-blue-200/80 text-lg md:text-xl font-medium max-w-2xl mx-auto">Practice complete. Here's your performance summary.</p>
            
            <div className="mt-12 md:mt-16 flex flex-wrap justify-center gap-4 md:gap-8">
              {[
                { label: 'Score', value: `${result.score}/${result.total}`, color: 'bg-white/5 border-white/10' },
                { label: 'Accuracy', value: `${percentage}%`, color: 'bg-white/5 border-white/10' },
                { label: 'Time', value: `${Math.floor(result.timeTaken / 60)}m ${result.timeTaken % 60}s`, color: 'bg-white/5 border-white/10' }
              ].map((stat, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className={`backdrop-blur-md px-6 md:px-10 py-6 md:py-8 rounded-[2rem] md:rounded-[2.5rem] border ${stat.color} flex-grow md:flex-none min-w-[140px] md:min-w-[180px]`}
                >
                  <span className="block text-3xl md:text-4xl font-black mb-1 md:mb-2 font-display tracking-tight">{stat.value}</span>
                  <span className="text-[8px] md:text-[10px] uppercase font-black tracking-[0.3em] text-blue-400">{stat.label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-8 md:p-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-20">
            <div className="lg:col-span-7 space-y-12 md:space-y-16">
              <div>
                <h3 className="text-lg md:text-xl font-black text-slate-900 mb-6 md:mb-8 flex items-center gap-3 md:gap-4 font-display">
                  <div className="w-1.5 md:w-2 h-6 md:h-8 bg-blue-600 rounded-full"></div>
                  Topic Summary
                </h3>
                <div className="bg-slate-50 p-8 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 relative group hover:bg-white hover:shadow-xl transition-all duration-500">
                  <div className="absolute -top-3 -left-3 md:-top-4 md:-left-4 w-10 h-10 md:w-12 md:h-12 bg-white rounded-xl md:rounded-2xl shadow-lg flex items-center justify-center text-xl md:text-2xl border border-slate-100">📝</div>
                  <p className="text-slate-600 text-base md:text-xl leading-relaxed font-medium italic">
                    "{quiz.notesSummary}"
                  </p>
                </div>
              </div>
              
              {quiz.weakAreas && quiz.weakAreas.length > 0 && (
                <div>
                  <h3 className="text-lg md:text-xl font-black text-slate-900 mb-6 md:mb-8 flex items-center gap-3 md:gap-4 font-display">
                    <div className="w-1.5 md:w-2 h-6 md:h-8 bg-rose-500 rounded-full"></div>
                    Boost these areas
                  </h3>
                  <div className="flex flex-wrap gap-2 md:gap-3">
                    {quiz.weakAreas.map((area, idx) => (
                      <span key={idx} className="px-4 md:px-6 py-2.5 md:py-3.5 bg-white text-rose-600 text-xs md:text-sm font-black rounded-xl md:rounded-2xl border-2 border-rose-50 shadow-sm hover:border-rose-200 transition-colors">
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-5 flex flex-col justify-center gap-6 md:gap-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button 
                  onClick={onRetake}
                  className="p-6 md:p-8 bg-slate-900 text-white font-black rounded-[2rem] md:rounded-[2.5rem] hover:bg-slate-800 transition-all shadow-2xl flex flex-col items-center gap-3 md:gap-4 group active:scale-95"
                >
                  <div className="p-3 md:p-4 bg-white/10 rounded-xl md:rounded-2xl group-hover:scale-110 transition-transform group-hover:rotate-12">
                    <RotateCcw className="w-6 h-6 md:w-7 md:h-7" />
                  </div>
                  <span className="text-base md:text-lg">Retake Quiz</span>
                </button>
                <button 
                  onClick={onNew}
                  className="p-6 md:p-8 bg-blue-600 text-white font-black rounded-[2rem] md:rounded-[2.5rem] hover:bg-blue-700 transition-all shadow-2xl flex flex-col items-center gap-3 md:gap-4 group active:scale-95"
                >
                   <div className="p-3 md:p-4 bg-white/10 rounded-xl md:rounded-2xl group-hover:scale-110 transition-transform group-hover:-rotate-12">
                    <Plus className="w-6 h-6 md:w-7 md:h-7" />
                  </div>
                  <span className="text-base md:text-lg">New Practice</span>
                </button>
              </div>

              <div className="mt-6 md:mt-8 pt-8 md:pt-12 border-t border-slate-100">
                <h4 className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 md:mb-8 text-center">Mastery Toolkit</h4>
                <div className="grid grid-cols-3 gap-3 md:gap-4">
                  {[
                    { format: 'json', label: 'JSON', icon: <FileJson className="w-5 h-5 md:w-6 md:h-6" /> },
                    { format: 'csv', label: 'CSV', icon: <Table className="w-5 h-5 md:w-6 md:h-6" /> },
                    { format: 'print', label: 'Print', icon: <Printer className="w-5 h-5 md:w-6 md:h-6" /> }
                  ].map((btn, i) => (
                    <button 
                      key={i}
                      onClick={() => btn.format === 'print' ? window.print() : handleExport(btn.format as any)}
                      className="py-4 md:py-6 px-2 md:px-4 border-2 border-slate-50 rounded-[1.5rem] md:rounded-[2rem] font-black text-slate-700 hover:bg-slate-50 hover:border-slate-200 transition-all flex flex-col items-center gap-2 md:gap-3 text-[10px] md:text-xs active:scale-95 shadow-sm"
                    >
                      <div className="text-blue-600">{btn.icon}</div>
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="bg-white rounded-[2.5rem] md:rounded-[3rem] shadow-2xl border border-slate-200/60 p-8 md:p-20 no-print">
        <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-10 md:mb-16 font-display text-center">Review your journey</h3>
        <div className="space-y-6 md:space-y-8">
          {quiz.questions.map((q, idx) => {
            const isCorrect = result.answers[idx] === q.correctAnswer;
            return (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`p-6 md:p-12 rounded-[2rem] md:rounded-[3rem] border-2 transition-all duration-500 ${isCorrect ? 'border-emerald-50 bg-emerald-50/30' : 'border-rose-50 bg-rose-50/30'}`}
              >
                <div className="flex flex-col md:flex-row items-start gap-6 md:gap-8">
                  <div className={`flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center text-base md:text-lg font-black text-white shadow-lg ${isCorrect ? 'bg-emerald-500 shadow-emerald-500/20' : 'bg-rose-500 shadow-rose-500/20'}`}>
                    {idx + 1}
                  </div>
                  <div className="flex-grow w-full">
                    <h4 className="text-xl md:text-3xl font-black text-slate-900 mb-8 md:mb-10 font-display leading-tight">{q.question}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-8 md:mb-10">
                      {q.options.map((opt, optIdx) => {
                        let optStyle = "p-4 md:p-5 rounded-xl md:rounded-2xl text-sm md:text-base border-2 font-bold flex items-center gap-3 md:gap-4 transition-all ";
                        if (optIdx === q.correctAnswer) optStyle += "bg-emerald-100 border-emerald-300 text-emerald-900 shadow-sm";
                        else if (optIdx === result.answers[idx]) optStyle += "bg-rose-100 border-rose-300 text-rose-900 shadow-sm";
                        else optStyle += "bg-white border-slate-100 text-slate-400";
                        return (
                          <div key={optIdx} className={optStyle}>
                             <span className="text-[9px] md:text-[10px] font-black opacity-30 uppercase tracking-widest">{String.fromCharCode(65 + optIdx)}</span>
                             {opt}
                          </div>
                        );
                      })}
                    </div>
                    <div className="bg-white/60 backdrop-blur-sm p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-slate-200/50 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 md:p-6 opacity-5">
                        <Info className="w-12 h-12 md:w-16 md:h-16" />
                      </div>
                      <p className="text-slate-700 text-base md:text-lg leading-relaxed font-medium">
                        <span className="font-black text-slate-900 mr-2 md:mr-3 uppercase text-[10px] md:text-xs tracking-widest">AI Insight:</span>
                        {q.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ResultView;
