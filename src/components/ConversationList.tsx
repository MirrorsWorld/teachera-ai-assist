
import { Heart, Trash2 } from "lucide-react";
import type { Conversation } from "../pages/Index";

interface ConversationListProps {
  conversations: Conversation[];
  onConversationClick: (conversation: Conversation) => void;
  onDeleteConversation: (id: number) => void;
  onFavoriteConversation: (id: number) => void;
}

const ConversationList = ({ 
  conversations, 
  onConversationClick, 
  onDeleteConversation, 
  onFavoriteConversation 
}: ConversationListProps) => {
  const handleDelete = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (window.confirm('确定要删除这个对话吗？')) {
      onDeleteConversation(id);
    }
  };

  const handleFavorite = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    onFavoriteConversation(id);
  };

  return (
    <div className="h-full overflow-y-auto mt-5 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
      {conversations.map((conversation, index) => (
        <div
          key={conversation.id}
          onClick={() => onConversationClick(conversation)}
          className={`p-3.5 rounded-xl mb-2.5 cursor-pointer transition-all duration-300 border-l-4 animate-fade-in group relative ${
            conversation.active
              ? 'bg-primary/10 border-l-primary'
              : 'border-l-transparent hover:bg-gray-100'
          }`}
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="font-medium mb-1 text-gray-900 flex items-center justify-between">
            <span className="flex items-center gap-2">
              {conversation.title}
              {conversation.favorited && (
                <Heart className="w-4 h-4 text-red-500 fill-current" />
              )}
            </span>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
              <button
                onClick={(e) => handleFavorite(e, conversation.id)}
                className={`p-1 rounded hover:bg-gray-200 ${
                  conversation.favorited ? 'text-red-500' : 'text-gray-400'
                }`}
                title={conversation.favorited ? '取消收藏' : '收藏'}
              >
                <Heart className={`w-3 h-3 ${conversation.favorited ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={(e) => handleDelete(e, conversation.id)}
                className="p-1 rounded hover:bg-gray-200 text-gray-400 hover:text-red-500"
                title="删除对话"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>
          <div className="text-sm text-gray-500 whitespace-nowrap overflow-hidden text-ellipsis">
            {conversation.subject}
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-1.5">
            <span>{conversation.date}</span>
            <span>{conversation.time}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ConversationList;
