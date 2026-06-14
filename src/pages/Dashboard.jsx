import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWorkflow } from '../context/WorkflowContext';
import { 
  UploadCloud, CheckCircle2, XCircle, 
  Send, BadgeCheck, Users, Activity,
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
        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-32 h-32 border-[8px] border-amber-500/10 rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-24 h-24 border-[6px] border-emerald-800/5 rounded-full pointer-events-none"></div>
        
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

// Helper component for displaying the rejection reason natively
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

// ----------------------------------------------------
// OBSERVER
// ----------------------------------------------------
function ObserverView() {
  const { files, uploadFile } = useWorkflow();
  const { user } = useAuth();
  const [fileType, setFileType] = useState('review');
  const fileInputRef = useRef(null);

  // Show files uploaded by the current observer OR files returned to the observer (currentStage === 'observer')
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
      <div className="bg-white rounded-2xl shadow-lg border border-stone-200 border-t-4 border-t-emerald-800 p-8 flex flex-col items-center">
        <h3 className="text-2xl font-['Amiri'] font-bold text-emerald-950 mb-6 w-full text-right">رفع ملف جديد</h3>
        
        <div className="w-full max-w-md mb-6">
          <label className="block text-sm font-bold text-emerald-900 mb-2 text-right">نوع الملف المُرفق (يحدد مسار اللجنة)</label>
          <select 
            value={fileType}
            onChange={(e) => setFileType(e.target.value)}
            className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 text-emerald-950 font-bold"
          >
            <option value="review">مراجعة شواهد</option>
            <option value="evidence">استدراك شواهد</option>
            <option value="books">استدراك كتب</option>
          </select>
        </div>

        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          onChange={handleFileUpload}
          accept=".xlsx,.xls,.csv"
        />

        <div 
          onClick={() => fileInputRef.current.click()}
          className="w-full bg-stone-50/50 rounded-2xl p-12 border-2 border-dashed border-emerald-800/30 hover:border-amber-500 hover:bg-stone-100 transition-all duration-300 flex flex-col items-center justify-center text-center cursor-pointer group"
        >
          <UploadCloud className="w-14 h-14 text-emerald-800/40 group-hover:text-amber-500 mb-6 transition-colors duration-300" strokeWidth={1.5} />
          <p className="text-xl font-['Amiri'] font-bold text-emerald-950 mb-2">اسحب وأفلت ملف الإكسيل هنا لرفعه للمنسق</p>
          <p className="text-stone-500 text-sm">أو انقر لاختيار ملف من جهازك بصيغة (XLSX, CSV)</p>
        </div>
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
                <th className="px-6 py-4">النوع</th>
                <th className="px-6 py-4">التاريخ والوقت</th>
                <th className="px-6 py-4 rounded-l-xl text-center">الحالة الحالية</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {myFiles.map((file) => (
                <tr key={file.id} className="hover:bg-stone-50 transition-colors">
                  <td className="px-6 py-5 font-bold text-emerald-950 flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-stone-100 text-amber-600 rounded-lg"><FileText className="w-4 h-4"/></div>
                      {file.name}
                    </div>
                    {file.currentStage === 'observer' && <RejectReason history={file.history} />}
                  </td>
                  <td className="px-6 py-5 text-stone-500 font-medium">
                    {file.type === 'review' ? 'مراجعة' : file.type === 'evidence' ? 'استدراك شواهد' : 'استدراك كتب'}
                  </td>
                  <td className="px-6 py-5 text-stone-500 font-medium">{file.date}</td>
                  <td className="px-6 py-5 text-center">
                    <span className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${file.color}`}>
                      {file.status}
                    </span>
                  </td>
                </tr>
              ))}
              {myFiles.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-8 text-stone-400 font-medium">لا توجد ملفات مرفوعة حالياً</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// COORDINATOR
// ----------------------------------------------------
function CoordinatorView() {
  const { files, passFile, returnFile } = useWorkflow();
  const coordinatorFiles = files.filter(f => f.currentStage === 'coordinator');
  const [rejectModal, setRejectModal] = useState({ isOpen: false, payload: null });

  const confirmReject = (reason) => {
    returnFile(rejectModal.payload.id, 'observer', reason);
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
                <th className="px-6 py-4">اسم الملف (والنوع)</th>
                <th className="px-6 py-4 text-center rounded-l-xl">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {coordinatorFiles.map((item) => (
                <tr key={item.id} className="hover:bg-stone-50 transition-colors duration-200 group">
                  <td className="px-6 py-5 text-emerald-950 font-bold">{item.uploadedBy}</td>
                  <td className="px-6 py-5 text-stone-600 font-medium">
                    <span className="font-bold text-emerald-950 block mb-1">{item.name}</span>
                    <span className="text-xs text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-md">
                      {item.type === 'review' ? 'مراجعة' : item.type === 'evidence' ? 'استدراك شواهد' : 'استدراك كتب'}
                    </span>
                    <RejectReason history={item.history} />
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="flex justify-center items-center gap-2">
                      <button 
                        onClick={() => passFile(item.id, `l3_${item.type}`)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold border shadow-sm transition-all flex items-center gap-1.5 bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200 hover:shadow-[0_0_10px_rgba(245,158,11,0.2)]"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> قبول وتمرير
                      </button>
                      <button 
                        onClick={() => setRejectModal({ isOpen: true, payload: { id: item.id } })}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold border shadow-sm transition-all flex items-center gap-1.5 bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100"
                      >
                        <XCircle className="w-3.5 h-3.5" /> رفض وإرجاع
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {coordinatorFiles.length === 0 && (
                <tr>
                  <td colSpan="3" className="text-center py-8 text-stone-400 font-medium">صندوق الوارد فارغ</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <RejectionModal isOpen={rejectModal.isOpen} onClose={() => setRejectModal({ isOpen: false, payload: null })} onConfirm={confirmReject} />
    </div>
  );
}

// ----------------------------------------------------
// REVIEW COMMITTEE
// ----------------------------------------------------
function ReviewCommitteeView() {
  const { files, passFile, returnFile } = useWorkflow();
  const committeeFiles = files.filter(f => f.currentStage === 'l3_review');
  const [rejectModal, setRejectModal] = useState({ isOpen: false, payload: null });

  const confirmReject = (reason) => {
    returnFile(rejectModal.payload.id, 'coordinator', reason);
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
                <th className="px-6 py-4 rounded-r-xl">بيان الشاهد (اسم الملف)</th>
                <th className="px-6 py-4 text-center rounded-l-xl">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {committeeFiles.map((item) => (
                <tr key={item.id} className="hover:bg-stone-50 transition-colors">
                  <td className="px-6 py-5 font-bold text-emerald-950">
                    {item.name}
                    <RejectReason history={item.history} />
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="flex justify-center items-center gap-2">
                      <button 
                        onClick={() => passFile(item.id, 'main_coordinator')}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold border shadow-sm transition-all flex items-center gap-1.5 bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> قبول وتمرير
                      </button>
                      <button 
                        onClick={() => setRejectModal({ isOpen: true, payload: { id: item.id } })}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold border shadow-sm transition-all flex items-center gap-1.5 bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100"
                      >
                        <XCircle className="w-3.5 h-3.5" /> رفض وإرجاع
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {committeeFiles.length === 0 && <tr><td colSpan="2" className="text-center py-8 text-stone-400">لا توجد ملفات</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
      <RejectionModal isOpen={rejectModal.isOpen} onClose={() => setRejectModal({ isOpen: false, payload: null })} onConfirm={confirmReject} />
    </div>
  );
}

// ----------------------------------------------------
// CORRECTION COMMITTEE
// ----------------------------------------------------
function CorrectionCommitteeView() {
  const { files, passFile, returnFile } = useWorkflow();
  const evidenceData = files.filter(f => f.currentStage === 'l3_evidence');
  const booksData = files.filter(f => f.currentStage === 'l3_books');
  const [rejectModal, setRejectModal] = useState({ isOpen: false, payload: null });

  const confirmReject = (reason) => {
    returnFile(rejectModal.payload.id, 'coordinator', reason);
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
                    <th className="px-6 py-4 text-center rounded-l-xl">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {evidenceData.map((item) => (
                    <tr key={item.id} className="hover:bg-stone-50 transition-colors">
                      <td className="px-6 py-5 font-bold text-emerald-950">
                        {item.name}
                        <RejectReason history={item.history} />
                      </td>
                      <td className="px-6 py-5 text-center">
                        <div className="flex justify-center items-center gap-2">
                          <button 
                            onClick={() => passFile(item.id, 'main_coordinator')}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold border bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200 flex items-center gap-1.5"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> قبول وتمرير
                          </button>
                          <button 
                            onClick={() => setRejectModal({ isOpen: true, payload: { id: item.id } })}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold border bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 flex items-center gap-1.5"
                          >
                            <XCircle className="w-3.5 h-3.5" /> رفض وإرجاع
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {evidenceData.length === 0 && <tr><td colSpan="2" className="text-center py-8 text-stone-400">لا توجد ملفات</td></tr>}
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
                    <th className="px-6 py-4 text-center rounded-l-xl">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {booksData.map((item) => (
                    <tr key={item.id} className="hover:bg-stone-50 transition-colors">
                      <td className="px-6 py-5 font-bold text-emerald-950">
                        {item.name}
                        <RejectReason history={item.history} />
                      </td>
                      <td className="px-6 py-5 text-center">
                        <div className="flex justify-center items-center gap-2">
                          <button 
                            onClick={() => passFile(item.id, 'main_coordinator')}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold border bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200 flex items-center gap-1.5"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> قبول وتمرير
                          </button>
                          <button 
                            onClick={() => setRejectModal({ isOpen: true, payload: { id: item.id } })}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold border bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 flex items-center gap-1.5"
                          >
                            <XCircle className="w-3.5 h-3.5" /> رفض وإرجاع
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {booksData.length === 0 && <tr><td colSpan="2" className="text-center py-8 text-stone-400">لا توجد ملفات</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <RejectionModal isOpen={rejectModal.isOpen} onClose={() => setRejectModal({ isOpen: false, payload: null })} onConfirm={confirmReject} />
    </div>
  );
}

// ----------------------------------------------------
// MAIN COORDINATOR
// ----------------------------------------------------
function MainCoordinatorView() {
  const { files, passFile, returnFile } = useWorkflow();
  const [activeTab, setActiveTab] = useState('review');

  const mainData = files.filter(f => f.currentStage === 'main_coordinator');
  const reviewData = mainData.filter(f => f.type === 'review');
  const evidenceData = mainData.filter(f => f.type === 'evidence');
  const booksData = mainData.filter(f => f.type === 'books');

  const [rejectModal, setRejectModal] = useState({ isOpen: false, payload: null });

  const confirmReject = (reason) => {
    const { id, type } = rejectModal.payload;
    returnFile(id, `l3_${type}`, reason);
    setRejectModal({ isOpen: false, payload: null });
  };

  const getActiveData = () => {
    if (activeTab === 'review') return reviewData;
    if (activeTab === 'evidence') return evidenceData;
    return booksData;
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-md border border-stone-200 border-t-2 border-t-amber-500 p-6 relative overflow-hidden">
           <h3 className="text-xl font-['Amiri'] font-bold text-emerald-950 mb-2">لجنة المراجعة</h3>
           <p className="text-xs text-stone-500 mb-4 font-medium">مراجعة بيانات الأرباع الأربعة</p>
           <div className="bg-[#FDFBF7] rounded-xl p-4 border border-stone-100 flex justify-between items-center">
             <div>
               <p className="text-3xl font-bold text-emerald-900">{reviewData.length}</p>
               <p className="text-[10px] font-bold text-stone-400 mt-1 uppercase tracking-wider">ملف وارد</p>
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
               <p className="text-3xl font-bold text-emerald-900">{evidenceData.length}</p>
               <p className="text-[10px] font-bold text-stone-400 mt-1 uppercase tracking-wider">ملف وارد</p>
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
               <p className="text-3xl font-bold text-emerald-900">{booksData.length}</p>
               <p className="text-[10px] font-bold text-stone-400 mt-1 uppercase tracking-wider">ملف وارد</p>
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
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-right">
                <thead className="text-sm text-emerald-900 font-bold bg-stone-100/80">
                  <tr>
                    <th className="px-6 py-4 rounded-r-xl">بيان الملف</th>
                    <th className="px-6 py-4 text-center rounded-l-xl">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {getActiveData().map((item) => (
                    <tr key={item.id} className="hover:bg-stone-50 transition-colors">
                      <td className="px-6 py-5 font-bold text-emerald-950">
                        {item.name}
                        <RejectReason history={item.history} />
                      </td>
                      <td className="px-6 py-5 text-center">
                        <div className="flex justify-center items-center gap-2">
                          <button 
                            onClick={() => passFile(item.id, 'auditor')}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold border bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200 flex items-center gap-1.5"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> قبول وتمرير
                          </button>
                          <button 
                            onClick={() => setRejectModal({ isOpen: true, payload: { id: item.id, type: item.type } })}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold border bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 flex items-center gap-1.5"
                          >
                            <XCircle className="w-3.5 h-3.5" /> رفض وإرجاع
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {getActiveData().length === 0 && <tr><td colSpan="2" className="text-center py-8 text-stone-400">لا توجد ملفات</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </div>
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
  const tasks = files.filter(f => f.currentStage === 'auditor');
  const [rejectModal, setRejectModal] = useState({ isOpen: false, payload: null });

  const confirmReject = (reason) => {
    returnFile(rejectModal.payload.id, 'main_coordinator', reason);
    setRejectModal({ isOpen: false, payload: null });
  };

  return (
    <div className="space-y-8">
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
                  <th className="px-6 py-4 text-center rounded-l-xl">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {tasks.map((task) => (
                  <tr key={task.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-6 py-5 font-bold text-emerald-950">
                      {task.name}
                      <RejectReason history={task.history} />
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className="flex justify-center items-center gap-2">
                        <button 
                          onClick={() => passFile(task.id, task.type === 'books' ? 'l5_approval' : 'l5_scientific')}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold border bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200 flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> قبول وتمرير
                        </button>
                        <button 
                          onClick={() => setRejectModal({ isOpen: true, payload: { id: task.id } })}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold border bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 flex items-center gap-1.5"
                        >
                          <XCircle className="w-3.5 h-3.5" /> رفض وإرجاع
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {tasks.length === 0 && <tr><td colSpan="2" className="text-center py-8 text-stone-400">لا توجد ملفات</td></tr>}
              </tbody>
            </table>
          </div>
      </div>
      <RejectionModal isOpen={rejectModal.isOpen} onClose={() => setRejectModal({ isOpen: false, payload: null })} onConfirm={confirmReject} />
    </div>
  );
}

// ----------------------------------------------------
// SCIENTIFIC COMMITTEE
// ----------------------------------------------------
function ScientificCommitteeView() {
  const { files, passFile, returnFile } = useWorkflow();
  const data = files.filter(f => f.currentStage === 'l5_scientific');
  const [rejectModal, setRejectModal] = useState({ isOpen: false, payload: null });

  const confirmReject = (reason) => {
    returnFile(rejectModal.payload.id, 'auditor', reason);
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
                <th className="px-6 py-4 rounded-r-xl">البيان العلمي (الملف)</th>
                <th className="px-6 py-4 text-center rounded-l-xl">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {data.map((item) => (
                <tr key={item.id} className="hover:bg-stone-50 transition-colors">
                  <td className="px-6 py-5 font-bold text-emerald-950">
                    {item.name}
                    <RejectReason history={item.history} />
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="flex justify-center items-center gap-2">
                      <button 
                        onClick={() => passFile(item.id, 'assistant_supervisor')}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold border bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200 flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> إجازة وتمرير
                      </button>
                      <button 
                        onClick={() => setRejectModal({ isOpen: true, payload: { id: item.id } })}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold border bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 flex items-center gap-1.5"
                      >
                        <XCircle className="w-3.5 h-3.5" /> رفض وإرجاع
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {data.length === 0 && <tr><td colSpan="2" className="text-center py-8 text-stone-400">لا توجد ملفات</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
      <RejectionModal isOpen={rejectModal.isOpen} onClose={() => setRejectModal({ isOpen: false, payload: null })} onConfirm={confirmReject} />
    </div>
  );
}

// ----------------------------------------------------
// APPROVAL COMMITTEE
// ----------------------------------------------------
function ApprovalCommitteeView() {
  const { files, passFile, returnFile } = useWorkflow();
  const data = files.filter(f => f.currentStage === 'l5_approval');
  const [rejectModal, setRejectModal] = useState({ isOpen: false, payload: null });

  const confirmReject = (reason) => {
    returnFile(rejectModal.payload.id, 'auditor', reason);
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
                <th className="px-6 py-4 text-center rounded-l-xl">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {data.map((item) => (
                <tr key={item.id} className="hover:bg-stone-50 transition-colors">
                  <td className="px-6 py-5 font-bold text-emerald-950 flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-stone-100 text-amber-600 rounded-lg"><FileText className="w-4 h-4"/></div>
                      {item.name}
                    </div>
                    {item.history.length > 0 && <RejectReason history={item.history} />}
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="flex justify-center items-center gap-2">
                      <button 
                        onClick={() => passFile(item.id, 'assistant_supervisor')}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold border bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200 flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> اعتماد وتمرير
                      </button>
                      <button 
                        onClick={() => setRejectModal({ isOpen: true, payload: { id: item.id } })}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold border bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 flex items-center gap-1.5"
                      >
                        <XCircle className="w-3.5 h-3.5" /> رفض وإرجاع
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {data.length === 0 && <tr><td colSpan="2" className="text-center py-8 text-stone-400">لا توجد ملفات</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
      <RejectionModal isOpen={rejectModal.isOpen} onClose={() => setRejectModal({ isOpen: false, payload: null })} onConfirm={confirmReject} />
    </div>
  );
}

// ----------------------------------------------------
// ASSISTANT SUPERVISOR
// ----------------------------------------------------
function AssistantSupervisorView() {
  const { files, passFile, returnFile } = useWorkflow();
  const [activeTab, setActiveTab] = useState('approval');
  
  const supervisorData = files.filter(f => f.currentStage === 'assistant_supervisor');
  const approvalData = supervisorData.filter(f => f.type === 'books');
  const scientificData = supervisorData.filter(f => f.type !== 'books');

  const [rejectModal, setRejectModal] = useState({ isOpen: false, payload: null });

  const confirmReject = (reason) => {
    const { id, type } = rejectModal.payload;
    returnFile(id, type === 'books' ? 'l5_approval' : 'l5_scientific', reason);
    setRejectModal({ isOpen: false, payload: null });
  };

  const activeData = activeTab === 'approval' ? approvalData : scientificData;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow-md border border-stone-200 border-t-2 border-t-amber-500 p-8">
           <h3 className="text-2xl font-['Amiri'] font-bold text-emerald-950 mb-4 flex items-center gap-3"><ShieldCheck className="text-amber-500"/> لجنة الاعتماد النهائي</h3>
           <p className="text-sm text-stone-500 mb-6 leading-relaxed font-medium">تضم 4 أعضاء، وظيفتهم المراجعة النهائية لكل البيانات المُدققة من لجنة التدقيق والتحرير.</p>
           <div className="p-4 bg-[#FDFBF7] border border-stone-200 rounded-xl flex justify-between">
             <span className="text-emerald-700 font-bold text-sm">الملفات الواردة</span>
             <span className="text-emerald-700 font-bold text-sm">{approvalData.length}</span>
           </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md border border-stone-200 border-t-2 border-t-amber-500 p-8">
           <h3 className="text-2xl font-['Amiri'] font-bold text-emerald-950 mb-4 flex items-center gap-3"><BookText className="text-amber-500"/> اللجنة العلمية</h3>
           <p className="text-sm text-stone-500 mb-6 leading-relaxed font-medium">تضم 4 أعضاء، وظيفتهم الإشراف العلمي الدقيق والبت في المسائل اللغوية الخلافية.</p>
           <div className="p-4 bg-[#FDFBF7] border border-stone-200 rounded-xl flex justify-between">
             <span className="text-blue-700 font-bold text-sm">الملفات الواردة</span>
             <span className="text-blue-700 font-bold text-sm">{scientificData.length}</span>
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
                <th className="px-6 py-4 text-center rounded-l-xl">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {activeData.map((item) => (
                <tr key={item.id} className="hover:bg-stone-50 transition-colors">
                  <td className="px-6 py-5 font-bold text-emerald-950">
                    {item.name}
                    <RejectReason history={item.history} />
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="flex justify-center items-center gap-2">
                      <button 
                        onClick={() => passFile(item.id, 'general_supervisor')}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold border bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200 flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> تصديق ورفع
                      </button>
                      <button 
                        onClick={() => setRejectModal({ isOpen: true, payload: { id: item.id, type: item.type } })}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold border bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 flex items-center gap-1.5"
                      >
                        <XCircle className="w-3.5 h-3.5" /> رفض وإرجاع
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {activeData.length === 0 && <tr><td colSpan="2" className="text-center py-8 text-stone-400">لا توجد ملفات</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
      <RejectionModal isOpen={rejectModal.isOpen} onClose={() => setRejectModal({ isOpen: false, payload: null })} onConfirm={confirmReject} />
    </div>
  );
}

// ----------------------------------------------------
// GENERAL SUPERVISOR
// ----------------------------------------------------
function GeneralSupervisorView() {
  const { files } = useWorkflow();
  const finalFiles = files.filter(f => f.currentStage === 'general_supervisor');

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-emerald-950 to-emerald-800 rounded-2xl shadow-2xl border border-emerald-700 p-12 relative overflow-hidden text-center text-white border-t-4 border-t-amber-500">
         <h2 className="text-4xl font-['Amiri'] font-extrabold mb-4 text-amber-400 drop-shadow-md">لوحة الإشراف العام</h2>
         <p className="text-emerald-100 font-medium text-lg max-w-2xl mx-auto leading-relaxed">النسخ النهائية المعتمدة والجاهزة للنشر والإصدار الرسمي، مُدققة ومعتمدة من جميع اللجان المختصة.</p>
         <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 border-[10px] border-emerald-800/30 rounded-full blur-sm pointer-events-none"></div>
         <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 border-[10px] border-amber-500/10 rounded-full blur-sm pointer-events-none"></div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-stone-200 border-t-4 border-t-emerald-800 p-8">
        <h3 className="text-2xl font-['Amiri'] font-bold text-emerald-950 mb-8 border-b border-stone-100 pb-4">الملفات المستلمة (المرحلة النهائية)</h3>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-right">
              <thead className="text-sm text-emerald-900 font-bold bg-stone-100/80">
                <tr>
                  <th className="px-6 py-5 rounded-r-xl">اسم المجلد / الملف النهائي</th>
                  <th className="px-6 py-5">تاريخ الاعتماد</th>
                  <th className="px-6 py-5 text-center rounded-l-xl">تنزيل للإصدار</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {finalFiles.map((file) => (
                  <tr key={file.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-6 py-6 font-bold text-emerald-950 text-base">{file.name}</td>
                    <td className="px-6 py-6 text-stone-500 font-medium">{file.date}</td>
                    <td className="px-6 py-6 text-center">
                      <button className="text-amber-500 hover:text-amber-600 bg-stone-50 hover:bg-stone-100 px-6 py-3 rounded-xl font-bold transition-all duration-300 inline-flex items-center gap-2 shadow-sm border border-stone-200 hover:border-amber-500 hover:shadow-[0_0_15px_rgba(245,158,11,0.15)]">
                        تحميل النسخة <Download className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {finalFiles.length === 0 && <tr><td colSpan="3" className="text-center py-8 text-stone-400">لا توجد ملفات معتمدة نهائياً</td></tr>}
              </tbody>
            </table>
          </div>
      </div>
    </div>
  );
}
