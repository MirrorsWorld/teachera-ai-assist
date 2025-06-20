import { create } from 'zustand';

interface HtmlState {
  htmlCode: string;
  reset: (newHtml: string) => void;
}

const useHtmlStore = create<HtmlState>((set) => ({
  // 初始状态
  htmlCode: '<div>Initial HTML</div>',
  
  // reset 方法 - 用新 HTML 字符串覆盖当前状态
  reset: (newHtml: string) => set({ htmlCode: newHtml }),
}));

export default useHtmlStore;