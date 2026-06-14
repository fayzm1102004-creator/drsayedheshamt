import React, { createContext, useContext, useState, useEffect } from 'react';

const WorkflowContext = createContext();

export function useWorkflow() {
  return useContext(WorkflowContext);
}

const defaultParallelState = {
  level2_status: 'pending',
  level3_review_status: 'pending',
  level3_correction_status: 'pending',
  level4_status: 'pending',
  level5_scientific_status: 'pending',
  level5_final_status: 'pending',
};

const DEFAULT_FILES = [
  { id: '1', name: 'شواهد_سورة_البقرة.xlsx', type: 'review', date: '2023-10-15', status: 'قيد المراجعة', color: 'bg-amber-100 text-amber-800 border-amber-200', currentStage: 'coordinator', history: [], uploadedBy: 'الراصد 1', ...defaultParallelState },
  { id: '2', name: 'ألفاظ_غريب_القرآن.xlsx', type: 'review', date: '2023-10-12', status: 'محتاج تعديل', color: 'bg-rose-50 text-rose-600 border-rose-100', currentStage: 'observer', history: [{ action: 'reject', reason: 'يوجد خطأ في المنهجية المتبعة.' }], uploadedBy: 'الراصد 1', ...defaultParallelState, level2_status: 'rejected' },
  { id: '3', name: 'جذور_حرف_الألف.xlsx', type: 'evidence', date: '2023-10-10', status: 'ملف صحيح', color: 'bg-emerald-100 text-emerald-800 border-emerald-200', currentStage: 'coordinator', history: [], uploadedBy: 'الراصد 1', ...defaultParallelState },
  { id: '4', name: 'تحليل الشاهد النحوي لقوله تعالى', type: 'review', date: '2023-10-14', status: 'موزع للجان', color: 'bg-blue-100 text-blue-800 border-blue-200', currentStage: 'l3', history: [], uploadedBy: 'الراصد 2', ...defaultParallelState, level2_status: 'approved' },
  { id: '5', name: 'إعادة ضبط عزو الشاهد رقم 104', type: 'evidence', date: '2023-10-16', status: 'موزع للجان', color: 'bg-blue-100 text-blue-800 border-blue-200', currentStage: 'l3', history: [], uploadedBy: 'الراصد 3', ...defaultParallelState, level2_status: 'approved', level3_correction_status: 'approved' },
  { id: '6', name: 'تصحيح طبعة كتاب تسهيل الفوائد', type: 'books', date: '2023-10-17', status: 'موزع للجان', color: 'bg-blue-100 text-blue-800 border-blue-200', currentStage: 'l3', history: [], uploadedBy: 'الراصد 4', ...defaultParallelState, level2_status: 'approved', level3_review_status: 'approved' },
  { id: '7', name: 'حزمة الشواهد المجمعة (الربع الأول)', type: 'review', date: '2023-10-20', status: 'تم التدقيق', color: 'bg-emerald-100 text-emerald-800 border-emerald-200', currentStage: 'auditor', history: [], uploadedBy: 'الراصد 1', ...defaultParallelState, level2_status: 'approved', level3_review_status: 'approved', level3_correction_status: 'approved' },
  { id: '8', name: 'التحكيم العلمي لملف شواهد مجاز القرآن', type: 'review', date: '2023-10-22', status: 'موزع للجان العليا', color: 'bg-blue-100 text-blue-800 border-blue-200', currentStage: 'l5', history: [], uploadedBy: 'الراصد 2', ...defaultParallelState, level2_status: 'approved', level3_review_status: 'approved', level3_correction_status: 'approved', level4_status: 'approved' },
  { id: '9', name: 'المسودة النهائية المعتمدة لشواهد الجزء الأول', type: 'books', date: '2023-10-25', status: 'موزع للجان العليا', color: 'bg-blue-100 text-blue-800 border-blue-200', currentStage: 'l5', history: [], uploadedBy: 'الراصد 4', ...defaultParallelState, level2_status: 'approved', level3_review_status: 'approved', level3_correction_status: 'approved', level4_status: 'approved', level5_final_status: 'approved' },
  { id: '10', name: 'مجلد المعجم التاريخي (حرف الألف)', type: 'review', date: '2023-11-01', status: 'معتمد', color: 'bg-emerald-100 text-emerald-800 border-emerald-200', currentStage: 'general_supervisor', history: [], uploadedBy: 'الراصد 1', ...defaultParallelState, level2_status: 'approved', level3_review_status: 'approved', level3_correction_status: 'approved', level4_status: 'approved', level5_scientific_status: 'approved', level5_final_status: 'approved' },
];

