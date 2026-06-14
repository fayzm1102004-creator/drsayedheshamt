import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
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
    <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7] px-4 py-12 selection:bg-amber-500/30 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23d4af37\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-2xl border border-stone-200 border-t-4 border-t-emerald-800 relative overflow-hidden">
        
        <div className="text-center">
          <h2 className="mt-2 text-4xl font-['Amiri'] font-bold text-emerald-950 tracking-tight leading-loose">المعجم التاريخي للغة العربية</h2>
          <p className="mt-1 text-sm text-stone-500 font-medium tracking-wide uppercase">منصة الشارقة الذكية</p>
        </div>
        
        {error && (
          <div className="bg-rose-50 border-l-4 border-rose-500 text-rose-700 p-4 rounded-r-lg text-sm shadow-sm" role="alert">
            <p className="font-semibold mb-1">خطأ في المصادقة</p>
            <p>{error}</p>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-emerald-950 mb-2">البريد الإلكتروني</label>
              <input
                type="email"
                required
                className="appearance-none block w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 focus:bg-white transition-all duration-200 text-emerald-950 sm:text-sm shadow-sm"
                placeholder="أدخل بريدك الإلكتروني"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-emerald-950 mb-2">كلمة المرور</label>
              <input
                type="password"
                required
                className="appearance-none block w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 focus:bg-white transition-all duration-200 text-emerald-950 sm:text-sm shadow-sm"
                placeholder="أدخل كلمة المرور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3.5 px-4 border border-emerald-800 text-sm font-bold rounded-xl text-white bg-emerald-900 hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-900 hover:-translate-y-0.5 hover:shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all duration-300 ease-in-out"
            >
              تسجيل الدخول
            </button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-stone-100">
          <h3 className="text-[11px] font-bold text-stone-400 uppercase tracking-widest mb-4 text-center">حسابات النظام واللجان (للمعاينة)</h3>
          <div className="grid grid-cols-2 gap-4">
            <ul className="text-xs text-stone-600 space-y-3">
              <li className="flex flex-col"><span className="font-bold text-emerald-950">الراصد</span> <span className="opacity-80 text-amber-600">observer1@sharjah.com</span></li>
              <li className="flex flex-col"><span className="font-bold text-emerald-950">المنسق</span> <span className="opacity-80 text-amber-600">coordinator1@sharjah.com</span></li>
              <li className="flex flex-col"><span className="font-bold text-emerald-950">لجنة المراجعة</span> <span className="opacity-80 text-amber-600">review@sharjah.com</span></li>
              <li className="flex flex-col"><span className="font-bold text-emerald-950">لجنة الاستدراك</span> <span className="opacity-80 text-amber-600">correction@sharjah.com</span></li>
              <li className="flex flex-col"><span className="font-bold text-emerald-950">المنسق الرئيس</span> <span className="opacity-80 text-amber-600">main@sharjah.com</span></li>
            </ul>
            <ul className="text-xs text-stone-600 space-y-3">
              <li className="flex flex-col"><span className="font-bold text-emerald-950">لجنة التدقيق والتحرير</span> <span className="opacity-80 text-amber-600">auditor@sharjah.com</span></li>
              <li className="flex flex-col"><span className="font-bold text-emerald-950">اللجنة العلمية</span> <span className="opacity-80 text-amber-600">scientific@sharjah.com</span></li>
              <li className="flex flex-col"><span className="font-bold text-emerald-950">لجنة الاعتماد</span> <span className="opacity-80 text-amber-600">approval@sharjah.com</span></li>
              <li className="flex flex-col"><span className="font-bold text-emerald-950">المشرف المساعد</span> <span className="opacity-80 text-amber-600">assistant@sharjah.com</span></li>
              <li className="flex flex-col"><span className="font-bold text-emerald-950">المشرف العام</span> <span className="opacity-80 text-amber-600">admin@sharjah.com</span></li>
            </ul>
          </div>
          <p className="text-[10px] text-center text-stone-400 mt-5 font-medium">(كلمة المرور لجميع الحسابات: 123456)</p>
        </div>
      </div>
    </div>
  );
}
