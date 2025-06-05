
import { Plus } from "lucide-react";
import ConversationList from "./ConversationList";
import type { Conversation } from "../pages/Index";

interface SidebarProps {
  conversations: Conversation[];
  onNewChat: () => void;
  onConversationClick: (conversation: Conversation) => void;
  onDeleteConversation: (id: number) => void;
  onFavoriteConversation: (id: number) => void;
}

const Sidebar = ({ 
  conversations, 
  onNewChat, 
  onConversationClick, 
  onDeleteConversation, 
  onFavoriteConversation 
}: SidebarProps) => {
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
          onClick={onNewChat}
          className="bg-white text-primary border-2 border-dashed border-primary p-3.5 rounded-xl font-medium cursor-pointer transition-all duration-300 flex items-center justify-center gap-2 text-base hover:bg-primary/10"
        >
          <Plus className="w-5 h-5" />
          <span>发起新对话</span>
        </button>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <ConversationList 
          conversations={conversations}
          onConversationClick={onConversationClick}
          onDeleteConversation={onDeleteConversation}
          onFavoriteConversation={onFavoriteConversation}
        />
      </div>
    </aside>
  );
};

export default Sidebar;
