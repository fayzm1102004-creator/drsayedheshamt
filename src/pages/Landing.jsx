import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

export default function Landing() {
  return (
    <div className="h-screen w-full bg-slate-950 flex flex-col relative overflow-hidden font-sans selection:bg-amber-500/30">
      
      {/* 1. Immersive Deep Gradient Background (Dark Teal/Emerald) */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#020617] via-[#064e3b] to-[#022c22] z-0"></div>

      {/* 2. Ornate Islamic Side Mandalas (using an intricate SVG pattern) */}
      {/* Left side pattern */}
      <div className="absolute top-0 left-0 w-full md:w-[45vw] h-full bg-[url('data:image/svg+xml,%3Csvg width=\'120\' height=\'120\' viewBox=\'0 0 120 120\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23fbbf24\' fill-opacity=\'0.08\'%3E%3Cpath d=\'M60 0L0 60l60 60 60-60L60 0zm0 10l40 40-40 40L20 50 60 10zm0 15l25 25-25 25-25-25 25-25zm0 10l15 15-15 15-15-15 15-15z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] mix-blend-color-dodge opacity-60 z-0 pointer-events-none mask-image:linear-gradient(to_right,black,transparent)]" style={{ WebkitMaskImage: 'linear-gradient(to right, black 20%, transparent 100%)' }}></div>
      
      {/* Right side pattern */}
      <div className="absolute top-0 right-0 w-full md:w-[45vw] h-full bg-[url('data:image/svg+xml,%3Csvg width=\'120\' height=\'120\' viewBox=\'0 0 120 120\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23fbbf24\' fill-opacity=\'0.08\'%3E%3Cpath d=\'M60 0L0 60l60 60 60-60L60 0zm0 10l40 40-40 40L20 50 60 10zm0 15l25 25-25 25-25-25 25-25zm0 10l15 15-15 15-15-15 15-15z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] mix-blend-color-dodge opacity-60 z-0 pointer-events-none transform scale-x-[-1]" style={{ WebkitMaskImage: 'linear-gradient(to right, black 20%, transparent 100%)' }}></div>
      
      {/* 3. Glowing center highlight to make text pop */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] md:w-[50vw] md:h-[50vw] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

      {/* 4. Top Header */}
      <header className="relative z-20 flex justify-end items-center px-8 md:px-16 py-6 w-full animate-in fade-in slide-in-from-top-8 duration-1000">
        <h2 className="text-amber-400/90 font-['Aref_Ruqaa'] text-xl md:text-2xl tracking-wide drop-shadow-md">الجامع التاريخي لشواهد البحث في لغة القرآن الكريم</h2>
      </header>

      {/* 5. Main Content */}
      <main className="flex-1 relative z-10 flex flex-col items-center justify-center px-4 text-center">
        
        {/* Massive Gold Title (3D embossed effect) */}
        <h1 className="text-[3rem] md:text-[5.5rem] lg:text-[7rem] leading-[1.2] md:leading-[1.1] font-['Aref_Ruqaa'] font-bold mb-6 animate-in zoom-in-95 duration-1000 delay-150">
          <span className="bg-clip-text text-transparent bg-gradient-to-b from-[#fef08a] via-[#d97706] to-[#78350f] drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)]" style={{ WebkitTextStroke: '2px rgba(252, 211, 77, 0.2)' }}>
            الجامع التاريخى لشواهد
            <br />
            البحث فى لغة القرآن الكريم
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base md:text-xl text-teal-50/90 max-w-4xl leading-relaxed font-bold mb-10 drop-shadow-lg animate-in slide-in-from-bottom-6 duration-1000 delay-300">
          أهلاً بكم في الصرح الجامع للأدلة البحثية في لغة القرآن الكريم.
        </p>

        {/* Grand Button */}
        <div className="animate-in slide-in-from-bottom-10 duration-1000 delay-500">
          <Link 
            to="/login" 
            className="relative group px-14 py-4 md:py-5 bg-gradient-to-b from-[#065f46] to-[#022c22] rounded-full border-[3px] border-[#fbbf24] shadow-[0_0_50px_rgba(5,150,105,0.6),inset_0_0_20px_rgba(252,211,77,0.3)] transition-all duration-500 hover:scale-110 hover:shadow-[0_0_80px_rgba(252,211,77,0.6),inset_0_0_40px_rgba(252,211,77,0.6)] overflow-hidden flex items-center justify-center cursor-pointer"
          >
            {/* Button inner shine animation */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]"></div>
            
            <span className="text-[1.8rem] md:text-[2.5rem] font-['Aref_Ruqaa'] font-bold text-amber-50 relative z-10 drop-shadow-[0_3px_5px_rgba(0,0,0,0.8)] tracking-wide">
              دُخُولُ المِنَصَّةِ
            </span>
          </Link>
        </div>
      </main>

      {/* 6. Decorative Quran/Book Icon on Bottom Left (replaces illustration gracefully) */}
      <div className="absolute bottom-8 left-6 md:bottom-12 md:left-12 z-10 opacity-40 mix-blend-screen drop-shadow-[0_0_30px_rgba(251,191,36,0.6)] animate-pulse duration-3000 pointer-events-none">
        <BookOpen className="w-24 h-24 md:w-40 md:h-40 text-[#fbbf24]" strokeWidth={0.5} />
      </div>

      {/* 7. Footer */}
      <footer className="relative z-20 py-4 text-center animate-in fade-in duration-1000 delay-700">
        <p className="text-[10px] md:text-xs font-bold text-amber-400/60 tracking-widest">
          جميع الحقوق محفوظة - جامع الشارقة التاريخي
        </p>
      </footer>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}} />
    </div>
  );
}
