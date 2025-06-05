
import { useState } from "react";
import { Plus } from "lucide-react";
import ConversationList from "./ConversationList";

const Sidebar = () => {
  const [conversations, setConversations] = useState([
    {
      id: 1,
      title: "高中数学函数讲解",
      subject: "好的，我们来复习一下描述函数的性质...",
      date: "昨天",
      time: "14:30",
      active: true
    },
    {
      id: 2,
      title: "物理力学问题",
      subject: "牛顿第二定律的应用场景包括...",
      date: "周一",
      time: "10:15",
      active: false
    },
    {
      id: 3,
      title: "化学方程式练习",
      subject: "让我们来分析一下这个氧化还原反应...",
      date: "6月3日",
      time: "15:42",
      active: false
    },
    {
      id: 4,
      title: "生物细胞结构",
      subject: "真核细胞和原核细胞的主要区别在于...",
      date: "6月2日",
      time: "09:30",
      active: false
    },
    {
      id: 5,
      title: "英语语法解析",
      subject: "现在完成时和过去完成时的区别是...",
      date: "6月1日",
      time: "16:20",
      active: false
    },
    {
      id: 6,
      title: "历史事件分析",
      subject: "第二次世界大战的主要转折点包括...",
      date: "5月31日",
      time: "11:10",
      active: false
    },
    {
      id: 7,
      title: "地理气候类型",
      subject: "热带雨林气候的主要特征及其分布...",
      date: "5月30日",
      time: "14:45",
      active: false
    }
  ]);

  const [activeTitle, setActiveTitle] = useState("高中数学函数讲解");

  const handleNewChat = () => {
    const newConversation = {
      id: Date.now(),
      title: "新对话",
      subject: "开始新的教学讨论...",
      date: "今天",
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      active: true
    };

    setConversations(prev => [
      newConversation,
      ...prev.map(conv => ({ ...conv, active: false }))
    ]);
    setActiveTitle("新对话");
  };

  const handleConversationClick = (conversation: any) => {
    setConversations(prev => 
      prev.map(conv => ({ 
        ...conv, 
        active: conv.id === conversation.id 
      }))
    );
    setActiveTitle(conversation.title);
  };

  return (
    <aside className="w-80 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] p-6 flex flex-col h-full lg:h-[calc(100vh-120px)]">
      <div className="flex flex-col gap-5 pb-5 border-b border-gray-200">
        <div className="text-lg font-semibold text-primary flex items-center gap-2.5">
          <div className="w-5 h-5 bg-primary rounded-sm flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
          <span>与TeacherA对话</span>
        </div>
        <button 
          onClick={handleNewChat}
          className="bg-white text-primary border-2 border-dashed border-primary p-3.5 rounded-xl font-medium cursor-pointer transition-all duration-300 flex items-center justify-center gap-2 text-base hover:bg-primary/10"
        >
          <Plus className="w-5 h-5" />
          <span>发起新对话</span>
        </button>
      </div>
      
      <ConversationList 
        conversations={conversations}
        onConversationClick={handleConversationClick}
      />
    </aside>
  );
};

export default Sidebar;
