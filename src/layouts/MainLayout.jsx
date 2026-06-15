import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Outlet, Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
import { BookOpen, LayoutDashboard, MessageSquare, LogOut, UserCircle, Bell, Search, Moon, Sun } from 'lucide-react';

export default function MainLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const navItems = [
    { name: 'لوحة التحكم', path: '/dashboard', icon: LayoutDashboard },
    { name: 'المكتبة الشاملة', path: '/library', icon: BookOpen },
    { name: 'الاقتراحات', path: '/suggestions', icon: MessageSquare },
  ];

  return (
    <div className="flex h-screen bg-[#f8f5ec] dark:bg-[#020617] transition-colors duration-500 font-sans selection:bg-amber-500/30">
      {/* Sidebar - Rich Emerald (Light) & Deep Navy (Dark) */}
      <div className="w-[22rem] bg-gradient-to-b from-[#064e3b] to-[#022c22] dark:from-slate-950/95 dark:to-[#020617]/95 text-white flex flex-col shadow-[15px_0_50px_rgba(6,78,59,0.15)] dark:shadow-[15px_0_50px_rgba(0,0,0,0.8)] z-20 relative overflow-hidden border-l border-white/10 dark:border-amber-500/10 transition-colors duration-500">
        {/* Subtle geometric overlay for sidebar */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23d4af37\' fill-opacity=\'0.06\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] pointer-events-none mix-blend-overlay"></div>
        {/* Soft radial gradient behind the text */}
        <div className="absolute top-0 right-0 w-full h-64 bg-[#fbbf24]/10 dark:bg-emerald-900/20 blur-[80px] rounded-full pointer-events-none transition-colors duration-500"></div>

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
        {/* Subtle global pattern for main area - Soft gold/emerald pattern in light mode, dark pattern in dark mode */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23064e3b\' fill-opacity=\'0.025\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] dark:bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23d4af37\' fill-opacity=\'0.03\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] pointer-events-none z-0"></div>
        
        {/* Top Navbar - Soft Parchment Glassmorphism */}
        <header className="h-24 sticky top-0 z-40 backdrop-blur-2xl bg-[#f8f5ec]/70 dark:bg-[#064e3b]/30 border-b border-[#064e3b]/10 dark:border-amber-500/20 flex items-center justify-between px-12 shadow-[0_4px_30px_rgba(6,78,59,0.03)] transition-colors duration-500">
          <div className="flex items-center">
            <h2 className="text-2xl font-['Amiri'] font-bold text-emerald-950 dark:text-amber-400 capitalize drop-shadow-sm transition-colors duration-500">
              {navItems.find(item => location.pathname.startsWith(item.path))?.name || 'مرحباً بك'}
            </h2>
          </div>

          <div className="flex items-center space-x-6 space-x-reverse">
            <button 
              onClick={toggleTheme}
              className="p-3 text-[#064e3b]/60 hover:text-[#d97706] dark:text-amber-200/60 dark:hover:text-amber-400 hover:bg-[#064e3b]/5 dark:hover:bg-slate-800/50 rounded-full transition-all duration-300 shadow-sm border border-transparent hover:border-[#064e3b]/10 dark:hover:border-transparent"
              title={theme === 'light' ? 'تفعيل الوضع الداكن' : 'تفعيل الوضع الفاتح'}
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            
            <div className="h-8 w-px bg-[#064e3b]/10 dark:bg-slate-700/50 mx-2"></div>
            
            <div className="flex items-center space-x-3 space-x-reverse bg-white/60 dark:bg-slate-900/50 px-4 py-2 rounded-full border border-[#064e3b]/10 dark:border-amber-500/20 shadow-sm transition-colors duration-500 backdrop-blur-md">
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
