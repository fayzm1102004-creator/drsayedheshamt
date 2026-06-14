import React, { createContext, useContext, useState, useEffect } from 'react';

const WorkflowContext = createContext();

export function useWorkflow() {
  return useContext(WorkflowContext);
}

const DEFAULT_FILES = [
  { id: '1', name: 'شواهد_سورة_البقرة.xlsx', type: 'review', date: '2023-10-15', status: 'قيد المراجعة', color: 'bg-amber-100 text-amber-800 border-amber-200', currentStage: 'coordinator', history: [], uploadedBy: 'الراصد 1' },
  { id: '2', name: 'ألفاظ_غريب_القرآن.xlsx', type: 'review', date: '2023-10-12', status: 'محتاج تعديل', color: 'bg-rose-50 text-rose-600 border-rose-100', currentStage: 'observer', history: [{ action: 'reject', reason: 'يوجد خطأ في المنهجية المتبعة.' }], uploadedBy: 'الراصد 1' },
  { id: '3', name: 'جذور_حرف_الألف.xlsx', type: 'evidence', date: '2023-10-10', status: 'ملف صحيح', color: 'bg-emerald-100 text-emerald-800 border-emerald-200', currentStage: 'coordinator', history: [], uploadedBy: 'الراصد 1' },
  { id: '4', name: 'تحليل الشاهد النحوي لقوله تعالى', type: 'review', date: '2023-10-14', status: 'قيد المراجعة', color: 'bg-amber-100 text-amber-800 border-amber-200', currentStage: 'l3_review', history: [], uploadedBy: 'الراصد 2' },
  { id: '5', name: 'إعادة ضبط عزو الشاهد رقم 104', type: 'evidence', date: '2023-10-16', status: 'تم التعديل', color: 'bg-blue-100 text-blue-800 border-blue-200', currentStage: 'main_coordinator', history: [], uploadedBy: 'الراصد 3' },
  { id: '6', name: 'تصحيح طبعة كتاب تسهيل الفوائد', type: 'books', date: '2023-10-17', status: 'تم الاستدراك', color: 'bg-emerald-100 text-emerald-800 border-emerald-200', currentStage: 'l3_books', history: [], uploadedBy: 'الراصد 4' },
  { id: '7', name: 'حزمة الشواهد المجمعة (الربع الأول)', type: 'review', date: '2023-10-20', status: 'تم التدقيق', color: 'bg-emerald-100 text-emerald-800 border-emerald-200', currentStage: 'auditor', history: [], uploadedBy: 'الراصد 1' },
  { id: '8', name: 'التحكيم العلمي لملف شواهد مجاز القرآن', type: 'review', date: '2023-10-22', status: 'مقبول علمياً', color: 'bg-emerald-100 text-emerald-800 border-emerald-200', currentStage: 'l5_scientific', history: [], uploadedBy: 'الراصد 2' },
  { id: '9', name: 'المسودة النهائية المعتمدة لشواهد الجزء الأول', type: 'books', date: '2023-10-25', status: 'جاهز للاعتماد النهائي', color: 'bg-emerald-100 text-emerald-800 border-emerald-200', currentStage: 'l5_approval', history: [], uploadedBy: 'الراصد 4' },
  { id: '10', name: 'مجلد المعجم التاريخي (حرف الألف)', type: 'review', date: '2023-11-01', status: 'معتمد', color: 'bg-emerald-100 text-emerald-800 border-emerald-200', currentStage: 'general_supervisor', history: [], uploadedBy: 'الراصد 1' },
];

export function WorkflowProvider({ children }) {
  const [files, setFiles] = useState(() => {
    const saved = localStorage.getItem('sharjah_workflow_files');
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
    localStorage.setItem('sharjah_workflow_files', JSON.stringify(files));
  }, [files]);

  const uploadFile = (fileObj) => {
    setFiles(prev => [fileObj, ...prev]);
  };

  const passFile = (id, nextStage) => {
    setFiles(prev => prev.map(f => {
      if (f.id === id) {
        return {
          ...f,
          currentStage: nextStage,
          status: 'مقبول وتم التمرير',
          color: 'bg-emerald-100 text-emerald-800 border-emerald-200'
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
          history: [{ action: 'reject', reason }, ...f.history]
        };
      }
      return f;
    }));
  };

  const resetWorkflow = () => {
    setFiles(DEFAULT_FILES);
    localStorage.setItem('sharjah_workflow_files', JSON.stringify(DEFAULT_FILES));
  };

  return (
    <WorkflowContext.Provider value={{ files, uploadFile, passFile, returnFile, resetWorkflow }}>
      {children}
    </WorkflowContext.Provider>
  );
}
