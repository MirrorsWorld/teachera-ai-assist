
import { useEffect, useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import MainContent from "../components/MainContent";
import ConversationContent from "../components/ConversationContent";
import { ConversationData, createConversation, deleteConversation, getConversation, getConversationList } from "@/api/conversation";
import { toast } from "@/hooks/use-toast";

export type ViewMode = 'welcome' | 'conversation';


const test_data=[
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
]

const Index = () => {
  const [isLoggedIn] = useState(localStorage.getItem("token")?true:false); // 模拟登录状态，可以后续连接到真实的认证系统
  const [activeTitle, setActiveTitle] = useState("我是你的A教师助理TeacherA");
  const [viewMode, setViewMode] = useState<ViewMode>('welcome');
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);
  const [selectedConversation, setSelectedConversation] = useState<ConversationData | null>(null);

  const handleNewChat = async (newConv) => {
    try {
      setActiveTitle(newConv.title);
      setViewMode('conversation');
      setSelectedConversationId(newConv.id);
      const selectedConversation = await getConversation(newConv.id);
      setSelectedConversation(selectedConversation);
      toast({ title: '对话创建成功', description: '已准备就绪' });
    
    } catch (error) {
      toast({
        title: '创建失败',
        description: error instanceof Error ? error.message : '网络异常',
        variant: 'destructive'
      });
    }finally{
      // console.log(conversations);
    }
  };

  const handleConversationClick = async (conversation: ConversationData) => {
    setActiveTitle(conversation.title);
    setViewMode('conversation');
    setSelectedConversationId(conversation.id);
    const selectedConversation = await getConversation(conversation.id);
    setSelectedConversation(selectedConversation);
  };

  const handleDeleteConversation = async (id: number) => {
    if (-1 !== id) {
        setSelectedConversationId(id);
        const selectedConversation = await getConversation(id);
        setSelectedConversation(selectedConversation);
    }
    
  };

  const handleFavoriteConversation = (id: number) => {
    // setConversations(prev =>
    //   prev.map(conv =>
    //     conv.id === id ? { ...conv, favorited: !conv.favorited } : conv
    //   )
    // );
  };

  return (
    <div className="min-h-screen flex flex-col font-roboto">
      <Header />
      
      <div className={`flex flex-1  mx-auto w-full p-5 gap-6 h-[calc(100vh-80px)] ${!isLoggedIn ? 'justify-center' : ''}`}>
        {isLoggedIn && (
          <div className="hidden lg:block">
            <Sidebar 
              onNewChat={handleNewChat}
              onConversationClick={handleConversationClick}
              onDeleteConversation={handleDeleteConversation}
              onFavoriteConversation={handleFavoriteConversation}
            />
          </div>
        )}
        
        <div className={`${isLoggedIn ? 'flex-1' : 'w-full'}`}>
          {viewMode === 'welcome' ? (
              <MainContent 
                activeTitle={activeTitle}
                onNewConversation={handleNewChat}
              />
          ) : (
            selectedConversation && (
              <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] h-full">
                <ConversationContent
                  conversationId={selectedConversationId}
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
