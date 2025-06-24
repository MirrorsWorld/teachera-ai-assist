import { useState, useRef, useEffect } from "react";
import { Copy, Code, Eye } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import useHtmlStore from '@/store/store';
const HtmlContent = () => {
  // 从 store 获取状态和方法
  const { htmlCode, reset } = useHtmlStore();
  const [showHtmlSource, setShowHtmlSource] = useState(false);

  const toggleHtmlSource = () => {
    setShowHtmlSource(!showHtmlSource);
  };

  return (
    <div className="h-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-600">生成内容:</span>
        <div className="flex gap-1">
          <button
            onClick={() => {
              navigator.clipboard.writeText(htmlCode);
              toast({ title: '已复制到剪贴板', description: '内容已复制' });
            }}
            className="p-1 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-700"
            title="复制内容"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={() => toggleHtmlSource()}
            className="p-1 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-700"
            title={htmlCode ? "查看渲染结果" : "查看HTML源码"}
          >
            {htmlCode ? <Eye className="w-4 h-4" /> : <Code className="w-4 h-4" />}
          </button>
        </div>
      </div>
      {showHtmlSource ? (
        <pre className="bg-gray-800 text-green-400 p-3 rounded text-sm h-[calc(100vh-150px)] overflow-x-auto overflow-y-auto">
          <div className="w-[500px]">{htmlCode}</div>
        </pre>
      ) : (
        <iframe
          srcDoc={htmlCode}
          className="border rounded-lg w-full lg:h-[calc(100vh-150px)]"
          sandbox="allow-scripts allow-same-origin"
        />
      )}
    </div>
    
  );
};

export default HtmlContent;

