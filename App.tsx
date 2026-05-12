
import React, { useState, useEffect } from 'react';
import Header from './src/components/Header';
import Home from './src/components/Home';
import Quiz from './src/components/Quiz';
import Result from './src/components/Result';
import { QuizData, QuizResult, Difficulty } from './src/types';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, AlertCircle, RefreshCcw } from 'lucide-react';
import { generateQuiz, generateCurrentAffairs, generateRandomQuiz } from './src/services/aiService';

const App: React.FC = () => {
  const [view, setView] = useState<"HOME" | "QUIZ" | "RESULT">("HOME");
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleQuizGenerated = (data: QuizData) => {
    setQuizData(data);
    setView("QUIZ");
    setIsLoading(false);
  };

  const handleGenerate = async (text: string, difficulty: Difficulty, numQuestions: number, language: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await generateQuiz(text, difficulty, numQuestions, language);
      handleQuizGenerated(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate quiz. Please try again.");
      setIsLoading(false);
    }
  };

  const handleCurrentAffairs = async (numQuestions: number, language: string, difficulty: Difficulty) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await generateCurrentAffairs(numQuestions, language, difficulty);
      handleQuizGenerated(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate current affairs quiz.");
      setIsLoading(false);
    }
  };

  const handleNavigate = async (page: string) => {
    const categories = ["GK_QUIZ", "SCIENCE_QUIZ", "HISTORY_QUIZ"];
    const targetPage = page === "RANDOM_SURPRISE" ? categories[Math.floor(Math.random() * categories.length)] : page;

    const categoryMap: Record<string, string> = {
      "GK_QUIZ": "General Knowledge & India Facts",
      "SCIENCE_QUIZ": "General Science & Technology",
      "HISTORY_QUIZ": "Indian & World History"
    };

    if (categoryMap[targetPage]) {
      setIsLoading(true);
      setError(null);
      try {
        const data = await generateRandomQuiz(categoryMap[targetPage], 10, "Hindi", Difficulty.MEDIUM);
        handleQuizGenerated(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : `Failed to generate quiz.`);
        setIsLoading(false);
      }
    } else if (page === "ABOUT" || page === "CONTACT") {
      alert("This page is coming soon! Focus on your studies for now.");
    }
  };

  const handleQuizFinish = (result: QuizResult) => {
    setQuizResult(result);
    setView("RESULT");
  };

  const handleRetry = () => {
    setQuizResult(null);
    setView("QUIZ");
  };

  const handleHome = () => {
    setQuizData(null);
    setQuizResult(null);
    setView("HOME");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      <Header 
        onShowTips={() => {}} 
        onShowArticles={() => {}} 
        onGoHome={handleHome} 
        onNavigate={handleNavigate} 
      />
      
      <main className="pt-20 md:pt-24 pb-20">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-xl"
            >
              <div className="text-center p-12 bg-white rounded-[3rem] shadow-2xl border border-slate-100 max-w-md w-full mx-4">
                <div className="relative w-24 h-24 mx-auto mb-10">
                  <div className="absolute inset-0 border-4 border-blue-100 rounded-full" />
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent"
                  />
                  <Loader2 className="absolute inset-0 m-auto w-10 h-10 text-blue-600 animate-pulse" />
                </div>
                <h3 className="text-3xl font-black text-slate-900 mb-4 font-display">Crafting Your Quiz</h3>
                <p className="text-slate-500 font-bold text-lg leading-relaxed">
                  Our AI is analyzing your notes to generate the perfect study material...
                </p>
                <div className="mt-10 flex justify-center gap-2">
                  {[0, 1, 2].map(i => (
                    <motion.div 
                      key={i}
                      animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                      className="w-2.5 h-2.5 bg-blue-600 rounded-full"
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          ) : error ? (
            <motion.div 
              key="error"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-xl mx-auto mt-20 p-12 bg-white rounded-[3rem] shadow-2xl border-2 border-rose-100 text-center"
            >
              <div className="w-20 h-20 bg-rose-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
                <AlertCircle className="w-10 h-10 text-rose-500" />
              </div>
              <h3 className="text-3xl font-black text-slate-900 mb-4 font-display">Something went wrong</h3>
              <p className="text-slate-500 font-bold text-lg mb-10 leading-relaxed">{error}</p>
              <button 
                onClick={() => setError(null)}
                className="px-10 py-5 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-3 mx-auto shadow-xl active:scale-95"
              >
                <RefreshCcw className="w-5 h-5" />
                Try Again
              </button>
            </motion.div>
          ) : (
            <div key={view}>
              {view === "HOME" && (
                <Home 
                  onGenerate={handleGenerate}
                  onScan={(text, diff, num, lang, topic) => {
                    if (topic === "RANDOM_SURPRISE") {
                      handleNavigate("RANDOM_SURPRISE");
                    } else if (text) {
                      handleGenerate(text, diff, num, lang);
                    }
                  }}
                  onCurrentAffairs={handleCurrentAffairs}
                  loading={isLoading}
                />
              )}
              {view === "QUIZ" && quizData && (
                <Quiz 
                  quiz={quizData} 
                  onFinish={handleQuizFinish} 
                  onExit={handleHome} 
                />
              )}
              {view === "RESULT" && quizData && quizResult && (
                <Result 
                  quiz={quizData} 
                  result={quizResult} 
                  onRetry={handleRetry} 
                  onHome={handleHome} 
                />
              )}
            </div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-16 md:py-24 no-print">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-20 mb-16 md:mb-24">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <span className="text-white font-black text-xl">Q</span>
                </div>
                <span className="text-2xl font-black tracking-tighter font-display">QuickQuiz</span>
              </div>
              <p className="text-slate-500 text-lg md:text-xl font-medium leading-relaxed max-w-md">
                The world's most advanced AI-powered study companion. Transform any notes into interactive quizzes in seconds.
              </p>
            </div>
            <div>
              <h4 className="font-black text-slate-900 text-xs uppercase tracking-widest mb-8">Product</h4>
              <ul className="space-y-4 text-slate-500 font-bold text-lg">
                <li><a href="#" className="hover:text-blue-600 transition-colors">AI Generator</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">OCR Scanner</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Study Tips</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-black text-slate-900 text-xs uppercase tracking-widest mb-8">Company</h4>
              <ul className="space-y-4 text-slate-500 font-bold text-lg">
                <li><a href="#" className="hover:text-blue-600 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-slate-400 font-bold text-sm">
              © 2026 QuickQuiz AI. Built for students, by students.
            </p>
            <div className="flex gap-8">
              <a href="#" className="text-slate-400 hover:text-slate-900 transition-colors font-black text-xs uppercase tracking-widest">Twitter</a>
              <a href="#" className="text-slate-400 hover:text-slate-900 transition-colors font-black text-xs uppercase tracking-widest">LinkedIn</a>
              <a href="#" className="text-slate-400 hover:text-slate-900 transition-colors font-black text-xs uppercase tracking-widest">Instagram</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
