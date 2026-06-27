import React, { useState } from 'react';
import * as Toast from '@radix-ui/react-toast';
import { Send, MessageSquarePlus } from 'lucide-react';

export default function Suggestions() {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ title: '', category: 'عام', description: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await fetch("https://formsubmit.co/ajax/fayzm1102004@gmail.com", {
        method: "POST",
        headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            "عنوان الطلب": formData.title,
            "التصنيف": formData.category,
            "التفاصيل": formData.description,
            _subject: `طلب جديد: ${formData.title} - ${formData.category}`
        })
      });

      setOpen(false); 
      setTimeout(() => {
        setOpen(true);
        setFormData({ title: '', category: 'عام', description: '' });
      }, 100);
    } catch (error) {
      console.error("حدث خطأ أثناء الإرسال", error);
      alert("حدث خطأ في الاتصال، يرجى المحاولة لاحقاً");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Toast.Provider swipeDirection="right">
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 py-4">
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 text-primary mb-4">
            <MessageSquarePlus className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-800">قسم الشكاوى والاقتراحات</h2>
          <p className="text-slate-500 font-medium mt-3 text-lg">نحن نثمن رأيك. يسعدنا استقبال مقترحاتكم البناءة لتطوير منصة المعجم التاريخي.</p>
        </div>

        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-10 relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary"></div>
           
          <form onSubmit={handleSubmit} className="space-y-8 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">عنوان الاقتراح أو الشكوى</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary focus:bg-white transition-all text-slate-800 font-medium placeholder-slate-400 shadow-sm"
                  placeholder="أدخل عنواناً موجزاً وواضحاً..."
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">التصنيف الرئيسي</label>
                <div className="relative">
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary focus:bg-white transition-all text-slate-800 font-medium appearance-none shadow-sm cursor-pointer"
                  >
                    <option>عام (مقترح عام)</option>
                    <option>مشكلة تقنية في النظام</option>
                    <option>اقتراح لتطوير واجهة المستخدم</option>
                    <option>استفسار علمي أو لغوي</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-4 text-slate-500">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">التفاصيل والشرح</label>
              <textarea
                required
                rows={6}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary focus:bg-white transition-all text-slate-800 font-medium placeholder-slate-400 shadow-sm resize-y"
                placeholder="يرجى كتابة كافة التفاصيل المتعلقة بمقترحك أو الشكوى هنا ليتمكن الفريق المختص من مراجعتها بدقة..."
              />
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary text-white font-bold px-8 py-3.5 rounded-xl hover:bg-primary/90 focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all duration-300 hover:-translate-y-0.5 shadow-lg flex items-center gap-3 disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {isSubmitting ? 'جاري الإرسال...' : 'إرسال الطلب'} <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>

      <Toast.Root
        className="bg-white border-l-4 border-l-emerald-500 rounded-xl shadow-2xl p-5 grid grid-cols-[auto_max-content] items-center gap-x-4 data-[state=open]:animate-slideIn data-[state=closed]:animate-hide data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:translate-x-0 data-[swipe=cancel]:transition-[transform_200ms_ease-out] data-[swipe=end]:animate-swipeOut"
        open={open}
        onOpenChange={setOpen}
      >
        <div className="flex gap-3 items-start">
           <div className="bg-emerald-100 p-2 rounded-full shrink-0">
             <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
           </div>
           <div>
             <Toast.Title className="font-bold text-slate-800 text-base">تم الإرسال بنجاح</Toast.Title>
             <Toast.Description className="mt-1 text-sm text-slate-500 font-medium leading-relaxed">شكرًا لك. لقد تم استلام مقترحك وسيقوم الفريق بمراجعته في أقرب وقت.</Toast.Description>
           </div>
        </div>
        
        <Toast.Close className="absolute top-3 left-3 text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 p-1 rounded-md transition-colors">
          <span aria-hidden>
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </span>
        </Toast.Close>
      </Toast.Root>
      <Toast.Viewport className="fixed bottom-0 right-0 flex flex-col p-6 gap-2 w-[420px] max-w-[100vw] m-0 list-none z-[2147483647] outline-none" />
    </Toast.Provider>
  );
}
