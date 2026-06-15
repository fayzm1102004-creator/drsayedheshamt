import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { BookOpen, LayoutDashboard, MessageSquare, LogOut, User } from 'lucide-react';

export default function MainLayout() {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const [namePart, titlePart] = user?.name ? user.name.split(' (') : ['', ''];
  const displayName = namePart;
  const displayTitle = titlePart ? titlePart.replace(')', '') : 'مستخدم';

  const navItems = [
    { name: 'لوحة التحكم', path: '/dashboard', icon: LayoutDashboard },
    { name: 'المكتبة الشاملة', path: '/library', icon: BookOpen },
    { name: 'الاقتراحات', path: '/suggestions', icon: MessageSquare },
  ];

  return (
    <div className="flex h-screen bg-[#FDFBF7] font-sans selection:bg-amber-500/30">
      {/* Sidebar - Islamic Emerald to Deep Navy Gradient */}
      <div className="w-72 bg-gradient-to-b from-emerald-950 to-slate-900 text-white flex flex-col shadow-2xl z-20 relative overflow-hidden">
        {/* Subtle geometric overlay for sidebar */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23d4af37\' fill-opacity=\'0.03\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] pointer-events-none"></div>

        <div className="p-8 flex items-center justify-center border-b border-emerald-800/50 relative z-10">
          <div className="text-center">
            <h1 className="text-3xl font-['Amiri'] font-bold text-amber-500 tracking-tight drop-shadow-md">الجامع التاريخى</h1>
            <p className="text-[10px] font-bold text-emerald-300 mt-2 tracking-wider">لشواهد البحث فى لغه القران الكريم</p>
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-8 space-y-2 relative z-10">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center space-x-3 space-x-reverse px-5 py-3.5 rounded-xl transition-all duration-300 ease-in-out group ${
                  isActive 
                  ? 'bg-emerald-900/80 border-r-4 border-amber-500 text-amber-400 font-bold shadow-[0_0_15px_rgba(245,158,11,0.15)] translate-x-[-4px]' 
                  : 'hover:bg-emerald-900/30 hover:translate-x-[-4px] text-emerald-100 hover:text-amber-300 border-r-4 border-transparent'
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
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top Navbar - Soft Parchment Glassmorphism */}
        <header className="h-20 sticky top-0 z-50 backdrop-blur-md bg-[#FDFBF7]/90 border-b border-stone-200 flex items-center justify-between px-8 shadow-sm transition-all">
          <div className="flex items-center">
            <h2 className="text-2xl font-['Amiri'] font-bold text-emerald-950 capitalize">
              {navItems.find(item => location.pathname.startsWith(item.path))?.name || 'مرحباً بك'}
            </h2>
          </div>
          <div className="flex items-center space-x-6 space-x-reverse">
            <div className="flex items-center space-x-3 space-x-reverse text-sm bg-white px-4 py-2 rounded-2xl shadow-sm border border-stone-200">
              <div className="bg-amber-100 p-2.5 rounded-xl text-amber-600 border border-amber-200/50">
                <User className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-emerald-950 text-sm">{displayName}</p>
                <p className="text-[11px] font-semibold text-emerald-800/70 mt-0.5 max-w-[150px] truncate" title={displayTitle}>
                  {displayTitle}
                </p>
              </div>
            </div>
            <button
              onClick={logout}
              className="p-2.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all duration-200 border border-transparent hover:border-rose-200"
              title="تسجيل الخروج"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-8">
          <div className="max-w-7xl mx-auto h-full">
             <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
