
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
      <div className="mt-20 md:mt-32 space-y-24 md:space-y-40">
        {/* Section 1: About QuickQuiz */}
        <section id="about-quickquiz" className="max-w-4xl mx-auto px-2">
          <div className="flex items-center gap-4 md:gap-6 mb-8 md:mb-12">
            <div className="h-px flex-grow bg-slate-200"></div>
            <span className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">About QuickQuiz</span>
            <div className="h-px flex-grow bg-slate-200"></div>
          </div>
          <h2 className="text-3xl md:text-6xl font-black text-slate-900 mb-8 md:mb-12 tracking-tight text-center font-display leading-tight">
            The Vision Behind <br /><span className="text-blue-600">QuickQuiz AI</span>
          </h2>
          <div className="prose prose-slate prose-base md:prose-lg max-w-none text-slate-600 font-medium leading-relaxed space-y-8">
            <p>
              QuickQuiz was born out of a simple yet profound observation: the world is drowning in information, but starving for true knowledge. As students and lifelong learners ourselves, we realized that the traditional "read-and-repeat" model of education was failing to keep pace with the sheer volume of data we are expected to master. We spent hours highlighting textbooks and re-reading notes, only to find that 70% of that information vanished within 24 hours. This is known as the "Forgetting Curve," and QuickQuiz is our answer to it.
            </p>
            <p>
              Our mission is to democratize high-quality, personalized education. We believe that every learner deserves a private tutor who can instantly turn any piece of text into a challenging, insightful assessment. By leveraging the power of the Gemini 1.5 Flash model, we've built an engine that doesn't just "read" your notes—it understands them. It identifies the nuances, the critical connections, and the potential pitfalls in your understanding, crafting questions that push you to think deeper.
            </p>
            <p>
              Since our inception, we have focused on three core pillars: <strong>Speed</strong>, <strong>Accuracy</strong>, and <strong>Accessibility</strong>. We know that when you're in the "flow state" of studying, every second counts. That's why our AI generates comprehensive study packages in under 15 seconds. We ensure accuracy by using sophisticated prompt engineering that minimizes hallucinations and maximizes educational value. And through our multilingual support, we ensure that whether you're studying in Hindi or English, the quality of your learning remains world-class.
            </p>
            <p>
              QuickQuiz isn't just a tool; it's a movement toward more intentional, effective, and joyful learning. We are constantly evolving, integrating the latest research in cognitive science and artificial intelligence to ensure that your study sessions are not just busy work, but true progress toward mastery.
            </p>
          </div>
        </section>

        {/* Section 2: Why Quizzes Help Learning */}
        <section id="learning-science" className="bg-slate-900 -mx-4 md:-mx-12 px-6 md:px-20 py-20 md:py-32 rounded-[2.5rem] md:rounded-[4rem] text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-blue-500/10 rounded-full blur-[80px] md:blur-[120px]"></div>
          <div className="absolute bottom-0 left-0 w-64 md:w-96 h-64 md:h-96 bg-indigo-500/10 rounded-full blur-[80px] md:blur-[120px]"></div>
          
          <div className="max-w-5xl mx-auto relative z-10">
            <div className="flex items-center gap-4 md:gap-6 mb-8 md:mb-12">
              <span className="text-[8px] md:text-[10px] font-black text-blue-400 uppercase tracking-[0.4em]">The Science of Learning</span>
              <div className="h-px flex-grow bg-white/10"></div>
            </div>
            <h2 className="text-3xl md:text-6xl font-black text-white mb-10 md:mb-16 tracking-tight font-display leading-tight">
              Why Quizzing is the <br />Ultimate Learning Hack
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-start">
              <div className="space-y-8 text-slate-400 font-medium text-base md:text-lg leading-relaxed">
                <p>
                  Most people think of quizzes as a way to <em>test</em> what they've learned. At QuickQuiz, we know that quizzes are actually a way to <strong>learn</strong>. This is based on a cognitive phenomenon called the "Testing Effect." When you try to retrieve information from your memory, you aren't just checking if it's there—you are actually strengthening the neural pathways that lead to that information.
                </p>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-1.5 h-1.5 mt-2.5 bg-blue-500 rounded-full"></div>
                    <p><strong className="text-white">Active Recall:</strong> Unlike passive reading, active recall forces your brain to reconstruct the information. This effortful processing signals to your brain that the information is important, making it much more likely to be stored in long-term memory.</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-1.5 h-1.5 mt-2.5 bg-indigo-500 rounded-full"></div>
                    <p><strong className="text-white">Metacognition:</strong> Quizzing provides immediate feedback. You quickly realize what you <em>actually</em> know versus what you <em>think</em> you know. This eliminates the "Illusion of Competence" that often comes from re-reading familiar text.</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-1.5 h-1.5 mt-2.5 bg-violet-500 rounded-full"></div>
                    <p><strong className="text-white">Contextual Encoding:</strong> Our AI-generated explanations provide the "Why" behind the "What." By understanding the logic of a correct answer, you encode the information within a broader context, making it easier to apply in different scenarios.</p>
                  </div>
                </div>
                <p>
                  By integrating these principles into a seamless, AI-driven workflow, QuickQuiz transforms your study sessions from a chore into a high-intensity workout for your mind. You'll find that you remember more, understand deeper, and perform better under pressure.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-6">
                <div className="bg-white/5 backdrop-blur-xl p-8 md:p-10 rounded-[2.5rem] border border-white/10 space-y-6">
                  <h4 className="text-xl md:text-2xl font-black text-white font-display">The Forgetting Curve</h4>
                  <p className="text-slate-400 font-medium leading-relaxed">
                    Without active review, humans forget nearly 90% of new information within a month. Quizzing at strategic intervals (Spaced Repetition) flattens this curve, keeping your knowledge fresh and accessible indefinitely.
                  </p>
                  <div className="h-32 flex items-end gap-2 px-4">
                    {[40, 70, 50, 90, 60, 100].map((h, i) => (
                      <div key={i} className="flex-1 bg-blue-500/20 rounded-t-lg relative group">
                        <motion.div 
                          initial={{ height: 0 }}
                          whileInView={{ height: `${h}%` }}
                          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-600 to-indigo-500 rounded-t-lg"
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white/5 backdrop-blur-xl p-8 md:p-10 rounded-[2.5rem] border border-white/10 space-y-6">
                  <h4 className="text-xl md:text-2xl font-black text-white font-display">Neural Plasticity</h4>
                  <p className="text-slate-400 font-medium leading-relaxed">
                    Every time you answer a question correctly, you reinforce the synaptic connections related to that topic. QuickQuiz is designed to provide the "Desirable Difficulty" needed to trigger this growth without causing frustration.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Categories */}
        <section id="categories" className="max-w-5xl mx-auto">
          <div className="text-center mb-16 md:mb-24">
            <span className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4 md:mb-6 block">Explore Subjects</span>
            <h2 className="text-3xl md:text-6xl font-black text-slate-900 tracking-tight font-display mb-8">
              Master Any Domain
            </h2>
            <p className="text-slate-500 font-medium text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Our AI is trained on a vast corpus of academic and professional data, making it an expert across hundreds of disciplines.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
            {[
              { title: 'STEM & Engineering', items: ['Physics', 'Calculus', 'Organic Chemistry', 'Data Structures'], icon: '🔬', color: 'bg-blue-50 border-blue-100 text-blue-700' },
              { title: 'Medical & Life Sciences', items: ['Anatomy', 'Pharmacology', 'Genetics', 'Microbiology'], icon: '🧬', color: 'bg-emerald-50 border-emerald-100 text-emerald-700' },
              { title: 'Humanities & Social', items: ['World History', 'Philosophy', 'Sociology', 'Political Science'], icon: '🏛️', color: 'bg-amber-50 border-amber-100 text-amber-700' },
              { title: 'Business & Finance', items: ['Microeconomics', 'Accounting', 'Marketing Strategy', 'Corporate Law'], icon: '📊', color: 'bg-indigo-50 border-indigo-100 text-indigo-700' },
              { title: 'Languages & Arts', items: ['Linguistics', 'Art History', 'Music Theory', 'Creative Writing'], icon: '🎨', color: 'bg-rose-50 border-rose-100 text-rose-700' },
              { title: 'Professional Skills', items: ['Project Management', 'Cybersecurity', 'Public Speaking', 'Ethics'], icon: '💼', color: 'bg-slate-100 border-slate-200 text-slate-700' }
            ].map((cat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`p-8 md:p-10 rounded-[2.5rem] border-2 ${cat.color} hover:shadow-2xl transition-all duration-500 group`}
              >
                <div className="text-4xl md:text-5xl mb-6 group-hover:scale-125 transition-transform duration-500 inline-block">{cat.icon}</div>
                <h3 className="text-xl md:text-2xl font-black mb-6 font-display">{cat.title}</h3>
                <ul className="space-y-3">
                  {cat.items.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3 font-bold text-sm md:text-base opacity-80">
                      <div className="w-1.5 h-1.5 rounded-full bg-current opacity-40"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Section 4: Popular Quizzes */}
        <section id="popular-quizzes" className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 md:p-20 rounded-[2.5rem] md:rounded-[4rem] text-white overflow-hidden relative shadow-2xl">
            <div className="absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-blue-500/10 rounded-full blur-[80px] md:blur-[100px]"></div>
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 md:mb-20">
                <div className="max-w-xl">
                  <span className="text-[8px] md:text-[10px] font-black text-blue-400 uppercase tracking-[0.4em] mb-4 block">Community Favorites</span>
                  <h2 className="text-3xl md:text-5xl font-black tracking-tight font-display">Popular Study Paths</h2>
                  <p className="text-slate-400 font-medium text-lg md:text-xl mt-6 leading-relaxed">
                    Join thousands of other students who are currently mastering these high-demand topics.
                  </p>
                </div>
                <div className="flex gap-4">
                   <div className="px-6 py-3 bg-white/5 rounded-2xl border border-white/10 text-center">
                     <span className="block text-2xl font-black">1.2M+</span>
                     <span className="text-[8px] uppercase font-black text-slate-500 tracking-widest">Questions Generated</span>
                   </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                {[
                  { title: 'The French Revolution', desc: 'Master the complex social and political upheaval of 18th century France.', count: '45k students', icon: '🇫🇷' },
                  { title: 'Human Anatomy 101', desc: 'A deep dive into the skeletal and muscular systems of the human body.', count: '120k students', icon: '🦴' },
                  { title: 'Intro to Quantum Physics', desc: 'Understanding the fundamental particles and forces that govern reality.', count: '32k students', icon: '⚛️' },
                  { title: 'Modern Macroeconomics', desc: 'Analyze global markets, inflation, and fiscal policy in the 21st century.', count: '28k students', icon: '📈' },
                  { title: 'Artificial Intelligence', desc: 'From neural networks to ethics: everything you need to know about AI.', count: '89k students', icon: '🤖' },
                  { title: 'World War II History', desc: 'The definitive guide to the global conflict that shaped the modern world.', count: '64k students', icon: '🌍' }
                ].map((quiz, i) => (
                  <button 
                    key={i}
                    onClick={() => {
                      setTopic(quiz.title);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="p-6 md:p-8 bg-white/5 backdrop-blur-md border border-white/10 rounded-[2rem] text-left hover:bg-white/10 transition-all group flex items-start gap-6"
                  >
                    <div className="text-4xl md:text-5xl group-hover:scale-110 transition-transform">{quiz.icon}</div>
                    <div>
                      <h4 className="text-lg md:text-xl font-black text-white mb-2 font-display group-hover:text-blue-600 transition-colors">{quiz.title}</h4>
                      <p className="text-slate-400 text-sm font-medium leading-relaxed mb-4">{quiz.desc}</p>
                      <div className="flex items-center gap-2 text-[10px] font-black text-blue-400 uppercase tracking-widest">
                        <Target className="w-3 h-3" />
                        {quiz.count}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: How It Works - Detailed Breakdown */}
        <section id="how-it-works" className="max-w-5xl mx-auto pb-20 md:pb-32">
          <div className="text-center mb-16 md:mb-24">
            <span className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4 md:mb-6 block">The Workflow</span>
            <h2 className="text-3xl md:text-6xl font-black text-slate-900 tracking-tight font-display mb-8">
              From Notes to Mastery <br />in <span className="text-blue-600">Three Simple Steps</span>
            </h2>
          </div>

          <div className="space-y-12 md:space-y-20">
            {[
              { 
                step: '01', 
                title: 'Input Your Material', 
                desc: 'Whether you have a digital PDF, a physical textbook, or a messy pile of handwritten notes, QuickQuiz can handle it. Our advanced OCR technology reads through images with incredible precision, while our text-processing engine can ingest up to 10,000 characters at once. Simply paste your text or snap a photo using your mobile device\'s camera.',
                details: 'We support a wide range of formats and styles. You can even provide a specific topic name to help the AI narrow down the context and generate more relevant questions.',
                icon: <FileText className="w-10 h-10" />,
                color: 'bg-blue-600'
              },
              { 
                step: '02', 
                title: 'AI Analysis & Generation', 
                desc: 'Once your material is uploaded, our AI study engine goes to work. It doesn\'t just look for keywords; it performs a deep semantic analysis of the content. It identifies the core thesis, supporting evidence, key dates, and complex relationships within the text.',
                details: 'The AI then crafts a comprehensive study package: a 300-word introductory article to prime your brain, a set of challenging multiple-choice questions, and a 300-word concluding summary. Every question is designed to test understanding, not just recognition.',
                icon: <Sparkles className="w-10 h-10" />,
                color: 'bg-indigo-600'
              },
              { 
                step: '03', 
                title: 'Active Practice & Review', 
                desc: 'This is where the magic happens. You engage with the quiz, forcing your brain to retrieve the information you just read. If you get a question wrong, don\'t worry—our AI provides a detailed explanation for every single answer, helping you understand the "why" behind the correct choice.',
                details: 'After the quiz, you receive a performance report highlighting your strengths and identifying specific "Weak Areas" that need more attention. You can export your results to JSON or CSV for long-term tracking or print them out for offline study.',
                icon: <Target className="w-10 h-10" />,
                color: 'bg-violet-600'
              }
            ].map((item, i) => (
              <div key={i} className="flex flex-col lg:flex-row gap-10 md:gap-20 items-center">
                <div className="lg:w-1/2 space-y-6 md:space-y-8">
                  <div className="flex items-center gap-6">
                    <span className="text-5xl md:text-7xl font-black text-slate-100 font-display">{item.step}</span>
                    <div className={`w-16 h-16 md:w-20 md:h-20 ${item.color} rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-current/20`}>
                      {item.icon}
                    </div>
                  </div>
                  <h3 className="text-2xl md:text-4xl font-black text-slate-900 font-display">{item.title}</h3>
                  <p className="text-slate-600 text-lg md:text-xl font-medium leading-relaxed">
                    {item.desc}
                  </p>
                  <p className="text-slate-400 text-sm md:text-base font-medium leading-relaxed italic border-l-4 border-slate-100 pl-6">
                    {item.details}
                  </p>
                </div>
                <div className="lg:w-1/2 w-full">
                  <div className="aspect-video bg-slate-50 rounded-[2.5rem] border-2 border-slate-100 overflow-hidden relative group">
                    <img 
                      src={`https://picsum.photos/seed/step${i}/800/600`} 
                      className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-700" 
                      alt={item.title} 
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                    <div className="absolute bottom-8 left-8 right-8">
                      <div className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl inline-block text-[10px] font-black text-white uppercase tracking-widest mb-2">
                        Step {item.step} Preview
                      </div>
                      <p className="text-white/80 text-xs font-bold">Visualizing the {item.title.toLowerCase()} process.</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-24 md:mt-40 pt-12 md:pt-20 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="flex -space-x-4">
                {[5, 6, 7, 8].map(i => (
                  <img key={i} src={`https://picsum.photos/seed/user${i}/100/100`} className="w-12 h-12 rounded-full border-4 border-white shadow-lg" alt="User" referrerPolicy="no-referrer" />
                ))}
              </div>
              <p className="text-slate-500 font-bold text-sm">Join 50,000+ active learners this week</p>
            </div>
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="w-full md:w-auto px-10 py-5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-3 text-lg"
            >
              Start Your Quiz Now
              <ArrowRight className="w-5 h-5" />
            </button>
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
