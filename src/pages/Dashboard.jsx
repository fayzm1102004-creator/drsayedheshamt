import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  FileDown, UploadCloud, CheckCircle2, XCircle, Inbox, 
  FileCheck2, SearchX, Send, BadgeCheck, Users, Activity,
  FileText, ShieldCheck, Download, BookText
} from 'lucide-react';

export default function Dashboard() {
  const { role } = useAuth();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto pb-12">
      {role === 'level1' && <ObserverView />}
      {role === 'level2' && <CoordinatorView />}
      {role === 'review_committee' && <ReviewCommitteeView />}
      {role === 'correction_committee' && <CorrectionCommitteeView />}
      {role === 'level3' && <MainCoordinatorView />}
      {role === 'level4' && <AuditorView />}
      {role === 'scientific_committee' && <ScientificCommitteeView />}
      {role === 'approval_committee' && <ApprovalCommitteeView />}
      {role === 'level5' && <AssistantSupervisorView />}
      {role === 'level6' && <GeneralSupervisorView />}
    </div>
  );
}

// ----------------------------------------------------
// SHARED COMPONENTS
// ----------------------------------------------------
function RejectionModal({ isOpen, onClose, onConfirm }) {
  const [reason, setReason] = useState('');

  // Reset reason when modal opens
  useEffect(() => {
    if (isOpen) setReason('');
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!reason.trim()) return;
    onConfirm(reason);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#FDFBF7] rounded-3xl shadow-2xl border-t-4 border-t-rose-600 p-8 max-w-lg w-full relative overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Islamic motif accent */}
        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-32 h-32 border-[8px] border-amber-500/10 rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-24 h-24 border-[6px] border-emerald-800/5 rounded-full pointer-events-none"></div>
        
        <h3 className="text-3xl font-['Amiri'] font-bold text-emerald-950 mb-2 relative z-10 flex items-center gap-2">
          <XCircle className="w-8 h-8 text-rose-500" />
          طلب تعديل على الملف
        </h3>
        <p className="text-sm text-stone-500 mb-6 relative z-10 font-medium">يرجى توضيح سبب إرجاع الملف للزميل في المستوى السابق ليتم تدارك الأخطاء.</p>
        
        <div className="relative z-10 space-y-6">
          <div>
            <label className="block text-sm font-bold text-emerald-900 mb-2">سبب طلب التعديل أو الملاحظات</label>
            <textarea 
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full h-32 px-4 py-3 bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all text-stone-700 resize-none shadow-sm font-medium leading-relaxed"
              placeholder="يرجى كتابة الملاحظات أو الأخطاء بالتفصيل هنا..."
            />
          </div>
          
          <div className="flex justify-end gap-3 pt-2">
            <button 
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl text-sm font-bold bg-stone-200 text-stone-600 hover:bg-stone-300 transition-colors shadow-sm"
            >
              إلغاء
            </button>
            <button 
              onClick={handleConfirm}
              disabled={!reason.trim()}
              className="px-6 py-2.5 rounded-xl text-sm font-bold bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 hover:border-rose-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm flex items-center gap-2"
            >
              تأكيد وإرجاع <Send className="w-4 h-4 rotate-180" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


// ----------------------------------------------------
// LEVEL 1: OBSERVER
// ----------------------------------------------------
function ObserverView() {
  const uploadedFiles = [
    { name: 'شواهد_سورة_البقرة.xlsx', date: '2023-10-15', status: 'قيد المراجعة', color: 'bg-amber-100 text-amber-800 border-amber-200' },
    { name: 'ألفاظ_غريب_القرآن.xlsx', date: '2023-10-12', status: 'محتاج تعديل', color: 'bg-rose-50 text-rose-600 border-rose-100' },
    { name: 'جذور_حرف_الألف.xlsx', date: '2023-10-10', status: 'ملف صحيح', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' }
  ];

  return (
    <div className="space-y-8">
      <div className="bg-stone-50/50 rounded-2xl p-16 border-2 border-dashed border-emerald-800/30 hover:border-amber-500 hover:bg-stone-100 transition-all duration-300 flex flex-col items-center justify-center text-center cursor-pointer group">
        <UploadCloud className="w-14 h-14 text-emerald-800/40 group-hover:text-amber-500 mb-6 transition-colors duration-300" strokeWidth={1.5} />
        <p className="text-xl font-['Amiri'] font-bold text-emerald-950 mb-2">اسحب وأفلت ملف الإكسيل هنا لرفعه للمنسق</p>
        <p className="text-stone-500 text-sm">أو انقر لاختيار ملف من جهازك بصيغة (XLSX, CSV)</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-stone-200 border-t-4 border-t-emerald-800 p-8">
        <div className="flex items-center justify-between mb-6 border-b border-stone-100 pb-4">
           <div>
             <h3 className="text-2xl font-['Amiri'] font-bold text-emerald-950">جدول الملفات المرفوعة وحالتها</h3>
             <p className="text-sm text-stone-400 mt-1">تتم المراجعة من قبل المنسق المسؤول</p>
           </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right">
            <thead className="text-sm text-emerald-900 font-bold bg-stone-100/80">
              <tr>
                <th className="px-6 py-4 rounded-r-xl">اسم الملف</th>
                <th className="px-6 py-4">التاريخ والوقت</th>
                <th className="px-6 py-4 rounded-l-xl text-center">الحالة (رد المنسق)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {uploadedFiles.map((file, idx) => (
                <tr key={idx} className="hover:bg-stone-50 transition-colors">
                  <td className="px-6 py-5 font-bold text-emerald-950 flex items-center gap-3">
                    <div className="p-2 bg-stone-100 text-amber-600 rounded-lg"><FileText className="w-4 h-4"/></div>
                    {file.name}
                  </td>
                  <td className="px-6 py-5 text-stone-500 font-medium">{file.date}</td>
                  <td className="px-6 py-5 text-center">
                    <span className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${file.color}`}>
                      {file.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// LEVEL 2: COORDINATOR
// ----------------------------------------------------
function CoordinatorView() {
  const [tasks, setTasks] = useState([
    { obs: 'الراصد 1', file: 'شواهد_سورة_البقرة.xlsx', status: 'قيد المراجعة', color: 'bg-amber-100 text-amber-800 border-amber-200', sent: false },
    { obs: 'الراصد 2', file: 'ألفاظ_غريب_القرآن.xlsx', status: 'قيد المراجعة', color: 'bg-amber-100 text-amber-800 border-amber-200', sent: false },
    { obs: 'الراصد 3', file: 'جذور_حرف_الألف.xlsx', status: 'قيد المراجعة', color: 'bg-amber-100 text-amber-800 border-amber-200', sent: false },
    { obs: 'الراصد 4', file: 'شواهد_العصر_الجاهلي.xlsx', status: 'قيد المراجعة', color: 'bg-amber-100 text-amber-800 border-amber-200', sent: false },
  ]);

  const [rejectModal, setRejectModal] = useState({ isOpen: false, payload: null });

  const handleAction = (idx, actionType) => {
    if (actionType === 'accept') {
      const newTasks = [...tasks];
      newTasks[idx].sent = true;
      newTasks[idx].status = 'تم القبول والتمرير';
      newTasks[idx].color = 'bg-emerald-100 text-emerald-800 border-emerald-200';
      setTasks(newTasks);
    } else {
      setRejectModal({ isOpen: true, payload: { idx } });
    }
  };

  const confirmReject = (reason) => {
    const { idx } = rejectModal.payload;
    const newTasks = [...tasks];
    newTasks[idx].sent = true;
    newTasks[idx].status = 'محتاج تعديل';
    newTasks[idx].color = 'bg-rose-50 text-rose-600 border-rose-100';
    newTasks[idx].reason = reason;
    setTasks(newTasks);
    setRejectModal({ isOpen: false, payload: null });
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl shadow-lg border border-stone-200 border-t-4 border-t-emerald-800 p-8">
        <div className="mb-8 flex justify-between items-center border-b border-stone-100 pb-4">
           <div>
             <h3 className="text-2xl font-['Amiri'] font-bold text-emerald-950">مراجعة ملفات الرصاد</h3>
             <p className="text-sm text-stone-400 mt-1">الملفات المستلمة من الرصاد</p>
           </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right">
            <thead className="text-sm text-emerald-900 font-bold bg-stone-100/80">
              <tr>
                <th className="px-6 py-4 rounded-r-xl">الراصد</th>
                <th className="px-6 py-4">اسم الملف</th>
                <th className="px-6 py-4 text-center">الحالة</th>
                <th className="px-6 py-4 text-center rounded-l-xl">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {tasks.map((item, idx) => (
                <tr key={idx} className="hover:bg-stone-50 transition-colors duration-200 group">
                  <td className="px-6 py-5 text-emerald-950 font-bold">{item.obs}</td>
                  <td className="px-6 py-5 text-stone-600 font-medium">
                    {item.file}
                    {item.reason && <p className="text-xs text-rose-600 mt-1 font-bold">الملاحظات: {item.reason}</p>}
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${item.color}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="flex justify-center items-center gap-2">
                      <button 
                        onClick={() => handleAction(idx, 'accept')}
                        disabled={item.sent}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border shadow-sm transition-all flex items-center gap-1.5 ${
                          item.sent 
                          ? 'bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed opacity-60' 
                          : 'bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200 hover:shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> قبول وتمرير
                      </button>
                      <button 
                        onClick={() => handleAction(idx, 'reject')}
                        disabled={item.sent}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border shadow-sm transition-all flex items-center gap-1.5 ${
                          item.sent 
                          ? 'bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed opacity-60' 
                          : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                        }`}
                      >
                        <XCircle className="w-3.5 h-3.5" /> رفض وإرجاع
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <RejectionModal 
        isOpen={rejectModal.isOpen} 
        onClose={() => setRejectModal({ isOpen: false, payload: null })} 
        onConfirm={confirmReject} 
      />
    </div>
  );
}

// ----------------------------------------------------
// LEVEL 3 SUB: REVIEW COMMITTEE
// ----------------------------------------------------
function ReviewCommitteeView() {
  const [data, setData] = useState([
    { title: "تحليل الشاهد النحوي لقوله تعالى (اهدنا الصراط المستقيم)", source: "تفسير الكشاف", quarter: "الربع الأول", status: "تمت المراجعة العلمية", color: "bg-emerald-100 text-emerald-800 border-emerald-200", sent: false },
    { title: "توثيق شواهد صيغ المبالغة في سورة آل عمران", source: "البحر المحيط", quarter: "الربع الثاني", status: "قيد الفحص", color: "bg-amber-100 text-amber-800 border-amber-200", sent: false }
  ]);
  const [rejectModal, setRejectModal] = useState({ isOpen: false, payload: null });

  const handleAction = (idx, actionType) => {
    if (actionType === 'accept') {
      const newData = [...data];
      newData[idx].sent = true;
      newData[idx].status = 'تم القبول والتمرير';
      newData[idx].color = 'bg-emerald-100 text-emerald-800 border-emerald-200';
      setData(newData);
    } else {
      setRejectModal({ isOpen: true, payload: { idx } });
    }
  };

  const confirmReject = (reason) => {
    const { idx } = rejectModal.payload;
    const newData = [...data];
    newData[idx].sent = true;
    newData[idx].status = 'محتاج تعديل';
    newData[idx].color = 'bg-rose-50 text-rose-600 border-rose-100';
    newData[idx].reason = reason;
    setData(newData);
    setRejectModal({ isOpen: false, payload: null });
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl shadow-lg border border-stone-200 border-t-4 border-t-emerald-800 p-8">
        <div className="flex items-center justify-between mb-8 border-b border-stone-100 pb-4">
           <div>
             <h3 className="text-2xl font-['Amiri'] font-bold text-emerald-950">مساحة عمل لجنة المراجعة</h3>
             <p className="text-sm text-stone-400 mt-1">مراجعة الشواهد اللغوية الواردة من المنسقين وتجهيزها</p>
           </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right">
            <thead className="text-sm text-emerald-900 font-bold bg-stone-100/80">
              <tr>
                <th className="px-6 py-4 rounded-r-xl">بيان الشاهد</th>
                <th className="px-6 py-4">المصدر</th>
                <th className="px-6 py-4">الربع</th>
                <th className="px-6 py-4 text-center">الحالة</th>
                <th className="px-6 py-4 text-center rounded-l-xl">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {data.map((item, idx) => (
                <tr key={idx} className="hover:bg-stone-50 transition-colors">
                  <td className="px-6 py-5 font-bold text-emerald-950">
                    {item.title}
                    {item.reason && <p className="text-xs text-rose-600 mt-1 font-bold">الملاحظات: {item.reason}</p>}
                  </td>
                  <td className="px-6 py-5 text-stone-500 font-medium">{item.source}</td>
                  <td className="px-6 py-5 text-stone-500 font-medium">{item.quarter}</td>
                  <td className="px-6 py-5 text-center">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${item.color}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="flex justify-center items-center gap-2">
                      <button 
                        onClick={() => handleAction(idx, 'accept')}
                        disabled={item.sent}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border shadow-sm transition-all flex items-center gap-1.5 ${
                          item.sent 
                          ? 'bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed opacity-60' 
                          : 'bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200 hover:shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> قبول وتمرير
                      </button>
                      <button 
                        onClick={() => handleAction(idx, 'reject')}
                        disabled={item.sent}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border shadow-sm transition-all flex items-center gap-1.5 ${
                          item.sent 
                          ? 'bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed opacity-60' 
                          : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                        }`}
                      >
                        <XCircle className="w-3.5 h-3.5" /> رفض وإرجاع
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <RejectionModal 
        isOpen={rejectModal.isOpen} 
        onClose={() => setRejectModal({ isOpen: false, payload: null })} 
        onConfirm={confirmReject} 
      />
    </div>
  );
}

// ----------------------------------------------------
// LEVEL 3 SUB: CORRECTION COMMITTEE
// ----------------------------------------------------
function CorrectionCommitteeView() {
  const [evidenceData, setEvidenceData] = useState([
    { title: "إعادة ضبط عزو الشاهد رقم 104 للشعر الجاهلي", status: "جاري التعديل", color: "bg-amber-100 text-amber-800 border-amber-200", sent: false }
  ]);
  const [booksData, setBooksData] = useState([
    { title: "تصحيح طبعة كتاب (تسهيل الفوائد) وتدقيق الصفحة", status: "تم الاستدراك", color: "bg-emerald-100 text-emerald-800 border-emerald-200", sent: false }
  ]);
  const [rejectModal, setRejectModal] = useState({ isOpen: false, payload: null });

  const handleAction = (idx, tableType, actionType) => {
    if (actionType === 'accept') {
      let newData = tableType === 'evidence' ? [...evidenceData] : [...booksData];
      newData[idx].sent = true;
      newData[idx].status = 'تم القبول والتمرير';
      newData[idx].color = 'bg-emerald-100 text-emerald-800 border-emerald-200';
      
      if (tableType === 'evidence') setEvidenceData(newData);
      else setBooksData(newData);
    } else {
      setRejectModal({ isOpen: true, payload: { idx, tableType } });
    }
  };

  const confirmReject = (reason) => {
    const { idx, tableType } = rejectModal.payload;
    let newData = tableType === 'evidence' ? [...evidenceData] : [...booksData];
    
    newData[idx].sent = true;
    newData[idx].status = 'محتاج تعديل';
    newData[idx].color = 'bg-rose-50 text-rose-600 border-rose-100';
    newData[idx].reason = reason;
    
    if (tableType === 'evidence') setEvidenceData(newData);
    else setBooksData(newData);
    
    setRejectModal({ isOpen: false, payload: null });
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl shadow-lg border border-stone-200 border-t-4 border-t-emerald-800 p-8">
        <div className="flex items-center justify-between mb-8 border-b border-stone-100 pb-4">
           <div>
             <h3 className="text-2xl font-['Amiri'] font-bold text-emerald-950">مساحة عمل لجنة الاستدراك</h3>
             <p className="text-sm text-stone-400 mt-1">تصحيح واستدراك النواقص في الشواهد والمصادر</p>
           </div>
        </div>

        <div className="space-y-10">
          <div>
            <h4 className="text-xl font-['Amiri'] font-bold text-emerald-900 mb-4 inline-block border-b-2 border-amber-500 pb-1">قسم الشواهد</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-right">
                <thead className="text-sm text-emerald-900 font-bold bg-stone-100/80">
                  <tr>
                    <th className="px-6 py-4 rounded-r-xl">بيان الاستدراك</th>
                    <th className="px-6 py-4 text-center">الحالة</th>
                    <th className="px-6 py-4 text-center rounded-l-xl">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {evidenceData.map((item, idx) => (
                    <tr key={idx} className="hover:bg-stone-50 transition-colors">
                      <td className="px-6 py-5 font-bold text-emerald-950">
                        {item.title}
                        {item.reason && <p className="text-xs text-rose-600 mt-1 font-bold">الملاحظات: {item.reason}</p>}
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${item.color}`}>{item.status}</span>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <div className="flex justify-center items-center gap-2">
                          <button 
                            onClick={() => handleAction(idx, 'evidence', 'accept')}
                            disabled={item.sent}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold border shadow-sm transition-all flex items-center gap-1.5 ${
                              item.sent 
                              ? 'bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed opacity-60' 
                              : 'bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200 hover:shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                            }`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> قبول وتمرير
                          </button>
                          <button 
                            onClick={() => handleAction(idx, 'evidence', 'reject')}
                            disabled={item.sent}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold border shadow-sm transition-all flex items-center gap-1.5 ${
                              item.sent 
                              ? 'bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed opacity-60' 
                              : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                            }`}
                          >
                            <XCircle className="w-3.5 h-3.5" /> رفض وإرجاع
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h4 className="text-xl font-['Amiri'] font-bold text-emerald-900 mb-4 inline-block border-b-2 border-amber-500 pb-1">قسم الكتب</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-right">
                <thead className="text-sm text-emerald-900 font-bold bg-stone-100/80">
                  <tr>
                    <th className="px-6 py-4 rounded-r-xl">بيان الاستدراك</th>
                    <th className="px-6 py-4 text-center">الحالة</th>
                    <th className="px-6 py-4 text-center rounded-l-xl">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {booksData.map((item, idx) => (
                    <tr key={idx} className="hover:bg-stone-50 transition-colors">
                      <td className="px-6 py-5 font-bold text-emerald-950">
                        {item.title}
                        {item.reason && <p className="text-xs text-rose-600 mt-1 font-bold">الملاحظات: {item.reason}</p>}
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${item.color}`}>{item.status}</span>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <div className="flex justify-center items-center gap-2">
                          <button 
                            onClick={() => handleAction(idx, 'books', 'accept')}
                            disabled={item.sent}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold border shadow-sm transition-all flex items-center gap-1.5 ${
                              item.sent 
                              ? 'bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed opacity-60' 
                              : 'bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200 hover:shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                            }`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> قبول وتمرير
                          </button>
                          <button 
                            onClick={() => handleAction(idx, 'books', 'reject')}
                            disabled={item.sent}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold border shadow-sm transition-all flex items-center gap-1.5 ${
                              item.sent 
                              ? 'bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed opacity-60' 
                              : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                            }`}
                          >
                            <XCircle className="w-3.5 h-3.5" /> رفض وإرجاع
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <RejectionModal 
        isOpen={rejectModal.isOpen} 
        onClose={() => setRejectModal({ isOpen: false, payload: null })} 
        onConfirm={confirmReject} 
      />
    </div>
  );
}

// ----------------------------------------------------
// LEVEL 3: MAIN COORDINATOR
// ----------------------------------------------------
function MainCoordinatorView() {
  const [activeTab, setActiveTab] = useState('review');

  const [reviewData, setReviewData] = useState([
    { title: "تحليل الشاهد النحوي لقوله تعالى (اهدنا الصراط المستقيم)", source: "تفسير الكشاف", quarter: "الربع الأول", status: "تمت المراجعة", color: "bg-emerald-100 text-emerald-800 border-emerald-200", sent: false },
    { title: "توثيق شواهد صيغ المبالغة في سورة آل عمران", source: "البحر المحيط", quarter: "الربع الثاني", status: "تمت المراجعة", color: "bg-emerald-100 text-emerald-800 border-emerald-200", sent: false }
  ]);

  const [evidenceData, setEvidenceData] = useState([
    { title: "إعادة ضبط عزو الشاهد رقم 104 للشعر الجاهلي", status: "تم التعديل", color: "bg-blue-100 text-blue-800 border-blue-200", sent: false }
  ]);

  const [booksData, setBooksData] = useState([
    { title: "تصحيح طبعة كتاب (تسهيل الفوائد) وتدقيق الصفحة", status: "تم الاستدراك", color: "bg-emerald-100 text-emerald-800 border-emerald-200", sent: false }
  ]);

  const [rejectModal, setRejectModal] = useState({ isOpen: false, payload: null });

  const handleAction = (idx, tableType, actionType) => {
    let newData;
    if (tableType === 'review') newData = [...reviewData];
    else if (tableType === 'evidence') newData = [...evidenceData];
    else newData = [...booksData];

    if (actionType === 'accept') {
      newData[idx].sent = true;
      newData[idx].status = 'تم القبول والتمرير';
      newData[idx].color = 'bg-emerald-100 text-emerald-800 border-emerald-200';
      if (tableType === 'review') setReviewData(newData);
      else if (tableType === 'evidence') setEvidenceData(newData);
      else setBooksData(newData);
    } else {
      setRejectModal({ isOpen: true, payload: { idx, tableType } });
    }
  };

  const confirmReject = (reason) => {
    const { idx, tableType } = rejectModal.payload;
    let newData;
    let setter;

    if (tableType === 'review') { newData = [...reviewData]; setter = setReviewData; }
    else if (tableType === 'evidence') { newData = [...evidenceData]; setter = setEvidenceData; }
    else if (tableType === 'books') { newData = [...booksData]; setter = setBooksData; }

    newData[idx].sent = true;
    newData[idx].status = 'محتاج تعديل';
    newData[idx].color = 'bg-rose-50 text-rose-600 border-rose-100';
    newData[idx].reason = reason;
    setter(newData);
    setRejectModal({ isOpen: false, payload: null });
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-md border border-stone-200 border-t-2 border-t-amber-500 p-6 relative overflow-hidden">
           <h3 className="text-xl font-['Amiri'] font-bold text-emerald-950 mb-2">لجنة المراجعة</h3>
           <p className="text-xs text-stone-500 mb-4 font-medium">مراجعة بيانات الأرباع الأربعة</p>
           <div className="bg-[#FDFBF7] rounded-xl p-4 border border-stone-100 flex justify-between items-center">
             <div>
               <p className="text-3xl font-bold text-emerald-900">2</p>
               <p className="text-[10px] font-bold text-stone-400 mt-1 uppercase tracking-wider">ملف جاهز</p>
             </div>
             <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center border border-emerald-200">
               <CheckCircle2 className="w-6 h-6" />
             </div>
           </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-md border border-stone-200 border-t-2 border-t-amber-500 p-6 relative overflow-hidden">
           <h3 className="text-xl font-['Amiri'] font-bold text-emerald-950 mb-2">لجنة الاستدراك (الشواهد)</h3>
           <p className="text-xs text-stone-500 mb-4 font-medium">استدراك الشواهد والمصادر</p>
           <div className="bg-[#FDFBF7] rounded-xl p-4 border border-stone-100 flex justify-between items-center">
             <div>
               <p className="text-3xl font-bold text-emerald-900">1</p>
               <p className="text-[10px] font-bold text-stone-400 mt-1 uppercase tracking-wider">ملف معدل</p>
             </div>
             <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center border border-amber-200">
               <Activity className="w-6 h-6" />
             </div>
           </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md border border-stone-200 border-t-2 border-t-amber-500 p-6 relative overflow-hidden">
           <h3 className="text-xl font-['Amiri'] font-bold text-emerald-950 mb-2">لجنة الاستدراك (الكتب)</h3>
           <p className="text-xs text-stone-500 mb-4 font-medium">تصحيح طبعات الكتب والصفحات</p>
           <div className="bg-[#FDFBF7] rounded-xl p-4 border border-stone-100 flex justify-between items-center">
             <div>
               <p className="text-3xl font-bold text-emerald-900">1</p>
               <p className="text-[10px] font-bold text-stone-400 mt-1 uppercase tracking-wider">ملف مستدرك</p>
             </div>
             <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center border border-emerald-200">
               <BookText className="w-6 h-6" />
             </div>
           </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-stone-200 border-t-4 border-t-emerald-800 p-8">
        <div className="mb-8 border-b border-stone-100 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
           <div>
             <h3 className="text-2xl font-['Amiri'] font-bold text-emerald-950">الملفات المستلمة من اللجان الفرعية</h3>
             <p className="text-sm text-stone-400 mt-1">تجهيز الحزم لإرسالها للجنة التدقيق والتحرير</p>
           </div>
           
           <div className="flex bg-[#FDFBF7] p-1.5 rounded-2xl border border-stone-200 shadow-inner overflow-x-auto">
             <button 
               onClick={() => setActiveTab('review')}
               className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'review' ? 'bg-gradient-to-r from-emerald-900 to-emerald-800 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.2)]' : 'text-stone-500 hover:text-emerald-900 hover:bg-stone-100'}`}
             >
               لجنة المراجعة
             </button>
             <button 
               onClick={() => setActiveTab('evidence')}
               className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'evidence' ? 'bg-gradient-to-r from-emerald-900 to-emerald-800 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.2)]' : 'text-stone-500 hover:text-emerald-900 hover:bg-stone-100'}`}
             >
               لجنة الاستدراك (الشواهد)
             </button>
             <button 
               onClick={() => setActiveTab('books')}
               className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'books' ? 'bg-gradient-to-r from-emerald-900 to-emerald-800 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.2)]' : 'text-stone-500 hover:text-emerald-900 hover:bg-stone-100'}`}
             >
               لجنة الاستدراك (الكتب)
             </button>
           </div>
        </div>
        
        <div className="space-y-4">
          {activeTab === 'review' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-right">
                  <thead className="text-sm text-emerald-900 font-bold bg-stone-100/80">
                    <tr>
                      <th className="px-6 py-4 rounded-r-xl">بيان الملف</th>
                      <th className="px-6 py-4">المصدر / الربع</th>
                      <th className="px-6 py-4 text-center">الحالة</th>
                      <th className="px-6 py-4 text-center rounded-l-xl">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {reviewData.map((item, idx) => (
                      <tr key={idx} className="hover:bg-stone-50 transition-colors">
                        <td className="px-6 py-5 font-bold text-emerald-950">
                          {item.title}
                          {item.reason && <p className="text-xs text-rose-600 mt-1 font-bold">الملاحظات: {item.reason}</p>}
                        </td>
                        <td className="px-6 py-5 text-stone-500 font-medium">{item.source} ({item.quarter})</td>
                        <td className="px-6 py-5 text-center">
                          <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${item.color}`}>{item.status}</span>
                        </td>
                        <td className="px-6 py-5 text-center">
                          <div className="flex justify-center items-center gap-2">
                            <button 
                              onClick={() => handleAction(idx, 'review', 'accept')}
                              disabled={item.sent}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold border shadow-sm transition-all flex items-center gap-1.5 ${
                                item.sent 
                                ? 'bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed opacity-60' 
                                : 'bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200 hover:shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                              }`}
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" /> قبول وتمرير
                            </button>
                            <button 
                              onClick={() => handleAction(idx, 'review', 'reject')}
                              disabled={item.sent}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold border shadow-sm transition-all flex items-center gap-1.5 ${
                                item.sent 
                                ? 'bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed opacity-60' 
                                : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                              }`}
                            >
                              <XCircle className="w-3.5 h-3.5" /> رفض وإرجاع
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'evidence' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-right">
                  <thead className="text-sm text-emerald-900 font-bold bg-stone-100/80">
                    <tr>
                      <th className="px-6 py-4 rounded-r-xl">بيان الملف</th>
                      <th className="px-6 py-4 text-center">الحالة</th>
                      <th className="px-6 py-4 text-center rounded-l-xl">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {evidenceData.map((item, idx) => (
                      <tr key={idx} className="hover:bg-stone-50 transition-colors">
                        <td className="px-6 py-5 font-bold text-emerald-950">
                          {item.title}
                          {item.reason && <p className="text-xs text-rose-600 mt-1 font-bold">الملاحظات: {item.reason}</p>}
                        </td>
                        <td className="px-6 py-5 text-center">
                          <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${item.color}`}>{item.status}</span>
                        </td>
                        <td className="px-6 py-5 text-center">
                          <div className="flex justify-center items-center gap-2">
                            <button 
                              onClick={() => handleAction(idx, 'evidence', 'accept')}
                              disabled={item.sent}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold border shadow-sm transition-all flex items-center gap-1.5 ${
                                item.sent 
                                ? 'bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed opacity-60' 
                                : 'bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200 hover:shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                              }`}
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" /> قبول وتمرير
                            </button>
                            <button 
                              onClick={() => handleAction(idx, 'evidence', 'reject')}
                              disabled={item.sent}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold border shadow-sm transition-all flex items-center gap-1.5 ${
                                item.sent 
                                ? 'bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed opacity-60' 
                                : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                              }`}
                            >
                              <XCircle className="w-3.5 h-3.5" /> رفض وإرجاع
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'books' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-right">
                  <thead className="text-sm text-emerald-900 font-bold bg-stone-100/80">
                    <tr>
                      <th className="px-6 py-4 rounded-r-xl">بيان الملف</th>
                      <th className="px-6 py-4 text-center">الحالة</th>
                      <th className="px-6 py-4 text-center rounded-l-xl">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {booksData.map((item, idx) => (
                      <tr key={idx} className="hover:bg-stone-50 transition-colors">
                        <td className="px-6 py-5 font-bold text-emerald-950">
                          {item.title}
                          {item.reason && <p className="text-xs text-rose-600 mt-1 font-bold">الملاحظات: {item.reason}</p>}
                        </td>
                        <td className="px-6 py-5 text-center">
                          <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${item.color}`}>{item.status}</span>
                        </td>
                        <td className="px-6 py-5 text-center">
                          <div className="flex justify-center items-center gap-2">
                            <button 
                              onClick={() => handleAction(idx, 'books', 'accept')}
                              disabled={item.sent}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold border shadow-sm transition-all flex items-center gap-1.5 ${
                                item.sent 
                                ? 'bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed opacity-60' 
                                : 'bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200 hover:shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                              }`}
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" /> قبول وتمرير
                            </button>
                            <button 
                              onClick={() => handleAction(idx, 'books', 'reject')}
                              disabled={item.sent}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold border shadow-sm transition-all flex items-center gap-1.5 ${
                                item.sent 
                                ? 'bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed opacity-60' 
                                : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                              }`}
                            >
                              <XCircle className="w-3.5 h-3.5" /> رفض وإرجاع
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <RejectionModal 
        isOpen={rejectModal.isOpen} 
        onClose={() => setRejectModal({ isOpen: false, payload: null })} 
        onConfirm={confirmReject} 
      />
    </div>
  );
}

// ----------------------------------------------------
// LEVEL 4: AUDITOR (لجنة التدقيق والتحرير)
// ----------------------------------------------------
function AuditorView() {
  const [tasks, setTasks] = useState([
    { title: 'حزمة الشواهد المجمعة (الربع الأول)', status: 'تم التدقيق', date: '2023-10-20', color: "bg-emerald-100 text-emerald-800 border-emerald-200", sent: false },
    { title: 'المستدركات الإضافية (تاريخ الطبري)', status: 'تم التحرير', date: '2023-10-21', color: "bg-blue-100 text-blue-800 border-blue-200", sent: false }
  ]);
  const [rejectModal, setRejectModal] = useState({ isOpen: false, payload: null });

  const handleAction = (idx, actionType) => {
    if (actionType === 'accept') {
      const newTasks = [...tasks];
      newTasks[idx].sent = true;
      newTasks[idx].status = 'تم القبول والتمرير';
      newTasks[idx].color = 'bg-emerald-100 text-emerald-800 border-emerald-200';
      setTasks(newTasks);
    } else {
      setRejectModal({ isOpen: true, payload: { idx } });
    }
  };

  const confirmReject = (reason) => {
    const { idx } = rejectModal.payload;
    const newTasks = [...tasks];
    newTasks[idx].sent = true;
    newTasks[idx].status = 'محتاج تعديل';
    newTasks[idx].color = 'bg-rose-50 text-rose-600 border-rose-100';
    newTasks[idx].reason = reason;
    setTasks(newTasks);
    setRejectModal({ isOpen: false, payload: null });
  };

  return (
    <div className="space-y-8">
      {/* Committee Badge Header */}
      <div className="bg-white rounded-2xl shadow-lg border border-stone-200 border-t-4 border-t-emerald-800 p-8 flex justify-between items-center bg-gradient-to-l from-[#FDFBF7] to-stone-100">
        <div className="flex items-center gap-5">
          <div className="p-4 bg-amber-100 text-amber-600 rounded-2xl border border-amber-200">
            <BadgeCheck className="w-10 h-10" />
          </div>
          <div>
            <h3 className="text-3xl font-['Amiri'] font-bold text-emerald-950">رئيس لجنة التدقيق والتحرير</h3>
            <div className="flex gap-2 mt-3">
              <span className="flex items-center gap-1 text-xs font-bold bg-white border border-stone-200 text-emerald-800 px-3 py-1.5 rounded-lg shadow-sm"><Users className="w-3.5 h-3.5"/> عضو 1</span>
              <span className="flex items-center gap-1 text-xs font-bold bg-white border border-stone-200 text-emerald-800 px-3 py-1.5 rounded-lg shadow-sm"><Users className="w-3.5 h-3.5"/> عضو 2</span>
              <span className="flex items-center gap-1 text-xs font-bold bg-white border border-stone-200 text-emerald-800 px-3 py-1.5 rounded-lg shadow-sm"><Users className="w-3.5 h-3.5"/> عضو 3</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-stone-200 border-t-4 border-t-emerald-800 p-8">
         <h3 className="text-2xl font-['Amiri'] font-bold text-emerald-950 mb-6">الملفات المستلمة من اللجان المختصة</h3>
         <div className="overflow-x-auto">
            <table className="w-full text-sm text-right">
              <thead className="text-sm text-emerald-900 font-bold bg-stone-100/80">
                <tr>
                  <th className="px-6 py-4 rounded-r-xl">بيان الملف</th>
                  <th className="px-6 py-4">تاريخ الانتهاء</th>
                  <th className="px-6 py-4 text-center">قرار اللجنة</th>
                  <th className="px-6 py-4 text-center rounded-l-xl">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {tasks.map((task, idx) => (
                  <tr key={idx} className="hover:bg-stone-50 transition-colors">
                    <td className="px-6 py-5 font-bold text-emerald-950">
                      {task.title}
                      {task.reason && <p className="text-xs text-rose-600 mt-1 font-bold">الملاحظات: {task.reason}</p>}
                    </td>
                    <td className="px-6 py-5 text-stone-500 font-medium">{task.date}</td>
                    <td className="px-6 py-5 text-center">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${task.color}`}>
                        {task.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className="flex justify-center items-center gap-2">
                        <button 
                          onClick={() => handleAction(idx, 'accept')}
                          disabled={task.sent}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold border shadow-sm transition-all flex items-center gap-1.5 ${
                            task.sent 
                            ? 'bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed opacity-60' 
                            : 'bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200 hover:shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> قبول وتمرير
                        </button>
                        <button 
                          onClick={() => handleAction(idx, 'reject')}
                          disabled={task.sent}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold border shadow-sm transition-all flex items-center gap-1.5 ${
                            task.sent 
                            ? 'bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed opacity-60' 
                            : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                          }`}
                        >
                          <XCircle className="w-3.5 h-3.5" /> رفض وإرجاع
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      </div>
      <RejectionModal 
        isOpen={rejectModal.isOpen} 
        onClose={() => setRejectModal({ isOpen: false, payload: null })} 
        onConfirm={confirmReject} 
      />
    </div>
  );
}

// ----------------------------------------------------
// LEVEL 5 SUB: SCIENTIFIC COMMITTEE
// ----------------------------------------------------
function ScientificCommitteeView() {
  const [data, setData] = useState([
    { title: "التحكيم العلمي لملف شواهد مجاز القرآن لأبي عبيدة", reviewer: "عضو اللجنة 1", status: "مقبول علمياً", color: "bg-emerald-100 text-emerald-800 border-emerald-200", sent: false },
    { title: "مراجعة التأصيل البلاغي لشواهد الربع الثالث", reviewer: "عضو اللجنة 3", status: "تحت المناقشة", color: "bg-amber-100 text-amber-800 border-amber-200", sent: false }
  ]);
  const [rejectModal, setRejectModal] = useState({ isOpen: false, payload: null });

  const handleAction = (idx, actionType) => {
    if (actionType === 'accept') {
      const newData = [...data];
      newData[idx].sent = true;
      newData[idx].status = 'تم القبول والتمرير';
      newData[idx].color = 'bg-emerald-100 text-emerald-800 border-emerald-200';
      setData(newData);
    } else {
      setRejectModal({ isOpen: true, payload: { idx } });
    }
  };

  const confirmReject = (reason) => {
    const { idx } = rejectModal.payload;
    const newData = [...data];
    newData[idx].sent = true;
    newData[idx].status = 'محتاج تعديل';
    newData[idx].color = 'bg-rose-50 text-rose-600 border-rose-100';
    newData[idx].reason = reason;
    setData(newData);
    setRejectModal({ isOpen: false, payload: null });
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl shadow-lg border border-stone-200 border-t-4 border-t-emerald-800 p-8">
        <div className="flex items-center justify-between mb-8 border-b border-stone-100 pb-4">
           <div>
             <h3 className="text-2xl font-['Amiri'] font-bold text-emerald-950 flex items-center gap-3"><BookText className="text-amber-500 w-8 h-8"/> مساحة عمل اللجنة العلمية</h3>
             <p className="text-sm text-stone-400 mt-2 font-medium">التحكيم الأكاديمي والبت في المسائل اللغوية الخلافية</p>
           </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right">
            <thead className="text-sm text-emerald-900 font-bold bg-stone-100/80">
              <tr>
                <th className="px-6 py-4 rounded-r-xl">البيان العلمي</th>
                <th className="px-6 py-4">المُحكِّم</th>
                <th className="px-6 py-4 text-center">الحالة</th>
                <th className="px-6 py-4 text-center rounded-l-xl">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {data.map((item, idx) => (
                <tr key={idx} className="hover:bg-stone-50 transition-colors">
                  <td className="px-6 py-5 font-bold text-emerald-950">
                    {item.title}
                    {item.reason && <p className="text-xs text-rose-600 mt-1 font-bold">الملاحظات: {item.reason}</p>}
                  </td>
                  <td className="px-6 py-5 text-stone-500 font-medium">{item.reviewer}</td>
                  <td className="px-6 py-5 text-center">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${item.color}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="flex justify-center items-center gap-2">
                      <button 
                        onClick={() => handleAction(idx, 'accept')}
                        disabled={item.sent}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border shadow-sm transition-all flex items-center gap-1.5 ${
                          item.sent 
                          ? 'bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed opacity-60' 
                          : 'bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200 hover:shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> قبول وتمرير
                      </button>
                      <button 
                        onClick={() => handleAction(idx, 'reject')}
                        disabled={item.sent}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border shadow-sm transition-all flex items-center gap-1.5 ${
                          item.sent 
                          ? 'bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed opacity-60' 
                          : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                        }`}
                      >
                        <XCircle className="w-3.5 h-3.5" /> رفض وإرجاع
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <RejectionModal 
        isOpen={rejectModal.isOpen} 
        onClose={() => setRejectModal({ isOpen: false, payload: null })} 
        onConfirm={confirmReject} 
      />
    </div>
  );
}

// ----------------------------------------------------
// LEVEL 5 SUB: APPROVAL COMMITTEE
// ----------------------------------------------------
function ApprovalCommitteeView() {
  const [data, setData] = useState([
    { title: "المسودة النهائية المعتمدة لشواهد الجزء الأول.xlsx", version: "V2.0", status: "جاهز للاعتماد النهائي", color: "bg-emerald-100 text-emerald-800 border-emerald-200", sent: false },
    { title: "مجموعة شواهد لسان العرب المصفاة بالكامل.xlsx", version: "V1.5", status: "معتمد", color: "bg-blue-100 text-blue-800 border-blue-200", sent: false }
  ]);
  const [rejectModal, setRejectModal] = useState({ isOpen: false, payload: null });

  const handleAction = (idx, actionType) => {
    if (actionType === 'accept') {
      const newData = [...data];
      newData[idx].sent = true;
      newData[idx].status = 'تم القبول والتمرير';
      newData[idx].color = 'bg-emerald-100 text-emerald-800 border-emerald-200';
      setData(newData);
    } else {
      setRejectModal({ isOpen: true, payload: { idx } });
    }
  };

  const confirmReject = (reason) => {
    const { idx } = rejectModal.payload;
    const newData = [...data];
    newData[idx].sent = true;
    newData[idx].status = 'محتاج تعديل';
    newData[idx].color = 'bg-rose-50 text-rose-600 border-rose-100';
    newData[idx].reason = reason;
    setData(newData);
    setRejectModal({ isOpen: false, payload: null });
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl shadow-lg border border-stone-200 border-t-4 border-t-emerald-800 p-8">
        <div className="flex items-center justify-between mb-8 border-b border-stone-100 pb-4">
           <div>
             <h3 className="text-2xl font-['Amiri'] font-bold text-emerald-950 flex items-center gap-3"><ShieldCheck className="text-amber-500 w-8 h-8"/> مساحة عمل لجنة الاعتماد النهائي</h3>
             <p className="text-sm text-stone-400 mt-2 font-medium">التدقيق والمطابقة النهائية قبل العرض على المشرف العام</p>
           </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right">
            <thead className="text-sm text-emerald-900 font-bold bg-stone-100/80">
              <tr>
                <th className="px-6 py-4 rounded-r-xl">اسم الملف / المجلد</th>
                <th className="px-6 py-4">النسخة</th>
                <th className="px-6 py-4 text-center">الحالة</th>
                <th className="px-6 py-4 text-center rounded-l-xl">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {data.map((item, idx) => (
                <tr key={idx} className="hover:bg-stone-50 transition-colors">
                  <td className="px-6 py-5 font-bold text-emerald-950 flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-stone-100 text-amber-600 rounded-lg"><FileText className="w-4 h-4"/></div>
                      {item.title}
                    </div>
                    {item.reason && <p className="text-xs text-rose-600 mt-1 font-bold ms-11">الملاحظات: {item.reason}</p>}
                  </td>
                  <td className="px-6 py-5 text-stone-500 font-mono font-bold">{item.version}</td>
                  <td className="px-6 py-5 text-center">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${item.color}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="flex justify-center items-center gap-2">
                      <button 
                        onClick={() => handleAction(idx, 'accept')}
                        disabled={item.sent}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border shadow-sm transition-all flex items-center gap-1.5 ${
                          item.sent 
                          ? 'bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed opacity-60' 
                          : 'bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200 hover:shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> قبول وتمرير
                      </button>
                      <button 
                        onClick={() => handleAction(idx, 'reject')}
                        disabled={item.sent}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border shadow-sm transition-all flex items-center gap-1.5 ${
                          item.sent 
                          ? 'bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed opacity-60' 
                          : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                        }`}
                      >
                        <XCircle className="w-3.5 h-3.5" /> رفض وإرجاع
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <RejectionModal 
        isOpen={rejectModal.isOpen} 
        onClose={() => setRejectModal({ isOpen: false, payload: null })} 
        onConfirm={confirmReject} 
      />
    </div>
  );
}

// ----------------------------------------------------
// LEVEL 5: ASSISTANT SUPERVISOR
// ----------------------------------------------------
function AssistantSupervisorView() {
  const [activeTab, setActiveTab] = useState('approval');
  
  const [approvalData, setApprovalData] = useState([
    { title: "المسودة النهائية المعتمدة لشواهد الجزء الأول.xlsx", version: "V2.0", status: "معتمد نهائياً", color: "bg-emerald-100 text-emerald-800 border-emerald-200", sent: false },
    { title: "مجموعة شواهد لسان العرب المصفاة بالكامل.xlsx", version: "V1.5", status: "معتمد نهائياً", color: "bg-emerald-100 text-emerald-800 border-emerald-200", sent: false }
  ]);

  const [scientificData, setScientificData] = useState([
    { title: "التحكيم العلمي لملف شواهد مجاز القرآن لأبي عبيدة", reviewer: "عضو اللجنة 1", status: "مُجاز علمياً", color: "bg-blue-100 text-blue-800 border-blue-200", sent: false },
    { title: "مراجعة التأصيل البلاغي لشواهد الربع الثالث", reviewer: "عضو اللجنة 3", status: "مُجاز علمياً", color: "bg-blue-100 text-blue-800 border-blue-200", sent: false }
  ]);

  const [rejectModal, setRejectModal] = useState({ isOpen: false, payload: null });

  const handleAction = (idx, tableType, actionType) => {
    let newData = tableType === 'approval' ? [...approvalData] : [...scientificData];
    
    if (actionType === 'accept') {
      newData[idx].sent = true;
      newData[idx].status = 'تم القبول والتمرير';
      newData[idx].color = 'bg-emerald-100 text-emerald-800 border-emerald-200';
      if (tableType === 'approval') setApprovalData(newData);
      else setScientificData(newData);
    } else {
      setRejectModal({ isOpen: true, payload: { idx, tableType } });
    }
  };

  const confirmReject = (reason) => {
    const { idx, tableType } = rejectModal.payload;
    let newData = tableType === 'approval' ? [...approvalData] : [...scientificData];

    newData[idx].sent = true;
    newData[idx].status = 'محتاج تعديل';
    newData[idx].color = 'bg-rose-50 text-rose-600 border-rose-100';
    newData[idx].reason = reason;
    
    if (tableType === 'approval') setApprovalData(newData);
    else setScientificData(newData);
    
    setRejectModal({ isOpen: false, payload: null });
  };

  const activeData = activeTab === 'approval' ? approvalData : scientificData;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow-md border border-stone-200 border-t-2 border-t-amber-500 p-8">
           <h3 className="text-2xl font-['Amiri'] font-bold text-emerald-950 mb-4 flex items-center gap-3"><ShieldCheck className="text-amber-500"/> لجنة الاعتماد النهائي</h3>
           <p className="text-sm text-stone-500 mb-6 leading-relaxed font-medium">تضم 4 أعضاء، وظيفتهم المراجعة النهائية لكل البيانات المُدققة من لجنة التدقيق والتحرير.</p>
           <div className="p-4 bg-[#FDFBF7] border border-stone-200 rounded-xl">
             <span className="text-emerald-700 font-bold text-sm">الحالة: جاهز للمراجعة</span>
           </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md border border-stone-200 border-t-2 border-t-amber-500 p-8">
           <h3 className="text-2xl font-['Amiri'] font-bold text-emerald-950 mb-4 flex items-center gap-3"><BookText className="text-amber-500"/> اللجنة العلمية</h3>
           <p className="text-sm text-stone-500 mb-6 leading-relaxed font-medium">تضم 4 أعضاء، وظيفتهم الإشراف العلمي الدقيق والبت في المسائل اللغوية الخلافية.</p>
           <div className="p-4 bg-[#FDFBF7] border border-stone-200 rounded-xl">
             <span className="text-blue-700 font-bold text-sm">الحالة: تمت الإجازة العلمية</span>
           </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-stone-200 border-t-4 border-t-emerald-800 p-8">
        <div className="flex items-center justify-between mb-6 border-b border-stone-100 pb-6">
           <div>
             <h3 className="text-2xl font-['Amiri'] font-bold text-emerald-950">الملفات المستلمة من اللجان الفرعية</h3>
             <p className="text-sm text-stone-400 mt-1">النسخ النهائية الجاهزة للإرسال إلى المشرف العام</p>
           </div>
           
           <div className="flex bg-[#FDFBF7] p-1.5 rounded-2xl border border-stone-200 shadow-inner">
             <button 
               onClick={() => setActiveTab('approval')}
               className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'approval' ? 'bg-gradient-to-r from-emerald-900 to-emerald-800 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.2)]' : 'text-stone-500 hover:text-emerald-900 hover:bg-stone-100'}`}
             >
               لجنة الاعتماد النهائي
             </button>
             <button 
               onClick={() => setActiveTab('scientific')}
               className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'scientific' ? 'bg-gradient-to-r from-emerald-900 to-emerald-800 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.2)]' : 'text-stone-500 hover:text-emerald-900 hover:bg-stone-100'}`}
             >
               اللجنة العلمية
             </button>
           </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right">
            <thead className="text-sm text-emerald-900 font-bold bg-stone-100/80">
              <tr>
                <th className="px-6 py-4 rounded-r-xl">بيان المخرجات</th>
                {activeTab === 'approval' && <th className="px-6 py-4">النسخة</th>}
                {activeTab === 'scientific' && <th className="px-6 py-4">المُحكِّم</th>}
                <th className="px-6 py-4 text-center">الحالة</th>
                <th className="px-6 py-4 text-center rounded-l-xl">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {activeData.map((item, idx) => (
                <tr key={idx} className="hover:bg-stone-50 transition-colors">
                  <td className="px-6 py-5 font-bold text-emerald-950">
                    {item.title}
                    {item.reason && <p className="text-xs text-rose-600 mt-1 font-bold">الملاحظات: {item.reason}</p>}
                  </td>
                  {activeTab === 'approval' && <td className="px-6 py-5 text-stone-500 font-mono font-bold">{item.version}</td>}
                  {activeTab === 'scientific' && <td className="px-6 py-5 text-stone-500 font-medium">{item.reviewer}</td>}
                  <td className="px-6 py-5 text-center">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${item.color}`}>{item.status}</span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="flex justify-center items-center gap-2">
                      <button 
                        onClick={() => handleAction(idx, activeTab, 'accept')}
                        disabled={item.sent}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border shadow-sm transition-all flex items-center gap-1.5 ${
                          item.sent 
                          ? 'bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed opacity-60' 
                          : 'bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200 hover:shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> قبول وتمرير
                      </button>
                      <button 
                        onClick={() => handleAction(idx, activeTab, 'reject')}
                        disabled={item.sent}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border shadow-sm transition-all flex items-center gap-1.5 ${
                          item.sent 
                          ? 'bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed opacity-60' 
                          : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                        }`}
                      >
                        <XCircle className="w-3.5 h-3.5" /> رفض وإرجاع
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <RejectionModal 
        isOpen={rejectModal.isOpen} 
        onClose={() => setRejectModal({ isOpen: false, payload: null })} 
        onConfirm={confirmReject} 
      />
    </div>
  );
}

// ----------------------------------------------------
// LEVEL 6: GENERAL SUPERVISOR (ADMIN)
// ----------------------------------------------------
function GeneralSupervisorView() {
  const finalFiles = [
    { title: 'مجلد المعجم التاريخي (حرف الألف)', date: '2023-11-01', size: '15 MB' },
    { title: 'مجلد المعجم التاريخي (حرف الباء)', date: '2023-11-05', size: '12 MB' }
  ];

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-emerald-950 to-emerald-800 rounded-2xl shadow-2xl border border-emerald-700 p-12 relative overflow-hidden text-center text-white border-t-4 border-t-amber-500">
         <h2 className="text-4xl font-['Amiri'] font-extrabold mb-4 text-amber-400 drop-shadow-md">لوحة الإشراف العام</h2>
         <p className="text-emerald-100 font-medium text-lg max-w-2xl mx-auto leading-relaxed">النسخ النهائية المعتمدة والجاهزة للنشر والإصدار الرسمي، مُدققة ومعتمدة من جميع اللجان المختصة.</p>
         {/* Decorative geometric circle overlay */}
         <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 border-[10px] border-emerald-800/30 rounded-full blur-sm"></div>
         <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 border-[10px] border-amber-500/10 rounded-full blur-sm"></div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-stone-200 border-t-4 border-t-emerald-800 p-8">
        <h3 className="text-2xl font-['Amiri'] font-bold text-emerald-950 mb-8 border-b border-stone-100 pb-4">الملفات المستلمة (المرحلة النهائية)</h3>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-right">
              <thead className="text-sm text-emerald-900 font-bold bg-stone-100/80">
                <tr>
                  <th className="px-6 py-5 rounded-r-xl">اسم المجلد / الملف النهائي</th>
                  <th className="px-6 py-5">تاريخ الاعتماد</th>
                  <th className="px-6 py-5">حجم الملف</th>
                  <th className="px-6 py-5 text-center rounded-l-xl">تنزيل للإصدار</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {finalFiles.map((file, idx) => (
                  <tr key={idx} className="hover:bg-stone-50 transition-colors">
                    <td className="px-6 py-6 font-bold text-emerald-950 text-base">{file.title}</td>
                    <td className="px-6 py-6 text-stone-500 font-medium">{file.date}</td>
                    <td className="px-6 py-6 text-stone-400 font-mono font-bold">{file.size}</td>
                    <td className="px-6 py-6 text-center">
                      <button className="text-amber-500 hover:text-amber-600 bg-stone-50 hover:bg-stone-100 px-6 py-3 rounded-xl font-bold transition-all duration-300 inline-flex items-center gap-2 shadow-sm border border-stone-200 hover:border-amber-500 hover:shadow-[0_0_15px_rgba(245,158,11,0.15)]">
                        تحميل النسخة <Download className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      </div>
    </div>
  );
}
