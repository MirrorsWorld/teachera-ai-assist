
import { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import MainContent from "../components/MainContent";
import ConversationContent from "../components/ConversationContent";

export type ViewMode = 'welcome' | 'conversation';

export interface Conversation {
  id: number;
  title: string;
  subject: string;
  date: string;
  time: string;
  active: boolean;
  favorited?: boolean;
}

const Index = () => {
  const [isLoggedIn] = useState(localStorage.getItem("token")?true:false); // 模拟登录状态，可以后续连接到真实的认证系统
  const [activeTitle, setActiveTitle] = useState("我是你的A教师助理TeacherA");
  const [viewMode, setViewMode] = useState<ViewMode>('welcome');
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: 1,
      title: "高中数学函数讲解",
      subject: "好的，我们来复习一下描述函数的性质...",
      date: "昨天",
      time: "14:30",
      active: true,
      favorited: false
    },
    {
      id: 2,
      title: "物理力学问题",
      subject: "牛顿第二定律的应用场景包括...",
      date: "周一",
      time: "10:15",
      active: false,
      favorited: true
    },
    {
      id: 3,
      title: "化学方程式练习",
      subject: "让我们来分析一下这个氧化还原反应...",
      date: "6月3日",
      time: "15:42",
      active: false,
      favorited: false
    },
    {
      id: 4,
      title: "生物细胞结构",
      subject: "真核细胞和原核细胞的主要区别在于...",
      date: "6月2日",
      time: "09:30",
      active: false,
      favorited: false
    },
    {
      id: 5,
      title: "英语语法解析",
      subject: "现在完成时和过去完成时的区别是...",
      date: "6月1日",
      time: "16:20",
      active: false,
      favorited: false
    },
    {
      id: 6,
      title: "历史事件分析",
      subject: "第二次世界大战的主要转折点包括...",
      date: "5月31日",
      time: "11:10",
      active: false,
      favorited: false
    },
    {
      id: 7,
      title: "地理气候类型",
      subject: "热带雨林气候的主要特征及其分布...",
      date: "5月30日",
      time: "14:45",
      active: false,
      favorited: false
    }
  ]);

  const handleNewChat = () => {
    if(conversations && conversations.length>0 && conversations[0].title==='新对话'){
      var conversation = conversations[0]
      setConversations(prev => 
        prev.map(conv => ({ 
          ...conv, 
          active: !(conv.id != conversation.id)
        }))
      );
      // conversation.active = true;
      setActiveTitle(conversation.title);
      setViewMode(conversation.title==='新对话'?'welcome':'conversation');
      setSelectedConversationId(conversation.id);
      return;
    }
    const newConversation: Conversation = {
      id: Date.now(),
      title: "新对话",
      subject: "开始新的教学讨论...",
      date: "今天",
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      active: true,
      favorited: false
    };

    setConversations(prev => [
      newConversation,
      ...prev.map(conv => ({ ...conv, active: false }))
    ]);
    setActiveTitle("新对话");
    setViewMode('welcome');
    setSelectedConversationId(newConversation.id);
  };

  const handleConversationClick = (conversation: Conversation) => {
    setConversations(prev => 
      prev.map(conv => ({ 
        ...conv, 
        active: conv.id === conversation.id 
      }))
    );
    setActiveTitle(conversation.title);
    setViewMode(conversation.title==='新对话'?'welcome':'conversation');
    setSelectedConversationId(conversation.id);
  };

  const handleDeleteConversation = (id: number) => {
    setConversations(prev => prev.filter(conv => conv.id !== id));
    if (selectedConversationId === id) {
      setViewMode('welcome');
      setSelectedConversationId(null);
      setActiveTitle("我是你的A教师助理TeacherA");
    }
  };

  const handleFavoriteConversation = (id: number) => {
    setConversations(prev =>
      prev.map(conv =>
        conv.id === id ? { ...conv, favorited: !conv.favorited } : conv
      )
    );
  };

  const selectedConversation = conversations.find(conv => conv.id === selectedConversationId);

  return (
    <div className="min-h-screen flex flex-col font-roboto">
      <Header />
      
      <div className={`flex flex-1  mx-auto w-full p-5 gap-6 h-[calc(100vh-80px)] ${!isLoggedIn ? 'justify-center' : ''}`}>
        {isLoggedIn && (
          <div className="hidden lg:block">
            <Sidebar 
              conversations={conversations}
              onNewChat={handleNewChat}
              onConversationClick={handleConversationClick}
              onDeleteConversation={handleDeleteConversation}
              onFavoriteConversation={handleFavoriteConversation}
            />
          </div>
        )}
        
        <div className={`${isLoggedIn ? 'flex-1' : 'w-full'}`}>
          {viewMode === 'welcome' ? (
            <MainContent activeTitle={activeTitle} />
          ) : (
            selectedConversation && (
              <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] h-full">
                <ConversationContent
                  conversationId={selectedConversation.id}
                  title={selectedConversation.title}
                  onDelete={handleDeleteConversation}
                  onFavorite={handleFavoriteConversation}
                  isFavorited={selectedConversation.favorited || false}
                />
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
