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
    <div className="space-y-4 sm:space-y-6 lg:space-y-8 max-w-6xl mx-auto animate-in fade-in duration-500">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 sm:top-24 lg:top-28 left-1/2 -translate-x-1/2 z-50 bg-emerald-950/90 text-amber-400 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full border border-amber-500/30 shadow-[0_10px_40px_rgba(6,78,59,0.3)] backdrop-blur-md flex items-center gap-2 sm:gap-3 animate-in slide-in-from-top-4 max-w-[90vw]">
          <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
          <span className="font-bold text-xs sm:text-sm truncate">{toastMessage}</span>
        </div>
      )}

      {/* ─── Header Section ─── */}
      <div className="bg-gradient-to-br from-white/95 to-[#f8f5ec]/95 dark:bg-slate-900/90 backdrop-blur-3xl rounded-2xl sm:rounded-3xl lg:rounded-[2rem] shadow-[0_15px_40px_rgba(6,78,59,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] border border-[#d4af37]/40 dark:border-slate-800 border-t-[4px] border-t-[#064e3b] dark:border-t-amber-500 p-5 sm:p-7 lg:p-10 relative overflow-hidden transition-colors duration-500">
        <div className="absolute top-0 right-0 w-40 sm:w-64 h-40 sm:h-64 bg-[#d4af37]/10 dark:bg-amber-500/10 rounded-full blur-[60px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-48 sm:w-80 h-48 sm:h-80 bg-[#064e3b]/5 dark:bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none"></div>
        
        <div className="relative z-10 text-center mb-6 sm:mb-8 lg:mb-10">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-2 sm:mb-3 text-[#064e3b] dark:text-amber-400 font-['Aref_Ruqaa']">إرسالية رصد (3)</h2>
          <p className="text-xs sm:text-sm text-[#064e3b]/70 dark:text-slate-400 font-bold">المسار التقني لرصد الشاهد ومعالجته ورفعه</p>
        </div>

        {/* ─── The 3 Main Action Buttons ─── */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">

          <button 
            onClick={() => setActiveTab('draft')}
            className={`flex flex-row sm:flex-col items-center sm:justify-center gap-4 sm:gap-0 p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 group shadow-sm hover:shadow-[0_10px_30px_rgba(6,78,59,0.15)] dark:hover:shadow-[0_10px_30px_rgba(245,158,11,0.1)] ${
              activeTab === 'draft'
              ? 'bg-amber-50/50 dark:bg-slate-800 border-amber-400 dark:border-amber-500/50' 
              : 'bg-white/50 dark:bg-slate-900/50 border-transparent dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-500/30'
            }`}
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full bg-[#064e3b]/5 dark:bg-slate-800 flex items-center justify-center sm:mb-4 group-hover:scale-110 group-hover:bg-[#064e3b] dark:group-hover:bg-amber-500 transition-all duration-300 shrink-0">
              <FileEdit className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-[#064e3b] dark:text-amber-400 group-hover:text-white dark:group-hover:text-slate-900 transition-colors" />
            </div>
            <div className="text-right sm:text-center">
              <span className="font-bold text-base sm:text-lg text-[#064e3b] dark:text-amber-50 block">مسودة المعالجة</span>
              <span className="text-[11px] sm:text-xs text-[#064e3b]/60 dark:text-slate-500 mt-1 sm:mt-2 block">أولاً: طلب الشاهد ومعالجته</span>
            </div>
          </button>

          <button 
            onClick={() => setActiveTab('table')}
            className={`flex flex-row sm:flex-col items-center sm:justify-center gap-4 sm:gap-0 p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 group shadow-sm hover:shadow-[0_10px_30px_rgba(6,78,59,0.15)] dark:hover:shadow-[0_10px_30px_rgba(245,158,11,0.1)] ${
              activeTab === 'table' 
              ? 'bg-amber-50/50 dark:bg-slate-800 border-amber-400 dark:border-amber-500/50' 
              : 'bg-white/50 dark:bg-slate-900/50 border-transparent dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-500/30'
            }`}
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full bg-[#064e3b]/5 dark:bg-slate-800 flex items-center justify-center sm:mb-4 group-hover:scale-110 group-hover:bg-[#064e3b] dark:group-hover:bg-amber-500 transition-all duration-300 relative shrink-0">
              <TableProperties className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-[#064e3b] dark:text-amber-400 group-hover:text-white dark:group-hover:text-slate-900 transition-colors" />
              {tableData.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                  {tableData.length}
                </span>
              )}
            </div>
            <div className="text-right sm:text-center">
              <span className="font-bold text-base sm:text-lg text-[#064e3b] dark:text-amber-50 block">فتح الجدول</span>
              <span className="text-[11px] sm:text-xs text-[#064e3b]/60 dark:text-slate-500 mt-1 sm:mt-2 block">ثانياً: يضع الراصد الشاهد موضعه</span>
            </div>
          </button>

          <button 
            onClick={handleSubmitData}
            className="flex flex-row sm:flex-col items-center sm:justify-center gap-4 sm:gap-0 p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl border-2 border-transparent bg-white/50 dark:bg-slate-900/50 dark:border-slate-800 transition-all duration-300 group shadow-sm hover:border-[#064e3b]/50 dark:hover:border-emerald-500/50 hover:shadow-[0_10px_30px_rgba(6,78,59,0.15)] dark:hover:shadow-[0_10px_30px_rgba(16,185,129,0.1)]"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full bg-[#064e3b]/5 dark:bg-slate-800 flex items-center justify-center sm:mb-4 group-hover:scale-110 group-hover:bg-gradient-to-r group-hover:from-[#064e3b] group-hover:to-emerald-700 dark:group-hover:from-emerald-600 dark:group-hover:to-emerald-800 transition-all duration-300 shrink-0">
              <UploadCloud className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-[#064e3b] dark:text-amber-400 group-hover:text-white transition-colors" />
            </div>
            <div className="text-right sm:text-center">
              <span className="font-bold text-base sm:text-lg text-[#064e3b] dark:text-amber-50 block">رفع الجدول</span>
              <span className="text-[11px] sm:text-xs text-[#064e3b]/60 dark:text-slate-500 mt-1 sm:mt-2 block">أخيراً: رفع المنجز إلى المنسق عبر المنصة</span>
            </div>
          </button>
        </div>
      </div>

      {/* ─── Main Content Area ─── */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl lg:rounded-[2rem] border border-[#d4af37]/20 dark:border-slate-800 shadow-[0_10px_30px_rgba(0,0,0,0.02)] p-4 sm:p-6 lg:p-10 min-h-[300px] sm:min-h-[400px]">
        
        {/* ─── VIEW 1: DRAFTING AREA ─── */}
        {activeTab === 'draft' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl mx-auto space-y-4 sm:space-y-6">
            <div className="flex items-center gap-3 mb-4 sm:mb-6 lg:mb-8">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-700 dark:text-amber-400 shrink-0">
                <Search className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-[#064e3b] dark:text-amber-50 font-['Aref_Ruqaa']">مسودة المعالجة (خارج الجدول)</h3>
            </div>
            
            <div className="space-y-2">
              <label className="block text-xs sm:text-sm font-bold text-[#064e3b]/80 dark:text-slate-300">اسم الكتاب / المصدر</label>
              <input 
                type="text" 
                value={bookName}
                onChange={(e) => setBookName(e.target.value)}
                placeholder="مثال: لسان العرب"
                className="w-full px-4 sm:px-5 py-3 sm:py-4 rounded-lg sm:rounded-xl text-[#064e3b] dark:text-amber-50 bg-white dark:bg-slate-950 border border-[#d4af37]/40 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#064e3b]/50 focus:border-[#064e3b] dark:focus:border-amber-500 shadow-sm transition-all placeholder-slate-400 dark:placeholder-slate-600 text-sm sm:text-base"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs sm:text-sm font-bold text-[#064e3b]/80 dark:text-slate-300">الصق الشاهد هنا للتحرير والمعالجة</label>
              <textarea 
                value={quoteText}
                onChange={(e) => setQuoteText(e.target.value)}
                placeholder="قم بنسخ الشاهد من المكتبة الشاملة ولصقه هنا لمعالجته قبل إرساله للجدول..."
                rows={5}
                className="w-full px-4 sm:px-5 py-3 sm:py-4 rounded-lg sm:rounded-xl text-[#064e3b] dark:text-amber-50 bg-white dark:bg-slate-950 border border-[#d4af37]/40 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#064e3b]/50 focus:border-[#064e3b] dark:focus:border-amber-500 shadow-sm transition-all placeholder-slate-400 dark:placeholder-slate-600 resize-y text-sm sm:text-base"
              />
            </div>

            <div className="pt-2 sm:pt-4">
              <button 
                onClick={handleSendToTable}
                className="w-full sm:w-auto sm:float-left bg-gradient-to-l from-[#064e3b] to-[#022c22] dark:from-amber-600 dark:to-amber-800 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold hover:shadow-[0_8px_25px_rgba(6,78,59,0.3)] dark:hover:shadow-[0_8px_25px_rgba(245,158,11,0.2)] transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <Plus className="w-5 h-5" />
                إرسال إلى جدول الرصد
              </button>
              <div className="clear-both" />
            </div>
          </div>
        )}

        {/* ─── VIEW 2: OBSERVATION TABLE ─── */}
        {activeTab === 'table' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 sm:mb-6 lg:mb-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-700 dark:text-emerald-400 shrink-0">
                  <TableProperties className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-[#064e3b] dark:text-amber-50 font-['Aref_Ruqaa']">جدول الرصد</h3>
              </div>
              <div className="text-xs sm:text-sm font-bold text-[#064e3b]/60 dark:text-slate-400 bg-[#064e3b]/5 dark:bg-slate-800 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full">
                إجمالي الشواهد: {tableData.length}
              </div>
            </div>

            {/* ─── Mobile Card View ─── */}
            <div className="block sm:hidden space-y-3">
              {tableData.length > 0 ? (
                tableData.map(row => (
                  <div key={row.id} className="bg-white dark:bg-slate-900/60 border border-[#d4af37]/20 dark:border-slate-800 rounded-xl p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-bold text-sm text-[#064e3b]/90 dark:text-amber-100 block">{row.bookName}</span>
                        <span className="text-[10px] text-[#064e3b]/50 dark:text-slate-500 mt-0.5 block" dir="ltr">{row.timestamp}</span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button 
                          onClick={() => handleEditRow(row)}
                          className="p-1.5 text-sky-500/70 hover:text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-950/50 rounded-lg transition-colors"
                          title="تعديل الشاهد"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteRow(row.id)}
                          className="p-1.5 text-rose-500/70 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors"
                          title="حذف الشاهد"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-[#064e3b]/80 dark:text-slate-300 leading-relaxed whitespace-pre-wrap border-t border-slate-100 dark:border-slate-800 pt-3">{row.quote}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-[#064e3b]/50 dark:text-slate-500 font-bold text-sm">
                  الجدول فارغ. قم بطلب الشاهد من المكتبة ومعالجته في المسودة أولاً.
                </div>
              )}
            </div>

            {/* ─── Desktop Table View ─── */}
            <div className="hidden sm:block overflow-x-auto rounded-xl sm:rounded-2xl border border-[#d4af37]/20 dark:border-slate-800">
              <table className="w-full text-right text-sm sm:text-[15px] min-w-[500px]">
                <thead className="bg-[#f8f5ec] dark:bg-slate-950/80 border-b border-[#d4af37]/30 dark:border-slate-800">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 sm:py-5 text-[#064e3b] dark:text-amber-400 font-bold w-[25%]">اسم الكتاب</th>
                    <th className="px-4 sm:px-6 py-3 sm:py-5 text-[#064e3b] dark:text-amber-400 font-bold w-[60%]">نص الشاهد المعالج</th>
                    <th className="px-4 sm:px-6 py-3 sm:py-5 text-[#064e3b] dark:text-amber-400 font-bold text-center w-[15%]">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#d4af37]/10 dark:divide-slate-800/80 bg-white/50 dark:bg-slate-900/30">
                  {tableData.length > 0 ? (
                    tableData.map(row => (
                      <tr key={row.id} className="hover:bg-[#064e3b]/5 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="px-4 sm:px-6 py-3 sm:py-4">
                          <span className="font-bold text-[#064e3b]/90 dark:text-amber-100">{row.bookName}</span>
                          <span className="block text-[11px] text-[#064e3b]/50 dark:text-slate-500 mt-1" dir="ltr">{row.timestamp}</span>
                        </td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4">
                          <p className="text-[#064e3b]/80 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{row.quote}</p>
                        </td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4 text-center">
                          <div className="flex items-center justify-center gap-1 sm:gap-2">
                            <button 
                              onClick={() => handleEditRow(row)}
                              className="p-1.5 sm:p-2 text-sky-500/70 hover:text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-950/50 rounded-lg transition-colors"
                              title="تعديل الشاهد"
                            >
                              <Pencil className="w-4 h-4 sm:w-5 sm:h-5 mx-auto" />
                            </button>
                            <button 
                              onClick={() => handleDeleteRow(row.id)}
                              className="p-1.5 sm:p-2 text-rose-500/70 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors"
                              title="حذف الشاهد"
                            >
                              <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 mx-auto" />
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
              <div className="mt-6 sm:mt-8">
                <button 
                  onClick={handleSubmitData}
                  className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-emerald-800 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold hover:shadow-[0_8px_25px_rgba(16,185,129,0.3)] transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-2 text-sm sm:text-base"
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
