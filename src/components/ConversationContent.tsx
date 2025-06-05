import { useState, useRef, useEffect } from "react";
import { Heart, Trash2, MoreVertical, Send, Upload, Image, Code, Eye } from "lucide-react";
interface Message {
  id: number;
  type: 'user' | 'assistant';
  content: string;
  timestamp: string;
  image?: string;
  htmlContent?: string; // 添加HTML内容支持
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
  const [newMessage, setNewMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showHtmlSource, setShowHtmlSource] = useState<{ [key: number]: boolean }>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 模拟对话消息数据
  const [messages, setMessages] = useState<Message[]>([
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
      timestamp: '14:31',
      htmlContent: `
        <div style="background: linear-gradient(135deg, #f5f7ff 0%, #eef0f9 100%); padding: 20px; border-radius: 12px; margin: 10px 0;">
          <h3 style="color: #4361ee; margin-bottom: 15px;">二次函数的基本性质</h3>
          <div style="background: white; padding: 15px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <p style="margin-bottom: 10px;"><strong>一般形式：</strong> f(x) = ax² + bx + c (a ≠ 0)</p>
            <ul style="margin-left: 20px; line-height: 1.6;">
              <li><strong>开口方向：</strong>当a > 0时开口向上，当a < 0时开口向下</li>
              <li><strong>对称轴：</strong>x = -b/(2a)</li>
              <li><strong>顶点坐标：</strong>(-b/(2a), (4ac-b²)/(4a))</li>
              <li><strong>最值：</strong>当a > 0时有最小值，当a < 0时有最大值</li>
            </ul>
          </div>
        </div>
      `
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
      content: '当然可以！让我们看一个具体例子：f(x) = 2x² - 4x + 1',
      timestamp: '14:33',
      htmlContent: `
        <div style="background: linear-gradient(135deg, #f5f7ff 0%, #eef0f9 100%); padding: 20px; border-radius: 12px; margin: 10px 0;">
          <h3 style="color: #4361ee; margin-bottom: 15px;">具体例子：f(x) = 2x² - 4x + 1</h3>
          <div style="background: white; padding: 15px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
              <div>
                <h4 style="color: #3f37c9; margin-bottom: 10px;">分析过程：</h4>
                <ul style="line-height: 1.8;">
                  <li>a = 2 > 0，开口向上</li>
                  <li>对称轴：x = -(-4)/(2×2) = 1</li>
                  <li>顶点：(1, -1)</li>
                  <li>最小值：-1</li>
                </ul>
              </div>
              <div style="background: #f8f9ff; padding: 10px; border-radius: 6px;">
                <h4 style="color: #3f37c9; margin-bottom: 10px;">图像特征：</h4>
                <p style="margin: 0; line-height: 1.6;">开口向上的抛物线<br/>顶点在(1, -1)处<br/>在x=1处取得最小值</p>
              </div>
            </div>
          </div>
        </div>
      `
    }
  ]);

  // 自动滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleDelete = () => {
    if (window.confirm('确定要删除这个对话吗？')) {
      onDelete(conversationId);
    }
    setShowActions(false);
  };

  const handleFavorite = () => {
    onFavorite(conversationId);
    setShowActions(false);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() || selectedImage) {
      const message: Message = {
        id: messages.length + 1,
        type: 'user',
        content: newMessage.trim(),
        timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        image: selectedImage || undefined
      };
      
      setMessages(prev => [...prev, message]);
      setNewMessage("");
      setSelectedImage(null);
      
      // 模拟AI回复
      setTimeout(() => {
        const aiReply: Message = {
          id: messages.length + 2,
          type: 'assistant',
          content: '我理解了您的问题，让我来为您详细解答...',
          timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
          htmlContent: `
            <div style="background: linear-gradient(135deg, #f5f7ff 0%, #eef0f9 100%); padding: 20px; border-radius: 12px; margin: 10px 0;">
              <h3 style="color: #4361ee; margin-bottom: 15px;">AI生成的可视化内容</h3>
              <div style="background: white; padding: 15px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <p style="margin-bottom: 10px;">这是一个示例HTML渲染结果，包含了格式化的内容展示。</p>
                <div style="background: #e3f2fd; padding: 10px; border-left: 4px solid #2196f3; margin: 10px 0;">
                  <strong>提示：</strong> 您可以点击代码图标查看HTML源代码
                </div>
              </div>
            </div>
          `
        };
        setMessages(prev => [...prev, aiReply]);
      }, 1000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const toggleHtmlSource = (messageId: number) => {
    setShowHtmlSource(prev => ({
      ...prev,
      [messageId]: !prev[messageId]
    }));
  };

  return (
    <div className="flex flex-col h-full">
      {/* 对话标题和操作按钮 */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white rounded-t-xl">
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
                className={`w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-gray-50 rounded-t-lg ${
                  isFavorited ? 'text-red-500' : 'text-gray-700'
                }`}
              >
                <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
                {isFavorited ? '取消收藏' : '收藏'}
              </button>
              <button
                onClick={handleDelete}
                className="w-full px-4 py-2 text-left flex items-center gap-2 text-red-600 hover:bg-gray-50 rounded-b-lg"
              >
                <Trash2 className="w-4 h-4" />
                删除
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 对话内容 */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
              <div className={`p-4 rounded-lg ${
                message.type === 'user' 
                  ? 'bg-primary text-white ml-auto' 
                  : 'bg-white text-gray-900 shadow-sm'
              }`}>
                {message.image && (
                  <img 
                    src={message.image} 
                    alt="上传的图片" 
                    className="max-w-full h-auto rounded-lg mb-2"
                  />
                )}
                
                {/* HTML内容渲染或源码显示 */}
                {message.htmlContent && message.type === 'assistant' && (
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-600">生成内容:</span>
                      <div className="flex gap-1">
                        <button
                          onClick={() => toggleHtmlSource(message.id)}
                          className="p-1 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                          title={showHtmlSource[message.id] ? "查看渲染结果" : "查看HTML源码"}
                        >
                          {showHtmlSource[message.id] ? <Eye className="w-4 h-4" /> : <Code className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    
                    {showHtmlSource[message.id] ? (
                      <pre className="bg-gray-800 text-green-400 p-3 rounded text-sm overflow-x-auto w-[600px]">
                        <code>{message.htmlContent}</code>
                      </pre>
                    ) : (
                      <div 
                        className="border rounded-lg overflow-hidden w-[600px]"
                        dangerouslySetInnerHTML={{ __html: message.htmlContent }}
                      />
                    )}
                  </div>
                )}
                
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
        <div ref={messagesEndRef} />
      </div>

      {/* 输入区域 */}
      <div className="p-6 border-t border-gray-200 bg-white rounded-b-xl">
        {selectedImage && (
          <div className="mb-4 relative inline-block">
            <img 
              src={selectedImage} 
              alt="准备发送的图片" 
              className="max-h-20 rounded-lg"
            />
            <button
              onClick={removeSelectedImage}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
            >
              ×
            </button>
          </div>
        )}
        
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="继续对话..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none min-h-[48px] max-h-32"
              rows={1}
            />
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-3 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors"
            title="上传图片"
          >
            <Image className="w-5 h-5" />
          </button>
          
          <button 
            onClick={handleSendMessage}
            disabled={!newMessage.trim() && !selectedImage}
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            发送
          </button>
        </div>
        
        <p className="text-xs text-gray-500 mt-2">
          支持上传图片，按 Enter 发送，Shift + Enter 换行
        </p>
      </div>
    </div>
  );
};

export default ConversationContent;