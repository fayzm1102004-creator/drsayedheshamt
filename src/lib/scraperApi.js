export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5178';

export async function searchShamela(keyword) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/scraper/search?keyword=${encodeURIComponent(keyword)}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('تعذر العثور على الخادم الخلفي (API). يرجى التأكد من تشغيله.');
      }
      throw new Error(`خطأ في الاتصال: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.errorMessage || 'حدث خطأ غير معروف أثناء البحث.');
    }

    return data;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
      throw new Error('تعذر الاتصال بخادم البحث. تأكد من تشغيل الخادم الخلفي (C# API) على المنفذ 5178.');
    }
    throw error;
  }
}
