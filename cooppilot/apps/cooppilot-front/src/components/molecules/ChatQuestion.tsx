import { User } from "lucide-react";

const ChatQuestion = ({ question }: { question: string }) => {
  return (
    <div
      className="flex flex-row items-center gap-2 justify-end"
      id="list-view-item"
    >
      <div className="rounded-3xl ml-14 rounded-tr-none bg-stone-900 py-2 px-4">
        {question}
      </div>
      <div className="rounded-full bg-stone-700 p-2 text-xs text-stone-50">
        <User />
      </div>
    </div>
  );
};

export default ChatQuestion;
