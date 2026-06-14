import React from 'react';
import { Search, BookText, Download, Eye, LayoutGrid } from 'lucide-react';

export default function Library() {
  const categories = [
    'الكل', 'المعاجم', 'التفسير', 'الحديث', 'الأدب والشعر', 'التاريخ', 'الفقه'
  ];

  const books = Array(8).fill(null).map((_, i) => ({
    id: i + 1,
    title: `مخطوطة التراث الإسلامي الأصيل ${i + 1}`,
    author: 'الإمام العلامة فلان بن فلان',
    category: categories[(i % (categories.length - 1)) + 1],
  }));

  return (
    <div className="flex flex-col h-full space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto">
      {/* Search Header - Minimalist */}
      <div className="bg-slate-50 p-10 rounded-3xl border border-slate-100 text-center">
        <h2 className="text-3xl font-extrabold mb-3 text-slate-800">المكتبة الشاملة</h2>
        <p className="text-slate-500 font-medium mb-8">ابحث واستكشف في آلاف المصادر والمراجع التاريخية</p>
        <div className="relative max-w-2xl mx-auto">
          <input
            type="text"
            placeholder="ابحث عن كتاب، مؤلف، أو مخطوطة..."
            className="w-full pl-6 pr-14 py-4 rounded-full text-slate-700 bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-300 shadow-sm transition-all text-base placeholder-slate-400"
          />
          <Search className="absolute right-5 top-4.5 text-slate-400 w-6 h-6" strokeWidth={1.5} />
        </div>
      </div>

      <div className="flex flex-1 gap-8">
        {/* Categories Sidebar */}
        <div className="w-64 flex-shrink-0 hidden md:block">
          <div className="sticky top-8">
            <h3 className="font-semibold text-sm mb-4 text-slate-400 uppercase tracking-widest px-2">التصنيفات</h3>
            <ul className="space-y-1">
              {categories.map((cat, idx) => (
                <li key={idx}>
                  <button className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    idx === 0 
                    ? 'bg-slate-800 text-white shadow-sm' 
                    : 'text-slate-600 hover:bg-slate-100'
                  }`}>
                    <LayoutGrid className={`w-4 h-4 ${idx === 0 ? 'text-slate-300' : 'text-slate-400'}`} />
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Books Grid */}
        <div className="flex-1 pb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {books.map((book) => (
              <div key={book.id} className="group cursor-pointer">
                <div className="bg-slate-50/80 rounded-2xl p-6 aspect-[3/4] flex items-center justify-center mb-4 border border-slate-100 group-hover:bg-slate-100 transition-colors relative">
                  <span className="absolute top-4 right-4 bg-white text-slate-500 text-[10px] font-bold px-2 py-1 rounded-md shadow-sm">
                    {book.category}
                  </span>
                  <BookText className="w-12 h-12 text-slate-300 group-hover:text-slate-400 transition-colors" strokeWidth={1} />
                </div>
                <div className="px-1">
                  <h4 className="font-semibold text-slate-800 text-sm mb-1 line-clamp-1">{book.title}</h4>
                  <p className="text-xs text-slate-500 mb-3">{book.author}</p>
                  
                  <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="text-xs font-semibold text-slate-700 hover:text-secondary flex items-center gap-1.5 transition-colors">
                      <Eye className="w-3.5 h-3.5" /> تصفح
                    </button>
                    <button className="text-xs font-semibold text-slate-400 hover:text-slate-700 flex items-center gap-1.5 transition-colors">
                      <Download className="w-3.5 h-3.5" /> تحميل
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
