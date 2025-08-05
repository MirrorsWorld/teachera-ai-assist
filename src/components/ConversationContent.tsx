import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Heart, Trash2, MoreVertical, Send, Ellipsis, Code, Eye, Loader2, Paperclip, Check } from "lucide-react"
import { ConversationContentProps, MessageData, uploadImage } from "../api/chat"
import { getConversation } from "../api/conversation"
import { ScrollArea } from "./ui/scroll-area"
import ReactMarkdown from "react-markdown"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import remarkGfm from "remark-gfm"
import useHtmlStore from "@/store/store"
import { ReasoningBlock } from "./ui/reasoning-block"
import FileModal from "./ui/file-modal"

// 扩展 ConversationContentProps 接口
// interface ExtendedConversationContentProps extends ConversationContentProps {
//   onHtmlContentUpdate?: (content: string) => void
//   hasHtmlContent?: boolean
//   showHtmlPreview?: boolean
//   onToggleHtmlPreview?: () => void
//   initialMessage?: string
//   initialImgurl?: string
//   onInitialMessageSent?: () => void
// }


const test_data: MessageData[] = [
  {
    id: 1,
    type: 'user',
    answer: '请帮我讲解二次函数的基本性质',
    imageUrl: 'https://elsp-homepage.oss-cn-hongkong.aliyuncs.com/conference/1869198440085524480/conference_img/1900063852563570688.png',
    timestamp: '14:30'
  },
  {
    id: 2,
    type: 'assistant',
    reasoning: '好的，我们来复习一下二次函数的基本性质。二次函数的一般形式是 f(x) = ax² + bx + c (a ≠ 0)。\n\n主要性质包括：\n1. 开口方向：当a > 0时开口向上，当a < 0时开口向下\n2. 对称轴：x = -b/(2a)\n3. 顶点坐标：(-b/(2a), (4ac-b²)/(4a))\n4. 最值：当a > 0时有最小值，当a < 0时有最大值',
    answer: '以上数据均为前端mock数据，正式数据请从后端获取。',
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
    `,
    durationInSeconds: 19, // 模拟思考耗时
  }
]

const ConversationContent = ({
  conversationId,
  onDelete,
  onFavorite,
  isFavorited,
  onToggleHtmlPanel, // 新增的prop
  initialMessage,
  initialImgurl,
  onInitialMessageSent,
}: ConversationContentProps) => {
  const [showActions, setShowActions] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showHtmlSource, setShowHtmlSource] = useState<{ [key: number]: boolean }>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [enableDeepThinking, setEnableDeepThinking] = useState(true);
  const lastReasoningUpdateRef = useRef<number>(Date.now());
  const [loading, setLoading] = useState(false);

  // 在现有的 useRef 声明后添加
  const prevHtmlContentRef = useRef<string>("")

  // 从 store 获取状态和方法
  const { clear, reset } = useHtmlStore();

  // 示例重置函数
  const handleReset = (val: string) => {
    // 调用 reset 并传入新的 HTML 字符串，现在会追加到数组中
    if (val && val.trim()) {
      reset(val);
    }
  };

  // 模拟对话消息数据
  const [messages, setMessages] = useState<MessageData[]>([]);
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
    const fetchData = async () => {
      if (!conversationId) return;
      setMessages([])
      try {
        var data = await getConversation(conversationId)
        if (!data || !data.message) {
          setMessages([])
          return
        }
        const convertedMessages = convertApiDataToMessages(data.message);
        console.log("转换后的消息", convertedMessages)
        setMessages(convertedMessages)
      } catch (error) {
        console.error('获取会话消息列表失败:', error)
      } finally {
        // setLoading(false)
        clear()
      }
    }
    fetchData()
  }, [conversationId])

  // 转换函数
const convertApiDataToMessages = (apiData: any): MessageData[] => {
  const messages: MessageData[] = [];
  
  // 处理数据 - apiData是一个列表，每个元素包含message和aiMessage
  if (apiData && Array.isArray(apiData)) {
    apiData.forEach((item: any) => {
      // 添加用户消息
      if (item.message) {
        messages.push({
          id: item.id,
          type: 'user',
          answer: item.message,
          timestamp: new Date(item.createdAt).toLocaleTimeString('zh-CN', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })
        });
      }
      
      // 处理AI回复消息
      if (item.aiMessage && Array.isArray(item.aiMessage) && item.aiMessage.length > 0) {
        const aiMessages = item.aiMessage;
        
        // 合并reasoning内容（前两条）
        let reasoning = '';
        if (aiMessages.length >= 1) {
          reasoning = aiMessages[0].message
        }
        
        // 获取answer内容（第三条）
        let answer = '';
        if (aiMessages.length >= 2) {
          answer = aiMessages[1].message;
        }
        
        // 获取htmlContent内容（第四条）
        let htmlContent = '';
        if (aiMessages.length >= 3) {
          htmlContent = aiMessages[2].message;
        }
        
        // 计算执行时间
        const durationInSeconds = aiMessages.reduce((total: number, msg: any) => {
          return total + (msg.execTime || 0);
        }, 0);
        
        // 添加AI助手消息
        messages.push({
          id: aiMessages[0].id, // 使用第一条AI消息的ID
          type: 'assistant',
          reasoning: reasoning,
          answer: answer,
          htmlContent: htmlContent,
          timestamp: new Date(aiMessages[0].createdAt).toLocaleTimeString('zh-CN', { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          durationInSeconds: durationInSeconds > 0 ? Math.round(durationInSeconds / 1000) : undefined,
          isStreaming: false
        });
      }
    });
  }
  
  return messages;
};

  // 合并后的统一消息发送函数
  const handleSendMessage = async (message: string, initImageUrl: string, isInitial = false) => {
    if (!message.trim() || !conversationId) return;
    setLoading(true)
    // 创建临时用户消息
    const tempId = Date.now();
    setMessages(prev => [...prev, {
      id: tempId,
      type: 'user',
      answer: message,
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      ...(isInitial ? { imageUrl: initImageUrl } : { imageUrl: selectedImage })
    }]);

    if (!isInitial) {
      setNewMessage("");
      setSelectedImage(null);
    }

    try {
      const controller = new AbortController();
      setAbortController(controller);
      const startTime = Date.now();
      const bodyData = {
        SessionId: conversationId,
        message: message,
        message_order: 1,
        user_id: 1,
        imageUrl: null
      };
      if (selectedImage && !isInitial) {
        bodyData.imageUrl = selectedImage;
      }

      if (isInitial && initImageUrl) {
        bodyData.imageUrl = initImageUrl;
      }

      const response = await fetch(`/api/v2/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(bodyData),
        signal: controller.signal
      });
      const assistantId = Date.now();
      setLoading(false)
      setMessages(prev => [...prev, {
        id: assistantId,
        type: 'assistant',
        reasoning: '',
        answer: '',
        htmlContent: '',
        timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
        isStreaming: true,
      }]);
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let answer = '';
      let reasoning = '';
      let htmlContent = '';
      let buffer = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          // 处理最后可能剩余的 buffer 数据
          if (buffer) {
            const lines = buffer.split('\n');
            buffer = '';
            const localReasoning = reasoning;
            for (const line of lines) {
              if (!line.startsWith('data: ')) continue;
              const jsonStr = line.slice(6).trim();
              if (!jsonStr) continue;
              try {
                const { data } = JSON.parse(jsonStr);
                if (data.type === 'reasoning') {
                  reasoning += data.content;
                  lastReasoningUpdateRef.current = Date.now();
                  setMessages(prev =>
                    prev.map(msg =>
                      msg.id === assistantId
                        ? { ...msg, reasoning: localReasoning }
                        : msg
                    )
                  );
                }
                if (data.type === 'html_code') {
                  htmlContent += data.content;
                  setMessages(prev =>
                    prev.map(msg =>
                      msg.id === assistantId
                        ? { ...msg, htmlContent: htmlContent }
                        : msg
                    )
                  );
                }
                if (data.type === 'result') {
                  answer += data.content;
                  setMessages(prev =>
                    prev.map(msg =>
                      msg.id === assistantId
                        ? { ...msg, answer: answer }
                        : msg
                    )
                  );
                }
              } catch (error) {
                console.error('Error parsing line:', error, line);
              }
            }
          }
          break;
        }
        const chunk = decoder.decode(value);
        buffer += chunk;
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';
        const localReasoning = reasoning;
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const jsonStr = line.slice(6).trim();
          if (!jsonStr) continue;
          try {
            const { data } = JSON.parse(jsonStr);
            if (data.type === 'reasoning') {
              reasoning += data.content;
              lastReasoningUpdateRef.current = Date.now();
              setMessages(prev =>
                prev.map(msg =>
                  msg.id === assistantId
                    ? { ...msg, reasoning: localReasoning }
                    : msg
                )
              );
            }
            if (data.type === 'html_code') {
              htmlContent += data.content;
              setMessages(prev =>
                prev.map(msg =>
                  msg.id === assistantId
                    ? { ...msg, htmlContent: htmlContent }
                    : msg
                )
              );
            }
            if (data.type === 'result') {
              answer += data.content;
              setMessages(prev =>
                prev.map(msg =>
                  msg.id === assistantId
                    ? { ...msg, answer: answer }
                    : msg
                )
              );
            }
          } catch (error) {
            console.error('Error parsing line:', error, line);
          }
        }
      }
      const durationInSeconds = Math.round((Date.now() - startTime) / 1000);
      setMessages(prev =>
        prev.map(msg =>
          msg.id === assistantId ? { ...msg, isStreaming: false, durationInSeconds } : msg
        )
      );
      setSelectedImage(null);
      fileInputRef.current.value = '';
      if (isInitial && onInitialMessageSent) {
        onInitialMessageSent();
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('流式请求异常:', error);
      }
    } finally {
      setAbortController(null);
    }
  };

  // 页面加载时自动发送初始消息
  useEffect(() => {
    if (initialMessage && conversationId) {
      handleSendMessage(initialMessage, initialImgurl , true);
    }
  }, [initialMessage, conversationId]);

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

  // 用户点击发送时
  const handleSend = () => {
    handleSendMessage(newMessage, initialImgurl , false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log('file', file);
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      try {
        const res = await uploadImage(formData);
        let imageUrl = '';
        if (res?.data?.imageUrl) {
          imageUrl = res.data.imageUrl;
        }
        if (imageUrl) {
          setSelectedImage(imageUrl);
        } else {
          alert('图片上传失败，未获取到图片路径');
        }
      } catch (err) {
        alert('图片上传失败');
      }
    }
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 监听HTML内容变化，自动显示预览面板
  useEffect(() => {
    // 遍历messages数组，查找所有包含htmlContent的assistant消息
    const assistantMessagesWithHtml = messages.filter((msg) => 
      msg.type === "assistant" && msg.htmlContent && msg.htmlContent.trim()
    );
    
    // 遍历所有找到的HTML内容，检查是否需要添加到store中
    assistantMessagesWithHtml.forEach((message) => {
      const htmlContent = message.htmlContent;
      if (htmlContent && htmlContent.trim()) {
        // 检查这个HTML内容是否已经在store中
        const storeState = useHtmlStore.getState();
        const isAlreadyInStore = storeState.htmlCode.some(existingHtml => 
          existingHtml === htmlContent
        );
        
        // 如果不在store中，则添加
        if (!isAlreadyInStore) {
          handleReset(htmlContent);
        }
      }
    });

    // 获取最新的HTML内容用于自动打开预览面板
    const latestMessage = assistantMessagesWithHtml[assistantMessagesWithHtml.length - 1];
    const currentHtmlContent = latestMessage?.htmlContent || ""

    // 如果有新的HTML内容生成，自动打开HTML预览面板
    if (currentHtmlContent && currentHtmlContent !== prevHtmlContentRef.current) {
      // 自动打开HTML预览面板
      if (onToggleHtmlPanel) {
        onToggleHtmlPanel()
      }

      // 更新ref中的值
      prevHtmlContentRef.current = currentHtmlContent
    }
  }, [messages, onToggleHtmlPanel])


  //计算html大小
  const formatHtmlSize = (html: string): string => {
    const sizeInBytes = new Blob([html]).size;
    if (sizeInBytes < 1024) {
      return `${sizeInBytes} B`;
    } else if (sizeInBytes < 1024 * 1024) {
      return `${(sizeInBytes / 1024).toFixed(2)} KB`;
    } else {
      return `${(sizeInBytes / (1024 * 1024)).toFixed(2)} MB`;
    }
  };

  //显示所有文件
  const [fileModalOpen, setFileModalOpen] = useState(false)
  //例子
  const exampleFiles: {
    name: string
    type: "code" | "image" | "document" | "link"
    date?: string
  }[] = [
      {
        name: "trigonometric_functions.html",
        type: "code",
        date: "Thursday"
      }
    ]

  return (
    <div className="flex flex-col h-full">
      {/* 对话标题和操作按钮 */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white rounded-t-xl">
        <div className="flex items-center gap-2">
          {/* 移除HTML预览切换按钮 */}

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
      </div>

      {/* 对话内容 */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
        <ScrollArea ref={scrollRef} className="flex-1 p-4">
          <div className="max-w-4xl mx-auto space-y-6"> 
            {messages && messages.map((message) => (
              message &&
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                {/* 用户消息 */}
                {message.type === 'user' ? (
                  <div className="max-w-[80%]">
                    {/* 用户上传的图片 */}
                    {message.imageUrl && (
                      <img
                        src={message.imageUrl}
                        alt="上传的图片"
                        className="max-w-full h-auto rounded-lg mb-2"
                      />
                    )}
                    <div className="p-4 rounded-lg relative bg-primary text-white shadow-sm">{message.answer}</div>
                    <div className='text-xs text-gray-500 mt-1 text-right'>
                      {message.timestamp}
                    </div>
                  </div>
                ) : (
                  <div className="flex-1"> 
                    {/* 深度思考部分 */}
                    {message.reasoning && (
                      <div className="max-w-[95%] w-full mb-3">
                        <ReasoningBlock
                          reasoning={message.reasoning}
                          isStreaming={!!message.isStreaming}
                          durationInSeconds={message.durationInSeconds}
                        />
                      </div>
                    )}
                    <div className="max-w-[95%] order-1 mt-2">
                      <div className="p-4 rounded-lg relative bg-white text-gray-900 shadow-sm">
                        {message.isStreaming && (
                          <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                            <Loader2 className="w-3 h-3 animate-spin" />
                          </div>
                        )}

                        {/* HTML内容渲染或源码显示*/}
                        {!message.htmlContent && message.isStreaming && message.reasoning ? (
                          <div className="flex items-center whitespace-pre-wrap break-words">
                            <Loader2 className="w-4 h-4 animate-spin m-0.5" />
                            <span className="ml-1">问题解析中...</span>
                          </div>
                        ) : ('')}
                        {message.htmlContent && message.type === "assistant" && (
                          <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                            {/* 左边：HTML 文件卡片 + 预览按钮 */}
                            <div className="flex flex-wrap justify-between bg-blue-50 border border-blue-200 rounded-xl px-4 py-2 w-full sm:w-[48%]">
                              <div className="flex items-center gap-2 text-blue-700">
                                <Code className="w-5 h-5" />
                                <div className="flex flex-col">
                                  <span className="font-medium text-sm">生成文件.html</span>
                                  <span className="text-xs text-blue-500">
                                    Code · {message.htmlContent ? formatHtmlSize(message.htmlContent) : "0 B"}
                                  </span>

                                </div>
                              </div>
                              <button
                                onClick={onToggleHtmlPanel}
                                className="text-xs text-blue-600 hover:text-blue-800 underline px-2 py-1 rounded hover:bg-blue-100 transition-colors flex items-center gap-1 whitespace-nowrap"
                              >
                                <Eye className="w-3 h-3" />
                                展开预览
                              </button>
                            </div>

                            {/* 右边：查看所有文件按钮 */}
                            <button
                              onClick={() => setFileModalOpen(true)}
                              className="flex items-center justify-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 bg-white hover:bg-gray-100 rounded-xl border border-gray-200 transition-colors w-full sm:w-[48%]"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
                              </svg>
                              查看所有文件
                            </button>

                          </div>
                        )}

                        <div className="markdown-content break-words">
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
                                    <code className="block p-2 text-sm text-black-100 w-[400px]" {...props}>
                                      {children}
                                    </code>
                                  </div>
                                )
                              },
                            }}
                          >
                            {message.answer}
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
            )
            )}
            {loading && (
              <div className="flex justify-start">
                  <div className="flex-1">
                    <div className="max-w-[95%] order-1 mt-2">
                      <div className="p-4 rounded-lg relative bg-white text-gray-900 shadow-sm flex items-center">
                        <Loader2 className="w-4 h-4 animate-spin m-0.5" />
                        <span className="ml-1">问题解析中...</span>
                      </div>
                    </div>
                  </div>
              </div>
            )}        
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>

      {/* 输入区域 */}
      <div className="px-6 pb-4 pt-4 max-w-4xl mx-auto w-full">
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

        {/* 新增深度思考勾选框 */}
        {/* <div className="flex items-center mb-3">
          <input
            type="checkbox"
            id="deepThinkingCheckbox"
            checked={enableDeepThinking}
            onChange={(e) => setEnableDeepThinking(e.target.checked)}
            className="w-4 h-4 text-primary rounded focus:ring-primary/20"
          />
          <label htmlFor="deepThinkingCheckbox" className="ml-2 text-sm text-gray-600 cursor-pointer">
            开启GGB代码生成
          </label>
        </div> */}

        {/* 主输入容器 */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden w-full">
          <div className="flex items-end p-3 gap-2">
            {/* 左侧工具按钮 */}
            <div className="flex items-center flex-shrink-0">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                title="上传图片"
              >
                <Paperclip className="w-5 h-5" />
              </button>
            </div>

            {/* 输入框 */}
            <div className="flex-1 min-w-0">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="继续对话..."
                className="w-full px-3 py-2 border-0 outline-none resize-none bg-transparent text-gray-900 placeholder-gray-500 min-h-[24px] max-h-32"
                rows={1}
                style={{
                  height: "auto",
                  minHeight: "24px",
                }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement
                  target.style.height = "auto"
                  target.style.height = target.scrollHeight + "px"
                }}
              />
            </div>

            {/* 右侧按钮组 */}
            <div className="flex items-center flex-shrink-0">
              {abortController ? (
                <button
                  onClick={() => abortController.abort()}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                >
                  停止
                </button>
              ) : (
                <button
                  onClick={handleSend}
                  disabled={!newMessage.trim() && !selectedImage}
                  className="bg-primary text-white p-2.5 rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-500 mt-3 text-center">
          支持上传图片，按 Enter 发送，Shift + Enter 换行
        </p>

        <FileModal
          isOpen={fileModalOpen}
          onClose={() => setFileModalOpen(false)}
          files={exampleFiles}
        />

      </div>
    </div>
  );
};

export default ConversationContent;
