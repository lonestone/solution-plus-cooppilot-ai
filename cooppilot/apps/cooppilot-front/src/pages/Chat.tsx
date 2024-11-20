import ChatClearHistory from "@/components/molecules/ChatClearHistory";
import InspireMe from "@/components/molecules/InspireMe";
import ChatEntries, {
  ChatEntriesRef,
} from "@/components/organisms/ChatEntries";
import ChatPromptInput from "@/components/organisms/ChatPromptInput";
import ChatSkeleton from "@/components/organisms/ChatSkeleton";
import NewChatHeader from "@/components/organisms/NewChatHeader";
import { useToast } from "@/components/ui/use-toast";
import { useChatEntries } from "@/hooks/useChatEntries";
import { QuestionCategory, useChatExamples } from "@/hooks/useChatExamples";
import { useCreateChatEntry } from "@/hooks/useCreateChatEntry";
import { useLastChatCleanupMutation } from "@/hooks/useLastChatCleanupMutation";
import { ChatEntry } from "@common/types/back/chat";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

export type ChatEntryExamples = {
  examples: QuestionCategory[];
  createdAt: Date;
};

export type Entry = ChatEntry | ChatEntryExamples;

const Chat = () => {
  const { data: chatEntries, isLoading, error, mutate } = useChatEntries();
  const { trigger: clearChatHistory } = useLastChatCleanupMutation();
  const { toast } = useToast();
  const { t } = useTranslation();
  const { trigger: createChatEntry } = useCreateChatEntry();
  const [searchParams, setSearchParams] = useSearchParams();
  let hasLoaded = false;

  const chatEntriesRef = useRef<ChatEntriesRef>(null);

  const [examples, setExamples] = useState<QuestionCategory[] | null>(null);

  const sendMessage = useCallback(
    async (message: string) => {
      setExamples(null);
      await createChatEntry(message);

      mutate();
    },
    [createChatEntry, mutate]
  );

  useEffect(() => {
    if (searchParams.has("newQuery") && !hasLoaded) {
      sendMessage(searchParams.get("newQuery") as string);
      setSearchParams({});
      // Prevents double triggering in dev mode
      hasLoaded = true;
    }
  }, [searchParams]);

  const deleteChatHistory = async () => {
    try {
      await clearChatHistory();
      toast({
        title: t("Toast.successTitle"),
        description: t("Chat.conversationClearSuccess"),
      });
      mutate();
    } catch (error) {
      toast({
        title: t("Toast.errorTitle"),
        description: t("Chat.conversationClearError"),
        variant: "destructive",
      });
    }
  };

  const questions = useChatExamples();

  const addQuestionsToEntries = () => {
    const newValue = examples ? null : questions;

    setExamples(newValue);

    setTimeout(() => {
      chatEntriesRef.current?.scrollToBottom("smooth");
    }, 100);
  };

  const entries: Entry[] = useMemo(() => {
    const entries = [
      ...(chatEntries ?? []),
      { examples: examples ?? [], createdAt: new Date() },
    ];

    return entries;
  }, [examples, chatEntries]);

  const onExampleClick = (example: string) => {
    sendMessage(example);
  };

  if (error) return <div>failed to load</div>;
  if (isLoading || !chatEntries) return <ChatSkeleton />;

  return (
    <div className="flex w-full h-full justify-center">
      <div className="w-full max-w-[1100px] flex flex-col h-full">
        <div className="flex flex-col gap-[2.5rem] items-end h-full w-full flex-grow overflow-hidden justify-end">
          {chatEntries.length < 1 && (
            <NewChatHeader onExampleClick={sendMessage} />
          )}
          {chatEntries.length >= 1 && (
            <ChatEntries
              ref={chatEntriesRef}
              chatEntries={entries}
              onExampleClick={onExampleClick}
            />
          )}
          <div className="flex flex-col w-full items-start gap-4 justify-center">
            <div className="flex flex-row gap-4">
              {chatEntries.length >= 1 && (
                <InspireMe
                  onClick={addQuestionsToEntries}
                  type={examples ? "inactive" : "active"}
                />
              )}
              {chatEntries.length > 0 && (
                <ChatClearHistory onDeleteConfirm={deleteChatHistory} />
              )}
            </div>
            <div className="w-[calc(100%-2px)] pb-1 m-auto">
              <ChatPromptInput sendMessage={sendMessage} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
