
import type { Conversation } from "../pages/Index";

interface ConversationListProps {
  conversations: Conversation[];
  onConversationClick: (conversation: Conversation) => void;
}

const ConversationList = ({ conversations, onConversationClick }: ConversationListProps) => {
  return (
    <div className="flex-1 overflow-y-auto mt-5">
      {conversations.map((conversation, index) => (
        <div
          key={conversation.id}
          onClick={() => onConversationClick(conversation)}
          className={`p-3.5 rounded-xl mb-2.5 cursor-pointer transition-all duration-300 border-l-4 animate-fade-in ${
            conversation.active
              ? 'bg-primary/10 border-l-primary'
              : 'border-l-transparent hover:bg-gray-100'
          }`}
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="font-medium mb-1 text-gray-900 flex items-center gap-2">
            {conversation.title}
            {conversation.favorited && (
              <span className="text-red-500 text-sm">♥</span>
            )}
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
