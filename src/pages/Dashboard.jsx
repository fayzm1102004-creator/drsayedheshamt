import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWorkflow } from '../context/WorkflowContext';
import { 
  UploadCloud, CheckCircle2, XCircle, 
  Send, ExternalLink, Download
} from 'lucide-react';

export default function Dashboard() {
  const { role } = useAuth();

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-7xl mx-auto pb-20 pt-4">
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

  useEffect(() => {
    if (isOpen) setReason('');
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!reason.trim()) return;
    onConfirm(reason);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 dark:bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-[#FDFBF7] dark:bg-slate-900 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-white/50 dark:border-slate-800 border-t-[4px] border-t-rose-500 p-10 max-w-lg w-full relative overflow-hidden animate-in zoom-in-95 duration-300">
        <h3 className="text-[2rem] font-['Aref_Ruqaa'] font-bold text-slate-900 dark:text-amber-50 mb-2 relative z-10 flex items-center gap-3">
          <XCircle className="w-8 h-8 text-rose-500 drop-shadow-sm" />
          طلب تعديل على الملف
        </h3>
        <p className="text-sm text-stone-500 dark:text-slate-400 mb-8 relative z-10 font-bold tracking-wide">يرجى توضيح سبب إرجاع الملف للزميل السابق ليتم تدارك الأخطاء.</p>
        
        <div className="relative z-10 space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-800 dark:text-slate-300 mb-3">سبب طلب التعديل أو الملاحظات</label>
            <textarea 
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full h-32 px-5 py-4 bg-white dark:bg-slate-950 border border-stone-200/80 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 dark:focus:ring-amber-500/30 dark:text-slate-200 transition-all text-stone-700 resize-none font-medium shadow-sm"
              placeholder="يرجى كتابة الملاحظات بدقة..."
            />
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <button onClick={onClose} className="px-8 py-3 rounded-2xl text-sm font-bold bg-stone-100 dark:bg-slate-800 hover:bg-stone-200 dark:hover:bg-slate-700 text-stone-600 dark:text-slate-300 transition-colors">إلغاء</button>
            <button onClick={handleConfirm} disabled={!reason.trim()} className="px-8 py-3 rounded-2xl text-sm font-bold bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50 hover:bg-rose-600 hover:text-white hover:border-transparent dark:hover:bg-rose-600 dark:hover:text-white flex items-center gap-2 transition-all duration-300 hover:shadow-[0_0_15px_rgba(225,29,72,0.3)] disabled:opacity-50 disabled:hover:bg-rose-50 disabled:hover:text-rose-700 disabled:hover:border-rose-200 disabled:shadow-none">
              تأكيد وإرجاع <Send className="w-4 h-4 rotate-180" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const RejectReason = ({ history }) => {
  if (!history || history.length === 0) return null;
  const lastRejection = history[0];
  if (lastRejection.action !== 'reject') return null;
  
  return (
    <p className="text-xs text-rose-600 dark:text-rose-400 mt-2 font-bold flex flex-col gap-1 bg-rose-50/50 dark:bg-rose-950/20 p-3 rounded-xl border border-rose-100/50 dark:border-rose-900/30">
      <span className="text-[10px] text-rose-400/80 dark:text-rose-500/80 uppercase tracking-widest">ملاحظات التعديل:</span>
      <span className="leading-relaxed">{lastRejection.reason}</span>
    </p>
  );
};

const ParallelBadge = ({ status }) => {
  if (status === 'approved') return <span className="px-4 py-2 rounded-xl text-xs font-bold border bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50 flex items-center justify-center gap-1.5 w-full shadow-sm"><CheckCircle2 className="w-4 h-4"/> تم القبول</span>;
  if (status === 'rejected') return <span className="px-4 py-2 rounded-xl text-xs font-bold border bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-900/50 flex items-center justify-center gap-1.5 w-full shadow-sm"><XCircle className="w-4 h-4"/> محتاج تعديل</span>;
  return null;
};

const FileLink = ({ file }) => {
  const handleDownload = () => {
    if (file.fileData) {
      const a = document.createElement('a');
      a.href = file.fileData;
      a.download = file.name;
      a.click();
    } else {
      const blob = new Blob(["هذا ملف تجريبي للعرض فقط نظراً لأنه من البيانات الافتراضية الأولية للمنصة."], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleOpen = () => {
    if (file.fileData) {
      const w = window.open();
      if (w) {
        w.document.write(`<iframe src="${file.fileData}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%; position:absolute;" allowfullscreen></iframe>`);
        w.document.title = file.name;
      }
    } else {
      const w = window.open();
      if (w) {
        w.document.write(`
          <div style="display:flex; justify-content:center; align-items:center; height:100vh; font-family:system-ui, sans-serif; background:#FDFBF7; color:#0f172a; flex-direction:column; gap:20px;">
            <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="#d4af37" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            <h2 style="font-size: 28px; margin: 0; font-weight: bold;">${file.name}</h2>
            <p style="color: #64748b; font-size: 18px;">هذا الملف هو بيان تجريبي (Mock Data). يمكنك رفع ملفات حقيقية من حساب الراصد لتجربة فتحها.</p>
          </div>
        `);
        w.document.title = file.name;
      }
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <span className="text-slate-800 dark:text-slate-200 text-[15px]">{file.name}</span>
        <div className="flex gap-1.5 opacity-80 hover:opacity-100 transition-opacity">
          <button onClick={handleOpen} title="فتح ومعاينة الملف" className="p-2 text-emerald-700 dark:text-emerald-400 hover:text-white bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-600 dark:hover:bg-emerald-600 rounded-lg border border-emerald-100 dark:border-emerald-900/50 transition-all shadow-sm">
            <ExternalLink className="w-4 h-4" />
          </button>
          <button onClick={handleDownload} title="تحميل الملف" className="p-2 text-amber-600 dark:text-amber-400 hover:text-white bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-500 dark:hover:bg-amber-600 rounded-lg border border-amber-100 dark:border-amber-900/50 transition-all shadow-sm">
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>
      <RejectReason history={file.history} />
    </div>
  );
};

const CardLayout = ({ children, title }) => (
  <div className="bg-white/95 dark:bg-slate-900/90 backdrop-blur-3xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] border border-stone-100 dark:border-slate-800 border-t-[3px] border-t-amber-500 p-10 relative overflow-hidden transition-colors duration-500">
    <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 dark:bg-amber-500/10 rounded-full blur-[60px] pointer-events-none"></div>
    <h3 className="text-3xl font-['Aref_Ruqaa'] font-bold text-slate-900 dark:text-amber-400 mb-8 pb-5 border-b border-stone-100 dark:border-slate-800 relative z-10 transition-colors duration-500">{title}</h3>
    <div className="relative z-10">
      {children}
    </div>
  </div>
);

// ----------------------------------------------------
// OBSERVER
// ----------------------------------------------------
function ObserverView() {
  const { files, uploadFile } = useWorkflow();
  const { user } = useAuth();
  const fileInputRef = useRef(null);
  const myFiles = files.filter(f => f.uploadedBy === user?.name || f.currentStage === 'observer');

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("حجم الملف كبير جداً، يرجى رفع ملف أقل من 5 ميجابايت للنسخة التجريبية.");
        e.target.value = null;
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        uploadFile({
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          type: 'review',
          date: new Date().toISOString().split('T')[0],
          status: 'تم الرفع للمنسق',
          color: 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900/50',
          currentStage: 'coordinator',
          history: [],
          uploadedBy: user.name,
          fileData: reader.result
        });
      };
      reader.readAsDataURL(file);
      e.target.value = null;
    }
  };

  return (
    <div className="space-y-12">
      <CardLayout title="رفع ملف جديد">
        <div className="flex flex-col items-center">
          <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
          <div onClick={() => fileInputRef.current.click()} className="w-full bg-slate-50/50 dark:bg-slate-950/50 rounded-[2rem] p-16 border-2 border-dashed border-amber-500/30 dark:border-amber-500/20 hover:border-amber-500 dark:hover:border-amber-400 hover:bg-amber-50/30 dark:hover:bg-amber-900/10 cursor-pointer flex flex-col items-center transition-all duration-300 group">
            <UploadCloud className="w-16 h-16 text-amber-500/60 dark:text-amber-500/40 mb-6 group-hover:scale-110 group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-all duration-300 drop-shadow-sm" />
            <p className="text-[1.35rem] font-['Aref_Ruqaa'] font-bold text-slate-800 dark:text-amber-50">اسحب وأفلت الملف هنا لرفعه للمنسق</p>
            <p className="text-sm text-stone-400 dark:text-slate-500 mt-3 font-medium">الحد الأقصى للتجربة: 5 ميجابايت</p>
          </div>
        </div>
      </CardLayout>
      
      <CardLayout title="جدول الملفات المرفوعة وحالتها">
        <table className="w-full text-[15px] text-right">
          <thead className="bg-stone-50/80 dark:bg-slate-950/50 border-b border-stone-100 dark:border-slate-800 transition-colors duration-500"><tr><th className="px-8 py-5 text-slate-500 dark:text-slate-400 font-bold rounded-r-2xl">اسم الملف</th><th className="px-8 py-5 text-center text-slate-500 dark:text-slate-400 font-bold rounded-l-2xl">الحالة الحالية</th></tr></thead>
          <tbody className="divide-y divide-stone-100/80 dark:divide-slate-800/80">
            {myFiles.map(file => (
              <tr key={file.id} className="hover:bg-amber-50/40 dark:hover:bg-slate-800/50 transition-colors duration-200">
                <td className="px-8 py-6 font-bold">
                  <FileLink file={file} />
                </td>
                <td className="px-8 py-6 text-center"><span className={`px-4 py-2 rounded-xl text-xs font-bold border ${file.color} shadow-sm inline-block`}>{file.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardLayout>
    </div>
  );
}

// ----------------------------------------------------
// COORDINATOR
// ----------------------------------------------------
function CoordinatorView() {
  const { files, passFile, returnFile } = useWorkflow();
  const [activeObserver, setActiveObserver] = useState('all');
  const [rejectModal, setRejectModal] = useState({ isOpen: false, payload: null });

  const allCoordinatorFiles = files.filter(f => f.currentStage === 'coordinator' || f.level2_status !== 'pending');
  const coordinatorFiles = activeObserver === 'all' 
    ? allCoordinatorFiles 
    : allCoordinatorFiles.filter(f => f.uploadedBy === activeObserver);

  const confirmReject = (reason) => {
    returnFile(rejectModal.payload.id, 'observer', reason, 'coordinator');
    setRejectModal({ isOpen: false, payload: null });
  };

  const observersList = [
    { id: 'all', label: 'الكل' },
    { id: 'الراصد 1', label: 'أحمد مصطفى (الراصد 1)' },
    { id: 'الراصد 2', label: 'محمود علي (الراصد 2)' },
    { id: 'الراصد 3', label: 'يوسف عمر (الراصد 3)' },
    { id: 'الراصد 4', label: 'عبد الله حسن (الراصد 4)' }
  ];

  return (
    <div className="space-y-12">
      <CardLayout title="مراجعة ملفات الرصاد">
        <div className="mb-8 flex bg-slate-50/80 dark:bg-slate-950/50 p-2 rounded-2xl border border-stone-100 dark:border-slate-800 shadow-inner overflow-x-auto gap-2 transition-colors duration-500">
          {observersList.map(obs => (
            <button
              key={obs.id}
              onClick={() => setActiveObserver(obs.id)}
              className={`px-6 py-3 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-300 ${
                activeObserver === obs.id 
                  ? 'bg-slate-900 dark:bg-amber-500/20 text-amber-400 shadow-[0_4px_15px_rgba(245,158,11,0.2)] scale-[1.02] border border-transparent dark:border-amber-500/30' 
                  : 'text-stone-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-amber-50 hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm'
              }`}
            >
              {obs.label}
            </button>
          ))}
        </div>

        <table className="w-full text-[15px] text-right">
          <thead className="bg-stone-50/80 dark:bg-slate-950/50 border-b border-stone-100 dark:border-slate-800 transition-colors duration-500"><tr><th className="px-8 py-5 text-slate-500 dark:text-slate-400 font-bold rounded-r-2xl w-40">الراصد</th><th className="px-8 py-5 text-slate-500 dark:text-slate-400 font-bold">اسم الملف</th><th className="px-8 py-5 text-center text-slate-500 dark:text-slate-400 font-bold w-72 rounded-l-2xl">الإجراءات</th></tr></thead>
          <tbody className="divide-y divide-stone-100/80 dark:divide-slate-800/80">
            {coordinatorFiles.map(item => (
              <tr key={item.id} className="hover:bg-amber-50/40 dark:hover:bg-slate-800/50 transition-colors duration-200">
                <td className="px-8 py-6 text-slate-700 dark:text-slate-300 font-bold whitespace-nowrap">{item.uploadedBy}</td>
                <td className="px-8 py-6 font-bold">
                  <FileLink file={item} />
                </td>
                <td className="px-8 py-6 text-center">
                  {item.level2_status === 'pending' ? (
                    <div className="flex justify-center gap-3">
                      <button onClick={() => passFile(item.id, 'l3')} className="px-4 py-2 border border-transparent rounded-xl text-xs font-bold bg-emerald-950 dark:bg-emerald-600/20 text-white dark:text-emerald-400 dark:border-emerald-500/30 hover:bg-emerald-900 dark:hover:bg-emerald-500/30 w-full transition-all duration-300 hover:shadow-[0_4px_15px_rgba(245,158,11,0.3)]"><CheckCircle2 className="w-4 h-4 inline ml-1"/> قبول وتمرير</button>
                      <button onClick={() => setRejectModal({ isOpen: true, payload: { id: item.id } })} className="px-4 py-2 border border-rose-200 dark:border-rose-900/50 rounded-xl text-xs font-bold bg-white dark:bg-slate-950/50 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30 hover:text-rose-700 dark:hover:text-rose-300 w-full transition-all duration-300 hover:shadow-sm"><XCircle className="w-4 h-4 inline ml-1"/> إرجاع</button>
                    </div>
                  ) : (
                    <ParallelBadge status={item.level2_status} />
                  )}
                </td>
              </tr>
            ))}
            {coordinatorFiles.length === 0 && (
              <tr>
                <td colSpan="3" className="text-center py-12 text-stone-400 dark:text-slate-600 font-medium text-lg">لا توجد ملفات لهذا الراصد</td>
              </tr>
            )}
          </tbody>
        </table>
      </CardLayout>
      <RejectionModal isOpen={rejectModal.isOpen} onClose={() => setRejectModal({ isOpen: false, payload: null })} onConfirm={confirmReject} />
    </div>
  );
}

// ----------------------------------------------------
// L3: REVIEW COMMITTEE
// ----------------------------------------------------
function ReviewCommitteeView() {
  const { files, passParallelFile, rejectParallelFile } = useWorkflow();
  const committeeFiles = files.filter(f => f.currentStage === 'l3' || f.level3_review_status !== 'pending');
  const [rejectModal, setRejectModal] = useState({ isOpen: false, payload: null });

  const confirmReject = (reason) => {
    rejectParallelFile(rejectModal.payload.id, 'l3', 'review', reason);
    setRejectModal({ isOpen: false, payload: null });
  };

  return (
    <div className="space-y-12">
      <CardLayout title="مساحة عمل لجنة المراجعة">
        <table className="w-full text-[15px] text-right">
          <thead className="bg-stone-50/80 dark:bg-slate-950/50 border-b border-stone-100 dark:border-slate-800 transition-colors duration-500"><tr><th className="px-8 py-5 text-slate-500 dark:text-slate-400 font-bold rounded-r-2xl">بيان الشاهد</th><th className="px-8 py-5 text-center text-slate-500 dark:text-slate-400 font-bold w-72 rounded-l-2xl">حالة اللجنة</th></tr></thead>
          <tbody className="divide-y divide-stone-100/80 dark:divide-slate-800/80">
            {committeeFiles.map(item => (
              <tr key={item.id} className="hover:bg-amber-50/40 dark:hover:bg-slate-800/50 transition-colors duration-200">
                <td className="px-8 py-6 font-bold">
                  <FileLink file={item} />
                </td>
                <td className="px-8 py-6 text-center">
                  {item.level3_review_status === 'pending' ? (
                    <div className="flex justify-center gap-3">
                      <button onClick={() => passParallelFile(item.id, 'l3', 'review')} className="px-4 py-2 border border-transparent rounded-xl text-xs font-bold bg-emerald-950 dark:bg-emerald-600/20 text-white dark:text-emerald-400 dark:border-emerald-500/30 hover:bg-emerald-900 dark:hover:bg-emerald-500/30 w-full transition-all duration-300 hover:shadow-[0_4px_15px_rgba(245,158,11,0.3)]"><CheckCircle2 className="w-4 h-4 inline ml-1"/> قبول</button>
                      <button onClick={() => setRejectModal({ isOpen: true, payload: { id: item.id } })} className="px-4 py-2 border border-rose-200 dark:border-rose-900/50 rounded-xl text-xs font-bold bg-white dark:bg-slate-950/50 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30 hover:text-rose-700 dark:hover:text-rose-300 w-full transition-all duration-300 hover:shadow-sm"><XCircle className="w-4 h-4 inline ml-1"/> رفض</button>
                    </div>
                  ) : (
                    <ParallelBadge status={item.level3_review_status} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardLayout>
      <RejectionModal isOpen={rejectModal.isOpen} onClose={() => setRejectModal({ isOpen: false, payload: null })} onConfirm={confirmReject} />
    </div>
  );
}

// ----------------------------------------------------
// L3: CORRECTION COMMITTEE
// ----------------------------------------------------
function CorrectionCommitteeView() {
  const { files, passParallelFile, rejectParallelFile } = useWorkflow();
  const l3Files = files.filter(f => f.currentStage === 'l3' || f.level3_correction_status !== 'pending');
  const [rejectModal, setRejectModal] = useState({ isOpen: false, payload: null });

  const confirmReject = (reason) => {
    rejectParallelFile(rejectModal.payload.id, 'l3', 'correction', reason);
    setRejectModal({ isOpen: false, payload: null });
  };

  return (
    <div className="space-y-12">
      <CardLayout title="مساحة عمل لجنة الاستدراك">
        <table className="w-full text-[15px] text-right">
          <thead className="bg-stone-50/80 dark:bg-slate-950/50 border-b border-stone-100 dark:border-slate-800 transition-colors duration-500"><tr><th className="px-8 py-5 text-slate-500 dark:text-slate-400 font-bold rounded-r-2xl">بيان الاستدراك</th><th className="px-8 py-5 text-center text-slate-500 dark:text-slate-400 font-bold w-72 rounded-l-2xl">حالة اللجنة</th></tr></thead>
          <tbody className="divide-y divide-stone-100/80 dark:divide-slate-800/80">
            {l3Files.map(item => (
              <tr key={item.id} className="hover:bg-amber-50/40 dark:hover:bg-slate-800/50 transition-colors duration-200">
                <td className="px-8 py-6 font-bold">
                  <FileLink file={item} />
                </td>
                <td className="px-8 py-6 text-center">
                  {item.level3_correction_status === 'pending' ? (
                    <div className="flex justify-center gap-3">
                      <button onClick={() => passParallelFile(item.id, 'l3', 'correction')} className="px-4 py-2 border border-transparent rounded-xl text-xs font-bold bg-emerald-950 dark:bg-emerald-600/20 text-white dark:text-emerald-400 dark:border-emerald-500/30 hover:bg-emerald-900 dark:hover:bg-emerald-500/30 w-full transition-all duration-300 hover:shadow-[0_4px_15px_rgba(245,158,11,0.3)]"><CheckCircle2 className="w-4 h-4 inline ml-1"/> قبول</button>
                      <button onClick={() => setRejectModal({ isOpen: true, payload: { id: item.id } })} className="px-4 py-2 border border-rose-200 dark:border-rose-900/50 rounded-xl text-xs font-bold bg-white dark:bg-slate-950/50 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30 hover:text-rose-700 dark:hover:text-rose-300 w-full transition-all duration-300 hover:shadow-sm"><XCircle className="w-4 h-4 inline ml-1"/> رفض</button>
                    </div>
                  ) : (
                    <ParallelBadge status={item.level3_correction_status} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardLayout>
      <RejectionModal isOpen={rejectModal.isOpen} onClose={() => setRejectModal({ isOpen: false, payload: null })} onConfirm={confirmReject} />
    </div>
  );
}

// ----------------------------------------------------
// L3: MAIN COORDINATOR
// ----------------------------------------------------
function MainCoordinatorView() {
  const { files, passParallelFile, rejectParallelFile } = useWorkflow();
  const [activeTab, setActiveTab] = useState('review');
  const l3Files = files.filter(f => f.currentStage === 'l3' || f.level3_review_status !== 'pending' || f.level3_correction_status !== 'pending');
  const [rejectModal, setRejectModal] = useState({ isOpen: false, payload: null });

  const confirmReject = (reason) => {
    rejectParallelFile(rejectModal.payload.id, 'l3', rejectModal.payload.tabType, reason);
    setRejectModal({ isOpen: false, payload: null });
  };

  const currentStatusProp = activeTab === 'review' ? 'level3_review_status' : 'level3_correction_status';
  const currentActionType = activeTab === 'review' ? 'review' : 'correction';

  return (
    <div className="space-y-12">
      <CardLayout title="إدارة اللجان الموازية (المستوى 3)">
        <div className="mb-8 flex bg-slate-50/80 dark:bg-slate-950/50 p-2 rounded-2xl border border-stone-100 dark:border-slate-800 shadow-inner w-fit transition-colors duration-500">
          <button onClick={() => setActiveTab('review')} className={`px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === 'review' ? 'bg-slate-900 dark:bg-amber-500/20 text-amber-400 shadow-[0_4px_15px_rgba(245,158,11,0.2)] border border-transparent dark:border-amber-500/30' : 'text-stone-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-amber-50'}`}>لجنة المراجعة</button>
          <button onClick={() => setActiveTab('correction')} className={`px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === 'correction' ? 'bg-slate-900 dark:bg-amber-500/20 text-amber-400 shadow-[0_4px_15px_rgba(245,158,11,0.2)] border border-transparent dark:border-amber-500/30' : 'text-stone-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-amber-50'}`}>لجنة الاستدراك</button>
        </div>
        <table className="w-full text-[15px] text-right">
          <thead className="bg-stone-50/80 dark:bg-slate-950/50 border-b border-stone-100 dark:border-slate-800 transition-colors duration-500"><tr><th className="px-8 py-5 text-slate-500 dark:text-slate-400 font-bold rounded-r-2xl">الملف</th><th className="px-8 py-5 text-center text-slate-500 dark:text-slate-400 font-bold w-72 rounded-l-2xl">الحالة ({activeTab === 'review' ? 'المراجعة' : 'الاستدراك'})</th></tr></thead>
          <tbody className="divide-y divide-stone-100/80 dark:divide-slate-800/80">
            {l3Files.map(item => (
              <tr key={item.id} className="hover:bg-amber-50/40 dark:hover:bg-slate-800/50 transition-colors duration-200">
                <td className="px-8 py-6 font-bold">
                  <FileLink file={item} />
                </td>
                <td className="px-8 py-6 text-center">
                  {item[currentStatusProp] === 'pending' ? (
                    <div className="flex justify-center gap-3">
                      <button onClick={() => passParallelFile(item.id, 'l3', currentActionType)} className="px-4 py-2 border border-transparent rounded-xl text-xs font-bold bg-emerald-950 dark:bg-emerald-600/20 text-white dark:text-emerald-400 dark:border-emerald-500/30 hover:bg-emerald-900 dark:hover:bg-emerald-500/30 w-full transition-all duration-300 hover:shadow-[0_4px_15px_rgba(245,158,11,0.3)]"><CheckCircle2 className="w-4 h-4 inline ml-1"/> قبول</button>
                      <button onClick={() => setRejectModal({ isOpen: true, payload: { id: item.id, tabType: currentActionType } })} className="px-4 py-2 border border-rose-200 dark:border-rose-900/50 rounded-xl text-xs font-bold bg-white dark:bg-slate-950/50 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30 hover:text-rose-700 dark:hover:text-rose-300 w-full transition-all duration-300 hover:shadow-sm"><XCircle className="w-4 h-4 inline ml-1"/> رفض</button>
                    </div>
                  ) : (
                    <ParallelBadge status={item[currentStatusProp]} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardLayout>
      <RejectionModal isOpen={rejectModal.isOpen} onClose={() => setRejectModal({ isOpen: false, payload: null })} onConfirm={confirmReject} />
    </div>
  );
}

// ----------------------------------------------------
// AUDITOR
// ----------------------------------------------------
function AuditorView() {
  const { files, passFile, returnFile } = useWorkflow();
  const tasks = files.filter(f => f.currentStage === 'auditor' || f.level4_status !== 'pending');
  const [rejectModal, setRejectModal] = useState({ isOpen: false, payload: null });

  const confirmReject = (reason) => {
    returnFile(rejectModal.payload.id, 'coordinator', reason, 'auditor'); 
    setRejectModal({ isOpen: false, payload: null });
  };

  return (
    <div className="space-y-12">
      <CardLayout title="تدقيق الملفات الواردة (مكتملة الموافقة)">
         <table className="w-full text-[15px] text-right">
            <thead className="bg-stone-50/80 dark:bg-slate-950/50 border-b border-stone-100 dark:border-slate-800 transition-colors duration-500"><tr><th className="px-8 py-5 text-slate-500 dark:text-slate-400 font-bold rounded-r-2xl">بيان الملف</th><th className="px-8 py-5 text-center text-slate-500 dark:text-slate-400 font-bold w-72 rounded-l-2xl">الإجراءات</th></tr></thead>
            <tbody className="divide-y divide-stone-100/80 dark:divide-slate-800/80">
              {tasks.map(task => (
                <tr key={task.id} className="hover:bg-amber-50/40 dark:hover:bg-slate-800/50 transition-colors duration-200">
                  <td className="px-8 py-6 font-bold">
                    <FileLink file={task} />
                  </td>
                  <td className="px-8 py-6 text-center">
                    {task.level4_status === 'pending' ? (
                      <div className="flex justify-center gap-3">
                        <button onClick={() => passFile(task.id, 'l5')} className="px-4 py-2 border border-transparent rounded-xl text-xs font-bold bg-emerald-950 dark:bg-emerald-600/20 text-white dark:text-emerald-400 dark:border-emerald-500/30 hover:bg-emerald-900 dark:hover:bg-emerald-500/30 w-full transition-all duration-300 hover:shadow-[0_4px_15px_rgba(245,158,11,0.3)]"><CheckCircle2 className="w-4 h-4 inline ml-1"/> تمرير للجان العليا</button>
                        <button onClick={() => setRejectModal({ isOpen: true, payload: { id: task.id } })} className="px-4 py-2 border border-rose-200 dark:border-rose-900/50 rounded-xl text-xs font-bold bg-white dark:bg-slate-950/50 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30 hover:text-rose-700 dark:hover:text-rose-300 w-full transition-all duration-300 hover:shadow-sm"><XCircle className="w-4 h-4 inline ml-1"/> إرجاع</button>
                      </div>
                    ) : (
                      <ParallelBadge status={task.level4_status} />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
      </CardLayout>
      <RejectionModal isOpen={rejectModal.isOpen} onClose={() => setRejectModal({ isOpen: false, payload: null })} onConfirm={confirmReject} />
    </div>
  );
}

// ----------------------------------------------------
// L5: SCIENTIFIC COMMITTEE
// ----------------------------------------------------
function ScientificCommitteeView() {
  const { files, passParallelFile, rejectParallelFile } = useWorkflow();
  const data = files.filter(f => f.currentStage === 'l5' || f.level5_scientific_status !== 'pending');
  const [rejectModal, setRejectModal] = useState({ isOpen: false, payload: null });

  const confirmReject = (reason) => {
    rejectParallelFile(rejectModal.payload.id, 'l5', 'scientific', reason);
    setRejectModal({ isOpen: false, payload: null });
  };

  return (
    <div className="space-y-12">
      <CardLayout title="اللجنة العلمية">
        <table className="w-full text-[15px] text-right">
          <thead className="bg-stone-50/80 dark:bg-slate-950/50 border-b border-stone-100 dark:border-slate-800 transition-colors duration-500"><tr><th className="px-8 py-5 text-slate-500 dark:text-slate-400 font-bold rounded-r-2xl">البيان</th><th className="px-8 py-5 text-center text-slate-500 dark:text-slate-400 font-bold w-72 rounded-l-2xl">الاعتماد</th></tr></thead>
          <tbody className="divide-y divide-stone-100/80 dark:divide-slate-800/80">
            {data.map(item => (
              <tr key={item.id} className="hover:bg-amber-50/40 dark:hover:bg-slate-800/50 transition-colors duration-200">
                <td className="px-8 py-6 font-bold">
                  <FileLink file={item} />
                </td>
                <td className="px-8 py-6 text-center">
                  {item.level5_scientific_status === 'pending' ? (
                    <div className="flex justify-center gap-3">
                      <button onClick={() => passParallelFile(item.id, 'l5', 'scientific')} className="px-4 py-2 border border-transparent rounded-xl text-xs font-bold bg-emerald-950 dark:bg-emerald-600/20 text-white dark:text-emerald-400 dark:border-emerald-500/30 hover:bg-emerald-900 dark:hover:bg-emerald-500/30 w-full transition-all duration-300 hover:shadow-[0_4px_15px_rgba(245,158,11,0.3)]"><CheckCircle2 className="w-4 h-4 inline ml-1"/> إجازة</button>
                      <button onClick={() => setRejectModal({ isOpen: true, payload: { id: item.id } })} className="px-4 py-2 border border-rose-200 dark:border-rose-900/50 rounded-xl text-xs font-bold bg-white dark:bg-slate-950/50 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30 hover:text-rose-700 dark:hover:text-rose-300 w-full transition-all duration-300 hover:shadow-sm"><XCircle className="w-4 h-4 inline ml-1"/> رفض</button>
                    </div>
                  ) : (
                    <ParallelBadge status={item.level5_scientific_status} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardLayout>
      <RejectionModal isOpen={rejectModal.isOpen} onClose={() => setRejectModal({ isOpen: false, payload: null })} onConfirm={confirmReject} />
    </div>
  );
}

// ----------------------------------------------------
// L5: APPROVAL COMMITTEE
// ----------------------------------------------------
function ApprovalCommitteeView() {
  const { files, passParallelFile, rejectParallelFile } = useWorkflow();
  const data = files.filter(f => f.currentStage === 'l5' || f.level5_final_status !== 'pending');
  const [rejectModal, setRejectModal] = useState({ isOpen: false, payload: null });

  const confirmReject = (reason) => {
    rejectParallelFile(rejectModal.payload.id, 'l5', 'final', reason);
    setRejectModal({ isOpen: false, payload: null });
  };

  return (
    <div className="space-y-12">
      <CardLayout title="لجنة الاعتماد النهائي">
        <table className="w-full text-[15px] text-right">
          <thead className="bg-stone-50/80 dark:bg-slate-950/50 border-b border-stone-100 dark:border-slate-800 transition-colors duration-500"><tr><th className="px-8 py-5 text-slate-500 dark:text-slate-400 font-bold rounded-r-2xl">البيان</th><th className="px-8 py-5 text-center text-slate-500 dark:text-slate-400 font-bold w-72 rounded-l-2xl">الاعتماد</th></tr></thead>
          <tbody className="divide-y divide-stone-100/80 dark:divide-slate-800/80">
            {data.map(item => (
              <tr key={item.id} className="hover:bg-amber-50/40 dark:hover:bg-slate-800/50 transition-colors duration-200">
                <td className="px-8 py-6 font-bold">
                  <FileLink file={item} />
                </td>
                <td className="px-8 py-6 text-center">
                  {item.level5_final_status === 'pending' ? (
                    <div className="flex justify-center gap-3">
                      <button onClick={() => passParallelFile(item.id, 'l5', 'final')} className="px-4 py-2 border border-transparent rounded-xl text-xs font-bold bg-emerald-950 dark:bg-emerald-600/20 text-white dark:text-emerald-400 dark:border-emerald-500/30 hover:bg-emerald-900 dark:hover:bg-emerald-500/30 w-full transition-all duration-300 hover:shadow-[0_4px_15px_rgba(245,158,11,0.3)]"><CheckCircle2 className="w-4 h-4 inline ml-1"/> اعتماد</button>
                      <button onClick={() => setRejectModal({ isOpen: true, payload: { id: item.id } })} className="px-4 py-2 border border-rose-200 dark:border-rose-900/50 rounded-xl text-xs font-bold bg-white dark:bg-slate-950/50 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30 hover:text-rose-700 dark:hover:text-rose-300 w-full transition-all duration-300 hover:shadow-sm"><XCircle className="w-4 h-4 inline ml-1"/> رفض</button>
                    </div>
                  ) : (
                    <ParallelBadge status={item.level5_final_status} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardLayout>
      <RejectionModal isOpen={rejectModal.isOpen} onClose={() => setRejectModal({ isOpen: false, payload: null })} onConfirm={confirmReject} />
    </div>
  );
}

// ----------------------------------------------------
// L5: ASSISTANT SUPERVISOR
// ----------------------------------------------------
function AssistantSupervisorView() {
  const { files, passParallelFile, rejectParallelFile } = useWorkflow();
  const [activeTab, setActiveTab] = useState('scientific');
  const l5Files = files.filter(f => f.currentStage === 'l5' || f.level5_scientific_status !== 'pending' || f.level5_final_status !== 'pending');
  const [rejectModal, setRejectModal] = useState({ isOpen: false, payload: null });

  const confirmReject = (reason) => {
    rejectParallelFile(rejectModal.payload.id, 'l5', rejectModal.payload.tabType, reason);
    setRejectModal({ isOpen: false, payload: null });
  };

  const currentStatusProp = activeTab === 'scientific' ? 'level5_scientific_status' : 'level5_final_status';
  const currentActionType = activeTab === 'scientific' ? 'scientific' : 'final';

  return (
    <div className="space-y-12">
      <CardLayout title="إدارة اللجان الموازية العليا (المستوى 5)">
        <div className="mb-8 flex bg-slate-50/80 dark:bg-slate-950/50 p-2 rounded-2xl border border-stone-100 dark:border-slate-800 shadow-inner w-fit transition-colors duration-500">
          <button onClick={() => setActiveTab('scientific')} className={`px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === 'scientific' ? 'bg-slate-900 dark:bg-amber-500/20 text-amber-400 shadow-[0_4px_15px_rgba(245,158,11,0.2)] border border-transparent dark:border-amber-500/30' : 'text-stone-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-amber-50'}`}>اللجنة العلمية</button>
          <button onClick={() => setActiveTab('final')} className={`px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === 'final' ? 'bg-slate-900 dark:bg-amber-500/20 text-amber-400 shadow-[0_4px_15px_rgba(245,158,11,0.2)] border border-transparent dark:border-amber-500/30' : 'text-stone-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-amber-50'}`}>لجنة الاعتماد النهائي</button>
        </div>
        <table className="w-full text-[15px] text-right">
          <thead className="bg-stone-50/80 dark:bg-slate-950/50 border-b border-stone-100 dark:border-slate-800 transition-colors duration-500"><tr><th className="px-8 py-5 text-slate-500 dark:text-slate-400 font-bold rounded-r-2xl">البيان</th><th className="px-8 py-5 text-center text-slate-500 dark:text-slate-400 font-bold w-72 rounded-l-2xl">الحالة</th></tr></thead>
          <tbody className="divide-y divide-stone-100/80 dark:divide-slate-800/80">
            {l5Files.map(item => (
              <tr key={item.id} className="hover:bg-amber-50/40 dark:hover:bg-slate-800/50 transition-colors duration-200">
                <td className="px-8 py-6 font-bold">
                  <FileLink file={item} />
                </td>
                <td className="px-8 py-6 text-center">
                  {item[currentStatusProp] === 'pending' ? (
                    <div className="flex justify-center gap-3">
                      <button onClick={() => passParallelFile(item.id, 'l5', currentActionType)} className="px-4 py-2 border border-transparent rounded-xl text-xs font-bold bg-emerald-950 dark:bg-emerald-600/20 text-white dark:text-emerald-400 dark:border-emerald-500/30 hover:bg-emerald-900 dark:hover:bg-emerald-500/30 w-full transition-all duration-300 hover:shadow-[0_4px_15px_rgba(245,158,11,0.3)]"><CheckCircle2 className="w-4 h-4 inline ml-1"/> قبول</button>
                      <button onClick={() => setRejectModal({ isOpen: true, payload: { id: item.id, tabType: currentActionType } })} className="px-4 py-2 border border-rose-200 dark:border-rose-900/50 rounded-xl text-xs font-bold bg-white dark:bg-slate-950/50 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30 hover:text-rose-700 dark:hover:text-rose-300 w-full transition-all duration-300 hover:shadow-sm"><XCircle className="w-4 h-4 inline ml-1"/> رفض</button>
                    </div>
                  ) : (
                    <ParallelBadge status={item[currentStatusProp]} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardLayout>
      <RejectionModal isOpen={rejectModal.isOpen} onClose={() => setRejectModal({ isOpen: false, payload: null })} onConfirm={confirmReject} />
    </div>
  );
}

// ----------------------------------------------------
// L6: GENERAL SUPERVISOR
// ----------------------------------------------------
function GeneralSupervisorView() {
  const { files } = useWorkflow();
  const finalFiles = files.filter(f => f.currentStage === 'general_supervisor');

  return (
    <div className="space-y-12">
      <div className="bg-slate-950 dark:bg-[#064e3b]/30 rounded-[2.5rem] shadow-[0_20px_60px_rgba(2,6,23,0.3)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-amber-900/30 dark:border-amber-500/20 p-16 relative overflow-hidden text-center text-white border-t-[4px] border-t-amber-500 transition-colors duration-500">
         <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23d4af37\' fill-opacity=\'0.04\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] pointer-events-none mix-blend-overlay"></div>
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-full bg-emerald-900/30 dark:bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none"></div>
         <h2 className="text-[3rem] font-['Aref_Ruqaa'] font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-l from-amber-200 via-amber-400 to-amber-600 drop-shadow-[0_2px_15px_rgba(245,158,11,0.25)] relative z-10 leading-normal">لوحة المشرف العام</h2>
         <p className="text-amber-100/80 font-bold text-lg max-w-2xl mx-auto tracking-wide relative z-10">النسخ المعتمدة نهائياً من جميع اللجان المختصة، جاهزة للإصدار.</p>
      </div>
      
      <CardLayout title="الملفات المعتمدة الجاهزة للإصدار">
        <table className="w-full text-[15px] text-right">
          <thead className="bg-stone-50/80 dark:bg-slate-950/50 border-b border-stone-100 dark:border-slate-800 transition-colors duration-500"><tr><th className="px-8 py-5 text-slate-500 dark:text-slate-400 font-bold rounded-r-2xl">اسم المجلد / الملف النهائي</th><th className="px-8 py-5 text-center text-slate-500 dark:text-slate-400 font-bold w-72 rounded-l-2xl">الإصدار</th></tr></thead>
          <tbody className="divide-y divide-stone-100/80 dark:divide-slate-800/80">
            {finalFiles.map(file => (
              <tr key={file.id} className="hover:bg-amber-50/40 dark:hover:bg-slate-800/50 transition-colors duration-200">
                <td className="px-8 py-8 font-bold">
                  <FileLink file={file} />
                </td>
                <td className="px-8 py-8 text-center">
                  <button onClick={() => {
                    if(file.fileData) {
                      const a = document.createElement('a');
                      a.href = file.fileData;
                      a.download = file.name;
                      a.click();
                    } else {
                      const blob = new Blob(["هذا ملف تجريبي للعرض فقط نظراً لأنه من البيانات الافتراضية الأولية للمنصة."], { type: "text/plain" });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = file.name;
                      a.click();
                      URL.revokeObjectURL(url);
                    }
                  }} className="text-slate-900 hover:text-white bg-amber-400 hover:bg-amber-500 px-8 py-3.5 rounded-2xl font-bold transition-all duration-300 hover:shadow-[0_4px_20px_rgba(245,158,11,0.4)] flex items-center justify-center gap-2 mx-auto w-full">
                    تحميل للنشر <Download className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {finalFiles.length === 0 && <tr><td colSpan="2" className="text-center py-12 text-stone-400 dark:text-slate-500 font-medium">لا يوجد ملفات مكتملة حتى الآن</td></tr>}
          </tbody>
        </table>
      </CardLayout>
    </div>
  );
}
