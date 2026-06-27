import React, { useState } from 'react';
import { CheckCircle2, Clock, AlertCircle, FileText, Calendar, Filter } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const CardLayout = ({ children, title }) => (
  <div className="bg-gradient-to-br from-white/95 to-[#f8f5ec]/95 dark:bg-slate-900/90 backdrop-blur-3xl rounded-[2rem] shadow-[0_15px_40px_rgba(6,78,59,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] border border-[#d4af37]/40 dark:border-slate-800 border-t-[4px] border-t-[#064e3b] dark:border-t-amber-500 p-10 relative overflow-hidden transition-colors duration-500">
    <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4af37]/10 dark:bg-amber-500/10 rounded-full blur-[60px] pointer-events-none"></div>
    <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#064e3b]/5 dark:bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none"></div>
    <h3 className="text-3xl font-['Aref_Ruqaa'] font-bold text-[#064e3b] dark:text-amber-400 mb-8 pb-5 border-b border-[#064e3b]/10 dark:border-slate-800 relative z-10 transition-colors duration-500">{title}</h3>
    <div className="relative z-10">
      {children}
    </div>
  </div>
);

const userTasks = [
  { id: 1, title: 'مراجعة شواهد الراصد الأول', description: 'يرجى تدقيق الشواهد المرفوعة في قسم العصر العباسي', deadline: '2026-07-01', priority: 'عالي', status: 'جديدة' },
  { id: 2, title: 'تدقيق نحوي لكتاب العقد الفريد', description: 'مراجعة الباب الأول والثاني من الكتاب', deadline: '2026-07-05', priority: 'متوسط', status: 'قيد التنفيذ' },
  { id: 3, title: 'اعتماد الملاحظات من لجنة المراجعة', description: 'مراجعة ردود لجنة التدقيق والتحرير', deadline: '2026-06-30', priority: 'عالي', status: 'قيد التنفيذ' },
  { id: 4, title: 'استكمال رفع شواهد العصر الأموي', description: 'رفع باقي الملفات المتبقية', deadline: '2026-06-25', priority: 'منخفض', status: 'منجزة' },
  { id: 5, title: 'التواصل مع المنسق الرئيسي', description: 'لمناقشة خطة العمل للأسبوع القادم', deadline: '2026-07-03', priority: 'متوسط', status: 'جديدة' },
];

