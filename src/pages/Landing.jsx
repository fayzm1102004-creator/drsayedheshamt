import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ShieldCheck, Users, ArrowLeft, Library, Sparkles } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans selection:bg-amber-500/30 overflow-hidden relative">
      {/* Immersive Islamic Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23d4af37\' fill-opacity=\'0.04\'%3E%3Cpath d=\'M50 0L0 50l50 50 50-50L50 0zm0 10l40 40-40 40L10 50 50 10z\'/%3E%3C/g%3E%3C/svg%3E')] mix-blend-multiply pointer-events-none z-0"></div>
      
      {/* Decorative Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-emerald-900/20 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-amber-500/15 rounded-full blur-[120px] pointer-events-none z-0"></div>

      {/* Navbar */}
      <nav className="relative z-20 flex justify-between items-center px-10 py-6 max-w-7xl mx-auto backdrop-blur-sm border-b border-amber-900/10 mb-10">
        <div className="flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-amber-500" />
          <span className="text-xl font-['Aref_Ruqaa'] font-bold text-emerald-950">الجامع التاريخي</span>
        </div>
        <div>
          <Link to="/login" className="px-6 py-2.5 bg-white border border-emerald-900/20 text-emerald-950 hover:bg-emerald-50 rounded-xl font-bold transition-all shadow-sm hover:shadow-md flex items-center gap-2">
            تسجيل الدخول
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12 lg:py-20 flex flex-col items-center text-center">
        
        {/* Ornate Quranic Page Container */}
        <div className="relative p-10 md:p-16 bg-[#FDFBF7] rounded-3xl border-[6px] border-double border-amber-600/40 shadow-[inset_0_0_60px_rgba(212,175,55,0.15),0_20px_50px_rgba(0,0,0,0.05)] w-full max-w-5xl mb-12 flex flex-col items-center overflow-hidden animate-in zoom-in-95 duration-1000">
          
          {/* Detailed Islamic Pattern Background inside the container */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23064e3b\' fill-opacity=\'0.03\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-80 mix-blend-multiply pointer-events-none z-0"></div>

          {/* Corner Decorations */}
          <div className="absolute top-4 left-4 w-12 h-12 border-t-[3px] border-l-[3px] border-amber-500 rounded-tl-2xl opacity-60"></div>
          <div className="absolute top-4 right-4 w-12 h-12 border-t-[3px] border-r-[3px] border-amber-500 rounded-tr-2xl opacity-60"></div>
          <div className="absolute bottom-4 left-4 w-12 h-12 border-b-[3px] border-l-[3px] border-amber-500 rounded-bl-2xl opacity-60"></div>
          <div className="absolute bottom-4 right-4 w-12 h-12 border-b-[3px] border-r-[3px] border-amber-500 rounded-br-2xl opacity-60"></div>
          
          {/* Header Ornament */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-8 bg-amber-600/10 rounded-b-[100%] border-b border-amber-600/30"></div>

          <h1 className="text-[3.2rem] md:text-[4.5rem] leading-[1.3] font-['Aref_Ruqaa'] font-bold mb-6 max-w-4xl relative z-10 mt-4 text-center">
            <span className="bg-clip-text text-transparent bg-gradient-to-l from-amber-500 via-amber-600 to-amber-700 drop-shadow-sm">الجامع التاريخى</span>
            <br />
            <span className="text-emerald-950 text-[2.2rem] md:text-[3rem] mt-4 inline-block">لشواهد البحث فى لغة القرآن الكريم</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-emerald-950/80 max-w-3xl leading-relaxed font-semibold relative z-10 text-center px-4">
            المنصة الرقمية المتكاملة المخصصة لجمع وتوثيق وتدقيق الشواهد التاريخية لألفاظ القرآن الكريم، لخدمة الباحثين واللجان العلمية في بيئة عمل مؤسسية ومترابطة.
          </p>

          {/* Footer Ornament */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-40 h-8 bg-amber-600/10 rounded-t-[100%] border-t border-amber-600/30"></div>
        </div>

        <div className="flex flex-col sm:flex-row gap-5 mb-24 animate-in slide-in-from-bottom-8 duration-1000 delay-300">
          <Link to="/login" className="px-10 py-4 bg-emerald-950 hover:bg-emerald-900 text-white rounded-2xl font-bold text-lg transition-all duration-300 hover:shadow-[0_8px_25px_rgba(5,150,105,0.4)] hover:-translate-y-1 flex items-center justify-center gap-3">
            الدخول لمساحة العمل
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 w-full max-w-6xl animate-in slide-in-from-bottom-10 duration-1000 delay-500">
          <div className="bg-white/80 backdrop-blur-xl p-10 rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.03)] border border-white border-t-[4px] border-t-amber-500 text-right group hover:-translate-y-2 transition-transform duration-300">
            <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 text-emerald-700 group-hover:scale-110 group-hover:bg-emerald-100 transition-all">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-['Aref_Ruqaa'] font-bold text-emerald-950 mb-4">مسارات عمل موازية</h3>
            <p className="text-stone-500 font-medium leading-relaxed">
              هيكلية إدارية متطورة تدعم اللجان المتوازية لضمان سرعة الإنجاز ودقة المراجعة في نفس الوقت.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-xl p-10 rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.03)] border border-white border-t-[4px] border-t-emerald-600 text-right group hover:-translate-y-2 transition-transform duration-300">
            <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mb-6 text-amber-600 group-hover:scale-110 group-hover:bg-amber-100 transition-all">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-['Aref_Ruqaa'] font-bold text-emerald-950 mb-4">اعتماد علمي دقيق</h3>
            <p className="text-stone-500 font-medium leading-relaxed">
              سلسلة من الاعتمادات العلمية والتدقيق الشامل لضمان خلو الشواهد من أي شوائب أو أخطاء تاريخية.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-xl p-10 rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.03)] border border-white border-t-[4px] border-t-amber-500 text-right group hover:-translate-y-2 transition-transform duration-300">
            <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 text-emerald-700 group-hover:scale-110 group-hover:bg-emerald-100 transition-all">
              <Library className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-['Aref_Ruqaa'] font-bold text-emerald-950 mb-4">مكتبة تاريخية شاملة</h3>
            <p className="text-stone-500 font-medium leading-relaxed">
              قاعدة بيانات مركزية تجمع ملايين الشواهد والكتب في مكان واحد، جاهزة للعرض والبحث والتحقيق.
            </p>
          </div>
        </div>

      </main>
      
      {/* Footer */}
      <footer className="relative z-10 border-t border-amber-900/10 mt-20 py-8 text-center bg-white/50 backdrop-blur-md">
        <p className="text-sm font-bold text-emerald-950/60 uppercase tracking-widest">جميع الحقوق محفوظة © مجمع الشارقة 2026</p>
      </footer>
    </div>
  );
}
