
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Home from './components/Home';
import QuizPlayer from './components/QuizPlayer';
import ResultView from './components/ResultView';
import StudyTipsModal from './components/StudyTipsModal';
import Articles from './components/Articles';
import StaticPage from './components/StaticPage';
import { AppState, Quiz, QuizResult, Difficulty } from './types';
import { generateQuiz, generateQuizFromImage } from './services/groqService';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('HOME');
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isTipsOpen, setIsTipsOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>('/logo.png');

  const handleGenerate = async (notes: string, difficulty: Difficulty, count: number, language: string) => {
    setAppState('GENERATING');
    setLoading(true);
    setError(null);
    try {
      const generatedQuiz = await generateQuiz(notes, difficulty, count, language);
      setQuiz(generatedQuiz);
      setAppState('QUIZ');
    } catch (err) {
      console.error("Quiz generation failed", err);
      setError("Failed to generate quiz. Please check your notes or try again later.");
      setAppState('HOME');
    } finally {
      setLoading(false);
    }
  };

  const handleScan = async (base64: string, difficulty: Difficulty, count: number, language: string, topic?: string) => {
    setAppState('GENERATING');
    setLoading(true);
    setError(null);
    try {
      const generatedQuiz = await generateQuizFromImage(base64, difficulty, count, language, topic);
      setQuiz(generatedQuiz);
      setAppState('QUIZ');
    } catch (err) {
      console.error("Scanning quiz generation failed", err);
      setError("Failed to process scan. Ensure the photo is clear and contains text.");
      setAppState('HOME');
    } finally {
      setLoading(false);
    }
  };

  const handleFinishQuiz = (quizResult: QuizResult) => {
    setResult(quizResult);
    setAppState('RESULT');
  };

  const handleRetake = () => {
    setResult(null);
    setAppState('QUIZ');
  };

  const handleNew = () => {
    setQuiz(null);
    setResult(null);
    setAppState('HOME');
  };

  const handleShowArticles = () => {
    setAppState('ARTICLES');
  };

  const handleNavigate = (state: AppState) => {
    if (state === 'GK_QUIZ') {
      handleGenerate('General Knowledge', Difficulty.MEDIUM, 10, 'English');
    } else if (state === 'SCIENCE_QUIZ') {
      handleGenerate('Science', Difficulty.MEDIUM, 10, 'English');
    } else if (state === 'HISTORY_QUIZ') {
      handleGenerate('History', Difficulty.MEDIUM, 10, 'English');
    } else {
      setAppState(state);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        onShowTips={() => setIsTipsOpen(true)} 
        onShowArticles={handleShowArticles}
        onGoHome={handleNew}
        onNavigate={handleNavigate}
        logoUrl={logoUrl}
      />
      
      <main className="flex-grow">
        {error && (
          <div className="max-w-3xl mx-auto mt-6 px-6">
            <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
                <p className="text-sm font-medium">{error}</p>
              </div>
              <button onClick={() => setError(null)} className="text-rose-400 hover:text-rose-600">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
              </button>
            </div>
          </div>
        )}

        {appState === 'HOME' && (
          <Home 
            onGenerate={handleGenerate} 
            onScan={handleScan} 
            loading={loading} 
          />
        )}

        {appState === 'ARTICLES' && (
          <Articles onBack={handleNew} />
        )}

        {appState === 'GENERATING' && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center animate-fadeIn">
            <div className="relative w-24 h-24 md:w-48 md:h-48 mb-6 md:mb-8">
              <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping"></div>
              <div className="absolute inset-4 bg-indigo-500/20 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 md:w-24 md:h-24 bg-white rounded-2xl md:rounded-3xl shadow-2xl flex items-center justify-center animate-bounce overflow-hidden border border-slate-100">
                  {logoUrl ? (
                    <img src={logoUrl} alt="QuickQuiz Logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center">
                      <svg className="w-6 h-6 md:w-12 md:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <h2 className="text-xl md:text-4xl font-black text-slate-900 mb-3 md:mb-4 tracking-tight">AI is crafting your quiz...</h2>
            <p className="text-slate-500 font-bold text-xs md:text-base max-w-md mx-auto leading-relaxed">
              We're analyzing your notes and generating high-quality questions. This usually takes 10-15 seconds.
            </p>
            <div className="mt-6 md:mt-8 flex gap-2">
              <div className="w-1.5 h-1.5 md:w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
              <div className="w-1.5 h-1.5 md:w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-1.5 h-1.5 md:w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        )}

        {appState === 'QUIZ' && quiz && (
          <QuizPlayer 
            quiz={quiz} 
            onFinish={handleFinishQuiz} 
            onExit={handleNew}
          />
        )}

        {appState === 'RESULT' && quiz && result && (
          <ResultView 
            quiz={quiz} 
            result={result} 
            onRetake={handleRetake} 
            onNew={handleNew} 
          />
        )}

        {['ABOUT', 'CONTACT', 'PRIVACY', 'TERMS', 'DISCLAIMER'].includes(appState) && (
          <StaticPage type={appState} onBack={handleNew} />
        )}
      </main>

      <StudyTipsModal isOpen={isTipsOpen} onClose={() => setIsTipsOpen(false)} />

      <footer className="py-12 px-6 text-slate-400 text-sm no-print border-t border-slate-100 mt-20 bg-slate-50/50">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-md overflow-hidden border border-slate-100">
                {logoUrl ? (
                  <img src={logoUrl} alt="QuickQuiz Logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-full h-full bg-blue-600 flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                )}
              </div>
              <span className="text-xl font-black text-slate-900 tracking-tight">QuickQuiz</span>
            </div>
            <p className="max-w-xs font-medium leading-relaxed mb-6">
              The AI-powered study tool that turns your notes into high-quality quizzes in seconds. Master any subject with active recall.
            </p>
            <p className="font-bold text-slate-500">© 2026 QuickQuiz. Built for rapid learning.</p>
          </div>
          
          <div>
            <h4 className="text-slate-900 font-black uppercase tracking-wider text-xs mb-6">Product</h4>
            <ul className="space-y-4 font-bold">
              <li><a href="#" onClick={(e) => { e.preventDefault(); setAppState('HOME'); }} className="hover:text-blue-600 transition-colors">Home</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setAppState('ARTICLES'); }} className="hover:text-blue-600 transition-colors">Blog</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setIsTipsOpen(true); }} className="hover:text-blue-600 transition-colors">Study Tips</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setAppState('ABOUT'); }} className="hover:text-blue-600 transition-colors">About Us</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-slate-900 font-black uppercase tracking-wider text-xs mb-6">Legal & Support</h4>
            <ul className="space-y-4 font-bold">
              <li><a href="#" onClick={(e) => { e.preventDefault(); setAppState('CONTACT'); }} className="hover:text-blue-600 transition-colors">Contact</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setAppState('PRIVACY'); }} className="hover:text-blue-600 transition-colors">Privacy Policy</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setAppState('TERMS'); }} className="hover:text-blue-600 transition-colors">Terms of Service</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setAppState('DISCLAIMER'); }} className="hover:text-blue-600 transition-colors">Disclaimer</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
