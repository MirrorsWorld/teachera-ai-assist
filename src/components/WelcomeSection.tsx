
interface WelcomeSectionProps {
  title: string;
}

const WelcomeSection = ({ title }: WelcomeSectionProps) => {
  return (
    <div className="text-center max-w-4xl mx-auto py-5 pb-10">
      <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
        {title}
      </h1>
      <p className="text-lg text-gray-500 mb-10 max-w-2xl mx-auto">
        可以帮你备课，输入你想要讲解的知识点或试题，自动生成对应的可视化内容
      </p>
    </div>
  );
};

export default WelcomeSection;
