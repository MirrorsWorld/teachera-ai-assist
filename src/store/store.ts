import { create } from 'zustand';

interface HtmlState {
  htmlCode: string[];
  reset: (newHtml: string) => void;
  clear: () => void;
  getLatest: () => string;
}

const useHtmlStore = create<HtmlState>((set, get) => ({
  // 初始状态
  htmlCode: [],
  
  // 往数组后添加新的 HTML 字符串
  reset: (newHtml: string) => {
    set((state) => ({ 
      htmlCode: [...state.htmlCode, newHtml] 
    }));
  },
  
  // 清空数组
  clear: () => {
    console.log('Store clear called');
    set({ htmlCode: [] });
  },
  
  // 获取最新的HTML内容
  getLatest: () => {
    const state = get();
    return state.htmlCode.length > 0 ? state.htmlCode[state.htmlCode.length - 1] : '';
  },

}));

export default useHtmlStore;