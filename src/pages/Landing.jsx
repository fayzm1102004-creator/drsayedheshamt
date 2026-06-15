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
        
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100/50 border border-amber-200/50 text-amber-800 text-sm font-bold mb-8 animate-in slide-in-from-bottom-4 duration-700">
          <Sparkles className="w-4 h-4" />
          <span>المنصة الرسمية لإمارة الشارقة</span>
        </div>

        <h1 className="text-[3.5rem] md:text-[5rem] leading-[1.2] font-['Aref_Ruqaa'] font-bold mb-8 max-w-4xl">
          <span className="bg-clip-text text-transparent bg-gradient-to-l from-amber-500 via-amber-600 to-amber-700 drop-shadow-sm">الجامع التاريخى</span>
          <br />
          <span className="text-emerald-950 text-[2.5rem] md:text-[3.5rem]">لشواهد البحث فى لغة القرآن الكريم</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-stone-600 mb-12 max-w-3xl leading-relaxed font-medium animate-in slide-in-from-bottom-6 duration-1000 delay-150">
          المنصة الرقمية المتكاملة المخصصة لجمع وتوثيق وتدقيق الشواهد التاريخية لألفاظ القرآن الكريم، لخدمة الباحثين واللجان العلمية في بيئة عمل مؤسسية ومترابطة.
        </p>

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
