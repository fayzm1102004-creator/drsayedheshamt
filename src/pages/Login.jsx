import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (login(email, password)) {
      navigate('/dashboard');
    } else {
      setError('البريد الإلكتروني أو كلمة المرور غير صحيحة. يرجى التحقق من بيانات الدخول.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f5ec] dark:bg-[#020617] px-4 py-12 transition-colors duration-500 selection:bg-amber-500/30 bg-[url('data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23064e3b\' fill-opacity=\'0.02\'%3E%3Cpath d=\'M50 0L0 50l50 50 50-50L50 0zm0 10l40 40-40 40L10 50 50 10z\'/%3E%3C/g%3E%3C/svg%3E')] dark:bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23d4af37\' fill-opacity=\'0.04\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] relative">
      
      {/* Absolute Theme Toggle for Login Page */}
      <button 
        onClick={toggleTheme}
        className="absolute top-6 left-6 p-4 text-[#064e3b] dark:text-amber-400 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md rounded-full shadow-sm hover:shadow-md transition-all duration-300 border border-[#064e3b]/10 dark:border-amber-500/20"
        title={theme === 'light' ? 'تفعيل الوضع الداكن' : 'تفعيل الوضع الفاتح'}
      >
        {theme === 'light' ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
      </button>

      {/* Main Login Card */}
      <div className="max-w-md w-full space-y-8 bg-gradient-to-br from-white/95 to-[#f8f5ec]/95 dark:bg-slate-900/90 backdrop-blur-3xl p-12 rounded-[2rem] shadow-[0_20px_60px_rgba(6,78,59,0.08)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.6)] border border-[#d4af37]/30 dark:border-slate-800 border-t-[6px] border-t-[#064e3b] dark:border-t-amber-500 relative overflow-hidden transition-colors duration-500 z-10">
        
        {/* Decorative inner glow for dark mode */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4af37]/10 dark:bg-amber-500/10 rounded-full blur-[60px] pointer-events-none"></div>

        <div className="text-center pb-4 relative z-10">
          <h2 className="mt-2 text-[2.5rem] font-['Aref_Ruqaa'] font-bold bg-clip-text text-transparent bg-gradient-to-l from-[#064e3b] via-[#022c22] to-[#064e3b] dark:from-amber-400 dark:via-amber-500 dark:to-amber-700 drop-shadow-sm tracking-tight leading-normal">الجامع التاريخى</h2>
          <p className="mt-4 text-sm text-[#064e3b]/80 dark:text-amber-100/70 font-bold tracking-widest uppercase transition-colors duration-500">لشواهد البحث فى لغة القرآن الكريم</p>
        </div>
        
        {error && (
          <div className="bg-rose-50 border-l-4 border-rose-500 text-rose-700 p-4 rounded-r-lg text-sm shadow-sm" role="alert">
            <p className="font-semibold mb-1">خطأ في المصادقة</p>
            <p>{error}</p>
          </div>
        )}

        <form className="mt-8 space-y-6 relative z-10" onSubmit={handleSubmit}>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-[#064e3b] dark:text-amber-50 mb-2 transition-colors duration-500">البريد الإلكتروني</label>
              <input
                type="email"
                required
                className="appearance-none block w-full px-4 py-3 bg-white/50 dark:bg-slate-950 border border-[#d4af37]/40 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#064e3b]/50 focus:border-[#064e3b] dark:focus:border-amber-500 focus:bg-white dark:focus:bg-slate-900 transition-all duration-200 text-[#064e3b] dark:text-amber-50 sm:text-sm shadow-[inset_0_2px_10px_rgba(6,78,59,0.02)]"
                placeholder="أدخل بريدك الإلكتروني"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#064e3b] dark:text-amber-50 mb-2 transition-colors duration-500">كلمة المرور</label>
              <input
                type="password"
                required
                className="appearance-none block w-full px-4 py-3 bg-white/50 dark:bg-slate-950 border border-[#d4af37]/40 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#064e3b]/50 focus:border-[#064e3b] dark:focus:border-amber-500 focus:bg-white dark:focus:bg-slate-900 transition-all duration-200 text-[#064e3b] dark:text-amber-50 sm:text-sm shadow-[inset_0_2px_10px_rgba(6,78,59,0.02)]"
                placeholder="أدخل كلمة المرور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-4 px-4 border border-transparent text-[15px] font-bold rounded-2xl text-white bg-gradient-to-l from-[#064e3b] to-[#022c22] hover:from-[#022c22] hover:to-[#064e3b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#064e3b] hover:-translate-y-1 hover:shadow-[0_8px_25px_rgba(6,78,59,0.4)] transition-all duration-300 ease-in-out"
            >
              تسجيل الدخول
            </button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-[#064e3b]/10 dark:border-slate-800 relative z-10 transition-colors duration-500">
          <h3 className="text-[11px] font-bold text-[#064e3b]/50 dark:text-slate-500 uppercase tracking-widest mb-4 text-center">حسابات النظام واللجان (للمعاينة)</h3>
          <div className="grid grid-cols-2 gap-4">
            <ul className="text-xs text-[#064e3b]/70 dark:text-slate-400 space-y-3 transition-colors duration-500">
              <li className="flex flex-col"><span className="font-bold text-[#064e3b] dark:text-amber-50">الراصد</span> <span className="opacity-80 text-[#d97706] dark:text-amber-400">observer1@sharjah.com</span></li>
              <li className="flex flex-col"><span className="font-bold text-[#064e3b] dark:text-amber-50">المنسق</span> <span className="opacity-80 text-[#d97706] dark:text-amber-400">coordinator1@sharjah.com</span></li>
              <li className="flex flex-col"><span className="font-bold text-[#064e3b] dark:text-amber-50">لجنة المراجعة</span> <span className="opacity-80 text-[#d97706] dark:text-amber-400">review@sharjah.com</span></li>
              <li className="flex flex-col"><span className="font-bold text-[#064e3b] dark:text-amber-50">لجنة الاستدراك</span> <span className="opacity-80 text-[#d97706] dark:text-amber-400">correction@sharjah.com</span></li>
              <li className="flex flex-col"><span className="font-bold text-[#064e3b] dark:text-amber-50">المنسق الرئيس</span> <span className="opacity-80 text-[#d97706] dark:text-amber-400">main@sharjah.com</span></li>
            </ul>
            <ul className="text-xs text-[#064e3b]/70 dark:text-slate-400 space-y-3 transition-colors duration-500">
              <li className="flex flex-col"><span className="font-bold text-[#064e3b] dark:text-amber-50">لجنة التدقيق والتحرير</span> <span className="opacity-80 text-[#d97706] dark:text-amber-400">auditor@sharjah.com</span></li>
              <li className="flex flex-col"><span className="font-bold text-[#064e3b] dark:text-amber-50">اللجنة العلمية</span> <span className="opacity-80 text-[#d97706] dark:text-amber-400">scientific@sharjah.com</span></li>
              <li className="flex flex-col"><span className="font-bold text-[#064e3b] dark:text-amber-50">لجنة الاعتماد</span> <span className="opacity-80 text-[#d97706] dark:text-amber-400">approval@sharjah.com</span></li>
              <li className="flex flex-col"><span className="font-bold text-[#064e3b] dark:text-amber-50">المشرف المساعد</span> <span className="opacity-80 text-[#d97706] dark:text-amber-400">assistant@sharjah.com</span></li>
              <li className="flex flex-col"><span className="font-bold text-[#064e3b] dark:text-amber-50">المشرف العام</span> <span className="opacity-80 text-[#d97706] dark:text-amber-400">admin@sharjah.com</span></li>
            </ul>
          </div>
          <p className="text-[10px] text-center text-[#064e3b]/50 dark:text-slate-500 mt-5 font-medium transition-colors duration-500">(كلمة المرور لجميع الحسابات: 123456)</p>
        </div>
      </div>
    </div>
  );
}