export default function Tasks() {
  const { user } = useAuth();
  const [filter, setFilter] = useState('الكل');

  const filteredTasks = filter === 'الكل' ? userTasks : userTasks.filter(t => t.status === filter);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'جديدة':
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800"><AlertCircle className="w-3 h-3 ml-1" /> {status}</span>;
      case 'قيد التنفيذ':
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800"><Clock className="w-3 h-3 ml-1" /> {status}</span>;
      case 'منجزة':
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"><CheckCircle2 className="w-3 h-3 ml-1" /> {status}</span>;
      default:
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-stone-100 dark:bg-slate-800 text-stone-600 dark:text-slate-400">{status}</span>;
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'عالي':
        return <span className="text-rose-600 dark:text-rose-400 font-bold bg-rose-50 dark:bg-rose-900/20 px-2 py-0.5 rounded-md text-xs">{priority}</span>;
      case 'متوسط':
        return <span className="text-amber-600 dark:text-amber-400 font-bold bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded-md text-xs">{priority}</span>;
      case 'منخفض':
        return <span className="text-slate-600 dark:text-slate-400 font-bold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md text-xs">{priority}</span>;
      default:
        return <span>{priority}</span>;
    }
  };

  const stats = [
    { label: 'إجمالي المهام', value: userTasks.length, icon: FileText, color: 'text-[#064e3b] dark:text-amber-400', bg: 'bg-[#064e3b]/5 dark:bg-amber-500/10' },
    { label: 'جديدة', value: userTasks.filter(t => t.status === 'جديدة').length, icon: AlertCircle, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
    { label: 'قيد التنفيذ', value: userTasks.filter(t => t.status === 'قيد التنفيذ').length, icon: Clock, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20' },
    { label: 'منجزة', value: userTasks.filter(t => t.status === 'منجزة').length, icon: CheckCircle2, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
  ];

  return (
    <div className="space-y-12">
      
      {/* User Greeting & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-gradient-to-br from-white/95 to-[#f8f5ec]/95 dark:bg-slate-900/90 backdrop-blur-3xl rounded-[2rem] p-6 flex items-center justify-between border border-[#d4af37]/30 dark:border-slate-800 shadow-[0_10px_30px_rgba(6,78,59,0.05)] dark:shadow-none transition-transform hover:scale-105 duration-300">
            <div>
              <p className="text-[#064e3b]/70 dark:text-slate-400 text-sm font-bold mb-1">{stat.label}</p>
              <h4 className="text-3xl font-bold text-[#064e3b] dark:text-amber-50">{stat.value}</h4>
            </div>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color} shadow-sm`}>
              <stat.icon className="w-7 h-7" />
            </div>
          </div>
        ))}
      </div>

      <CardLayout title="جدول المهام الموكلة إليك">
        {/* Filters */}
        <div className="mb-8 flex items-center gap-4">
          <div className="flex bg-[#f8f5ec] dark:bg-slate-950/50 p-2 rounded-2xl border border-[#d4af37]/30 dark:border-slate-800 shadow-inner overflow-x-auto transition-colors duration-500">
            {['الكل', 'جديدة', 'قيد التنفيذ', 'منجزة'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-300 ${
                  filter === f 
                    ? 'bg-gradient-to-b from-[#064e3b] to-[#022c22] dark:bg-amber-500/20 text-white dark:text-amber-400 shadow-[0_4px_15px_rgba(6,78,59,0.3)] scale-[1.02] border border-transparent dark:border-amber-500/30' 
                    : 'text-[#064e3b]/70 dark:text-slate-400 hover:text-[#064e3b] dark:hover:text-amber-50 hover:bg-white/80 dark:hover:bg-slate-800 hover:shadow-sm'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Tasks Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-[15px] text-right">
            <thead className="bg-[#064e3b]/5 dark:bg-slate-950/50 border-b border-[#064e3b]/10 dark:border-slate-800 transition-colors duration-500">
              <tr>
                <th className="px-8 py-5 text-[#064e3b] dark:text-slate-400 font-bold rounded-r-2xl w-1/3">تفاصيل المهمة</th>
                <th className="px-8 py-5 text-[#064e3b] dark:text-slate-400 font-bold">تاريخ الاستحقاق</th>
                <th className="px-8 py-5 text-[#064e3b] dark:text-slate-400 font-bold">الأهمية</th>
                <th className="px-8 py-5 text-center text-[#064e3b] dark:text-slate-400 font-bold rounded-l-2xl">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#064e3b]/5 dark:divide-slate-800/80">
              {filteredTasks.length > 0 ? (
                filteredTasks.map(task => (
                  <tr key={task.id} className="hover:bg-[#d4af37]/10 dark:hover:bg-slate-800/50 transition-colors duration-200">
                    <td className="px-8 py-6">
                      <p className="font-bold text-[#064e3b] dark:text-amber-50 text-base mb-1">{task.title}</p>
                      <p className="text-sm text-[#064e3b]/60 dark:text-slate-400">{task.description}</p>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="flex items-center text-[#064e3b]/80 dark:text-slate-300 font-medium">
                        <Calendar className="w-4 h-4 ml-2 opacity-70" />
                        <span dir="ltr">{task.deadline}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      {getPriorityBadge(task.priority)}
                    </td>
                    <td className="px-8 py-6 text-center">
                      {getStatusBadge(task.status)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-8 py-16 text-center text-[#064e3b]/50 dark:text-slate-500 font-bold">
                    لا توجد مهام مطابقة للفلتر المحدد
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardLayout>
    </div>
  );
}
