
import { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import MainContent from "../components/MainContent";

const Index = () => {
  const [activeTitle, setActiveTitle] = useState("我是你的A教师助理TeacherA");

  return (
    <div className="min-h-screen flex flex-col font-roboto">
      <Header />
      
      <div className="flex flex-1 max-w-7xl mx-auto w-full p-5 gap-6 h-[calc(100vh-80px)]">
        <div className="hidden lg:block">
          <Sidebar />
        </div>
        
        <div className="flex-1">
          <MainContent activeTitle={activeTitle} />
        </div>
        
        {/* Mobile sidebar overlay could be added here */}
      </div>
    </div>
  );
};

export default Index;
