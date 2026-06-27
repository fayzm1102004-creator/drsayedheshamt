import React, { useState, useEffect } from 'react';
import * as Toast from '@radix-ui/react-toast';
import { Send, MessageSquarePlus, Mail, Calendar as CalendarIcon, User, Inbox, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Suggestions() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'level6';
  
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ title: '', category: 'عام', description: '' });
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    if (isAdmin) {
      const saved = localStorage.getItem('system_complaints');
      if (saved) {
        setComplaints(JSON.parse(saved));
      }
    }
  }, [isAdmin]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      const newComplaint = {
        id: Date.now(),
        title: formData.title,
        category: formData.category,
        description: formData.description,
        date: new Date().toLocaleDateString('ar-EG'),
        senderName: user?.name || 'مستخدم غير معروف',
        senderEmail: user?.email || 'بدون إيميل',
        status: 'جديدة'
      };

      const existing = localStorage.getItem('system_complaints');
      const complaintsArray = existing ? JSON.parse(existing) : [];
      complaintsArray.unshift(newComplaint);
      localStorage.setItem('system_complaints', JSON.stringify(complaintsArray));

      setIsSubmitting(false);
      setOpen(false); 
      setTimeout(() => {
        setOpen(true);
        setFormData({ title: '', category: 'عام', description: '' });
      }, 100);
    }, 800); // Simulate network delay
  };

  if (isAdmin) {
    return (
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 py-4">
        <div className="flex items-center gap-4 mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#064e3b] to-[#022c22] dark:from-amber-500/20 dark:to-amber-700/20 text-white dark:text-amber-400 shadow-lg">
            <Inbox className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-3xl font-extrabold text-[#064e3b] dark:text-amber-400 font-['Aref_Ruqaa']">صندوق الوارد للإدارة</h2>
            <p className="text-[#064e3b]/70 dark:text-slate-400 font-bold mt-1">الشكاوى والاقتراحات المرسلة من المستخدمين</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white/95 to-[#f8f5ec]/95 dark:bg-slate-900/90 backdrop-blur-3xl rounded-[2rem] shadow-[0_15px_40px_rgba(6,78,59,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] border border-[#d4af37]/40 dark:border-slate-800 p-8">
          {complaints.length === 0 ? (
            <div className="text-center py-16">
              <Inbox className="w-16 h-16 mx-auto text-[#064e3b]/20 dark:text-slate-600 mb-4" />
              <p className="text-lg font-bold text-[#064e3b]/50 dark:text-slate-400">لا توجد شكاوى أو اقتراحات حالياً</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {complaints.map(comp => (
                <div key={comp.id} className="bg-white/50 dark:bg-slate-950/50 p-6 rounded-2xl border border-[#d4af37]/20 dark:border-slate-800 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="inline-block px-3 py-1 bg-[#d4af37]/10 dark:bg-amber-500/10 text-[#064e3b] dark:text-amber-400 text-xs font-bold rounded-full mb-2 border border-[#d4af37]/30 dark:border-amber-500/20">{comp.category}</span>
                      <h3 className="text-xl font-bold text-[#064e3b] dark:text-amber-50">{comp.title}</h3>
                    </div>
                    <div className="flex items-center text-sm font-bold text-[#064e3b]/60 dark:text-slate-400 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-stone-100 dark:border-slate-800 shadow-sm">
                      <CalendarIcon className="w-4 h-4 ml-2" />
                      {comp.date}
                    </div>
                  </div>
                  <p className="text-[#064e3b]/80 dark:text-slate-300 leading-relaxed mb-6 bg-white/40 dark:bg-slate-900/40 p-4 rounded-xl border border-[#d4af37]/10 dark:border-slate-800/50">
                    {comp.description}
                  </p>
                  <div className="flex items-center gap-6 pt-4 border-t border-[#064e3b]/10 dark:border-slate-800 text-sm font-bold text-[#064e3b]/70 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-[#d4af37] dark:text-amber-500" />
                      <span>{comp.senderName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-[#d4af37] dark:text-amber-500" />
                      <span dir="ltr">{comp.senderEmail}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Normal User View
  return (
    <Toast.Provider swipeDirection="right">
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 py-4">
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#064e3b]/5 dark:bg-amber-500/10 text-[#064e3b] dark:text-amber-400 mb-4">
            <MessageSquarePlus className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-extrabold text-[#064e3b] dark:text-amber-50 font-['Aref_Ruqaa']">قسم الشكاوى والاقتراحات</h2>
          <p className="text-[#064e3b]/70 dark:text-slate-400 font-bold mt-3 text-lg">نحن نثمن رأيك. يسعدنا استقبال مقترحاتكم البناءة لتطوير منصة المعجم التاريخي.</p>
        </div>

        <div className="bg-gradient-to-br from-white/95 to-[#f8f5ec]/95 dark:bg-slate-900/90 backdrop-blur-3xl rounded-[2rem] shadow-[0_15px_40px_rgba(6,78,59,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] border border-[#d4af37]/40 dark:border-slate-800 p-10 relative overflow-hidden transition-colors duration-500">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#d4af37] to-[#064e3b] dark:from-amber-400 dark:to-amber-600"></div>
           
          <form onSubmit={handleSubmit} className="space-y-8 mt-4 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-bold text-[#064e3b] dark:text-amber-50 mb-2">عنوان الاقتراح أو الشكوى</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-5 py-3.5 bg-white/50 dark:bg-slate-950 border border-[#d4af37]/40 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#064e3b]/50 focus:border-[#064e3b] dark:focus:border-amber-500 focus:bg-white dark:focus:bg-slate-900 transition-all text-[#064e3b] dark:text-amber-50 font-medium placeholder-slate-400 dark:placeholder-slate-500 shadow-sm"
                  placeholder="أدخل عنواناً موجزاً وواضحاً..."
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#064e3b] dark:text-amber-50 mb-2">التصنيف الرئيسي</label>
                <div className="relative">
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-5 py-3.5 bg-white/50 dark:bg-slate-950 border border-[#d4af37]/40 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#064e3b]/50 focus:border-[#064e3b] dark:focus:border-amber-500 focus:bg-white dark:focus:bg-slate-900 transition-all text-[#064e3b] dark:text-amber-50 font-medium appearance-none shadow-sm cursor-pointer"
                  >
                    <option>عام (مقترح عام)</option>
                    <option>مشكلة تقنية في النظام</option>
                    <option>اقتراح لتطوير واجهة المستخدم</option>
                    <option>استفسار علمي أو لغوي</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-4 text-[#064e3b]/50 dark:text-slate-500">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#064e3b] dark:text-amber-50 mb-2">التفاصيل والشرح</label>
              <textarea
                required
                rows={6}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-5 py-4 bg-white/50 dark:bg-slate-950 border border-[#d4af37]/40 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#064e3b]/50 focus:border-[#064e3b] dark:focus:border-amber-500 focus:bg-white dark:focus:bg-slate-900 transition-all text-[#064e3b] dark:text-amber-50 font-medium placeholder-slate-400 dark:placeholder-slate-500 shadow-sm resize-y"
                placeholder="يرجى كتابة كافة التفاصيل المتعلقة بمقترحك أو الشكوى هنا ليتمكن الفريق المختص من مراجعتها بدقة..."
              />
            </div>

            <div className="flex justify-end pt-4 border-t border-[#064e3b]/10 dark:border-slate-800">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-l from-[#064e3b] to-[#022c22] dark:from-amber-500 dark:to-amber-700 text-white dark:text-slate-900 font-bold px-8 py-3.5 rounded-xl hover:shadow-[0_8px_25px_rgba(6,78,59,0.4)] dark:hover:shadow-[0_8px_25px_rgba(245,158,11,0.3)] focus:outline-none focus:ring-4 focus:ring-[#064e3b]/20 transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-3 disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {isSubmitting ? 'جاري الإرسال...' : 'إرسال الطلب'} <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>

      <Toast.Root
        className="bg-gradient-to-br from-emerald-50 to-white dark:from-slate-800 dark:to-slate-900 border border-emerald-200 dark:border-emerald-800 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-5 grid grid-cols-[auto_max-content] items-center gap-x-4 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:slide-in-from-bottom-[50px] data-[state=closed]:slide-out-to-bottom-[50px] data-[state=open]:fade-in data-[state=closed]:fade-out duration-300"
        open={open}
        onOpenChange={setOpen}
      >
        <div className="flex gap-4 items-center">
           <div className="bg-emerald-100 dark:bg-emerald-900/50 p-2.5 rounded-full shrink-0">
             <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
           </div>
           <div>
             <Toast.Title className="font-bold text-[#064e3b] dark:text-amber-50 text-[15px]">تم الإرسال بنجاح</Toast.Title>
             <Toast.Description className="mt-1 text-[13px] text-[#064e3b]/70 dark:text-slate-400 font-bold leading-relaxed">
               شكرًا لك. لقد تم استلام مقترحك وسيقوم الفريق بمراجعته.
             </Toast.Description>
           </div>
        </div>
        
        <Toast.Close className="absolute top-3 left-3 text-slate-400 hover:text-slate-700 dark:hover:text-amber-50 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 p-1.5 rounded-md transition-colors">
          <span aria-hidden>
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </span>
        </Toast.Close>
      </Toast.Root>
      {/* 
        Fix: Position the viewport at the bottom left. 
        bottom-10 and left-10 keep it away from the navbar and sidebar. 
      */}
      <Toast.Viewport className="fixed bottom-10 left-10 flex flex-col p-6 gap-2 w-[420px] max-w-[100vw] m-0 list-none z-[100] outline-none" />
    </Toast.Provider>
  );
}
