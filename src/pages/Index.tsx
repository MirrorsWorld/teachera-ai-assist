"use client"

import { useState, useRef } from "react"
import Header from "../components/Header"
import Sidebar from "../components/Sidebar"
import MainContent from "../components/MainContent"
import ConversationContent from "../components/ConversationContent"
import HtmlContent from "../components/HtmlContent"
import { type ConversationData, getConversation } from "@/api/conversation"
import { toast } from "@/hooks/use-toast"
import useHtmlStore from "@/store/store" // 保留您的原有store
export type ViewMode = "welcome" | "conversation"

const Index = () => {
  const [isLoggedIn] = useState(true)
  const [activeTitle, setActiveTitle] = useState("我是你的AI教师助理TeacherA，可以帮你备课")
  const [viewMode, setViewMode] = useState<ViewMode>("welcome")
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null)
  const [initialMessage, setInitialMessage] = useState<string>("")
  const [initialImgurl, setInitialImgurl] = useState<string>("")
  interface ConversationListRef {
    fetchData: () => Promise<void>;
  }

  const conversationListRef = useRef<ConversationListRef>(null);
  

  // 从您的原有store获取HTML内容
  const { htmlCode, getLatest } = useHtmlStore()

  // 获取最新的HTML内容
  const latestHtmlCode = getLatest()

  // HTML 预览面板显示控制
  const [showHtmlPanel, setShowHtmlPanel] = useState<boolean>(false)

  // 删除这个useEffect，不要自动显示面板
  // useEffect(() => {
  //   if (latestHtmlCode.trim()) {
  //     setShowHtmlPanel(true)
  //   } else {
  //     setShowHtmlPanel(false)
  //   }
  // }, [latestHtmlCode])

  // 切换 HTML 面板显示/隐藏
  const toggleHtmlPanel = () => {
    setShowHtmlPanel(!showHtmlPanel)
  }

  const handleNewChat = async (newConv: ConversationData, initialMsg?: string, initialImgurl?: string) => {
    console.log("图片地址", initialImgurl);

    try {
      setViewMode("conversation")
      setSelectedConversationId(newConv.id)
      const selectedConversation = await getConversation(newConv.id)
      console.log("selectedConversation", selectedConversation);
      conversationListRef.current.fetchData();
      
      // 保存初始消息，用于自动发送
      if (initialMsg) {
        setInitialMessage(initialMsg)
      }

      if (initialImgurl) {
        setInitialImgurl(initialImgurl)
      }
      
      toast({ title: "对话创建成功", description: "已准备就绪" })
    } catch (error) {
      toast({
        title: "创建失败",
        description: error instanceof Error ? error.message : "网络异常",
        variant: "destructive",
      })
    }
  }

  const handleConversationClick = async (conversation: ConversationData) => {
    setViewMode("conversation")
    setSelectedConversationId(conversation.id)
    // 清除初始消息，因为这是点击已有对话
    setInitialMessage("")
  }

  const handleDeleteConversation = async (id: number) => {
    if (-1 !== id) {
      setSelectedConversationId(id)
    }
  }

  const handleFavoriteConversation = (id: number) => {
    // 收藏逻辑
  }

  // 处理初始消息发送完成
  const handleInitialMessageSent = () => {
    setInitialMessage("")
  }

  return (
    <div className="h-screen flex flex-col font-roboto overflow-hidden">
      <Header />
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* 左侧边栏 固定宽度，独立滚动*/}
        {isLoggedIn && (
          <div className="w-64 bg-slate-100 border-r border-gray-200 flex-shrink-0 flex flex-col">
            <Sidebar
              conversationsList={conversationListRef}
              onNewChat={handleNewChat}
              onConversationClick={handleConversationClick}
              onDeleteConversation={handleDeleteConversation}
              onFavoriteConversation={handleFavoriteConversation}
            />
          </div>
        )}

        {/* 中间内容区域 - 动态宽度 */}
        <div
          className={`flex-1 bg-white min-h-full transition-all duration-300 ${showHtmlPanel ? "max-w-[90%]" : ""}`}
        >
          {viewMode === "welcome" ? (
            <MainContent activeTitle={activeTitle} onNewConversation={handleNewChat} />
          ) : (
            selectedConversationId && (
              <ConversationContent
                conversationId={selectedConversationId}
                onDelete={handleDeleteConversation}
                onFavorite={handleFavoriteConversation}
                isFavorited={false}
                onToggleHtmlPanel={toggleHtmlPanel}
                initialMessage={initialMessage}
                onInitialMessageSent={handleInitialMessageSent}
                initialImgurl={initialImgurl}
              />
            )
          )}
        </div>

        {/* 右侧 HTML 预览面板 - 条件渲染 */}
        {isLoggedIn && showHtmlPanel && (
          <div className="w-[46%] bg-gray-50 transition-all duration-300 flex-shrink-0">
            <div className="h-full bg-white border border-gray-200 flex flex-col">
              <HtmlContent onClose={() => setShowHtmlPanel(false)} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Index;
