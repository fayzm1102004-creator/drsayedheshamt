import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWorkflow } from '../context/WorkflowContext';
import { 
  UploadCloud, CheckCircle2, XCircle, 
  Send, BadgeCheck, Users, Activity,
  FileText, ShieldCheck, Download, BookText, Clock
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
        <h3 className="text-3xl font-['Amiri'] font-bold text-emerald-950 mb-2 relative z-10 flex items-center gap-2">
          <XCircle className="w-8 h-8 text-rose-500" />
          طلب تعديل على الملف
        </h3>
        <p className="text-sm text-stone-500 mb-6 relative z-10 font-medium">يرجى توضيح سبب إرجاع الملف للزميل السابق ليتم تدارك الأخطاء.</p>
        
        <div className="relative z-10 space-y-6">
          <div>
            <label className="block text-sm font-bold text-emerald-900 mb-2">سبب طلب التعديل أو الملاحظات</label>
            <textarea 
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full h-32 px-4 py-3 bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all text-stone-700 resize-none font-medium"
              placeholder="يرجى كتابة الملاحظات..."
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={onClose} className="px-6 py-2.5 rounded-xl text-sm font-bold bg-stone-200 text-stone-600">إلغاء</button>
            <button onClick={handleConfirm} disabled={!reason.trim()} className="px-6 py-2.5 rounded-xl text-sm font-bold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-2">
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
    <p className="text-xs text-rose-600 mt-1.5 font-bold flex flex-col gap-0.5">
      <span className="text-[10px] text-stone-400 uppercase">ملاحظات التعديل:</span>
      {lastRejection.reason}
    </p>
  );
};

const ParallelBadge = ({ status }) => {
  if (status === 'approved') return <span className="px-3 py-1.5 rounded-lg text-xs font-bold border bg-emerald-50 text-emerald-600 border-emerald-200 flex items-center justify-center gap-1 w-full opacity-80"><CheckCircle2 className="w-3.5 h-3.5"/> تم القبول</span>;
  if (status === 'rejected') return <span className="px-3 py-1.5 rounded-lg text-xs font-bold border bg-rose-50 text-rose-600 border-rose-200 flex items-center justify-center gap-1 w-full opacity-80"><XCircle className="w-3.5 h-3.5"/> محتاج تعديل</span>;
  return null;
};

