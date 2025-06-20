// import { useState, useRef, useEffect } from "react";
// import { Copy, Code, Eye } from "lucide-react";
// import { toast } from "@/hooks/use-toast";

// const HtmlContent = ({htmlCode}) => {

//   const [showHtmlSource, setShowHtmlSource] = useState(false);

//   const toggleHtmlSource = () => {
//     setShowHtmlSource(!showHtmlSource);
//   };

//   return (
//     <div className="flex items-center justify-between mb-2">
//       <span className="text-sm font-medium text-gray-600">生成内容:</span>
//       <div className="flex gap-1">
//         <button
//           onClick={() => {
//             navigator.clipboard.writeText(htmlCode);
//             toast({ title: '已复制到剪贴板', description: '内容已复制' });
//           }}
//           className="p-1 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-700"
//           title="复制内容"
//         >
//           <Copy className="w-4 h-4" />
//         </button>
//         <button
//           onClick={() => toggleHtmlSource(message.id)}
//           className="p-1 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-700"
//           title={showHtmlSource[message.id] ? "查看渲染结果" : "查看HTML源码"}
//         >
//           {showHtmlSource[message.id] ? <Eye className="w-4 h-4" /> : <Code className="w-4 h-4" />}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default HtmlContent;

