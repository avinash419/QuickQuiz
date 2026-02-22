
import React, { useState } from 'react';
import { Difficulty } from '../types';
import ScannerModal from './ScannerModal';

interface HomeProps {
  onGenerate: (notes: string, difficulty: Difficulty, count: number, language: string) => void;
  onScan: (base64: string, difficulty: Difficulty, count: number, language: string, topic?: string) => void;
  loading: boolean;
}

const Home: React.FC<HomeProps> = ({ onGenerate, onScan, loading }) => {
  const [notes, setNotes] = useState('');
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.MEDIUM);
  const [count, setCount] = useState(10);
  const [language, setLanguage] = useState('Hindi');
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'paste' | 'scan'>('paste');

  const charLimit = 10000;

  const handleFillExample = (subject: string) => {
    setTopic(subject);
    if (subject === 'Biology') {
      setNotes(`Photosynthesis is a process used by plants and other organisms to convert light energy into chemical energy that, through cellular respiration, can later be released to fuel the organism's activities. This chemical energy is stored in carbohydrate molecules, such as sugars and starches, which are synthesized from carbon dioxide and water.`);
    } else if (subject === 'History') {
      setNotes(`The French Revolution was a period of far-reaching social and political upheaval in France and its colonies beginning in 1789 and ending in 1799. The Revolution overthrew the monarchy, established a republic, catalyzed violent periods of political turmoil, and finally culminated in a dictatorship under Napoleon.`);
    } else {
      setNotes(`Artificial intelligence (AI) is intelligence demonstrated by machines, as opposed to the natural intelligence displayed by animals including humans. AI research has been defined as the field of study of intelligent agents, which refers to any system that perceives its environment and takes actions that maximize its chance of achieving its goals.`);
    }
  };

  const isButtonDisabled = notes.trim().length < 30 || loading;

  const handleGenerateClick = () => {
    const fullNotes = topic ? `Topic: ${topic}\n\n${notes}` : notes;
    onGenerate(fullNotes, difficulty, count, language);
  };

  const handleCapturedImage = (base64: string) => {
    setIsScannerOpen(false);
    onScan(base64, difficulty, count, language, topic);
  };

  return (
    <div className="max-w-4xl mx-auto py-6 md:py-12 px-4 md:px-6">
      <div className="text-center mb-8 md:mb-12">
        <div className="inline-block px-3 py-1 mb-4 md:mb-6 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] md:text-xs font-bold uppercase tracking-widest">
          The ultimate study companion
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 md:mb-6 tracking-tight leading-tight">
          Turn your notes into <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Active Practice</span>
        </h2>
        <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto px-2">
          Paste your material or <b>scan a page</b> and watch AI transform it into a professional quiz. 
        </p>
      </div>

      <div className="relative">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-400/10 rounded-full blur-3xl -z-10 animate-float"></div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-400/10 rounded-full blur-3xl -z-10" style={{ animationDelay: '3s' }}></div>

        <div className="bg-white/90 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-white/60 overflow-hidden">
          {/* Tab Navigation */}
          <div className="flex border-b border-slate-100">
            <button 
              onClick={() => setActiveTab('paste')}
              className={`flex-1 py-5 font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${activeTab === 'paste' ? 'text-blue-600 bg-white border-b-4 border-blue-600' : 'text-slate-400 bg-slate-50/50 hover:text-slate-600'}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              Paste Notes
            </button>
            <button 
              onClick={() => {
                setActiveTab('scan');
                setIsScannerOpen(true);
              }}
              className={`flex-1 py-5 font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${activeTab === 'scan' ? 'text-indigo-600 bg-white border-b-4 border-indigo-600' : 'text-slate-400 bg-slate-50/50 hover:text-slate-600'}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              Scan Page
            </button>
          </div>

          <div className="p-6 md:p-10">
            {/* Topic Input */}
            <div className="mb-8">
              <label htmlFor="topic" className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-3 px-1">
                What are you studying?
              </label>
              <div className="flex flex-col md:flex-row gap-4">
                <input 
                  id="topic"
                  type="text"
                  placeholder="e.g. Molecular Biology, French Revolution..."
                  className="flex-grow bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-bold text-slate-800"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
                <div className="flex gap-2">
                  {['Biology', 'History', 'AI'].map(sub => (
                    <button 
                      key={sub}
                      onClick={() => handleFillExample(sub)}
                      className="px-4 py-2 bg-white border-2 border-slate-100 rounded-xl text-xs font-black text-slate-500 hover:border-blue-200 hover:text-blue-600 transition-all shadow-sm"
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Content Input */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3 px-1">
                <label htmlFor="notes" className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
                  Study Material
                </label>
                {notes.length > 0 && (
                  <button onClick={() => setNotes('')} className="text-[10px] font-black text-rose-500 uppercase tracking-widest hover:underline">
                    Clear All
                  </button>
                )}
              </div>
              <div className="relative group">
                {activeTab === 'scan' && notes.length === 0 ? (
                  <div className="w-full h-64 md:h-80 flex flex-col items-center justify-center bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-[2rem] p-6 text-center">
                    <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mb-4 text-indigo-600">
                      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </div>
                    <h3 className="text-lg font-black text-slate-800 mb-2">Ready to scan?</h3>
                    <p className="text-slate-500 text-sm mb-6 max-w-xs">Point your camera at your notes and we'll handle the rest.</p>
                    <button 
                      onClick={() => setIsScannerOpen(true)}
                      className="px-8 py-3 bg-indigo-600 text-white font-black rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-95"
                    >
                      Open Camera
                    </button>
                  </div>
                ) : (
                  <>
                    <textarea
                      id="notes"
                      className="w-full h-64 md:h-80 p-6 text-slate-800 bg-slate-50/50 border-2 border-slate-100 rounded-[2rem] focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500 transition-all resize-none outline-none text-base leading-relaxed group-hover:bg-white"
                      placeholder={activeTab === 'paste' ? "Paste your notes, article text, or study material here..." : "Captured text will appear here..."}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      maxLength={charLimit}
                      readOnly={activeTab === 'scan'}
                    />
                    <div className="absolute bottom-6 right-6 flex items-center gap-3">
                       <div className="px-3 py-1 bg-white border border-slate-100 rounded-full text-[10px] font-black text-slate-400 shadow-sm">
                        {notes.length} / {charLimit}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Configuration */}
            <div className="bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100 mb-10">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 text-center">Quiz Configuration</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Difficulty</label>
                  <div className="relative">
                    <select 
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                      className="w-full bg-white border-2 border-slate-100 p-3.5 rounded-2xl text-slate-800 outline-none focus:border-blue-500 font-bold transition-all appearance-none cursor-pointer text-sm shadow-sm"
                    >
                      <option value={Difficulty.EASY}>🟢 Easy</option>
                      <option value={Difficulty.MEDIUM}>🟡 Medium</option>
                      <option value={Difficulty.HARD}>🔴 Hard</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Questions</label>
                  <div className="relative">
                    <select 
                      value={count}
                      onChange={(e) => setCount(Number(e.target.value))}
                      className="w-full bg-white border-2 border-slate-100 p-3.5 rounded-2xl text-slate-800 outline-none focus:border-blue-500 font-bold transition-all appearance-none cursor-pointer text-sm shadow-sm"
                    >
                      <option value={5}>5 Questions</option>
                      <option value={10}>10 Questions</option>
                      <option value={15}>15 Questions</option>
                      <option value={20}>20 Questions</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Language</label>
                  <div className="relative">
                    <select 
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full bg-white border-2 border-slate-100 p-3.5 rounded-2xl text-slate-800 outline-none focus:border-blue-500 font-bold transition-all appearance-none cursor-pointer text-sm shadow-sm"
                    >
                      <option value="Hindi">🇮🇳 Hindi (हिंदी)</option>
                      <option value="English">🇬🇧 English</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleGenerateClick}
              disabled={isButtonDisabled}
              className={`w-full py-5 rounded-[2rem] font-black text-xl shadow-2xl transition-all flex items-center justify-center gap-4 relative overflow-hidden group ${
                isButtonDisabled 
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed border-2 border-slate-200' 
                  : 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white transform active:scale-[0.98] hover:shadow-blue-500/25'
              }`}
            >
              {loading ? (
                <>
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                  <span className="ml-2">Crafting your quiz...</span>
                </>
              ) : (
                <>
                  <span>Generate Quiz</span>
                  <div className="bg-white/20 p-1.5 rounded-full group-hover:translate-x-1 transition-transform">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                  </div>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-12 md:mt-20 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
        {[
          { icon: '📸', title: 'Direct Scan', desc: 'Point your camera at a textbook page or notes to convert them instantly.' },
          { icon: '🎯', title: 'Targeted Practice', desc: 'Identify your weak spots and fix them before they show up on exams.' },
          { icon: '🌍', title: 'Multilingual Support', desc: 'Switch between languages effortlessly for a native experience.' }
        ].map((feat, i) => (
          <div key={i} className="group p-6 md:p-8 rounded-2xl md:rounded-3xl bg-white border border-slate-100 hover:shadow-xl transition-all duration-300">
            <div className="text-3xl md:text-4xl mb-3 md:mb-4 group-hover:scale-110 transition-transform">{feat.icon}</div>
            <h3 className="font-extrabold text-slate-900 mb-1 md:mb-2">{feat.title}</h3>
            <p className="text-xs md:text-sm text-slate-500 leading-relaxed">{feat.desc}</p>
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
