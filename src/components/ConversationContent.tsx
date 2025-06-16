import { useState, useRef, useEffect } from "react";
import { Heart, Trash2, MoreVertical, Send, Upload, Image, Code, Eye, Loader2 } from "lucide-react";
import { getMessageList, chat, ConversationContentProps, MessageData } from '../api/chat'
import { ConversationData, getConversationList } from "@/api/conversation";
import { ScrollArea } from "./ui/scroll-area";
import { toast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import remarkGfm from "remark-gfm"

const test_data: MessageData[] = [
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
    <!DOCTYPE html>
    <html lang="zh-CN">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>函数图像分析工具</title>
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
        <style>
            body {
                font-family: 'Roboto', sans-serif;
                margin: 0;
                padding: 20px;
                display: flex;
                flex-direction: column;
                background-color: #f5f5f5;
            }
            
            .container {
                display: flex;
                gap: 20px;
                max-width: 1200px;
                margin: 0 auto;
            }
            
            .ggb-container {
                width: 800px;
                height: 600px;
                background-color: white;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            
            .control-panel {
                flex: 1;
                background-color: white;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
    
            h1 {
                color: #333;
                margin-bottom: 20px;
            }
    
            .control-group {
                margin-bottom: 20px;
            }
    
            .control-group h3 {
                margin-top: 0;
                color: #444;
                border-bottom: 1px solid #eee;
                padding-bottom: 8px;
            }
    
            button {
                background-color: #4CAF50;
                color: white;
                border: none;
                padding: 10px 15px;
                margin: 5px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
                transition: background-color 0.3s;
            }
    
            button:hover {
                background-color: #45a049;
            }
    
            button.toggle {
                background-color: #2196F3;
            }
    
            button.toggle:hover {
                background-color: #0b7dda;
            }
    
            button.reset {
                background-color: #f44336;
            }
    
            button.reset:hover {
                background-color: #d32f2f;
            }
    
            .slider-container {
                margin: 15px 0;
            }
    
            .slider-container label {
                display: block;
                margin-bottom: 5px;
                font-weight: 500;
            }
    
            input[type="range"] {
                width: 100%;
            }
    
            .value-display {
                font-size: 14px;
                color: #666;
                margin-top: 5px;
            }
        </style>
    </head>
    <body>
        <h1>函数图像分析工具</h1>
        <div class="container">
            <div class="ggb-container" id="ggb-element"></div>
            <div class="control-panel">
                <div class="control-group">
                    <h3>主函数控制</h3>
                    <button id="toggleMainFunction">显示/隐藏主函数</button>
                    <button id="toggleDerivative">显示/隐藏导数函数</button>
                    <button class="reset" id="resetAll">重置所有</button>
                </div>
    
                <div class="control-group">
                    <h3>参数控制</h3>
                    <div class="slider-container">
                        <label for="kSlider">k 值 (0 < k < 1/3)</label>
                        <input type="range" id="kSlider" min="0.01" max="0.33" step="0.01" value="0.1">
                        <div class="value-display">当前值: <span id="kValue">0.1</span></div>
                    </div>
                </div>
    
                <div class="control-group">
                    <h3>点控制</h3>
                    <button id="toggleP1">显示/隐藏极值点 P1</button>
                    <button id="toggleP2">显示/隐藏零点 P2</button>
                </div>
    
                <div class="control-group">
                    <h3>辅助函数控制</h3>
                    <button id="toggleGfunc">显示/隐藏 g_func(x)</button>
                    <button id="toggleGt">显示/隐藏 g_t(t)</button>
                </div>
            </div>
        </div>
    
        <script src="https://cdn.geogebra.org/apps/deployggb.js"></script>
        <script>
            // GeoGebra parameters
            const parameters = {
                "id": "ggbApplet",
                "appName": "classic",
                "width": 800,
                "height": 600,
                "showMenuBar": true,
                "showAlgebraInput": true,
                "showToolBar": true,
                "showToolBarHelp": true,
                "showResetIcon": true,
                "enableLabelDrags": true,
                "enableShiftDragZoom": true,
                "enableRightClick": true,
                "errorDialogsActive": false,
                "useBrowserForJS": false,
                "allowStyleBar": false,
                "preventFocus": false,
                "showZoomButtons": true,
                "capturingThreshold": 3,
                "showFullscreenButton": true,
                "scale": 1,
                "disableAutoScale": false,
                "allowUpscale": false,
                "clickToLoad": false,
                "buttonRounding": 0.7,
                "buttonShadows": false,
                "language": "zh-CN",
                "appletOnLoad": function(api) {
                    window.ggbApp = api;
                    initializeGeoGebra();
                }
            };
    
            // Initialize GeoGebra
            window.addEventListener('load', function() {
                var applet = new GGBApplet(parameters, true);
                applet.inject('ggb-element');
            });
    
            // Initialize GeoGebra objects
            function initializeGeoGebra() {
                // Create slider for k
                ggbApp.evalCommand('k=Slider(0.01,0.33,0.01,1,140,false,true,false,false)');
                ggbApp.evalCommand('SetValue(k,0.1)');
    
                // Main function
                ggbApp.evalCommand('f(x)=ln(1+x)-x+0.5x^2-kx^3');
    
                // Derivative function (hidden by default)
                ggbApp.evalCommand('f_prime(x)=x^2(1/(1+x)-3k)');
                ggbApp.evalCommand('SetVisibleInView(f_prime,1,false)');
                ggbApp.evalCommand('SetLabel(f_prime,"derivative")');
    
                // Helper function g_func (hidden)
                ggbApp.evalCommand('g_func(x)=1/(1+x)-3k');
                ggbApp.evalCommand('SetVisibleInView(g_func,1,false)');
                ggbApp.evalCommand('SetLabel(g_func,"g_function")');
    
                // x1 value (hidden)
                ggbApp.evalCommand('x1_val=1/(3k)-1');
                ggbApp.evalCommand('SetVisibleInView(x1_val,1,false)');
                ggbApp.evalCommand('SetLabel(x1_val,"x1_value")');
    
                // Point P1 (visible)
                ggbApp.evalCommand('P1=(x1_val,f(x1_val))');
                ggbApp.evalCommand('SetLabel(P1,"P1_extreme_point")');
    
                // x2 value (hidden)
                ggbApp.evalCommand('x2_val=NSolve(f(x)=0,x,x1_val+0.1,100)');
                ggbApp.evalCommand('SetVisibleInView(x2_val,1,false)');
                ggbApp.evalCommand('SetLabel(x2_val,"x2_root")');
    
                // Point P2 (visible)
                ggbApp.evalCommand('P2=(x2_val,0)');
                ggbApp.evalCommand('SetLabel(P2,"P2_zero_point")');
    
                // Helper function g_t (hidden)
                ggbApp.evalCommand('g_t(t)=f(x1_val+t)-f(x1_val-t)');
                ggbApp.evalCommand('SetVisibleInView(g_t,1,false)');
                ggbApp.evalCommand('SetLabel(g_t,"g_t_function")');
    
                // Update k value display
                updateKValue();
            }
    
            // UI Controls
            document.getElementById('toggleMainFunction').addEventListener('click', function() {
                const visible = ggbApp.getVisible('f', 1);
                ggbApp.setVisible('f', 1, !visible);
            });
    
            document.getElementById('toggleDerivative').addEventListener('click', function() {
                const visible = ggbApp.getVisible('f_prime', 1);
                ggbApp.setVisible('f_prime', 1, !visible);
            });
    
            document.getElementById('toggleP1').addEventListener('click', function() {
                const visible = ggbApp.getVisible('P1', 1);
                ggbApp.setVisible('P1', 1, !visible);
            });
    
            document.getElementById('toggleP2').addEventListener('click', function() {
                const visible = ggbApp.getVisible('P2', 1);
                ggbApp.setVisible('P2', 1, !visible);
            });
    
            document.getElementById('toggleGfunc').addEventListener('click', function() {
                const visible = ggbApp.getVisible('g_func', 1);
                ggbApp.setVisible('g_func', 1, !visible);
            });
    
            document.getElementById('toggleGt').addEventListener('click', function() {
                const visible = ggbApp.getVisible('g_t', 1);
                ggbApp.setVisible('g_t', 1, !visible);
            });
    
            document.getElementById('resetAll').addEventListener('click', function() {
                ggbApp.reset();
                initializeGeoGebra();
            });
    
            // Slider control for k
            const kSlider = document.getElementById('kSlider');
            kSlider.addEventListener('input', function() {
                const value = parseFloat(this.value).toFixed(2);
                ggbApp.evalCommand('SetValue(k,' + value + ')');
                updateKValue();
    
                // Update dependent objects
                ggbApp.evalCommand('UpdateConstruction()');
            });
    
            function updateKValue() {
                const kValue = ggbApp.getValue('k');
                document.getElementById('kValue').textContent = kValue.toFixed(2);
            }
    
            // Handle window resize
            window.addEventListener('resize', function() {
                if (typeof ggbApp !== 'undefined' && typeof ggbApp.recalculateEnvironments === 'function') {
                    ggbApp.setSize(800, 600);
                }
            });
        </script>
    </body>
    </html>
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
    thinking: '深度思考内容...深度思考内容...深度思考内容...深度思考内容...深度思考内容...深度思考内容...深度思考内容...深度思考内容...',
    content: '当然可以！让我们看一个具体例子：f(x) = 2x² - 4x + 1',
    timestamp: '14:33',
  }
]
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
  const [messages, setMessages] = useState<MessageData[]>(test_data);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);
  // 自动滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // const fetchData = async () => {
    //   if (!conversationId) return;
    //   setMessages([])
    //   try {
    //     var data = await getMessageList(conversationId)
    //     console.info('获取会话消息列表:', data)
    //     if (!data) {
    //       data = []
    //     }
    //     setMessages(data)
    //   } catch (error) {
    //     console.error('获取会话消息列表失败:', error)
    //   } finally {
    //     // setLoading(false)
    //   }
    // }
    // fetchData()
  }, [conversationId])

  const handleDelete = async () => {
    if (window.confirm('确定要删除这个对话吗？')) {
      await onDelete(conversationId);

    }
    setShowActions(false);
  };

  const handleFavorite = () => {
    onFavorite(conversationId);
    setShowActions(false);
  };

  const [abortController, setAbortController] = useState<AbortController | null>(null);

  // 删除重复的handleSendMessage函数
  const handleSend = async () => {
    if (!newMessage.trim() || !conversationId) return;

    setNewMessage("");
    setSelectedImage(null);
    // 创建临时消息
    const tempId = Date.now();
    setMessages(prev => [...prev, {
      id: tempId,
      type: 'user',
      content: newMessage,
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    }]);
    // const tempId2 = Date.now();
    // setMessages(prev => [...prev, {
    //   id: tempId2,
    //   type: 'assistant',
    //   content: '',
    //   timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    // }]);

    try {
      const controller = new AbortController();
      setAbortController(controller);

      // 流式请求
      const response = await fetch('/chat/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          conversation_id: conversationId,
          prompt: newMessage,
          deep_thinking: true
        }),
        signal: controller.signal
      });

      // 创建assistant消息
      const assistantId = Date.now();
      setMessages(prev => [...prev, {
        id: assistantId,
        type: 'assistant',
        content: '',
        timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
        isStreaming: true
      }]);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let content = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);

        // 处理可能包含多个 JSON 对象的情况（以 "data: " 分隔）
        const dataLines = chunk.split('\n').filter(line => line.trim() !== '');

        for (const line of dataLines) {
          try {
            // 确保是以 "data: " 开头的有效行
            if (!line.startsWith('data: ')) continue;
            const jsonStr = line.slice(6).trim();
            if (!jsonStr) continue;
            const data = JSON.parse(jsonStr);
            // 只处理 type 为 text 的消息
            if (data.type === 'text') {
              content += data.content;  // 累积完整内容
              setMessages(prev =>
                prev.map(msg =>
                  msg.id === assistantId
                    ? { ...msg, content: content } // 直接使用累积的完整内容
                    : msg
                )
              );
            }
          } catch (error) {
            console.error('Error parsing line:', error, line);
          }
        }
      }

      // 更新完成状态
      setMessages(prev =>
        prev
          // .filter((msg, index) => index !== prev.length - 2)
          .map(msg =>
            msg.id === assistantId
              ? { ...msg, isStreaming: false }
              : msg
          )
      );
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('流式请求异常:', error);
        // setMessages(prev => prev.filter(msg => msg.id !== tempId));
      }
    } finally {
      setAbortController(null);
      // setMessages(prev => prev.map(msg => {
      //   if (msg.id === tempId) {
      //     return { ...msg, isStreaming: false };
      //   }
      //   return msg;
      // }));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
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
                className={`w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-gray-50 rounded-t-lg ${isFavorited ? 'text-red-500' : 'text-gray-700'
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

      <div className="p-6 space-y-4 bg-gray-50 h-[calc(100vh-350px)] overflow-y-auto">
        <ScrollArea ref={scrollRef} className="flex-1 p-4">
          {messages && messages.map((message) => (
            message &&
            <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              {/* 用户消息 */}
              {message.type === 'user' ? (
                <div>
                  {/* 用户上传的图片 */}
                  {message.image && (
                    <img
                      src={message.image}
                      alt="上传的图片"
                      className="max-w-full h-auto rounded-lg mb-2"
                    />
                  )}
                  <div className="p-4 rounded-lg relative bg-primary text-white shadow-sm">{message.content}</div>
                  <div className='text-xs text-gray-500 mt-1 text-right'>
                    {message.timestamp}
                  </div>                  
                </div>
              ) : (
                <div className="flex-1">
                  {/* 深度思考部分 */}
                  {message.thinking && (
                    <div className="max-w-[80%] w-full">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        {message.isStreaming && (
                          <div className="flex items-center space-x-2 text-blue-600">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span className="text-sm">深度思考中...</span>
                          </div>
                        )}
                        <div className="mt-2 text-xs text-blue-500">{message.thinking}</div>
                      </div>
                    </div>
                  )}
                  <div className='max-w-[95%] order-1'>
                    <div className='p-4 rounded-lg relative bg-white text-gray-900 shadow-sm'>
                      {message.isStreaming && (
                        <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                          <Loader2 className="w-3 h-3 animate-spin" />
                        </div>
                      )}
                      {/* HTML内容渲染或源码显示 */}
                      {message.htmlContent && message.type === 'assistant' && (
                        <div className="mb-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-600">生成内容:</span>
                            <div className="flex gap-1">
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(message.content);
                                  toast({ title: '已复制到剪贴板', description: '内容已复制' });
                                }}
                                className="p-1 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                                title="复制内容"
                              >
                                <Upload className="w-4 h-4" />
                              </button>
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
                            <iframe
                              srcDoc={message.htmlContent}
                              height="800"
                              className="border rounded-lg w-full"
                              sandbox="allow-scripts allow-same-origin"
                            />
                          )}
                        </div>
                      )}

                      {/* <div className="whitespace-pre-wrap relative group">
                    {message.content}
                    {message.isStreaming && (
                      <span className="inline-block ml-1 w-2 h-4 bg-gray-300 animate-pulse"></span>
                    )}
                    {!message.htmlContent && (
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(message.content);
                          toast({ title: '已复制到剪贴板', description: '内容已复制' });
                        }}
                        className="absolute -top-6 -right-6 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                        title="复制内容"
                      >
                        <Upload className="w-4 h-4" />
                      </button>
                    )}
                  </div> */}
                      <div className="markdown-content whitespace-pre-wrap break-words">
                        <ReactMarkdown
                          remarkPlugins={[remarkMath, remarkGfm]}
                          rehypePlugins={[rehypeKatex]}
                          components={{
                            a: ({ node, ...props }) => (
                              <a
                                {...props}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline"
                              />
                            ),
                            code: ({ node, className, children, ...props }) => {
                              return (
                                <div className="bg-gray-100 dark:bg-gray-900 rounded-md my-1 overflow-x-auto">
                                  <code className="block p-2 text-sm text-black-100" {...props}>
                                    {children}
                                  </code>
                                </div>
                              )
                            },
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    </div>
                    <div className='text-xs text-gray-500 mt-1 text-left'>
                      {message.timestamp}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </ScrollArea>
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

          {abortController ? (
            <button
              onClick={() => abortController.abort()}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded ml-2"
            >
              停止生成
            </button>
          )
            :
            (<button
              onClick={handleSend}
              disabled={!newMessage.trim() && !selectedImage}
              className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              发送
            </button>)}
        </div>

        <p className="text-xs text-gray-500 mt-2">
          支持上传图片，按 Enter 发送，Shift + Enter 换行
        </p>
      </div>
    </div>
  );
};

export default ConversationContent;
