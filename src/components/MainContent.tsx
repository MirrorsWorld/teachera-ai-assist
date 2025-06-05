
import { useState } from "react";
import WelcomeSection from "./WelcomeSection";
import MessageInput from "./MessageInput";
import ActionButtons from "./ActionButtons";

interface MainContentProps {
  activeTitle?: string;
}

const MainContent = ({ activeTitle = "我是你的A教师助理TeacherA" }: MainContentProps) => {
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    if (message.trim() !== '') {
      console.log(`发送消息: ${message}`);
      setMessage('');
    }
  };

  const handleUpload = () => {
    console.log("打开上传试题界面");
  };

  const handleKnowledge = () => {
    console.log("打开知识点选择界面");
  };

  const handleMistakes = () => {
    console.log("打开高频错题选择界面");
  };

  return (
    <main className="flex-1 flex flex-col bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] p-5 h-full justify-center">
      <WelcomeSection title={activeTitle === '新对话'? '我是你的A教师助理TeacherA':activeTitle} />
      
      <MessageInput 
        message={message}
        setMessage={setMessage}
        onSendMessage={handleSendMessage}
      />
      
      <ActionButtons 
        onUpload={handleUpload}
        onKnowledge={handleKnowledge}
        onMistakes={handleMistakes}
      />
    </main>
  );
};

export default MainContent;
