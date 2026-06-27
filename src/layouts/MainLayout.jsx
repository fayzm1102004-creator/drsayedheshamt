import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Outlet, Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
import { BookOpen, LayoutDashboard, MessageSquare, LogOut, UserCircle, Moon, Sun, CheckSquare } from 'lucide-react';

export default function MainLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const allNavItems = [
    { name: 'لوحة التحكم', path: '/dashboard', icon: LayoutDashboard },
    { name: 'المهام', path: '/tasks', icon: CheckSquare },
    { name: 'الشكاوى والاقتراحات', path: '/suggestions', icon: MessageSquare },
  ];

  const navItems = user?.role === 'developer' 
    ? allNavItems.filter(item => item.path === '/suggestions')
    : allNavItems;

  return (
    <div className="flex h-screen bg-[#FDFBF7] dark:bg-[#020617] transition-colors duration-500 font-sans selection:bg-amber-500/30">
      {/* Sidebar - Royal Navy & Emerald Glassmorphism */}
      <div className="w-[22rem] bg-slate-950/95 dark:bg-[#020617]/95 backdrop-blur-2xl text-white flex flex-col shadow-[15px_0_50px_rgba(2,6,23,0.5)] dark:shadow-[15px_0_50px_rgba(0,0,0,0.8)] z-20 relative overflow-hidden border-l border-white/5 dark:border-amber-500/10 transition-colors duration-500">
        {/* Subtle geometric overlay for sidebar */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23d4af37\' fill-opacity=\'0.04\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] pointer-events-none mix-blend-overlay"></div>
        {/* Soft emerald radial gradient behind the text */}
        <div className="absolute top-0 right-0 w-full h-64 bg-emerald-900/40 dark:bg-emerald-900/20 blur-[80px] rounded-full pointer-events-none transition-colors duration-500"></div>

        <div className="p-10 flex flex-col items-center justify-center border-b border-amber-900/30 relative z-10 pb-12 pt-14">
          <div className="text-center w-full">
            <h1 className="text-[2.5rem] leading-[1.3] font-['Aref_Ruqaa'] font-bold bg-clip-text text-transparent bg-gradient-to-l from-amber-200 via-amber-400 to-amber-600 drop-shadow-[0_2px_15px_rgba(245,158,11,0.25)]">الجامع التاريخى</h1>
            <p className="text-sm font-bold text-amber-200/80 mt-3 tracking-wider">لشواهد البحث فى لغة القرآن الكريم</p>
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-8 space-y-2 relative z-10">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center space-x-4 space-x-reverse px-6 py-4 rounded-2xl transition-all duration-300 ease-out group ${
                  isActive 
                  ? 'bg-emerald-950/50 border-r-4 border-amber-400 text-amber-400 font-bold shadow-[inset_0px_0px_20px_rgba(245,158,11,0.05)] translate-x-[-4px]' 
                  : 'hover:bg-emerald-950/30 hover:translate-x-[-4px] text-stone-300 hover:text-amber-200 border-r-4 border-transparent'
                }`}
              >
                <item.icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110 drop-shadow-md' : 'group-hover:scale-110'}`} />
                <span className="text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>
        
        {/* Sidebar Footer Accent */}
        <div className="p-6 border-t border-emerald-800/50 bg-black/20 relative z-10">
           <div className="text-[10px] text-emerald-500/80 text-center uppercase tracking-widest">v2.0.0 Enterprise</div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative dark:bg-[#020617] transition-colors duration-500">
        {/* Subtle global pattern for main area in dark mode to match landing page vibe */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%230f172a\' fill-opacity=\'0.015\'%3E%3Cpath d=\'M50 0L0 50l50 50 50-50L50 0zm0 10l40 40-40 40L10 50 50 10z\'/%3E%3C/g%3E%3C/svg%3E')] dark:bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23d4af37\' fill-opacity=\'0.03\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] pointer-events-none z-0"></div>
        
        {/* Top Navbar - Soft Parchment Glassmorphism */}
        <header className="h-24 sticky top-0 z-40 backdrop-blur-2xl bg-[#FDFBF7]/80 dark:bg-[#064e3b]/30 border-b border-amber-900/10 dark:border-amber-500/20 flex items-center justify-between px-12 shadow-[0_4px_30px_rgba(0,0,0,0.02)] transition-colors duration-500">
          <div className="flex items-center">
            <h2 className="text-2xl font-['Amiri'] font-bold text-emerald-950 dark:text-amber-400 capitalize drop-shadow-sm transition-colors duration-500">
              {navItems.find(item => location.pathname.startsWith(item.path))?.name || 'مرحباً بك'}
            </h2>
          </div>

          <div className="flex items-center space-x-6 space-x-reverse">
            {/* Shamela Direct Link */}
            {user?.role !== 'developer' && (
              <a 
                href="https://shamela.ws"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 text-[#064e3b] hover:text-amber-600 dark:text-amber-200/60 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-slate-800/50 rounded-full transition-all duration-300 shadow-sm relative group"
                title="المكتبة الشاملة"
              >
                <BookOpen className="w-5 h-5" />
                <span className="absolute -bottom-8 right-1/2 translate-x-1/2 bg-slate-900 dark:bg-amber-500 text-white dark:text-slate-900 text-[10px] font-bold px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">المكتبة الشاملة</span>
              </a>
            )}

            <button 
              onClick={toggleTheme}
              className="p-3 text-stone-400 hover:text-amber-500 dark:text-amber-200/60 dark:hover:text-amber-400 hover:bg-white dark:hover:bg-slate-800/50 rounded-full transition-all duration-300 shadow-sm"
              title={theme === 'light' ? 'تفعيل الوضع الداكن' : 'تفعيل الوضع الفاتح'}
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            
            <div className="h-8 w-px bg-stone-200 dark:bg-slate-700/50 mx-2"></div>
            
            <div className="flex items-center space-x-3 space-x-reverse bg-white dark:bg-slate-900/50 px-4 py-2 rounded-full border border-stone-100 dark:border-amber-500/20 shadow-sm transition-colors duration-500">
              <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
                <UserCircle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800 dark:text-amber-50">{user?.name}</p>
                <p className="text-[11px] font-bold text-stone-500 dark:text-amber-200/60">{user?.roleText}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="p-3 text-stone-400 hover:text-rose-600 dark:text-rose-400/70 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-xl transition-all duration-200"
              title="تسجيل الخروج"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-12 relative z-10">
          <div className="max-w-7xl mx-auto h-full">
             <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
