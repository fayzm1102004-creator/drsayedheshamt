import React, { useState, useEffect, useRef } from 'react';
import { Search, Book, Library, Loader2, AlertCircle, X, ChevronDown, CheckCircle2, Copy } from 'lucide-react';
import { searchShamela } from '../lib/scraperApi';

export default function ShamelaWidget({ onExtract }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [extractedIndex, setExtractedIndex] = useState(null);

  const panelRef = useRef(null);

  // Close the widget if user clicks outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        // Only close if it's open, but maybe we want to keep it open until user manually closes it?
        // Let's keep it manual close for better UX so they don't accidentally lose results
      }
    };
    
    const handleOpenShamela = () => {
      setIsOpen(true);
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('open_shamela', handleOpenShamela);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('open_shamela', handleOpenShamela);
    };
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setError(null);
    setHasSearched(true);
    
    try {
      const data = await searchShamela(query.trim());
      setResults(data.results || []);
    } catch (err) {
      setError(err.message);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleExtract = (result, index) => {
    setExtractedIndex(index);
    if (onExtract) {
      onExtract(result.bookTitle, result.quoteText);
    }
    // Also dispatch a global event so other components (like ObserverView) can listen
    window.dispatchEvent(new CustomEvent('shamela_extract', { 
      detail: { book: result.bookTitle, quote: result.quoteText } 
    }));
    setTimeout(() => setExtractedIndex(null), 2000);
  };

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed bottom-6 left-6 z-[100]" dir="rtl" ref={panelRef}>
      
      {/* Widget Panel */}
      {isOpen && (
        <div className="absolute bottom-20 left-0 w-[380px] h-[550px] bg-white dark:bg-slate-900 rounded-3xl shadow-[0_20px_60px_rgba(6,78,59,0.2)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.6)] border border-[#d4af37]/30 dark:border-slate-800 flex flex-col overflow-hidden animate-widget-in origin-bottom-left">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-[#064e3b] to-emerald-800 p-4 flex items-center justify-between shadow-md relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[#d4af37]/10 opacity-50"></div>
            <div className="flex items-center gap-3 relative z-10">
              <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                <Library className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h3 className="text-white font-bold font-['Aref_Ruqaa'] text-lg leading-tight">المكتبة الشاملة</h3>
                <p className="text-emerald-100/80 text-xs">بحث واستخراج الشواهد</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="relative z-10 text-white/70 hover:text-white hover:bg-white/20 p-1.5 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Area */}
          <div className="p-4 bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="ابحث عن الشواهد أو الكتب..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#064e3b] dark:focus:ring-amber-500 shadow-sm text-sm"
              />
              <button 
                type="submit"
                disabled={isSearching}
                className="absolute left-1.5 top-1.5 bottom-1.5 w-10 bg-[#064e3b] hover:bg-emerald-800 dark:bg-amber-600 dark:hover:bg-amber-500 text-white rounded-lg flex items-center justify-center transition-colors disabled:opacity-50"
              >
                {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              </button>
            </form>
          </div>

          {/* Results Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-950/50 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
            
            {/* Loading State */}
            {isSearching && (
              <div className="flex flex-col items-center justify-center py-10 space-y-4 text-[#064e3b] dark:text-amber-500">
                <Loader2 className="w-8 h-8 animate-spin" />
                <p className="font-bold text-sm">جاري البحث في المكتبة...</p>
              </div>
            )}

            {/* Error State */}
            {error && !isSearching && (
              <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 rounded-xl p-4 flex gap-3 text-rose-700 dark:text-rose-400">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Empty State / No Results */}
            {!isSearching && !error && hasSearched && results.length === 0 && (
              <div className="flex flex-col items-center justify-center py-10 text-center text-slate-500">
                <Search className="w-10 h-10 mb-3 opacity-20" />
                <p className="font-bold">لم يتم العثور على نتائج</p>
                <p className="text-xs mt-1">جرّب كلمات مفتاحية مختلفة</p>
              </div>
            )}

            {/* Initial State */}
            {!isSearching && !error && !hasSearched && (
              <div className="flex flex-col items-center justify-center py-12 text-center text-slate-400">
                <Library className="w-12 h-12 mb-4 opacity-20" />
                <p className="text-sm">أدخل الكلمة للبحث في ملايين الصفحات</p>
              </div>
            )}

            {/* Results List */}
            {!isSearching && !error && results.length > 0 && (
              <div className="space-y-4">
                <p className="text-xs font-bold text-slate-500">تم العثور على {results.length} نتيجة (عرض سريع)</p>
                
                {results.map((result, idx) => (
                  <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                    <div className="p-3 bg-[#064e3b]/5 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700/50 flex justify-between items-start gap-2">
                      <div>
                        <a href={result.sourceUrl} target="_blank" rel="noopener noreferrer" className="font-bold text-[#064e3b] dark:text-amber-400 text-sm hover:underline line-clamp-1">
                          {result.bookTitle}
                        </a>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{result.referenceInfo}</p>
                      </div>
                      <Book className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                    </div>
                    <div className="p-3 relative group">
                      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed text-justify line-clamp-4">
                        {result.quoteText}
                      </p>
                      
                      {/* Action buttons (shown on hover) */}
                      <div className="absolute top-2 left-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleCopy(result.quoteText, idx)}
                          title="نسخ النص"
                          className="p-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                        >
                          {copiedIndex === idx ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                    <div className="p-2 border-t border-slate-50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/50 flex justify-end">
                      <button 
                        onClick={() => handleExtract(result, idx)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                          extractedIndex === idx 
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
                          : 'bg-[#064e3b] text-white hover:bg-emerald-800 dark:bg-amber-600 dark:hover:bg-amber-500'
                        }`}
                      >
                        {extractedIndex === idx ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" /> تم الاستخراج
                          </>
                        ) : (
                          'استخراج الشاهد'
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-[0_10px_25px_rgba(6,78,59,0.3)] dark:shadow-[0_10px_25px_rgba(245,158,11,0.2)] flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 z-10 relative ${
          isOpen 
          ? 'bg-rose-500 text-white' 
          : 'bg-gradient-to-tr from-[#064e3b] to-emerald-600 dark:from-amber-500 dark:to-amber-700 text-white'
        }`}
      >
        <div className="absolute inset-0 rounded-full bg-white/20 animate-ping opacity-20"></div>
        {isOpen ? <ChevronDown className="w-6 h-6" /> : <Library className="w-6 h-6" />}
      </button>

    </div>
  );
}
