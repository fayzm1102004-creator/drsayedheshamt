import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Outlet, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, LogOut, UserCircle, Moon, Sun, CheckSquare, ClipboardList, Menu, X } from 'lucide-react';
import ShamelaWidget from '../components/ShamelaWidget';

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
    { name: 'إرساليات الرصد', path: '/observer', icon: ClipboardList },
    { name: 'المهام', path: '/tasks', icon: CheckSquare },
    { name: 'الشكاوى والاقتراحات', path: '/suggestions', icon: MessageSquare },
  ];

  const navItems = user?.role === 'developer' 
    ? allNavItems.filter(item => item.path === '/suggestions')
    : allNavItems;

  const handleNavClick = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  /* ── Sidebar Content (shared between desktop & mobile) ── */
  const SidebarContent = () => (
    <>
      <div className="p-6 lg:p-10 flex flex-col items-center justify-center border-b border-amber-900/30 relative z-10 pb-8 lg:pb-12 pt-10 lg:pt-14">
        <div className="text-center w-full">
          <h1 className="text-2xl lg:text-[2.5rem] leading-[1.3] font-['Aref_Ruqaa'] font-bold bg-clip-text text-transparent bg-gradient-to-l from-amber-200 via-amber-400 to-amber-600 drop-shadow-[0_2px_15px_rgba(245,158,11,0.25)]">الجامع التاريخى</h1>
          <p className="text-xs lg:text-sm font-bold text-amber-200/80 mt-2 lg:mt-3 tracking-wider">لشواهد البحث فى لغة القرآن الكريم</p>
        </div>
      </div>
      
      <nav className="flex-1 px-3 lg:px-4 py-6 lg:py-8 space-y-1.5 relative z-10 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <button
              key={item.name}
              onClick={() => handleNavClick(item.path)}
              className={`w-full flex items-center space-x-3 space-x-reverse px-4 lg:px-6 py-3 lg:py-4 rounded-xl lg:rounded-2xl transition-all duration-300 ease-out group text-right ${
                isActive 
                ? 'bg-emerald-950/50 border-r-4 border-amber-400 text-amber-400 font-bold shadow-[inset_0px_0px_20px_rgba(245,158,11,0.05)]' 
                : 'hover:bg-emerald-950/30 text-stone-300 hover:text-amber-200 border-r-4 border-transparent'
              }`}
            >
              <item.icon className={`w-5 h-5 shrink-0 transition-transform duration-300 ${isActive ? 'scale-110 drop-shadow-md' : 'group-hover:scale-110'}`} />
              <span className="text-sm">{item.name}</span>
            </button>
          );
        })}
      </nav>
      
      <div className="p-4 lg:p-6 border-t border-emerald-800/50 bg-black/20 relative z-10">
         <div className="text-[10px] text-emerald-500/80 text-center uppercase tracking-widest">v2.0.0 Enterprise</div>
      </div>
    </>
  );

  const sidebarBg = "bg-slate-950/95 dark:bg-[#020617]/95 backdrop-blur-2xl text-white overflow-hidden border-l border-white/5 dark:border-amber-500/10";
  const sidebarPattern = "absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%3E%3Cg%20fill%3D%22%23d4af37%22%20fill-opacity%3D%220.04%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] pointer-events-none mix-blend-overlay";

  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#020617] transition-colors duration-500 font-sans selection:bg-amber-500/30">
      
      {/* ══════════════════════════════════════════════════
          DESKTOP SIDEBAR (hidden on mobile, visible on lg+)
         ══════════════════════════════════════════════════ */}
      <div className={`hidden lg:flex lg:fixed lg:inset-y-0 lg:right-0 lg:z-30 lg:w-[22rem] lg:flex-col ${sidebarBg} shadow-[15px_0_50px_rgba(2,6,23,0.5)]`}>
        <div className={sidebarPattern}></div>
        <div className="absolute top-0 right-0 w-full h-64 bg-emerald-900/40 blur-[80px] rounded-full pointer-events-none"></div>
        <SidebarContent />
      </div>

      {/* ══════════════════════════════════════════════════
          MOBILE SIDEBAR OVERLAY (shown only when menu is open)
         ══════════════════════════════════════════════════ */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          {/* Drawer */}
          <div className={`fixed inset-y-0 right-0 z-[70] w-[280px] flex flex-col lg:hidden ${sidebarBg} shadow-[-10px_0_40px_rgba(0,0,0,0.5)] animate-in slide-in-from-right duration-300`}>
            <div className={sidebarPattern}></div>
            <div className="absolute top-0 right-0 w-full h-64 bg-emerald-900/40 blur-[80px] rounded-full pointer-events-none"></div>
            {/* Close Button */}
            <button 
              className="absolute top-4 left-4 z-20 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
            <SidebarContent />
          </div>
        </>
      )}

      {/* ══════════════════════════════════════════════════
          MAIN CONTENT AREA
         ══════════════════════════════════════════════════ */}
      <div className="lg:mr-[22rem] flex flex-col min-h-screen">
        
        {/* ── Top Navbar ── */}
        <header className="h-14 sm:h-16 lg:h-24 sticky top-0 z-40 backdrop-blur-2xl bg-[#FDFBF7]/80 dark:bg-[#064e3b]/30 border-b border-amber-900/10 dark:border-amber-500/20 flex items-center justify-between px-3 sm:px-4 lg:px-12 shadow-[0_4px_30px_rgba(0,0,0,0.02)] transition-colors duration-500">
          
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {/* Mobile Hamburger */}
            <button 
              className="lg:hidden p-2 text-emerald-900 dark:text-amber-400 hover:bg-emerald-100 dark:hover:bg-slate-800 rounded-xl transition-colors shrink-0"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <h2 className="text-sm sm:text-base lg:text-2xl font-['Amiri'] font-bold text-emerald-950 dark:text-amber-400 truncate">
              {navItems.find(item => location.pathname.startsWith(item.path))?.name || 'مرحباً بك'}
            </h2>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 lg:gap-6 shrink-0">
            <button 
              onClick={toggleTheme}
              className="p-2 text-stone-400 hover:text-amber-500 dark:text-amber-200/60 dark:hover:text-amber-400 hover:bg-white dark:hover:bg-slate-800/50 rounded-full transition-all duration-300"
              title={theme === 'light' ? 'تفعيل الوضع الداكن' : 'تفعيل الوضع الفاتح'}
            >
              {theme === 'light' ? <Moon className="w-4 h-4 sm:w-5 sm:h-5" /> : <Sun className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>
            
            <div className="hidden sm:block h-8 w-px bg-stone-200 dark:bg-slate-700/50"></div>
            
            {/* User Info - hidden on mobile */}
            <div className="hidden md:flex items-center space-x-3 space-x-reverse bg-white dark:bg-slate-900/50 px-3 py-2 rounded-full border border-stone-100 dark:border-amber-500/20 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
                <UserCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800 dark:text-amber-50">{user?.name}</p>
                <p className="text-[11px] font-bold text-stone-500 dark:text-amber-200/60">{user?.roleText}</p>
              </div>
            </div>

            <button
              onClick={logout}
              className="p-2 text-stone-400 hover:text-rose-600 dark:text-rose-400/70 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-xl transition-all duration-200"
              title="تسجيل الخروج"
            >
              <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </header>

        {/* ── Page Content ── */}
        <main className="flex-1 overflow-auto p-3 sm:p-4 md:p-6 lg:p-12 relative z-10">
          <div className="max-w-7xl mx-auto">
             <Outlet />
          </div>
        </main>
      </div>

      {/* Global Shamela Widget */}
      <ShamelaWidget />
    </div>
  );
}
