
import { useState } from "react";
import { Heart, Trash2, MoreVertical } from "lucide-react";

interface Message {
  id: number;
  type: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface ConversationContentProps {
  conversationId: number;
  title: string;
  onDelete: (id: number) => void;
  onFavorite: (id: number) => void;
  isFavorited: boolean;
}

const ConversationContent = ({ 
  conversationId, 
  title, 
  onDelete, 
  onFavorite, 
  isFavorited 
}: ConversationContentProps) => {
  const [showActions, setShowActions] = useState(false);
  
  // 模拟对话消息数据
  const [messages] = useState<Message[]>([
    {
      id: 1,
      type: 'user',
      content: '请帮我讲解二次函数的基本性质',
      timestamp: '14:30'
    },
    {
      id: 2,
      type: 'assistant',
      content: '好的，我们来复习一下二次函数的基本性质。二次函数的一般形式是 f(x) = ax² + bx + c (a ≠ 0)。\n\n主要性质包括：\n1. 开口方向：当a > 0时开口向上，当a < 0时开口向下\n2. 对称轴：x = -b/(2a)\n3. 顶点坐标：(-b/(2a), (4ac-b²)/(4a))\n4. 最值：当a > 0时有最小值，当a < 0时有最大值',
      timestamp: '14:31'
    },
    {
      id: 3,
      type: 'user',
      content: '能给我一个具体的例子吗？',
      timestamp: '14:32'
    },
    {
      id: 4,
      type: 'assistant',
      content: '当然可以！让我们看一个具体例子：f(x) = 2x² - 4x + 1\n\n分析这个函数：\n• a = 2 > 0，所以开口向上\n• 对称轴：x = -(-4)/(2×2) = 1\n• 顶点坐标：(1, 2×1² - 4×1 + 1) = (1, -1)\n• 因为a > 0，所以函数有最小值-1\n\n这个函数的图像是一个开口向上的抛物线，顶点在(1, -1)处。',
      timestamp: '14:33'
    }
  ]);

  const handleDelete = () => {
    if (window.confirm('确定要删除这个对话吗？')) {
      onDelete(conversationId);
    }
  };

  const handleFavorite = () => {
    onFavorite(conversationId);
  };

  return (
    <div className="flex flex-col h-full">
      {/* 对话标题和操作按钮 */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <div className="relative">
          <button
            onClick={() => setShowActions(!showActions)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
          
          {showActions && (
            <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-10 min-w-[120px]">
              <button
                onClick={handleFavorite}
                className={`w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-gray-50 ${
                  isFavorited ? 'text-red-500' : 'text-gray-700'
                }`}
              >
                <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
                {isFavorited ? '取消收藏' : '收藏'}
              </button>
              <button
                onClick={handleDelete}
                className="w-full px-4 py-2 text-left flex items-center gap-2 text-red-600 hover:bg-gray-50"
              >
                <Trash2 className="w-4 h-4" />
                删除
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 对话内容 */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
              <div className={`p-4 rounded-lg ${
                message.type === 'user' 
                  ? 'bg-primary text-white ml-auto' 
                  : 'bg-gray-100 text-gray-900'
              }`}>
                <div className="whitespace-pre-wrap">{message.content}</div>
              </div>
              <div className={`text-xs text-gray-500 mt-1 ${
                message.type === 'user' ? 'text-right' : 'text-left'
              }`}>
                {message.timestamp}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 输入区域 */}
      <div className="p-6 border-t border-gray-200">
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="继续对话..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
          />
          <button className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors">
            发送
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConversationContent;
