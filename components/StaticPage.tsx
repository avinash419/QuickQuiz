
import React from 'react';
import { AppState } from '../types';
import { motion } from 'motion/react';
import { ArrowLeft, Info, Mail, Shield, FileText, AlertTriangle, Sparkles } from 'lucide-react';

interface StaticPageProps {
  type: AppState;
  onBack: () => void;
}

const StaticPage: React.FC<StaticPageProps> = ({ type, onBack }) => {
  const getContent = () => {
    switch (type) {
      case 'ABOUT':
        return {
          title: 'About QuickQuiz',
          icon: <Info className="w-12 h-12 text-blue-600" />,
          content: (
            <div className="space-y-8 md:space-y-10">
              <p className="text-lg md:text-2xl leading-relaxed text-slate-600 font-medium">QuickQuiz is an AI quiz generator designed for students and teachers. Upload your notes, Books, or photos and our AI will analyze the content to generate quizzes automatically.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div className="bg-slate-50 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-slate-100">
                  <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-3 md:mb-4 font-display">Our Mission</h3>
                  <p className="text-slate-600 leading-relaxed text-sm md:text-base">QuickQuiz is an AI-powered study tool designed to help students and lifelong learners master any subject with ease. Our mission is to make learning more interactive, efficient, and fun.</p>
                </div>
                <div className="bg-blue-50 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-blue-100">
                  <h3 className="text-xl md:text-2xl font-black text-blue-900 mb-3 md:mb-4 font-display">Our Vision</h3>
                  <p className="text-blue-800/80 leading-relaxed text-sm md:text-base">By leveraging the latest in AI technology, we've created a platform that turns your notes into personalized assessments in seconds, making high-quality education accessible to everyone.</p>
                </div>
              </div>
            </div>
          )
        };
      case 'CONTACT':
        return {
          title: 'Contact Us',
          icon: <Mail className="w-12 h-12 text-blue-600" />,
          content: (
            <div className="space-y-8 md:space-y-10">
              <p className="text-lg md:text-2xl leading-relaxed text-slate-600 font-medium">Have questions, feedback, or just want to say hello? We'd love to hear from you!</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div className="bg-white p-8 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 group hover:border-blue-200 transition-all">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-50 rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform">
                    <Mail className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-1 md:mb-2 font-display">Email Support</h3>
                  <p className="text-blue-600 text-lg md:text-xl font-black break-all">avi937288@gmail.com</p>
                  <p className="text-slate-400 mt-3 md:mt-4 text-[10px] md:text-sm font-bold uppercase tracking-widest">General Inquiries</p>
                </div>
                
                <div className="bg-white p-8 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 group hover:border-indigo-200 transition-all">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-indigo-50 rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform">
                    <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-indigo-600" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-1 md:mb-2 font-display">Mobile Number</h3>
                  <p className="text-indigo-600 text-lg md:text-xl font-black">9372881752</p>
                  <p className="text-slate-400 mt-3 md:mt-4 text-[10px] md:text-sm font-bold uppercase tracking-widest">Direct Contact</p>
                </div>
              </div>
              
              <div className="bg-slate-900 p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] text-white text-center">
                <h3 className="text-xl md:text-2xl font-black mb-3 md:mb-4 font-display">Response Time</h3>
                <p className="text-slate-400 text-base md:text-lg font-medium">We typically respond within 24-48 hours. Our team is working hard to help you master your subjects!</p>
              </div>
            </div>
          )
        };
      case 'PRIVACY':
        return {
          title: 'Privacy Policy',
          icon: <Shield className="w-12 h-12 text-blue-600" />,
          content: (
            <div className="space-y-8 text-lg">
              <div className="inline-block px-4 py-1.5 bg-slate-100 rounded-full text-slate-500 text-xs font-black uppercase tracking-widest mb-4">Last Updated: March 4, 2026</div>
              <p className="text-xl text-slate-600 font-medium leading-relaxed">At QuickQuiz, we take your privacy seriously. This policy explains how we collect, use, and protect your information.</p>
              
              <div className="space-y-12 mt-12">
                {[
                  { title: '1. Information We Collect', desc: 'We collect the text and images you provide for quiz generation. This data is processed by our AI partners (Google Gemini) to create your assessments.' },
                  { title: '2. How We Use Your Data', desc: 'Your data is used solely to provide the services you request. We do not sell your personal information to third parties.' },
                  { title: '3. Data Security', desc: 'We implement industry-standard security measures to protect your data from unauthorized access.' },
                  { title: '4. Third-Party Services', desc: 'We use Google Gemini for AI processing and Google AdSense for advertising. These services have their own privacy policies.' }
                ].map((section, i) => (
                  <div key={i} className="border-l-4 border-blue-600 pl-8">
                    <h3 className="text-2xl font-black text-slate-900 mb-4 font-display">{section.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{section.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )
        };
      case 'TERMS':
        return {
          title: 'Terms of Service',
          icon: <FileText className="w-12 h-12 text-blue-600" />,
          content: (
            <div className="space-y-8 text-lg">
              <div className="inline-block px-4 py-1.5 bg-slate-100 rounded-full text-slate-500 text-xs font-black uppercase tracking-widest mb-4">Last Updated: March 4, 2026</div>
              <p className="text-xl text-slate-600 font-medium leading-relaxed">By using QuickQuiz, you agree to the following terms and conditions:</p>
              
              <div className="space-y-12 mt-12">
                {[
                  { title: '1. Acceptance of Terms', desc: 'By accessing our site, you agree to be bound by these terms and all applicable laws and regulations.' },
                  { title: '2. Use License', desc: 'Permission is granted to use QuickQuiz for personal, non-commercial educational purposes only.' },
                  { title: '3. Disclaimer', desc: 'The quizzes generated by our AI are for educational purposes. While we strive for accuracy, we cannot guarantee the correctness of every question.' },
                  { title: '4. Limitations', desc: 'QuickQuiz shall not be held liable for any damages arising out of the use or inability to use our services.' }
                ].map((section, i) => (
                  <div key={i} className="border-l-4 border-slate-900 pl-8">
                    <h3 className="text-2xl font-black text-slate-900 mb-4 font-display">{section.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{section.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )
        };
      case 'DISCLAIMER':
        return {
          title: 'Disclaimer',
          icon: <AlertTriangle className="w-12 h-12 text-blue-600" />,
          content: (
            <div className="space-y-8 text-lg">
              <p className="text-xl text-slate-600 font-medium leading-relaxed">The information provided by QuickQuiz is for general educational purposes only.</p>
              
              <div className="grid grid-cols-1 gap-8 mt-12">
                {[
                  { title: 'AI Accuracy', desc: 'Our quizzes are generated using Artificial Intelligence. While highly advanced, AI can occasionally produce incorrect or misleading information. Users are encouraged to verify important facts with primary sources.' },
                  { title: 'No Professional Advice', desc: 'The content on this site does not constitute professional, medical, legal, or financial advice. Use of the information is at your own risk.' },
                  { title: 'External Links', desc: 'Our site may contain links to external websites. We are not responsible for the content or privacy practices of these third-party sites.' }
                ].map((section, i) => (
                  <div key={i} className="bg-amber-50 p-10 rounded-[2.5rem] border border-amber-100">
                    <h3 className="text-2xl font-black text-amber-900 mb-4 font-display">{section.title}</h3>
                    <p className="text-amber-800/80 leading-relaxed">{section.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )
        };
      default:
        return { title: '', icon: null, content: null };
    }
  };

  const { title, icon, content } = getContent();

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-10 md:py-16">
      <motion.button 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={onBack}
        className="flex items-center gap-2 md:gap-3 text-blue-600 font-black mb-8 md:mb-12 hover:-translate-x-2 transition-transform uppercase text-[10px] md:text-xs tracking-widest"
      >
        <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
        Back to Home
      </motion.button>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-20 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] border border-slate-200/60 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-8 md:p-12 opacity-5 [&>svg]:w-16 [&>svg]:h-16 md:[&>svg]:w-24 md:[&>svg]:h-24">
          {icon}
        </div>
        
        <div className="relative z-10">
          <h1 className="text-3xl md:text-7xl font-black text-slate-900 mb-10 md:mb-16 tracking-tight font-display leading-tight">
            {title}
          </h1>
          <div className="prose prose-slate max-w-none">
            {content}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default StaticPage;
