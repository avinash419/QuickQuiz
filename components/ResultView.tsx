
import React from 'react';
import { Quiz, QuizResult } from '../types';

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
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="bg-white rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] border border-slate-50 overflow-hidden mb-12">
        <div className="bg-gradient-to-br from-slate-900 to-blue-900 p-12 md:p-16 text-center text-white relative">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          
          <div className="relative z-10">
            <div className="inline-block p-4 bg-white/10 backdrop-blur-xl rounded-full mb-8 border border-white/20 animate-float">
               <svg className="w-12 h-12 text-blue-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">{getCelebrationMessage()}</h2>
            <p className="text-blue-200/80 text-xl font-medium">Practice complete. Here's your performance summary.</p>
            
            <div className="mt-14 flex flex-wrap justify-center gap-6">
              {[
                { label: 'Score', value: `${result.score}/${result.total}`, color: 'bg-white/10 border-white/20' },
                { label: 'Accuracy', value: `${percentage}%`, color: 'bg-white/10 border-white/20' },
                { label: 'Time', value: `${Math.floor(result.timeTaken / 60)}m ${result.timeTaken % 60}s`, color: 'bg-white/10 border-white/20' }
              ].map((stat, i) => (
                <div key={i} className={`backdrop-blur-md px-10 py-6 rounded-[2rem] border ${stat.color} min-w-[160px]`}>
                  <span className="block text-3xl font-black mb-1">{stat.value}</span>
                  <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-blue-300">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-10 md:p-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-7">
              <div className="space-y-12">
                <div>
                  <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                    <span className="w-2 h-8 bg-blue-600 rounded-full"></span>
                    Topic Summary
                  </h3>
                  <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 relative group">
                    <div className="absolute -top-4 -left-4 text-4xl opacity-20 rotate-12">📝</div>
                    <p className="text-slate-600 text-lg leading-relaxed font-medium">
                      "{quiz.notesSummary}"
                    </p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                    <span className="w-2 h-8 bg-rose-500 rounded-full"></span>
                    Boost these areas
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {quiz.weakAreas?.map((area, idx) => (
                      <span key={idx} className="px-6 py-3 bg-white text-rose-600 text-sm font-black rounded-2xl border-2 border-rose-50 shadow-sm">
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col justify-center gap-6">
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={onRetake}
                  className="p-6 bg-slate-900 text-white font-black rounded-3xl hover:bg-slate-800 transition-all shadow-xl flex flex-col items-center gap-3 group"
                >
                  <div className="p-3 bg-white/10 rounded-2xl group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                  </div>
                  Retake Quiz
                </button>
                <button 
                  onClick={onNew}
                  className="p-6 bg-blue-600 text-white font-black rounded-3xl hover:bg-blue-700 transition-all shadow-xl flex flex-col items-center gap-3 group"
                >
                   <div className="p-3 bg-white/10 rounded-2xl group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path></svg>
                  </div>
                  New Practice
                </button>
              </div>

              <div className="mt-6 pt-10 border-t border-slate-100">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Mastery Toolkit</h4>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { format: 'json', label: 'JSON', icon: '📄' },
                    { format: 'csv', label: 'CSV', icon: '📊' },
                    { format: 'print', label: 'Print', icon: '🖨️' }
                  ].map((btn, i) => (
                    <button 
                      key={i}
                      onClick={() => btn.format === 'print' ? window.print() : handleExport(btn.format as any)}
                      className="py-4 px-2 border-2 border-slate-50 rounded-2xl font-black text-slate-700 hover:bg-slate-50 hover:border-slate-100 transition-all flex flex-col items-center gap-2 text-xs"
                    >
                      <span className="text-xl">{btn.icon}</span>
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-50 p-10 no-print">
        <h3 className="text-2xl font-black text-slate-900 mb-10">Review your journey</h3>
        <div className="space-y-6">
          {quiz.questions.map((q, idx) => {
            const isCorrect = result.answers[idx] === q.correctAnswer;
            return (
              <div key={idx} className={`p-8 rounded-[2rem] border-2 transition-all hover:scale-[1.01] ${isCorrect ? 'border-emerald-50 bg-emerald-50/20' : 'border-rose-50 bg-rose-50/20'}`}>
                <div className="flex items-start gap-6">
                  <div className={`mt-1 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white ${isCorrect ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                    {idx + 1}
                  </div>
                  <div className="flex-grow">
                    <h4 className="text-xl font-bold text-slate-800 mb-6">{q.question}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                      {q.options.map((opt, optIdx) => {
                        let optStyle = "p-4 rounded-xl text-sm border-2 font-bold flex items-center gap-3 ";
                        if (optIdx === q.correctAnswer) optStyle += "bg-emerald-100 border-emerald-200 text-emerald-900";
                        else if (optIdx === result.answers[idx]) optStyle += "bg-rose-100 border-rose-200 text-rose-900";
                        else optStyle += "bg-white border-slate-50 text-slate-400";
                        return (
                          <div key={optIdx} className={optStyle}>
                             <span className="text-[10px] opacity-50">{String.fromCharCode(65 + optIdx)}</span>
                             {opt}
                          </div>
                        );
                      })}
                    </div>
                    <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-100/50">
                      <p className="text-slate-600 text-sm leading-relaxed">
                        <span className="font-black text-slate-900 mr-2">Why this is correct:</span>
                        {q.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ResultView;
