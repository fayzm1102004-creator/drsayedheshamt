import React, { createContext, useContext, useState, useEffect } from 'react';

const WorkflowContext = createContext();

export function useWorkflow() {
  return useContext(WorkflowContext);
}

const defaultParallelState = {
  level3_review_status: 'pending',
  level3_correction_status: 'pending',
  level5_scientific_status: 'pending',
  level5_final_status: 'pending',
};

const DEFAULT_FILES = [
  { id: '1', name: 'شواهد_سورة_البقرة.xlsx', type: 'review', date: '2023-10-15', status: 'قيد المراجعة', color: 'bg-amber-100 text-amber-800 border-amber-200', currentStage: 'coordinator', history: [], uploadedBy: 'الراصد 1', ...defaultParallelState },
  { id: '2', name: 'ألفاظ_غريب_القرآن.xlsx', type: 'review', date: '2023-10-12', status: 'محتاج تعديل', color: 'bg-rose-50 text-rose-600 border-rose-100', currentStage: 'observer', history: [{ action: 'reject', reason: 'يوجد خطأ في المنهجية المتبعة.' }], uploadedBy: 'الراصد 1', ...defaultParallelState },
  { id: '3', name: 'جذور_حرف_الألف.xlsx', type: 'evidence', date: '2023-10-10', status: 'ملف صحيح', color: 'bg-emerald-100 text-emerald-800 border-emerald-200', currentStage: 'coordinator', history: [], uploadedBy: 'الراصد 1', ...defaultParallelState },
  { id: '4', name: 'تحليل الشاهد النحوي لقوله تعالى', type: 'review', date: '2023-10-14', status: 'موزع للجان', color: 'bg-blue-100 text-blue-800 border-blue-200', currentStage: 'l3', history: [], uploadedBy: 'الراصد 2', ...defaultParallelState },
  { id: '5', name: 'إعادة ضبط عزو الشاهد رقم 104', type: 'evidence', date: '2023-10-16', status: 'موزع للجان', color: 'bg-blue-100 text-blue-800 border-blue-200', currentStage: 'l3', history: [], uploadedBy: 'الراصد 3', ...defaultParallelState, level3_correction_status: 'approved' },
  { id: '6', name: 'تصحيح طبعة كتاب تسهيل الفوائد', type: 'books', date: '2023-10-17', status: 'موزع للجان', color: 'bg-blue-100 text-blue-800 border-blue-200', currentStage: 'l3', history: [], uploadedBy: 'الراصد 4', ...defaultParallelState, level3_review_status: 'approved' },
  { id: '7', name: 'حزمة الشواهد المجمعة (الربع الأول)', type: 'review', date: '2023-10-20', status: 'تم التدقيق', color: 'bg-emerald-100 text-emerald-800 border-emerald-200', currentStage: 'auditor', history: [], uploadedBy: 'الراصد 1', ...defaultParallelState },
  { id: '8', name: 'التحكيم العلمي لملف شواهد مجاز القرآن', type: 'review', date: '2023-10-22', status: 'موزع للجان العليا', color: 'bg-blue-100 text-blue-800 border-blue-200', currentStage: 'l5', history: [], uploadedBy: 'الراصد 2', ...defaultParallelState },
  { id: '9', name: 'المسودة النهائية المعتمدة لشواهد الجزء الأول', type: 'books', date: '2023-10-25', status: 'موزع للجان العليا', color: 'bg-blue-100 text-blue-800 border-blue-200', currentStage: 'l5', history: [], uploadedBy: 'الراصد 4', ...defaultParallelState, level5_final_status: 'approved' },
  { id: '10', name: 'مجلد المعجم التاريخي (حرف الألف)', type: 'review', date: '2023-11-01', status: 'معتمد', color: 'bg-emerald-100 text-emerald-800 border-emerald-200', currentStage: 'general_supervisor', history: [], uploadedBy: 'الراصد 1', ...defaultParallelState },
];

export function WorkflowProvider({ children }) {
  const [files, setFiles] = useState(() => {
    const saved = localStorage.getItem('sharjah_workflow_files_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_FILES;
      }
    }
    return DEFAULT_FILES;
  });

  useEffect(() => {
    localStorage.setItem('sharjah_workflow_files_v2', JSON.stringify(files));
  }, [files]);

  const uploadFile = (fileObj) => {
    setFiles(prev => [{...fileObj, ...defaultParallelState}, ...prev]);
  };

  const passFile = (id, nextStage) => {
    setFiles(prev => prev.map(f => {
      if (f.id === id) {
        return {
          ...f,
          currentStage: nextStage,
          status: nextStage === 'l3' || nextStage === 'l5' ? 'موزع للجان بالتوازي' : 'مقبول وتم التمرير',
          color: nextStage === 'l3' || nextStage === 'l5' ? 'bg-blue-100 text-blue-800 border-blue-200' : 'bg-emerald-100 text-emerald-800 border-emerald-200'
        };
      }
      return f;
    }));
  };

  const returnFile = (id, prevStage, reason) => {
    setFiles(prev => prev.map(f => {
      if (f.id === id) {
        return {
          ...f,
          currentStage: prevStage,
          status: 'محتاج تعديل',
          color: 'bg-rose-50 text-rose-600 border-rose-100',
          history: [{ action: 'reject', reason }, ...f.history],
          ...defaultParallelState // Reset parallel statuses on return
        };
      }
      return f;
    }));
  };

  const passParallelFile = (id, level, committee) => {
    setFiles(prev => prev.map(f => {
      if (f.id !== id) return f;
      
      let next = { ...f };
      
      if (level === 'l3') {
        if (committee === 'review') next.level3_review_status = 'approved';
        if (committee === 'correction') next.level3_correction_status = 'approved';
        
        // Auto-advance if both are approved
        if (next.level3_review_status === 'approved' && next.level3_correction_status === 'approved') {
          next.currentStage = 'auditor';
          next.status = 'مكتمل وتم تمريره للتدقيق';
          next.color = 'bg-emerald-100 text-emerald-800 border-emerald-200';
        }
      } else if (level === 'l5') {
        if (committee === 'scientific') next.level5_scientific_status = 'approved';
        if (committee === 'final') next.level5_final_status = 'approved';
        
        // Auto-advance if both are approved
        if (next.level5_scientific_status === 'approved' && next.level5_final_status === 'approved') {
          next.currentStage = 'general_supervisor';
          next.status = 'معتمد ونهائي';
          next.color = 'bg-emerald-100 text-emerald-800 border-emerald-200';
        }
      }
      
      return next;
    }));
  };

  const rejectParallelFile = (id, level, committee, reason) => {
    setFiles(prev => prev.map(f => {
      if (f.id !== id) return f;
      
      const prevStage = level === 'l3' ? 'coordinator' : 'auditor';
      
      return {
        ...f,
        currentStage: prevStage,
        status: `مرفوض من ${committee === 'review' || committee === 'scientific' ? 'اللجنة الأولى' : 'اللجنة الثانية'}`,
        color: 'bg-rose-50 text-rose-600 border-rose-100',
        history: [{ action: 'reject', reason }, ...f.history],
        ...defaultParallelState // Reset ALL parallel statuses back to pending
      };
    }));
  };

  const resetWorkflow = () => {
    setFiles(DEFAULT_FILES);
    localStorage.setItem('sharjah_workflow_files_v2', JSON.stringify(DEFAULT_FILES));
  };

  return (
    <WorkflowContext.Provider value={{ files, uploadFile, passFile, returnFile, passParallelFile, rejectParallelFile, resetWorkflow }}>
      {children}
    </WorkflowContext.Provider>
  );
}
