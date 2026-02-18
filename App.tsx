
import React, { useState } from 'react';
import Header from './components/Header';
import Home from './components/Home';
import QuizPlayer from './components/QuizPlayer';
import ResultView from './components/ResultView';
import StudyTipsModal from './components/StudyTipsModal';
import { AppState, Quiz, QuizResult, Difficulty } from './types';
import { generateQuiz, generateQuizFromImage } from './services/geminiService';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('HOME');
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isTipsOpen, setIsTipsOpen] = useState(false);

  const handleGenerate = async (notes: string, difficulty: Difficulty, count: number, language: string) => {
    setLoading(true);
    setError(null);
    try {
      const generatedQuiz = await generateQuiz(notes, difficulty, count, language);
      setQuiz(generatedQuiz);
      setAppState('QUIZ');
    } catch (err) {
      console.error("Quiz generation failed", err);
      setError("Failed to generate quiz. Please check your notes or try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleScan = async (base64: string, difficulty: Difficulty, count: number, language: string) => {
    setLoading(true);
    setError(null);
    try {
      const generatedQuiz = await generateQuizFromImage(base64, difficulty, count, language);
      setQuiz(generatedQuiz);
      setAppState('QUIZ');
    } catch (err) {
      console.error("Scanning quiz generation failed", err);
      setError("Failed to process scan. Ensure the photo is clear and contains text.");
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

  return (
    <div className="min-h-screen flex flex-col">
      <Header onShowTips={() => setIsTipsOpen(true)} />
      
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
          <Home onGenerate={handleGenerate} onScan={handleScan} loading={loading} />
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
      </main>

      <StudyTipsModal isOpen={isTipsOpen} onClose={() => setIsTipsOpen(false)} />

      <footer className="py-8 px-6 text-center text-slate-400 text-sm no-print border-t border-slate-100 mt-12">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© 2024 Quick Note-to-Quiz. Built for rapid learning.</p>
          <div className="flex gap-4 font-medium">
            <a href="#" className="hover:text-blue-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Terms</a>
            <a href="#" className="hover:text-blue-600 transition-colors" onClick={(e) => { e.preventDefault(); setIsTipsOpen(true); }}>Help</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
