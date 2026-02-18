
import React, { useState } from 'react';
import { Difficulty } from '../types';
import ScannerModal from './ScannerModal';

interface HomeProps {
  onGenerate: (notes: string, difficulty: Difficulty, count: number, language: string) => void;
  onScan: (base64: string, difficulty: Difficulty, count: number, language: string) => void;
  loading: boolean;
}

const Home: React.FC<HomeProps> = ({ onGenerate, onScan, loading }) => {
  const [notes, setNotes] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.MEDIUM);
  const [count, setCount] = useState(10);
  const [language, setLanguage] = useState('Hindi');
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const charLimit = 10000;

  const handleFillExample = () => {
    setNotes(`Photosynthesis is a process used by plants and other organisms to convert light energy into chemical energy that, through cellular respiration, can later be released to fuel the organism's activities. This chemical energy is stored in carbohydrate molecules, such as sugars and starches, which are synthesized from carbon dioxide and water.

Most plants, algae, and cyanobacteria perform photosynthesis; such organisms are called photoautotrophs. Photosynthesis is largely responsible for producing and maintaining the oxygen content of the Earth's atmosphere, and supplies most of the energy necessary for life on Earth.

Although photosynthesis is performed differently by different species, the process always begins when energy from light is absorbed by proteins called reaction centers that contain green chlorophyll (and other colored) pigments. In plants, these proteins are held inside organelles called chloroplasts, which are most abundant in leaf cells.`);
  };

  const isButtonDisabled = notes.trim().length < 50 || loading;

  const handleCapturedImage = (base64: string) => {
    setIsScannerOpen(false);
    onScan(base64, difficulty, count, language);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="text-center mb-12">
        <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold uppercase tracking-widest">
          The ultimate study companion
        </div>
        <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
          Turn your notes into <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Active Practice</span>
        </h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Paste your material or <b>scan a page</b> and watch AI transform it into a professional quiz. 
          Master any topic with interactive testing.
        </p>
      </div>

      <div className="relative">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-400/10 rounded-full blur-3xl -z-10 animate-float"></div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-400/10 rounded-full blur-3xl -z-10" style={{ animationDelay: '3s' }}></div>

        <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] border border-white/40 overflow-hidden">
          <div className="p-8 md:p-10">
            <div className="mb-8">
              <div className="flex justify-between items-end mb-3 px-1">
                <label htmlFor="notes" className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                  Study Material
                </label>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setIsScannerOpen(true)}
                    className="text-xs text-indigo-600 hover:text-indigo-700 font-black flex items-center gap-1.5 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100 transition-all hover:bg-indigo-100"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    Scan Notes
                  </button>
                  <button 
                    onClick={handleFillExample}
                    className="text-xs text-blue-600 hover:text-blue-700 font-bold underline underline-offset-4 decoration-blue-200 hover:decoration-blue-600 transition-all mt-1"
                  >
                    Try Example
                  </button>
                </div>
              </div>
              <div className="relative group">
                <textarea
                  id="notes"
                  className="w-full h-72 p-6 text-slate-800 bg-slate-50/50 border-2 border-slate-100 rounded-3xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all resize-none outline-none text-base leading-relaxed group-hover:bg-white"
                  placeholder="Paste text here or click 'Scan Notes' to use camera..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  maxLength={charLimit}
                />
                <div className="absolute bottom-4 right-6 flex items-center gap-3">
                   <div className="px-2.5 py-1 bg-white border border-slate-100 rounded-full text-[10px] font-black text-slate-400 shadow-sm">
                    {notes.length} / {charLimit}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Difficulty</label>
                <select 
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                  className="w-full bg-slate-50/50 border-2 border-slate-100 p-3.5 rounded-2xl text-slate-800 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 font-bold transition-all appearance-none cursor-pointer"
                >
                  <option value={Difficulty.EASY}>🟢 Easy</option>
                  <option value={Difficulty.MEDIUM}>🟡 Medium</option>
                  <option value={Difficulty.HARD}>🔴 Hard</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Questions</label>
                <select 
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value))}
                  className="w-full bg-slate-50/50 border-2 border-slate-100 p-3.5 rounded-2xl text-slate-800 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 font-bold transition-all appearance-none cursor-pointer"
                >
                  <option value={5}>5 Questions</option>
                  <option value={10}>10 Questions</option>
                  <option value={15}>15 Questions</option>
                  <option value={20}>20 Questions</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Language</label>
                <select 
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full bg-slate-50/50 border-2 border-slate-100 p-3.5 rounded-2xl text-slate-800 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 font-bold transition-all appearance-none cursor-pointer"
                >
                  <option value="Hindi">🇮🇳 Hindi (हिंदी)</option>
                  <option value="English">🇬🇧 English</option>
                </select>
              </div>
            </div>

            <button
              onClick={() => onGenerate(notes, difficulty, count, language)}
              disabled={isButtonDisabled}
              className={`w-full py-5 rounded-3xl font-black text-xl shadow-2xl transition-all flex items-center justify-center gap-3 relative overflow-hidden group ${
                isButtonDisabled 
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed border-2 border-slate-200' 
                  : 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white transform hover:-translate-y-1 active:scale-[0.98]'
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>AI Thinking...</span>
                </>
              ) : (
                <>
                  <span>Generate Quiz</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: '📸', title: 'Direct Scan', desc: 'Point your camera at a textbook page or notes to convert them instantly.' },
          { icon: '🎯', title: 'Targeted Practice', desc: 'Identify your weak spots and fix them before they show up on exams.' },
          { icon: '🌍', title: 'Multilingual Support', desc: 'Switch between languages effortlessly for a native experience.' }
        ].map((feat, i) => (
          <div key={i} className="group p-8 rounded-3xl bg-white border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{feat.icon}</div>
            <h3 className="font-extrabold text-slate-900 mb-2">{feat.title}</h3>
            <p className="text-sm text-slate-500 leading-relaxed">{feat.desc}</p>
          </div>
        ))}
      </div>

      <ScannerModal 
        isOpen={isScannerOpen} 
        onClose={() => setIsScannerOpen(false)} 
        onCapture={handleCapturedImage} 
      />
    </div>
  );
};

export default Home;
