import { create } from 'zustand';

interface HtmlState {
  htmlCode: string[];
  reset: (newHtml: string) => void;
  clear: () => void;
  getLatest: () => string;
  debug: () => void;
  subscribe: (callback: (state: HtmlState) => void) => () => void;
}

const useHtmlStore = create<HtmlState>((set, get) => ({
  // 初始状态
  htmlCode: [],
  
  // reset 方法 - 往数组后添加新的 HTML 字符串
  reset: (newHtml: string) => {
    set((state) => ({ 
      htmlCode: [...state.htmlCode, newHtml] 
    }));
    // console.log('Store reset completed, new length:', get().htmlCode.length);
  },
  
  // clear 方法 - 清空数组
  clear: () => {
    // console.log('Store clear called');
    set({ htmlCode: [] });
  },
  
  // getLatest 方法 - 获取最新的HTML内容
  getLatest: () => {
    const state = get();
    return state.htmlCode.length > 0 ? state.htmlCode[state.htmlCode.length - 1] : '';
  },
  
  // debug 方法 - 调试用，显示store中的所有HTML内容
  debug: () => {
    const state = get();
    // console.log('=== Store Debug ===');
    // console.log('数组长度:', state.htmlCode.length);
    // console.log('所有HTML内容:');
    state.htmlCode.forEach((html, index) => {
    //   console.log(`[${index}] 长度: ${html.length}, 前100字符: ${html.substring(0, 100)}...`);
    });
  },
  
  // subscribe 方法 - 监听store变化
  subscribe: (callback) => {
    return useHtmlStore.subscribe(callback);
  },
}));

export default useHtmlStore;