
import React, { useState } from 'react';
import { Difficulty } from '../types';
import ScannerModal from './ScannerModal';
import { Sparkles, Camera, FileText, Target, Globe, ArrowRight, Zap, Clock, Search, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';

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
    <div className="max-w-5xl mx-auto py-8 md:py-20 px-4 md:px-6">
      {/* Hero Section */}
      <div className="text-center mb-12 md:mb-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 md:mb-8 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] md:text-xs font-black uppercase tracking-[0.2em]"
        >
          <Sparkles className="w-3 h-3 md:w-3.5 md:h-3.5" />
          The ultimate study companion
        </motion.div>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-4xl md:text-7xl font-black text-slate-900 mb-6 md:mb-8 tracking-tight leading-[1.2] md:leading-[1.1] font-display"
        >
          Turn your notes into <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600">Active Practice</span>
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-base md:text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed px-2"
        >
          Paste your material or <b>scan a page</b> and watch AI transform it into a professional quiz in seconds. 
        </motion.p>
      </div>

      <div className="relative">
        {/* Decorative Blobs */}
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl -z-10 animate-float"></div>
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-indigo-400/10 rounded-full blur-3xl -z-10" style={{ animationDelay: '3s' }}></div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-[3rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] border border-slate-200/60 overflow-hidden"
        >
          {/* Tab Navigation */}
          <div className="flex border-b border-slate-100 bg-slate-50/50">
            <button 
              onClick={() => setActiveTab('paste')}
              className={`flex-1 py-6 font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 ${activeTab === 'paste' ? 'text-blue-600 bg-white border-b-4 border-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <FileText className="w-4 h-4" />
              Paste Notes
            </button>
            <button 
              onClick={() => {
                setActiveTab('scan');
                setIsScannerOpen(true);
              }}
              className={`flex-1 py-6 font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 ${activeTab === 'scan' ? 'text-indigo-600 bg-white border-b-4 border-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <Camera className="w-4 h-4" />
              Scan Page
            </button>
          </div>

          <div className="p-6 md:p-12">
            {/* Topic Input */}
            <div className="mb-8 md:mb-10">
              <label htmlFor="topic" className="block text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 px-1 text-center md:text-left">
                What are you studying?
              </label>
              <div className="flex flex-col gap-4">
                <div className="relative w-full">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                  <input 
                    id="topic"
                    type="text"
                    placeholder="e.g. Molecular Biology, French Revolution..."
                    className="w-full bg-slate-50 border-2 border-slate-100 pl-14 pr-6 py-4 md:py-4.5 rounded-2xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all font-bold text-slate-800 placeholder:text-slate-300 text-sm md:text-base"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                  />
                </div>
                <div className="flex flex-wrap justify-center md:justify-start gap-2">
                  {['Biology', 'History', 'AI'].map(sub => (
                    <button 
                      key={sub}
                      onClick={() => handleFillExample(sub)}
                      className="px-4 md:px-5 py-2 bg-white border-2 border-slate-100 rounded-xl text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest hover:border-blue-200 hover:text-blue-600 transition-all shadow-sm active:scale-95"
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Content Input */}
            <div className="mb-8 md:mb-10">
              <div className="flex justify-between items-center mb-4 px-1">
                <label htmlFor="notes" className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                  Study Material
                </label>
                {notes.length > 0 && (
                  <button onClick={() => setNotes('')} className="text-[9px] md:text-[10px] font-black text-rose-500 uppercase tracking-widest hover:underline">
                    Clear All
                  </button>
                )}
              </div>
              <div className="relative group">
                {activeTab === 'scan' && notes.length === 0 ? (
                  <div className="w-full h-72 md:h-96 flex flex-col items-center justify-center bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 text-center">
                    <div className="w-20 h-20 md:w-24 md:h-24 bg-indigo-100 rounded-full flex items-center justify-center mb-4 md:mb-6 text-indigo-600">
                      <Camera className="w-8 h-8 md:w-10 md:h-10" />
                    </div>
                    <h3 className="text-lg md:text-xl font-black text-slate-800 mb-2 md:mb-3">Ready to scan?</h3>
                    <p className="text-slate-500 font-medium mb-6 md:mb-8 max-w-xs leading-relaxed text-sm md:text-base">Point your camera at your notes and we'll handle the rest.</p>
                    <button 
                      onClick={() => setIsScannerOpen(true)}
                      className="px-8 md:px-10 py-3.5 md:py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/20 active:scale-95 flex items-center gap-3 text-sm md:text-base"
                    >
                      <Zap className="w-5 h-5" />
                      Open Camera
                    </button>
                  </div>
                ) : (
                  <>
                    <textarea
                      id="notes"
                      className="w-full h-72 md:h-96 p-6 md:p-8 text-slate-800 bg-slate-50/50 border-2 border-slate-100 rounded-[2rem] md:rounded-[2.5rem] focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500 transition-all resize-none outline-none text-base md:text-lg leading-relaxed group-hover:bg-white font-medium"
                      placeholder={activeTab === 'paste' ? "Paste your notes, article text, or study material here..." : "Captured text will appear here..."}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      maxLength={charLimit}
                      readOnly={activeTab === 'scan'}
                    />
                    <div className="absolute bottom-6 right-6 md:bottom-8 right-8 flex items-center gap-3">
                       <div className="px-3 md:px-4 py-1.5 bg-white border border-slate-100 rounded-full text-[9px] md:text-[10px] font-black text-slate-400 shadow-sm">
                        {notes.length.toLocaleString()} / {charLimit.toLocaleString()}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Configuration */}
            <div className="bg-slate-50/50 p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 mb-8 md:mb-12">
              <h4 className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 md:mb-8 text-center">Quiz Configuration</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-8">
                <div className="space-y-2 md:space-y-3">
                  <label className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Difficulty</label>
                  <div className="relative">
                    <select 
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                      className="w-full bg-white border-2 border-slate-100 p-3.5 md:p-4 rounded-2xl text-slate-800 outline-none focus:border-blue-500 font-bold transition-all appearance-none cursor-pointer text-xs md:text-sm shadow-sm"
                    >
                      <option value={Difficulty.EASY}>🟢 Easy</option>
                      <option value={Difficulty.MEDIUM}>🟡 Medium</option>
                      <option value={Difficulty.HARD}>🔴 Hard</option>
                    </select>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <ArrowRight className="w-4 h-4 rotate-90" />
                    </div>
                  </div>
                </div>
                <div className="space-y-2 md:space-y-3">
                  <label className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Questions</label>
                  <div className="relative">
                    <select 
                      value={count}
                      onChange={(e) => setCount(Number(e.target.value))}
                      className="w-full bg-white border-2 border-slate-100 p-3.5 md:p-4 rounded-2xl text-slate-800 outline-none focus:border-blue-500 font-bold transition-all appearance-none cursor-pointer text-xs md:text-sm shadow-sm"
                    >
                      <option value={5}>5 Questions</option>
                      <option value={10}>10 Questions</option>
                      <option value={15}>15 Questions</option>
                      <option value={20}>20 Questions</option>
                    </select>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <ArrowRight className="w-4 h-4 rotate-90" />
                    </div>
                  </div>
                </div>
                <div className="space-y-2 md:space-y-3">
                  <label className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Language</label>
                  <div className="relative">
                    <select 
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full bg-white border-2 border-slate-100 p-3.5 md:p-4 rounded-2xl text-slate-800 outline-none focus:border-blue-500 font-bold transition-all appearance-none cursor-pointer text-xs md:text-sm shadow-sm"
                    >
                      <option value="Hindi">🇮🇳 Hindi (हिंदी)</option>
                      <option value="English">🇬🇧 English</option>
                    </select>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <ArrowRight className="w-4 h-4 rotate-90" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleGenerateClick}
              disabled={isButtonDisabled}
              className={`w-full py-5 md:py-6 rounded-[1.5rem] md:rounded-[2rem] font-black text-xl md:text-2xl shadow-2xl transition-all flex items-center justify-center gap-4 relative overflow-hidden group ${
                isButtonDisabled 
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed border-2 border-slate-200' 
                  : 'bg-gradient-to-r from-blue-600 via-indigo-700 to-violet-700 text-white transform active:scale-[0.98] hover:shadow-blue-500/30'
              }`}
            >
              {loading ? (
                <>
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                    <div className="w-2.5 h-2.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2.5 h-2.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                  <span className="ml-2">Crafting your quiz...</span>
                </>
              ) : (
                <>
                  <span>Generate Quiz</span>
                  <div className="bg-white/20 p-2 rounded-full group-hover:translate-x-2 transition-transform">
                    <ArrowRight className="w-6 h-6" />
                  </div>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>

      {/* Feature Grid */}
      <div className="mt-24 md:mt-32 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
        {[
          { icon: <Camera className="w-8 h-8" />, title: 'Direct Scan', desc: 'Point your camera at a textbook page or notes to convert them instantly.', color: 'bg-blue-50 text-blue-600' },
          { icon: <Target className="w-8 h-8" />, title: 'Targeted Practice', desc: 'Identify your weak spots and fix them before they show up on exams.', color: 'bg-indigo-50 text-indigo-600' },
          { icon: <Globe className="w-8 h-8" />, title: 'Multilingual Support', desc: 'Switch between languages effortlessly for a native experience.', color: 'bg-violet-50 text-violet-600' }
        ].map((feat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="group p-10 rounded-[2.5rem] bg-white border border-slate-100 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500"
          >
            <div className={`w-16 h-16 ${feat.color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 group-hover:rotate-3`}>
              {feat.icon}
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-3 font-display">{feat.title}</h3>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">{feat.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Detailed Homepage Content */}
      <div className="mt-20 md:mt-32 space-y-20 md:space-y-32">
        {/* Introduction */}
        <section className="max-w-4xl mx-auto px-2">
          <div className="flex items-center gap-4 md:gap-6 mb-8 md:mb-12">
            <div className="h-px flex-grow bg-slate-200"></div>
            <span className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Introduction</span>
            <div className="h-px flex-grow bg-slate-200"></div>
          </div>
          <h2 className="text-3xl md:text-6xl font-black text-slate-900 mb-8 md:mb-10 tracking-tight text-center font-display leading-tight">
            Welcome to the Future of <br /><span className="text-blue-600">Personalized Learning</span>
          </h2>
          <div className="prose prose-slate prose-base md:prose-lg max-w-none text-slate-600 font-medium leading-relaxed space-y-6 md:space-y-8">
            <p>
              In an era where information is abundant but time is scarce, the way we consume and retain knowledge must evolve. Traditional methods of studying—reading, highlighting, and passive review—are increasingly proving to be inefficient in the face of modern academic and professional demands. Enter <strong>QuickQuiz</strong>, the revolutionary AI-powered study companion designed to bridge the gap between information and mastery.
            </p>
            <p>
              Our platform is built on the fundamental principle of <strong>Active Recall</strong>. Science has consistently shown that the most effective way to learn is not by putting information <em>into</em> your brain, but by trying to get it <em>out</em>. By transforming your static notes, textbook pages, and lecture materials into dynamic, interactive quizzes, QuickQuiz forces your brain to engage with the content, strengthening neural pathways and ensuring long-term retention.
            </p>
          </div>
        </section>

        {/* What is QuickQuiz */}
        <section className="bg-slate-900 -mx-4 md:-mx-12 px-6 md:px-20 py-20 md:py-32 rounded-[2.5rem] md:rounded-[4rem] text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-blue-500/10 rounded-full blur-[80px] md:blur-[120px]"></div>
          <div className="absolute bottom-0 left-0 w-64 md:w-96 h-64 md:h-96 bg-indigo-500/10 rounded-full blur-[80px] md:blur-[120px]"></div>
          
          <div className="max-w-5xl mx-auto relative z-10">
            <div className="flex items-center gap-4 md:gap-6 mb-8 md:mb-12">
              <span className="text-[8px] md:text-[10px] font-black text-blue-400 uppercase tracking-[0.4em]">What is QuickQuiz?</span>
              <div className="h-px flex-grow bg-white/10"></div>
            </div>
            <h2 className="text-3xl md:text-6xl font-black text-white mb-10 md:mb-12 tracking-tight font-display leading-tight">
              An Intelligent Bridge Between <br />Notes and Knowledge
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">
              <div className="space-y-6 md:space-y-8 text-slate-400 font-medium text-base md:text-lg leading-relaxed">
                <p>
                  QuickQuiz is more than just a quiz generator; it's a sophisticated educational engine powered by the latest advancements in Large Language Models (LLMs). Our technology analyzes the semantic structure of your study material, identifying key concepts, dates, formulas, and relationships that are critical for understanding.
                </p>
                <p>
                  Whether you're a medical student tackling complex anatomy, a law student memorizing case law, or a professional staying updated with industry trends, QuickQuiz adapts to your specific needs. We support multiple input methods, including direct text pasting and advanced OCR (Optical Character Recognition) for scanning physical documents.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-4 md:gap-6">
                <div className="bg-white/5 backdrop-blur-xl p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-white/10 space-y-4 md:space-y-6 hover:bg-white/10 transition-all duration-500">
                  <div className="flex items-center gap-4 md:gap-5">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400">
                      <Zap className="w-6 h-6 md:w-7 md:h-7" />
                    </div>
                    <h4 className="text-lg md:text-xl font-black text-white font-display">Instant Processing</h4>
                  </div>
                  <p className="text-slate-400 font-medium leading-relaxed text-sm md:text-base">
                    Our AI can process up to 10,000 characters in seconds, generating high-quality multiple-choice questions with detailed explanations.
                  </p>
                </div>
                <div className="bg-white/5 backdrop-blur-xl p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-white/10 space-y-4 md:space-y-6 hover:bg-white/10 transition-all duration-500">
                  <div className="flex items-center gap-4 md:gap-5">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-400">
                      <Globe className="w-6 h-6 md:w-7 md:h-7" />
                    </div>
                    <h4 className="text-lg md:text-xl font-black text-white font-display">Native Multilingualism</h4>
                  </div>
                  <p className="text-slate-400 font-medium leading-relaxed text-sm md:text-base">
                    Study in your native tongue. With full support for Hindi and English, we ensure that language is never a barrier to success.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="max-w-5xl mx-auto">
          <div className="text-center mb-12 md:mb-20">
            <span className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4 md:mb-6 block">Benefits</span>
            <h2 className="text-3xl md:text-6xl font-black text-slate-900 tracking-tight font-display">
              Why Students Love QuickQuiz
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              { title: 'Save Hours of Time', desc: 'No more manual flashcard creation. Turn a 50-page chapter into a quiz in minutes.', icon: <Clock className="w-7 h-7 md:w-8 md:h-8" />, color: 'text-blue-600 bg-blue-50' },
              { title: 'Eliminate Boredom', desc: 'Passive reading is tedious. Interactive quizzing keeps your brain engaged and alert.', icon: <Zap className="w-7 h-7 md:w-8 md:h-8" />, color: 'text-amber-600 bg-amber-50' },
              { title: 'Identify Weak Spots', desc: 'Our analysis shows exactly where your gaps are, so you can focus your energy.', icon: <Search className="w-7 h-7 md:w-8 md:h-8" />, color: 'text-emerald-600 bg-emerald-50' },
              { title: 'Boost Confidence', desc: 'Practice in a test-like environment to reduce anxiety and walk into finals prepared.', icon: <Target className="w-7 h-7 md:w-8 md:h-8" />, color: 'text-rose-600 bg-rose-50' },
              { title: 'Learn on the Go', desc: 'Mobile-optimized and fast. Turn your commute into a productive study session.', icon: <Globe className="w-7 h-7 md:w-8 md:h-8" />, color: 'text-indigo-600 bg-indigo-50' },
              { title: 'Scientific Foundation', desc: 'Built on active recall and spaced repetition, the most effective learning techniques.', icon: <BookOpen className="w-7 h-7 md:w-8 md:h-8" />, color: 'text-violet-600 bg-violet-50' }
            ].map((benefit, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 md:p-10 rounded-[2rem] md:rounded-[2.5rem] bg-white border border-slate-100 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-500/5 transition-all group"
              >
                <div className={`w-14 h-14 md:w-16 md:h-16 ${benefit.color} rounded-2xl flex items-center justify-center mb-6 md:mb-8 group-hover:scale-110 transition-transform duration-500`}>
                  {benefit.icon}
                </div>
                <h3 className="text-lg md:text-xl font-black text-slate-900 mb-3 md:mb-4 font-display">{benefit.title}</h3>
                <p className="text-sm md:text-base text-slate-500 font-medium leading-relaxed">{benefit.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Categories */}
        <section className="max-w-5xl mx-auto pb-20 md:pb-32">
          <div className="bg-gradient-to-br from-blue-600 via-indigo-700 to-violet-800 p-8 md:p-20 rounded-[2.5rem] md:rounded-[4rem] text-white overflow-hidden relative shadow-2xl shadow-blue-500/20">
            <div className="absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-white/10 rounded-full blur-[80px] md:blur-[100px]"></div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-black mb-6 md:mb-8 tracking-tight font-display">Diverse Learning Categories</h2>
              <p className="text-blue-100 font-medium text-lg md:text-xl mb-10 md:mb-16 max-w-2xl leading-relaxed">
                QuickQuiz is versatile enough to handle any subject matter. From technical sciences to the liberal arts, our AI understands the context.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                {[
                  'STEM Subjects', 'Medical Science', 'Law & Ethics', 'Business & Finance',
                  'Literature', 'History', 'Geography', 'Current Affairs',
                  'Foreign Languages', 'Coding & Tech', 'Psychology', 'General Knowledge'
                ].map((cat, i) => (
                  <div key={i} className="px-4 md:px-6 py-3 md:py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl md:rounded-2xl text-[10px] md:text-sm font-black hover:bg-white/20 transition-all text-center uppercase tracking-widest flex items-center justify-center">
                    {cat}
                  </div>
                ))}
              </div>
              <div className="mt-12 md:mt-20 pt-12 md:pt-20 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-10 text-center md:text-left">
                <div>
                  <h4 className="text-xl md:text-2xl font-black mb-2 md:mb-3 font-display">Ready to start your journey?</h4>
                  <p className="text-blue-100 font-medium text-base md:text-lg">Join thousands of students mastering their subjects today.</p>
                </div>
                <button 
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="w-full md:w-auto px-8 md:px-10 py-4 md:py-5 bg-white text-blue-700 font-black rounded-2xl hover:bg-blue-50 transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-3"
                >
                  Back to Top
                  <ArrowRight className="w-5 h-5 -rotate-90" />
                </button>
              </div>
            </div>
          </div>
        </section>
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
