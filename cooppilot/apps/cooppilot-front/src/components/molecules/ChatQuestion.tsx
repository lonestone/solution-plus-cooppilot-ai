import { User } from "lucide-react";

const ChatQuestion = ({ question }: { question: string }) => {
  return (
    <div
      className="flex flex-row items-center gap-2 justify-end"
      id="list-view-item"
    >
      <div className="rounded-lg ml-14 bg-[#e8e8e8] py-2 px-4">{question}</div>
      <div className="rounded-full bg-primary p-2 text-xs text-white">
        <User />
      </div>
    </div>
  );
};

export default ChatQuestion;
