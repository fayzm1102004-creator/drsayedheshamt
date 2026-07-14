import React, { useState, useEffect } from 'react';
import { BookOpen, TableProperties, UploadCloud, Plus, Trash2, CheckCircle, Search, FileEdit, Pencil } from 'lucide-react';

export default function ObserverView() {
  const [activeTab, setActiveTab] = useState('draft'); // 'draft' or 'table'
  const [bookName, setBookName] = useState('');
  const [quoteText, setQuoteText] = useState('');
  const [tableData, setTableData] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);

  // Load existing table data if any
  useEffect(() => {
    const saved = localStorage.getItem('observer_draft_table');
    if (saved) {
      try {
        setTableData(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  // Save table data automatically
  useEffect(() => {
    localStorage.setItem('observer_draft_table', JSON.stringify(tableData));
  }, [tableData]);

  // Listen for extractions from the global Shamela Widget
  useEffect(() => {
    const handleShamelaExtract = (e) => {
      const { book, quote } = e.detail;
      setBookName(book);
      setQuoteText(quote);
      setActiveTab('draft');
      showToast('تم استخراج الشاهد من المكتبة الشاملة بنجاح');
    };

    window.addEventListener('shamela_extract', handleShamelaExtract);
    return () => window.removeEventListener('shamela_extract', handleShamelaExtract);
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleLibraryClick = () => {
    window.open('https://shamela.ws/', '_blank', 'noopener,noreferrer');
    setActiveTab('draft');
  };

  const handleSendToTable = () => {
    if (!bookName.trim() || !quoteText.trim()) {
      showToast('يرجى تعبئة اسم الكتاب ونص الشاهد');
      return;
    }
    
    const newEntry = {
      id: Date.now().toString(),
      bookName: bookName.trim(),
      quote: quoteText.trim(),
      timestamp: new Date().toLocaleString('ar-EG')
    };

    setTableData(prev => [...prev, newEntry]);
    setBookName('');
    setQuoteText('');
    setActiveTab('table');
    showToast('تمت الإضافة إلى جدول الرصد بنجاح');
  };

  const handleDeleteRow = (id) => {
    setTableData(prev => prev.filter(row => row.id !== id));
  };

  const handleEditRow = (row) => {
    setBookName(row.bookName);
    setQuoteText(row.quote);
    handleDeleteRow(row.id);
    setActiveTab('draft');
    showToast('تم نقل الشاهد إلى المسودة لتعديله');
  };

  const handleSubmitData = () => {
    if (tableData.length === 0) {
      showToast('جدول الرصد فارغ، لا يوجد ما يتم رفعه.');
      return;
    }

    const payload = {
      data: tableData,
      currentStage: 'Level 2',
      submittedAt: new Date().toISOString()
    };
    
    localStorage.setItem('mission_3_submission', JSON.stringify(payload));
    setTableData([]); // Clear table after submission
    localStorage.removeItem('observer_draft_table'); // Clear draft
    setActiveTab('draft');
    showToast('تم رفع إرسالية الرصد بنجاح إلى المنسق!');
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto animate-in fade-in duration-500">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-28 left-1/2 -translate-x-1/2 z-50 bg-emerald-950/90 text-amber-400 px-6 py-3 rounded-full border border-amber-500/30 shadow-[0_10px_40px_rgba(6,78,59,0.3)] backdrop-blur-md flex items-center gap-3 animate-in slide-in-from-top-4">
          <CheckCircle className="w-5 h-5" />
          <span className="font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Header section - Royal Theme */}
      <div className="bg-gradient-to-br from-white/95 to-[#f8f5ec]/95 dark:bg-slate-900/90 backdrop-blur-3xl rounded-[2rem] shadow-[0_15px_40px_rgba(6,78,59,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] border border-[#d4af37]/40 dark:border-slate-800 border-t-[4px] border-t-[#064e3b] dark:border-t-amber-500 p-10 relative overflow-hidden transition-colors duration-500">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4af37]/10 dark:bg-amber-500/10 rounded-full blur-[60px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#064e3b]/5 dark:bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none"></div>
        
        <div className="relative z-10 text-center mb-10">
          <h2 className="text-4xl font-extrabold mb-3 text-[#064e3b] dark:text-amber-400 font-['Aref_Ruqaa']">إرسالية رصد (3)</h2>
          <p className="text-[#064e3b]/70 dark:text-slate-400 font-bold">المسار التقني لرصد الشاهد ومعالجته ورفعه</p>
        </div>

        {/* The 3 Main Action Buttons */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6">

          <button 
            onClick={() => setActiveTab('draft')}
            className={`flex flex-col items-center justify-center p-8 rounded-2xl border-2 transition-all duration-300 group shadow-sm hover:shadow-[0_10px_30px_rgba(6,78,59,0.15)] dark:hover:shadow-[0_10px_30px_rgba(245,158,11,0.1)] ${
              activeTab === 'draft'
              ? 'bg-amber-50/50 dark:bg-slate-800 border-amber-400 dark:border-amber-500/50' 
              : 'bg-white/50 dark:bg-slate-900/50 border-transparent dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-500/30'
            }`}
          >
            <div className="w-16 h-16 rounded-full bg-[#064e3b]/5 dark:bg-slate-800 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-[#064e3b] dark:group-hover:bg-amber-500 transition-all duration-300">
              <FileEdit className="w-8 h-8 text-[#064e3b] dark:text-amber-400 group-hover:text-white dark:group-hover:text-slate-900 transition-colors" />
            </div>
            <span className="font-bold text-lg text-[#064e3b] dark:text-amber-50">مسودة المعالجة</span>
            <span className="text-xs text-[#064e3b]/60 dark:text-slate-500 mt-2 text-center">أولاً: طلب الشاهد ومعالجته</span>
          </button>

          <button 
            onClick={() => setActiveTab('table')}
            className={`flex flex-col items-center justify-center p-8 rounded-2xl border-2 transition-all duration-300 group shadow-sm hover:shadow-[0_10px_30px_rgba(6,78,59,0.15)] dark:hover:shadow-[0_10px_30px_rgba(245,158,11,0.1)] ${
              activeTab === 'table' 
              ? 'bg-amber-50/50 dark:bg-slate-800 border-amber-400 dark:border-amber-500/50' 
              : 'bg-white/50 dark:bg-slate-900/50 border-transparent dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-500/30'
            }`}
          >
            <div className="w-16 h-16 rounded-full bg-[#064e3b]/5 dark:bg-slate-800 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-[#064e3b] dark:group-hover:bg-amber-500 transition-all duration-300 relative">
              <TableProperties className="w-8 h-8 text-[#064e3b] dark:text-amber-400 group-hover:text-white dark:group-hover:text-slate-900 transition-colors" />
              {tableData.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                  {tableData.length}
                </span>
              )}
            </div>
            <span className="font-bold text-lg text-[#064e3b] dark:text-amber-50">فتح الجدول</span>
            <span className="text-xs text-[#064e3b]/60 dark:text-slate-500 mt-2 text-center">ثانياً: يضع الراصد الشاهد موضعه</span>
          </button>

          <button 
            onClick={handleSubmitData}
            className="flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-transparent bg-white/50 dark:bg-slate-900/50 dark:border-slate-800 transition-all duration-300 group shadow-sm hover:border-[#064e3b]/50 dark:hover:border-emerald-500/50 hover:shadow-[0_10px_30px_rgba(6,78,59,0.15)] dark:hover:shadow-[0_10px_30px_rgba(16,185,129,0.1)]"
          >
            <div className="w-16 h-16 rounded-full bg-[#064e3b]/5 dark:bg-slate-800 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-gradient-to-r group-hover:from-[#064e3b] group-hover:to-emerald-700 dark:group-hover:from-emerald-600 dark:group-hover:to-emerald-800 transition-all duration-300">
              <UploadCloud className="w-8 h-8 text-[#064e3b] dark:text-amber-400 group-hover:text-white transition-colors" />
            </div>
            <span className="font-bold text-lg text-[#064e3b] dark:text-amber-50">رفع الجدول</span>
            <span className="text-xs text-[#064e3b]/60 dark:text-slate-500 mt-2 text-center">أخيراً: رفع المنجز إلى المنسق عبر المنصة</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2rem] border border-[#d4af37]/20 dark:border-slate-800 shadow-[0_10px_30px_rgba(0,0,0,0.02)] p-10 min-h-[400px]">
        
        {/* VIEW 1: DRAFTING AREA */}
        {activeTab === 'draft' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl mx-auto space-y-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-700 dark:text-amber-400">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-bold text-[#064e3b] dark:text-amber-50 font-['Aref_Ruqaa']">مسودة المعالجة (خارج الجدول)</h3>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-bold text-[#064e3b]/80 dark:text-slate-300">اسم الكتاب / المصدر</label>
              <input 
                type="text" 
                value={bookName}
                onChange={(e) => setBookName(e.target.value)}
                placeholder="مثال: لسان العرب"
                className="w-full px-5 py-4 rounded-xl text-[#064e3b] dark:text-amber-50 bg-white dark:bg-slate-950 border border-[#d4af37]/40 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#064e3b]/50 focus:border-[#064e3b] dark:focus:border-amber-500 shadow-sm transition-all placeholder-slate-400 dark:placeholder-slate-600"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-[#064e3b]/80 dark:text-slate-300">الصق الشاهد هنا للتحرير والمعالجة</label>
              <textarea 
                value={quoteText}
                onChange={(e) => setQuoteText(e.target.value)}
                placeholder="قم بنسخ الشاهد من المكتبة الشاملة ولصقه هنا لمعالجته قبل إرساله للجدول..."
                rows={6}
                className="w-full px-5 py-4 rounded-xl text-[#064e3b] dark:text-amber-50 bg-white dark:bg-slate-950 border border-[#d4af37]/40 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#064e3b]/50 focus:border-[#064e3b] dark:focus:border-amber-500 shadow-sm transition-all placeholder-slate-400 dark:placeholder-slate-600 resize-y"
              />
            </div>

            <div className="pt-4 flex justify-end">
              <button 
                onClick={handleSendToTable}
                className="bg-gradient-to-l from-[#064e3b] to-[#022c22] dark:from-amber-600 dark:to-amber-800 text-white px-8 py-4 rounded-xl font-bold hover:shadow-[0_8px_25px_rgba(6,78,59,0.3)] dark:hover:shadow-[0_8px_25px_rgba(245,158,11,0.2)] transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                إرسال إلى جدول الرصد
              </button>
            </div>
          </div>
        )}

        {/* VIEW 2: OBSERVATION TABLE */}
        {activeTab === 'table' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
                  <TableProperties className="w-5 h-5" />
                </div>
                <h3 className="text-2xl font-bold text-[#064e3b] dark:text-amber-50 font-['Aref_Ruqaa']">جدول الرصد</h3>
              </div>
              <div className="text-sm font-bold text-[#064e3b]/60 dark:text-slate-400 bg-[#064e3b]/5 dark:bg-slate-800 px-4 py-2 rounded-full">
                إجمالي الشواهد: {tableData.length}
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-[#d4af37]/20 dark:border-slate-800">
              <table className="w-full text-right text-[15px]">
                <thead className="bg-[#f8f5ec] dark:bg-slate-950/80 border-b border-[#d4af37]/30 dark:border-slate-800">
                  <tr>
                    <th className="px-6 py-5 text-[#064e3b] dark:text-amber-400 font-bold w-[25%]">اسم الكتاب</th>
                    <th className="px-6 py-5 text-[#064e3b] dark:text-amber-400 font-bold w-[60%]">نص الشاهد المعالج</th>
                    <th className="px-6 py-5 text-[#064e3b] dark:text-amber-400 font-bold text-center w-[15%]">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#d4af37]/10 dark:divide-slate-800/80 bg-white/50 dark:bg-slate-900/30">
                  {tableData.length > 0 ? (
                    tableData.map(row => (
                      <tr key={row.id} className="hover:bg-[#064e3b]/5 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="px-6 py-4">
                          <span className="font-bold text-[#064e3b]/90 dark:text-amber-100">{row.bookName}</span>
                          <span className="block text-[11px] text-[#064e3b]/50 dark:text-slate-500 mt-1" dir="ltr">{row.timestamp}</span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-[#064e3b]/80 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{row.quote}</p>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button 
                              onClick={() => handleEditRow(row)}
                              className="p-2 text-sky-500/70 hover:text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-950/50 rounded-lg transition-colors"
                              title="تعديل الشاهد"
                            >
                              <Pencil className="w-5 h-5 mx-auto" />
                            </button>
                            <button 
                              onClick={() => handleDeleteRow(row.id)}
                              className="p-2 text-rose-500/70 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors"
                              title="حذف الشاهد"
                            >
                              <Trash2 className="w-5 h-5 mx-auto" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-6 py-16 text-center text-[#064e3b]/50 dark:text-slate-500 font-bold bg-white/30 dark:bg-slate-900/30">
                        الجدول فارغ. قم بطلب الشاهد من المكتبة ومعالجته في المسودة أولاً.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {tableData.length > 0 && (
              <div className="mt-8 flex justify-end">
                <button 
                  onClick={handleSubmitData}
                  className="bg-gradient-to-r from-emerald-600 to-emerald-800 text-white px-8 py-4 rounded-xl font-bold hover:shadow-[0_8px_25px_rgba(16,185,129,0.3)] transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2"
                >
                  <UploadCloud className="w-5 h-5" />
                  رفع الجدول إلى المنسق
                </button>
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
