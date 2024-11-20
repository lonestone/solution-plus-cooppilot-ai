import ChatEntryFeedback from "@/components/molecules/ChatEntryFeedback";
import ChatReasoningLoader from "@/components/molecules/ChatReasoningLoader";
import ChatAnswerDetails from "@/components/organisms/ChatAnswerDetails";
import { ChatEntrySkeleton } from "@/components/organisms/ChatSkeleton";
import { useChatEntryPolling } from "@/hooks/useChatEntry";
import { ChatEntry } from "@common/types/back/chat";
import { User } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

type ChatAnswerProps = {
  chatEntryId: number;
  onChatEntryUpdated: () => void;
  onLoaded: () => void;
  isActive: boolean;
};

const ChatAnswer = ({
  chatEntryId,
  onChatEntryUpdated,
  onLoaded,
  isActive,
}: ChatAnswerProps) => {
  const { chatEntry } = useChatEntryPolling({
    active: true,
    cachedChatEntry: {} as ChatEntry,
    chatId: chatEntryId,
  });
  const { t } = useTranslation();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (chatEntry?.queryStatus !== undefined && !isLoaded) {
      setIsLoaded(true);
      onLoaded();
    }
  }, [chatEntry, chatEntry?.queryStatus, isLoaded, onLoaded]);

  useEffect(() => {
    onChatEntryUpdated();
  }, [chatEntry?.queryStatus, onChatEntryUpdated]);

  const Comp = useMemo(() => {
    if (chatEntry?.queryStatus === "DONE") {
      return (
        <Markdown remarkPlugins={[remarkGfm]}>
          {chatEntry.response.answer}
        </Markdown>
      );
    } else if (chatEntry?.queryStatus === "ERROR") {
      return <div className="text-red-400">{t("Chat.answerError")}</div>;
    } else if (
      chatEntry?.queryStatus === "PENDING" ||
      chatEntry?.queryStatus === "RUNNING" ||
      chatEntry?.queryStatus === "CREATING"
    ) {
      return <ChatReasoningLoader entry={chatEntry} />;
    } else {
      return <ChatEntrySkeleton isLeft={false} displayUser={false} />;
    }
  }, [chatEntry, t]);

  return (
    <div className="flex flex-col gap-2 items-start" id="list-view-item">
      <div className="flex flex-row items-start gap-4 w-full">
        <div className="rounded-full bg-gradient-to-r from-gradient-from to-gradient-to p-2 text-xs text-stone-50">
          <User />
        </div>
        <div
          className="markdown-content w-full md:max-w-[calc(100%-120px)] overflow-hidden"
          style={{ wordBreak: "break-word" }}
        >
          {Comp}
        </div>
      </div>
      {chatEntry?.queryStatus === "DONE" && isActive && (
        <ChatAnswerDetails chatEntry={chatEntry} />
      )}
      {chatEntry?.queryStatus === "DONE" && isActive && (
        <ChatEntryFeedback
          chatEntryId={chatEntryId}
          userFeedback={chatEntry?.answerUserFeedbacks?.[0]}
        />
      )}
    </div>
  );
};

export default ChatAnswer;
