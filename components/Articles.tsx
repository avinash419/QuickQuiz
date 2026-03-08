
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Article, articles } from '../data/articles';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Clock, Calendar, ArrowRight, Sparkles, BookOpen } from 'lucide-react';

interface ArticlesProps {
  onBack: () => void;
}

const Articles: React.FC<ArticlesProps> = ({ onBack }) => {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  if (selectedArticle) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12"
      >
        <button 
          onClick={() => setSelectedArticle(null)}
          className="flex items-center gap-2 md:gap-3 text-blue-600 font-black mb-6 md:mb-10 hover:-translate-x-2 transition-transform uppercase text-[10px] md:text-xs tracking-widest"
        >
          <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
          Back to Articles
        </button>

        <div className="bg-white rounded-[2rem] md:rounded-[3rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] border border-slate-200/60 overflow-hidden">
          {selectedArticle.imageUrl && (
            <div className="w-full h-[300px] md:h-[500px] overflow-hidden">
              <img 
                src={selectedArticle.imageUrl} 
                alt={selectedArticle.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          )}
          
          <div className="p-6 md:p-16">
            <div className="flex flex-wrap items-center gap-3 md:gap-4 mb-6 md:mb-10">
              <span className="px-3 md:px-4 py-1 md:py-1.5 bg-blue-600 text-white text-[8px] md:text-[10px] font-black rounded-full uppercase tracking-[0.2em]">
                {selectedArticle.category}
              </span>
              <div className="flex items-center gap-1.5 md:gap-2 text-slate-400 text-[10px] md:text-xs font-bold">
                <Calendar className="w-3.5 h-3.5 md:w-4 md:h-4" />
                {selectedArticle.date}
              </div>
              <div className="flex items-center gap-1.5 md:gap-2 text-slate-400 text-[10px] md:text-xs font-bold">
                <Clock className="w-3.5 h-3.5 md:w-4 md:h-4" />
                {selectedArticle.readTime} read
              </div>
            </div>
            
            <div className="prose prose-slate max-w-none prose-headings:font-black prose-headings:tracking-tight prose-p:leading-relaxed prose-a:text-blue-600 prose-img:rounded-[1.5rem] md:prose-img:rounded-[2rem] prose-img:shadow-2xl font-medium text-base md:text-xl text-slate-700">
              <ReactMarkdown>{selectedArticle.content}</ReactMarkdown>
            </div>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-12 md:mt-16 p-8 md:p-12 bg-slate-900 rounded-[2rem] md:rounded-[3rem] text-white text-center shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-48 md:w-64 h-48 md:h-64 bg-blue-500/10 rounded-full blur-[80px] md:blur-[100px]"></div>
          <h3 className="text-2xl md:text-4xl font-black mb-4 md:mb-6 font-display">Ready to test what you learned?</h3>
          <p className="text-slate-400 mb-8 md:mb-10 text-base md:text-xl font-medium max-w-2xl mx-auto">Turn these insights into a quiz and master the topic with AI-powered practice!</p>
          <button 
            onClick={onBack}
            className="w-full sm:w-auto px-10 md:px-12 py-4 md:py-5 bg-blue-600 text-white font-black rounded-xl md:rounded-2xl hover:bg-blue-700 transition-all shadow-xl active:scale-95 text-base md:text-lg"
          >
            Create a Quiz Now
          </button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-8 mb-12 md:mb-20">
        <div className="max-w-3xl">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4"
          >
            <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
            <span className="text-blue-600 font-black text-[8px] md:text-[10px] uppercase tracking-[0.4em]">Knowledge Hub</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-7xl font-black text-slate-900 mb-4 md:mb-6 tracking-tight font-display leading-tight"
          >
            Learning <span className="text-blue-600">Resources</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 text-lg md:text-2xl font-medium leading-relaxed"
          >
            Deep dives into the world of quizzes, general knowledge, and effective study habits.
          </motion.p>
        </div>
        <motion.button 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={onBack}
          className="w-full md:w-auto px-6 md:px-8 py-3.5 md:py-4 bg-white text-slate-900 font-black rounded-xl md:rounded-2xl border-2 border-slate-100 hover:border-blue-200 hover:bg-slate-50 transition-all shadow-sm active:scale-95 text-[10px] md:text-sm uppercase tracking-widest"
        >
          Back to Home
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
        {articles.map((article, index) => (
          <motion.div 
            key={article.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            className="group bg-white rounded-[2rem] md:rounded-[3rem] border border-slate-200/60 hover:border-blue-400 hover:shadow-[0_40px_80px_-20px_rgba(59,130,246,0.15)] transition-all cursor-pointer flex flex-col relative overflow-hidden"
            onClick={() => setSelectedArticle(article)}
          >
            {article.imageUrl && (
              <div className="w-full h-48 md:h-64 overflow-hidden">
                <img 
                  src={article.imageUrl} 
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}
            <div className="p-6 md:p-10">
              <div className="absolute top-0 right-0 p-6 md:p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <Sparkles className="w-16 h-16 md:w-24 md:h-24" />
              </div>
              <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                <span className="px-3 md:px-4 py-1 md:py-1.5 bg-slate-100 text-slate-600 text-[8px] md:text-[10px] font-black rounded-full uppercase tracking-[0.2em] group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  {article.category}
                </span>
                <div className="flex items-center gap-1.5 md:gap-2 text-slate-400 text-[8px] md:text-[10px] font-black uppercase tracking-widest">
                  <Clock className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  {article.readTime} read
                </div>
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-4 md:mb-6 group-hover:text-blue-600 transition-colors leading-tight font-display">
                {article.title}
              </h3>
              <p className="text-slate-500 font-medium mb-8 md:mb-10 line-clamp-3 leading-relaxed text-base md:text-lg">
                {article.excerpt}
              </p>
              <div className="mt-auto flex items-center gap-2 md:gap-3 text-blue-600 font-black text-[10px] md:text-sm uppercase tracking-widest">
                Read Article
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-2 transition-transform" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="mt-20 md:mt-32 text-center"
      >
        <div className="inline-flex items-center gap-2 md:gap-3 px-4 md:px-6 py-2 md:py-3 bg-amber-50 text-amber-700 rounded-full text-[10px] md:text-xs font-black mb-6 md:mb-8 uppercase tracking-[0.3em] border border-amber-100">
          <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4" />
          More Articles Coming Soon
        </div>
        <p className="text-slate-400 font-medium max-w-xl mx-auto text-base md:text-lg leading-relaxed">
          We are constantly adding new guides and resources to help you master any subject. Check back often for fresh insights!
        </p>
      </motion.div>
    </div>
  );
};

export default Articles;
