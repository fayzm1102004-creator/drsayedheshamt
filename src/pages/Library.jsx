import React, { useState } from 'react';
import { Search, BookText, Download, Eye, LayoutGrid, ExternalLink } from 'lucide-react';

export default function Library() {
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    'الكل', 'المعاجم', 'التفسير', 'الحديث', 'الأدب والشعر', 'التاريخ', 'الفقه'
  ];

  const books = Array(8).fill(null).map((_, i) => ({
    id: i + 1,
    title: `مخطوطة التراث الإسلامي الأصيل ${i + 1}`,
    author: 'الإمام العلامة فلان بن فلان',
    category: categories[(i % (categories.length - 1)) + 1],
  }));

  // Search logic is handled natively by the form now

  return (
    <div className="flex flex-col h-full space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto">
      {/* Search Header - Royal Theme */}
      <div className="bg-gradient-to-br from-white/95 to-[#f8f5ec]/95 dark:bg-slate-900/90 backdrop-blur-3xl rounded-[2rem] shadow-[0_15px_40px_rgba(6,78,59,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] border border-[#d4af37]/40 dark:border-slate-800 border-t-[4px] border-t-[#064e3b] dark:border-t-amber-500 p-10 relative overflow-hidden text-center transition-colors duration-500">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4af37]/10 dark:bg-amber-500/10 rounded-full blur-[60px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#064e3b]/5 dark:bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none"></div>
        
        <h2 className="text-4xl font-extrabold mb-4 text-[#064e3b] dark:text-amber-400 font-['Aref_Ruqaa'] relative z-10">المكتبة الشاملة</h2>
        <p className="text-[#064e3b]/70 dark:text-slate-400 font-bold mb-8 relative z-10">ابحث واستكشف في آلاف المصادر والمراجع التاريخية</p>
        
        <div className="relative max-w-3xl mx-auto flex gap-3 z-10">
          {/* Hidden input to prepend site:shamela.ws to the query */}
          <input type="hidden" name="q" value={`site:shamela.ws ${searchQuery}`} />
          
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchQuery.trim()) {
                  window.open(`https://www.google.com/search?q=${encodeURIComponent('site:shamela.ws ' + searchQuery)}`, '_blank');
                }
              }}
              placeholder="ابحث عن كتاب، مؤلف، أو كلمة مفتاحية..."
              className="w-full pl-6 pr-14 py-4 rounded-xl text-[#064e3b] dark:text-amber-50 bg-white/50 dark:bg-slate-950 border border-[#d4af37]/40 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-[#064e3b]/50 focus:border-[#064e3b] dark:focus:border-amber-500 focus:bg-white dark:focus:bg-slate-900 shadow-sm transition-all text-base placeholder-slate-400 dark:placeholder-slate-500"
            />
            <Search className="absolute right-5 top-4.5 text-[#064e3b]/50 dark:text-slate-500 w-6 h-6" strokeWidth={1.5} />
          </div>
          <a 
            href={searchQuery.trim() ? `https://www.google.com/search?q=${encodeURIComponent('site:shamela.ws ' + searchQuery)}` : '#'}
            target={searchQuery.trim() ? "_blank" : "_self"}
            rel="noopener noreferrer"
            onClick={(e) => {
              if (!searchQuery.trim()) e.preventDefault();
            }}
            className="flex-shrink-0 bg-gradient-to-l from-[#064e3b] to-[#022c22] dark:from-amber-500 dark:to-amber-700 text-white dark:text-slate-900 px-6 py-4 rounded-xl font-bold hover:shadow-[0_8px_25px_rgba(6,78,59,0.4)] dark:hover:shadow-[0_8px_25px_rgba(245,158,11,0.3)] transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2"
          >
            <ExternalLink className="w-5 h-5" />
            بحث في الشاملة
          </a>
        </div>
      </div>

      <div className="flex flex-1 gap-8">
        {/* Categories Sidebar */}
        <div className="w-64 flex-shrink-0 hidden md:block">
          <div className="sticky top-28 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl p-6 rounded-2xl border border-[#d4af37]/20 dark:border-slate-800 shadow-sm transition-colors duration-500">
            <h3 className="font-bold text-sm mb-4 text-[#064e3b]/60 dark:text-slate-500 uppercase tracking-widest px-2">التصنيفات</h3>
            <ul className="space-y-2">
              {categories.map((cat, idx) => (
                <li key={idx}>
                  <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    idx === 0 
                    ? 'bg-[#064e3b] dark:bg-amber-500/20 text-white dark:text-amber-400 shadow-md border border-transparent dark:border-amber-500/30' 
                    : 'text-[#064e3b]/70 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-[#064e3b] dark:hover:text-amber-50 border border-transparent'
                  }`}>
                    <LayoutGrid className={`w-4 h-4 ${idx === 0 ? 'opacity-80' : 'opacity-50'}`} />
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Books Grid */}
        <div className="flex-1 pb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {books.map((book) => (
              <div key={book.id} className="group cursor-pointer">
                <div className="bg-white/80 dark:bg-slate-900/80 rounded-2xl p-6 aspect-[3/4] flex items-center justify-center mb-4 border border-[#d4af37]/20 dark:border-slate-800 group-hover:bg-white dark:group-hover:bg-slate-800 group-hover:border-[#d4af37]/50 dark:group-hover:border-amber-500/50 transition-all duration-300 relative shadow-sm group-hover:shadow-[0_10px_30px_rgba(6,78,59,0.08)] dark:group-hover:shadow-[0_10px_30px_rgba(0,0,0,0.4)] hover:-translate-y-1">
                  <span className="absolute top-4 right-4 bg-[#f8f5ec] dark:bg-slate-950 border border-[#d4af37]/30 dark:border-slate-700 text-[#064e3b] dark:text-amber-400 text-[10px] font-bold px-2 py-1 rounded-md shadow-sm">
                    {book.category}
                  </span>
                  <BookText className="w-14 h-14 text-[#064e3b]/20 dark:text-slate-600 group-hover:text-[#064e3b]/60 dark:group-hover:text-amber-400/60 transition-colors duration-300" strokeWidth={1.5} />
                </div>
                <div className="px-2">
                  <h4 className="font-bold text-[#064e3b] dark:text-amber-50 text-[15px] mb-1 line-clamp-1 transition-colors duration-500">{book.title}</h4>
                  <p className="text-xs font-bold text-[#064e3b]/60 dark:text-slate-500 mb-3">{book.author}</p>
                  
                  <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="text-xs font-bold text-[#d4af37] dark:text-amber-500 hover:text-[#064e3b] dark:hover:text-amber-400 flex items-center gap-1.5 transition-colors">
                      <Eye className="w-4 h-4" /> تصفح
                    </button>
                    <button className="text-xs font-bold text-[#064e3b]/50 dark:text-slate-500 hover:text-[#064e3b] dark:hover:text-amber-50 flex items-center gap-1.5 transition-colors">
                      <Download className="w-4 h-4" /> تحميل
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