// ----------------------------------------------------
// OBSERVER
// ----------------------------------------------------
function ObserverView() {
  const { files, uploadFile } = useWorkflow();
  const { user } = useAuth();
  const [fileType, setFileType] = useState('review');
  const fileInputRef = useRef(null);
  const myFiles = files.filter(f => f.uploadedBy === user?.name || f.currentStage === 'observer');

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadFile({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: fileType,
        date: new Date().toISOString().split('T')[0],
        status: 'تم الرفع للمنسق',
        color: 'bg-amber-100 text-amber-800 border-amber-200',
        currentStage: 'coordinator',
        history: [],
        uploadedBy: user.name
      });
      e.target.value = null;
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl shadow-lg border-t-4 border-t-emerald-800 p-8 flex flex-col items-center">
        <h3 className="text-2xl font-['Amiri'] font-bold text-emerald-950 mb-6 w-full text-right">رفع ملف جديد</h3>
        <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} accept=".xlsx,.xls,.csv" />
        <div onClick={() => fileInputRef.current.click()} className="w-full bg-stone-50/50 rounded-2xl p-12 border-2 border-dashed border-emerald-800/30 hover:border-amber-500 cursor-pointer flex flex-col items-center">
          <UploadCloud className="w-14 h-14 text-emerald-800/40 mb-6" />
          <p className="text-xl font-['Amiri'] font-bold text-emerald-950">اسحب وأفلت ملف الإكسيل هنا لرفعه للمنسق</p>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl shadow-lg border-t-4 border-t-emerald-800 p-8">
        <h3 className="text-2xl font-['Amiri'] font-bold text-emerald-950 mb-6 border-b pb-4">جدول الملفات المرفوعة وحالتها</h3>
        <table className="w-full text-sm text-right">
          <thead className="bg-stone-100/80"><tr><th className="px-6 py-4">اسم الملف</th><th className="px-6 py-4 text-center">الحالة الحالية</th></tr></thead>
          <tbody className="divide-y">
            {myFiles.map(file => (
              <tr key={file.id}>
                <td className="px-6 py-5 font-bold">
                  {file.name}
                  {file.currentStage === 'observer' && <RejectReason history={file.history} />}
                </td>
                <td className="px-6 py-5 text-center"><span className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${file.color}`}>{file.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
    <div className="space-y-8">
      <div className="bg-white rounded-2xl shadow-lg border-t-4 border-t-emerald-800 p-8">
        <h3 className="text-2xl font-['Amiri'] font-bold text-emerald-950 mb-6 border-b pb-4">مراجعة ملفات الرصاد</h3>
        
        <div className="mb-6 flex bg-[#FDFBF7] p-1.5 rounded-2xl border border-stone-200 shadow-inner overflow-x-auto gap-1">
          {observersList.map(obs => (
            <button
              key={obs.id}
              onClick={() => setActiveObserver(obs.id)}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                activeObserver === obs.id 
                  ? 'bg-gradient-to-r from-emerald-900 to-emerald-800 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.2)]' 
                  : 'text-stone-500 hover:text-emerald-900 hover:bg-stone-100'
              }`}
            >
              {obs.label}
            </button>
          ))}
        </div>

        <table className="w-full text-sm text-right">
          <thead className="bg-stone-100/80"><tr><th className="px-6 py-4 rounded-r-xl">الراصد</th><th className="px-6 py-4">اسم الملف</th><th className="px-6 py-4 text-center w-64 rounded-l-xl">الإجراءات</th></tr></thead>
          <tbody className="divide-y">
            {coordinatorFiles.map(item => (
              <tr key={item.id} className="hover:bg-stone-50 transition-colors">
                <td className="px-6 py-5 text-emerald-950 font-bold">{item.uploadedBy}</td>
                <td className="px-6 py-5 font-bold">
                  {item.name}
                  <RejectReason history={item.history} />
                </td>
                <td className="px-6 py-5 text-center">
                  {item.level2_status === 'pending' ? (
                    <div className="flex justify-center gap-2">
                      <button onClick={() => passFile(item.id, 'l3')} className="px-3 py-1.5 border rounded-lg text-xs font-bold bg-emerald-100 text-emerald-800 hover:bg-emerald-200 w-full"><CheckCircle2 className="w-3.5 h-3.5 inline"/> قبول وتمرير للجان</button>
                      <button onClick={() => setRejectModal({ isOpen: true, payload: { id: item.id } })} className="px-3 py-1.5 border rounded-lg text-xs font-bold bg-rose-50 text-rose-700 hover:bg-rose-100 w-full"><XCircle className="w-3.5 h-3.5 inline"/> رفض وإرجاع</button>
                    </div>
                  ) : (
                    <ParallelBadge status={item.level2_status} />
                  )}
                </td>
              </tr>
            ))}
            {coordinatorFiles.length === 0 && (
              <tr>
                <td colSpan="3" className="text-center py-8 text-stone-400 font-medium">لا توجد ملفات لهذا الراصد</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
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
    <div className="space-y-8">
      <div className="bg-white rounded-2xl shadow-lg border-t-4 border-t-emerald-800 p-8">
        <h3 className="text-2xl font-['Amiri'] font-bold text-emerald-950 mb-8 border-b pb-4">مساحة عمل لجنة المراجعة</h3>
        <table className="w-full text-sm text-right">
          <thead className="bg-stone-100/80"><tr><th className="px-6 py-4">بيان الشاهد</th><th className="px-6 py-4 text-center w-64">حالة لجنة المراجعة</th></tr></thead>
          <tbody className="divide-y">
            {committeeFiles.map(item => (
              <tr key={item.id}>
                <td className="px-6 py-5 font-bold">
                  {item.name}
                  {item.currentStage === 'l3' && <RejectReason history={item.history} />}
                </td>
                <td className="px-6 py-5 text-center">
                  {item.level3_review_status === 'pending' ? (
                    <div className="flex justify-center gap-2">
                      <button onClick={() => passParallelFile(item.id, 'l3', 'review')} className="px-3 py-1.5 border rounded-lg text-xs font-bold bg-emerald-100 text-emerald-800 hover:bg-emerald-200 w-full"><CheckCircle2 className="w-3.5 h-3.5 inline"/> قبول</button>
                      <button onClick={() => setRejectModal({ isOpen: true, payload: { id: item.id } })} className="px-3 py-1.5 border rounded-lg text-xs font-bold bg-rose-50 text-rose-700 hover:bg-rose-100 w-full"><XCircle className="w-3.5 h-3.5 inline"/> رفض</button>
                    </div>
                  ) : (
                    <ParallelBadge status={item.level3_review_status} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
    <div className="space-y-8">
      <div className="bg-white rounded-2xl shadow-lg border-t-4 border-t-emerald-800 p-8">
        <h3 className="text-2xl font-['Amiri'] font-bold text-emerald-950 mb-8 border-b pb-4">مساحة عمل لجنة الاستدراك</h3>
        <table className="w-full text-sm text-right">
          <thead className="bg-stone-100/80"><tr><th className="px-6 py-4">بيان الاستدراك</th><th className="px-6 py-4 text-center w-64">حالة لجنة الاستدراك</th></tr></thead>
          <tbody className="divide-y">
            {l3Files.map(item => (
              <tr key={item.id}>
                <td className="px-6 py-5 font-bold">
                  {item.name}
                  {item.currentStage === 'l3' && <RejectReason history={item.history} />}
                </td>
                <td className="px-6 py-5 text-center">
                  {item.level3_correction_status === 'pending' ? (
                    <div className="flex justify-center gap-2">
                      <button onClick={() => passParallelFile(item.id, 'l3', 'correction')} className="px-3 py-1.5 border rounded-lg text-xs font-bold bg-emerald-100 text-emerald-800 hover:bg-emerald-200 w-full"><CheckCircle2 className="w-3.5 h-3.5 inline"/> قبول</button>
                      <button onClick={() => setRejectModal({ isOpen: true, payload: { id: item.id } })} className="px-3 py-1.5 border rounded-lg text-xs font-bold bg-rose-50 text-rose-700 hover:bg-rose-100 w-full"><XCircle className="w-3.5 h-3.5 inline"/> رفض</button>
                    </div>
                  ) : (
                    <ParallelBadge status={item.level3_correction_status} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
    <div className="space-y-8">
      <div className="bg-white rounded-2xl shadow-lg border-t-4 border-t-emerald-800 p-8">
        <div className="mb-8 border-b pb-6 flex flex-col md:flex-row justify-between gap-6">
           <h3 className="text-2xl font-['Amiri'] font-bold text-emerald-950">إدارة اللجان الموازية (المستوى 3)</h3>
           <div className="flex bg-[#FDFBF7] p-1.5 rounded-2xl border">
             <button onClick={() => setActiveTab('review')} className={`px-6 py-2.5 rounded-xl text-sm font-bold ${activeTab === 'review' ? 'bg-emerald-900 text-amber-400' : 'text-stone-500'}`}>لجنة المراجعة</button>
             <button onClick={() => setActiveTab('correction')} className={`px-6 py-2.5 rounded-xl text-sm font-bold ${activeTab === 'correction' ? 'bg-emerald-900 text-amber-400' : 'text-stone-500'}`}>لجنة الاستدراك</button>
           </div>
        </div>
        <table className="w-full text-sm text-right">
          <thead className="bg-stone-100/80"><tr><th className="px-6 py-4">الملف</th><th className="px-6 py-4 text-center w-64">الحالة للجنة ({activeTab === 'review' ? 'المراجعة' : 'الاستدراك'})</th></tr></thead>
          <tbody className="divide-y">
            {l3Files.map(item => (
              <tr key={item.id}>
                <td className="px-6 py-5 font-bold">
                  {item.name}
                  {item.currentStage === 'l3' && <RejectReason history={item.history} />}
                </td>
                <td className="px-6 py-5 text-center">
                  {item[currentStatusProp] === 'pending' ? (
                    <div className="flex justify-center gap-2">
                      <button onClick={() => passParallelFile(item.id, 'l3', currentActionType)} className="px-3 py-1.5 border rounded-lg text-xs font-bold bg-emerald-100 text-emerald-800 hover:bg-emerald-200 w-full"><CheckCircle2 className="w-3.5 h-3.5 inline"/> قبول</button>
                      <button onClick={() => setRejectModal({ isOpen: true, payload: { id: item.id, tabType: currentActionType } })} className="px-3 py-1.5 border rounded-lg text-xs font-bold bg-rose-50 text-rose-700 hover:bg-rose-100 w-full"><XCircle className="w-3.5 h-3.5 inline"/> رفض</button>
                    </div>
                  ) : (
                    <ParallelBadge status={item[currentStatusProp]} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
    <div className="space-y-8">
      <div className="bg-white rounded-2xl shadow-lg border-t-4 border-t-emerald-800 p-8">
         <h3 className="text-2xl font-['Amiri'] font-bold text-emerald-950 mb-6 border-b pb-4">تدقيق الملفات الواردة (مكتملة الموافقة الموازية)</h3>
         <table className="w-full text-sm text-right">
            <thead className="bg-stone-100/80"><tr><th className="px-6 py-4">بيان الملف</th><th className="px-6 py-4 text-center w-64">الإجراءات</th></tr></thead>
            <tbody className="divide-y">
              {tasks.map(task => (
                <tr key={task.id}>
                  <td className="px-6 py-5 font-bold">
                    {task.name}
                    <RejectReason history={task.history} />
                  </td>
                  <td className="px-6 py-5 text-center">
                    {task.level4_status === 'pending' ? (
                      <div className="flex justify-center gap-2">
                        <button onClick={() => passFile(task.id, 'l5')} className="px-3 py-1.5 border rounded-lg text-xs font-bold bg-emerald-100 text-emerald-800 hover:bg-emerald-200 w-full"><CheckCircle2 className="w-3.5 h-3.5 inline"/> تمرير للجان العليا</button>
                        <button onClick={() => setRejectModal({ isOpen: true, payload: { id: task.id } })} className="px-3 py-1.5 border rounded-lg text-xs font-bold bg-rose-50 text-rose-700 hover:bg-rose-100 w-full"><XCircle className="w-3.5 h-3.5 inline"/> رفض وإرجاع</button>
                      </div>
                    ) : (
                      <ParallelBadge status={task.level4_status} />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
      </div>
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
    <div className="space-y-8">
      <div className="bg-white rounded-2xl shadow-lg border-t-4 border-t-emerald-800 p-8">
        <h3 className="text-2xl font-['Amiri'] font-bold text-emerald-950 mb-8 border-b pb-4">اللجنة العلمية</h3>
        <table className="w-full text-sm text-right">
          <thead className="bg-stone-100/80"><tr><th className="px-6 py-4">البيان</th><th className="px-6 py-4 text-center w-64">الاعتماد العلمي</th></tr></thead>
          <tbody className="divide-y">
            {data.map(item => (
              <tr key={item.id}>
                <td className="px-6 py-5 font-bold">
                  {item.name}
                  {item.currentStage === 'l5' && <RejectReason history={item.history} />}
                </td>
                <td className="px-6 py-5 text-center">
                  {item.level5_scientific_status === 'pending' ? (
                    <div className="flex justify-center gap-2">
                      <button onClick={() => passParallelFile(item.id, 'l5', 'scientific')} className="px-3 py-1.5 border rounded-lg text-xs font-bold bg-emerald-100 text-emerald-800 hover:bg-emerald-200 w-full"><CheckCircle2 className="w-3.5 h-3.5 inline"/> إجازة</button>
                      <button onClick={() => setRejectModal({ isOpen: true, payload: { id: item.id } })} className="px-3 py-1.5 border rounded-lg text-xs font-bold bg-rose-50 text-rose-700 hover:bg-rose-100 w-full"><XCircle className="w-3.5 h-3.5 inline"/> رفض</button>
                    </div>
                  ) : (
                    <ParallelBadge status={item.level5_scientific_status} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
    <div className="space-y-8">
      <div className="bg-white rounded-2xl shadow-lg border-t-4 border-t-emerald-800 p-8">
        <h3 className="text-2xl font-['Amiri'] font-bold text-emerald-950 mb-8 border-b pb-4">لجنة الاعتماد النهائي</h3>
        <table className="w-full text-sm text-right">
          <thead className="bg-stone-100/80"><tr><th className="px-6 py-4">البيان</th><th className="px-6 py-4 text-center w-64">الاعتماد النهائي</th></tr></thead>
          <tbody className="divide-y">
            {data.map(item => (
              <tr key={item.id}>
                <td className="px-6 py-5 font-bold">
                  {item.name}
                  {item.currentStage === 'l5' && <RejectReason history={item.history} />}
                </td>
                <td className="px-6 py-5 text-center">
                  {item.level5_final_status === 'pending' ? (
                    <div className="flex justify-center gap-2">
                      <button onClick={() => passParallelFile(item.id, 'l5', 'final')} className="px-3 py-1.5 border rounded-lg text-xs font-bold bg-emerald-100 text-emerald-800 hover:bg-emerald-200 w-full"><CheckCircle2 className="w-3.5 h-3.5 inline"/> اعتماد</button>
                      <button onClick={() => setRejectModal({ isOpen: true, payload: { id: item.id } })} className="px-3 py-1.5 border rounded-lg text-xs font-bold bg-rose-50 text-rose-700 hover:bg-rose-100 w-full"><XCircle className="w-3.5 h-3.5 inline"/> رفض</button>
                    </div>
                  ) : (
                    <ParallelBadge status={item.level5_final_status} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
    <div className="space-y-8">
      <div className="bg-white rounded-2xl shadow-lg border-t-4 border-t-emerald-800 p-8">
        <div className="mb-8 border-b pb-6 flex flex-col md:flex-row justify-between gap-6">
           <h3 className="text-2xl font-['Amiri'] font-bold text-emerald-950">إدارة اللجان الموازية العليا (المستوى 5)</h3>
           <div className="flex bg-[#FDFBF7] p-1.5 rounded-2xl border">
             <button onClick={() => setActiveTab('scientific')} className={`px-6 py-2.5 rounded-xl text-sm font-bold ${activeTab === 'scientific' ? 'bg-emerald-900 text-amber-400' : 'text-stone-500'}`}>اللجنة العلمية</button>
             <button onClick={() => setActiveTab('final')} className={`px-6 py-2.5 rounded-xl text-sm font-bold ${activeTab === 'final' ? 'bg-emerald-900 text-amber-400' : 'text-stone-500'}`}>لجنة الاعتماد النهائي</button>
           </div>
        </div>
        <table className="w-full text-sm text-right">
          <thead className="bg-stone-100/80"><tr><th className="px-6 py-4">البيان</th><th className="px-6 py-4 text-center w-64">الحالة</th></tr></thead>
          <tbody className="divide-y">
            {l5Files.map(item => (
              <tr key={item.id}>
                <td className="px-6 py-5 font-bold">
                  {item.name}
                  {item.currentStage === 'l5' && <RejectReason history={item.history} />}
                </td>
                <td className="px-6 py-5 text-center">
                  {item[currentStatusProp] === 'pending' ? (
                    <div className="flex justify-center gap-2">
                      <button onClick={() => passParallelFile(item.id, 'l5', currentActionType)} className="px-3 py-1.5 border rounded-lg text-xs font-bold bg-emerald-100 text-emerald-800 hover:bg-emerald-200 w-full"><CheckCircle2 className="w-3.5 h-3.5 inline"/> قبول</button>
                      <button onClick={() => setRejectModal({ isOpen: true, payload: { id: item.id, tabType: currentActionType } })} className="px-3 py-1.5 border rounded-lg text-xs font-bold bg-rose-50 text-rose-700 hover:bg-rose-100 w-full"><XCircle className="w-3.5 h-3.5 inline"/> رفض</button>
                    </div>
                  ) : (
                    <ParallelBadge status={item[currentStatusProp]} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-emerald-950 to-emerald-800 rounded-2xl shadow-2xl border border-emerald-700 p-12 relative overflow-hidden text-center text-white border-t-4 border-t-amber-500">
         <h2 className="text-4xl font-['Amiri'] font-extrabold mb-4 text-amber-400 drop-shadow-md">لوحة المشرف العام</h2>
         <p className="text-emerald-100 font-medium text-lg max-w-2xl mx-auto leading-relaxed">النسخ المعتمدة نهائياً من جميع اللجان المختصة.</p>
      </div>
      <div className="bg-white rounded-2xl shadow-lg border-t-4 border-t-emerald-800 p-8">
        <h3 className="text-2xl font-['Amiri'] font-bold text-emerald-950 mb-8 border-b pb-4">الملفات المعتمدة الجاهزة للإصدار</h3>
        <table className="w-full text-sm text-right">
          <thead className="bg-stone-100/80"><tr><th className="px-6 py-5">اسم المجلد / الملف النهائي</th><th className="px-6 py-5 text-center">الإصدار</th></tr></thead>
          <tbody className="divide-y">
            {finalFiles.map(file => (
              <tr key={file.id}>
                <td className="px-6 py-6 font-bold">{file.name}</td>
                <td className="px-6 py-6 text-center">
                  <button className="text-amber-500 hover:text-amber-600 bg-stone-50 px-6 py-3 rounded-xl font-bold border border-stone-200">
                    تحميل للنشر <Download className="w-4 h-4 inline" />
                  </button>
                </td>
              </tr>
            ))}
            {finalFiles.length === 0 && <tr><td colSpan="2" className="text-center py-8 text-stone-400">لا يوجد</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
