
import { useEffect, useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import MainContent from "../components/MainContent";
import ConversationContent from "../components/ConversationContent";
import HtmlContent from "../components/HtmlContent";
import { ConversationData, createConversation, deleteConversation, getConversation, getConversationList } from "@/api/conversation";
import { toast } from "@/hooks/use-toast";

export type ViewMode = 'welcome' | 'conversation';

const Index = () => {
  // const [isLoggedIn] = useState(localStorage.getItem("token") ? true : false); // 模拟登录状态，可以后续连接到真实的认证系统>
  const [isLoggedIn] = useState(true); // 模拟登录状态，可以后续连接到真实的认证系统>
  const [activeTitle, setActiveTitle] = useState("我是你的A教师助理TeacherA");
  const [viewMode, setViewMode] = useState<ViewMode>('welcome');
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);
  const [selectedConversation, setSelectedConversation] = useState<ConversationData | null>(null);
  const [htmlCode, setHtmlCode] = useState<string>('');

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
    } finally {
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

        {isLoggedIn && (
          <div className="hidden lg:block flex flex-1">
            <HtmlContent />
          </div>
        )}

      </div>
    </div>
  );
};

export default Index;
