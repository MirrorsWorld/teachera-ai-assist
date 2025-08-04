import { useState, useEffect } from "react";
import { Copy, Code, Eye, X, Download, CopyPlus } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import useHtmlStore from '@/store/store';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface HtmlContentProps {
  onClose?: () => void // 新增关闭回调
}

const HtmlContent = ({ onClose }: HtmlContentProps) => {
  // 从store获取状态和方法
  const { htmlCode } = useHtmlStore()
  const [showHtmlSource, setShowHtmlSource] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState<string>("0") // 当前选中的HTML索引

  // 获取最新的HTML内容（数组中的最后一个元素）
  console.log(htmlCode);
  
  // 获取当前选中的HTML内容
  const currentHtmlCode = htmlCode.length > 0 ? htmlCode[Number(selectedIndex)] : ''
  
  const toggleHtmlSource = () => {
    setShowHtmlSource(!showHtmlSource)
  }

  // 当有新的HTML内容时，自动选择最新的
  useEffect(() => {
    if (htmlCode.length > 0) {
      setSelectedIndex(String(htmlCode.length - 1))
    }
  }, [htmlCode.length])

  return (
    <div className="flex flex-col h-full">
      {/* 头部工具栏 - 添加关闭按钮 */}
      <div className="flex items-center justify-between p-4 border-gray-200">
        <div className="flex items-center gap-3">
          {/* HTML选择器 */}
          {htmlCode.length > 1 && (
            <Select value={selectedIndex} onValueChange={setSelectedIndex}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="选择文件" />
              </SelectTrigger>
              <SelectContent>
                {htmlCode.map((_, index) => (
                  <SelectItem key={index} value={String(index)}>
                    文件 {index + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          
          <span className="text-sm font-medium text-gray-600">
            生成内容: {htmlCode.length > 0 ? `(${htmlCode.length} 个文件)` : ''}
          </span>
        </div>
        
        <div className="flex gap-1">
          <button
            onClick={() => {
              navigator.clipboard.writeText(currentHtmlCode)
              toast({ title: "已复制到剪贴板", description: "内容已复制" })
            }}
            className="p-1 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-700"
            title="复制内容"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={() => toggleHtmlSource()}
            className="p-1 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-700"
            title={showHtmlSource ? "查看渲染结果" : "查看HTML源码"}
          >
            {showHtmlSource ? <Eye className="w-4 h-4" /> : <Code className="w-4 h-4" />}
          </button>
          <button
            onClick={() => {
              const blob = new Blob([currentHtmlCode], { type: 'text/html' })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = `generated_${Number(selectedIndex) + 1}.html`
              a.click()
              URL.revokeObjectURL(url)
            }}
            className="p-1 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-700"
            title="下载 HTML 文件"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              // 新窗口打开功能
              const blob = new Blob([currentHtmlCode], { type: 'text/html' })
              const url = URL.createObjectURL(blob)
              window.open(url, '_blank')
              // 可选：不立即revoke，避免新窗口加载失败
              setTimeout(() => URL.revokeObjectURL(url), 10000)
            }}
            className="p-1 rounded hover:bg-gray-100 text-gray-500 hover:text-blue-700"
            title="在新窗口打开"
          >
            <CopyPlus className="w-4 h-4" />
          </button>

          {/* 新增关闭按钮 */}
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded hover:bg-red-100 text-gray-500 hover:text-red-600"
              title="关闭预览"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 p-4 overflow-hidden pt-0">
        {!currentHtmlCode ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <Code className="w-12 h-12 mx-auto mb-4 opacity-50" />
              {/* <p className="text-sm">暂无HTML内容</p>
              <p className="text-xs mt-1">当AI生成HTML内容时，将在此处显示预览</p> */}
            </div>
          </div>
        ) : showHtmlSource ? (
          <pre className="bg-gray-800 text-green-400 p-4 rounded-lg text-sm overflow-auto h-full">
            <code>{currentHtmlCode}</code>
          </pre>
        ) : (
          <iframe
            srcDoc={currentHtmlCode}
            className="w-full h-full border rounded-lg"
            sandbox="allow-scripts allow-same-origin"
          />
        )}
      </div>
    </div>
  );
};

export default HtmlContent;
