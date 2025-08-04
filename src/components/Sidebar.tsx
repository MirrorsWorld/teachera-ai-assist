import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import ConversationList from "./ConversationList";
import { Conversation } from "@/api/conversation";
import { useState, useEffect } from "react";

interface SidebarProps {
  onNewChat: () => void;
  onConversationClick: (conversation: Conversation) => void;
  onDeleteConversation: (id: number) => void;
  onFavoriteConversation: (id: number) => void;
  conversationsList
}

const Sidebar = ({  
  onNewChat, 
  onConversationClick, 
  onDeleteConversation, 
  onFavoriteConversation,
  conversationsList
}: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hideContent, setHideContent] = useState(false);

  const handleNewChat = async () => {
    onNewChat();
  }

  const handleDeleteConversation = async (id: number) => {
    await onDeleteConversation(id);
    if(id === -1){
      handleNewChat();
    }
    conversationsList.current.fetchData()
  }

  // 处理展开/收起逻辑
  const handleToggle = () => {
    if (!isCollapsed) {
      // 收起：先收缩宽度，动画结束后再隐藏内容
      setIsCollapsed(true);
      setTimeout(() => setHideContent(true), 50);
    } else {
      // 展开：先显示内容，再展开宽度
      setIsCollapsed(false);
      setTimeout(() => setHideContent(false), 150);
    }
  };

    // 判断是否为移动端
    const isMobile = () => window.innerWidth < 768;

    // 监听窗口变化，移动端默认收起
    useEffect(() => {
      const handleResize = () => {
        if (isMobile()) {
          setIsCollapsed(true);
          setHideContent(true);
        } else {
          setIsCollapsed(false);
          setHideContent(false);
        }
      };
      handleResize(); // 初始化
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

  return (
    <aside className={`h-full bg-white flex flex-col transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64 max-md:absolute max-md:left-0 max-md:z-[99] max-md:border-r'}`}>
      {/* <div className="flex flex-col gap-5 p-5 border-b border-gray-200>
        <button 
          onClick={handleNewChat}
          className="bg-primary text-white border-none px-5 py-2.5 rounded-md font-medium cursor-pointer transition-all duration-300 hover:transform hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(67,97,238,0.4)] flex items-center justify-center gap-2 text-base"
        >
          <Plus className="w-5 h-5" />
          <span>发起新对话</span>
        </button>
      </div> */}
      <div className='flex gap-4 p-4 border-b border-gray-200'>
        <button 
          onClick={handleNewChat}
          className={`bg-primary text-white border-none flex-1 px-5 py-2.5 rounded-md font-medium cursor-pointer transition-all duration-300 hover:transform hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(67,97,238,0.4)] flex items-center justify-center gap-2 text-base ${hideContent ? 'hidden' : ''}`}
        >
          <Plus className="w-5 h-5" />
          <span>发起新对话</span>
        </button>
        <div className="flex items-center justify-end">
          <button
            className="p-1 rounded hover:bg-gray-200 transition"
            onClick={handleToggle}
            aria-label={isCollapsed ? '展开侧边栏' : '收起侧边栏'}
          >
            {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>
      </div>
      
      <div className={`flex-1 overflow-hidden ${hideContent ? 'hidden' : ''}`}>
        <ConversationList  
          ref={conversationsList}
          onConversationClick={onConversationClick}
          onDeleteConversation={handleDeleteConversation}
          onFavoriteConversation={onFavoriteConversation}
        />
      </div>
    </aside>
  );
};

export default Sidebar;