export function WorkflowProvider({ children }) {
  const [files, setFiles] = useState(() => {
    const saved = localStorage.getItem('sharjah_workflow_files_v3');
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
    localStorage.setItem('sharjah_workflow_files_v3', JSON.stringify(files));
  }, [files]);

  const uploadFile = (fileObj) => {
    setFiles(prev => [{...fileObj, ...defaultParallelState}, ...prev]);
  };

  const passFile = (id, nextStage) => {
    setFiles(prev => prev.map(f => {
      if (f.id === id) {
        let updates = {
          currentStage: nextStage,
          status: nextStage === 'l3' || nextStage === 'l5' ? 'موزع للجان' : 'مقبول وتم التمرير',
          color: nextStage === 'l3' || nextStage === 'l5' ? 'bg-blue-100 text-blue-800 border-blue-200' : 'bg-emerald-100 text-emerald-800 border-emerald-200'
        };

        if (nextStage === 'l3') {
          updates.level2_status = 'approved';
          updates.level3_review_status = 'pending';
          updates.level3_correction_status = 'pending';
        } else if (nextStage === 'l5') {
          updates.level4_status = 'approved';
          updates.level5_scientific_status = 'pending';
          updates.level5_final_status = 'pending';
        }

        return { ...f, ...updates };
      }
      return f;
    }));
  };

  const returnFile = (id, prevStage, reason, rejectingStage) => {
    setFiles(prev => prev.map(f => {
      if (f.id === id) {
        let updates = {
          currentStage: prevStage,
          status: 'محتاج تعديل',
          color: 'bg-rose-50 text-rose-600 border-rose-100',
          history: [{ action: 'reject', reason }, ...f.history]
        };

        if (rejectingStage === 'coordinator') updates.level2_status = 'rejected';
        if (rejectingStage === 'auditor') updates.level4_status = 'rejected';

        return { ...f, ...updates };
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
        
        if (next.level3_review_status === 'approved' && next.level3_correction_status === 'approved') {
          next.currentStage = 'auditor';
          next.status = 'مكتمل وتم تمريره للتدقيق';
          next.color = 'bg-emerald-100 text-emerald-800 border-emerald-200';
          next.level4_status = 'pending'; // Reset auditor status for new arrival
        }
      } else if (level === 'l5') {
        if (committee === 'scientific') next.level5_scientific_status = 'approved';
        if (committee === 'final') next.level5_final_status = 'approved';
        
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
      
      let updates = {
        currentStage: prevStage,
        status: `مرفوض من ${committee === 'review' || committee === 'scientific' ? 'اللجنة الأولى' : 'اللجنة الثانية'}`,
        color: 'bg-rose-50 text-rose-600 border-rose-100',
        history: [{ action: 'reject', reason }, ...f.history]
      };

      if (level === 'l3') {
        if (committee === 'review') updates.level3_review_status = 'rejected';
        if (committee === 'correction') updates.level3_correction_status = 'rejected';
        // DO NOT reset the other committee's status. It stays pending or approved.
        updates.level2_status = 'pending'; // So coordinator can re-process
      } else if (level === 'l5') {
        if (committee === 'scientific') updates.level5_scientific_status = 'rejected';
        if (committee === 'final') updates.level5_final_status = 'rejected';
        updates.level4_status = 'pending'; // So auditor can re-process
      }

      return { ...f, ...updates };
    }));
  };

  const resetWorkflow = () => {
    setFiles(DEFAULT_FILES);
    localStorage.setItem('sharjah_workflow_files_v3', JSON.stringify(DEFAULT_FILES));
  };

  return (
    <WorkflowContext.Provider value={{ files, uploadFile, passFile, returnFile, passParallelFile, rejectParallelFile, resetWorkflow }}>
      {children}
    </WorkflowContext.Provider>
  );
}
