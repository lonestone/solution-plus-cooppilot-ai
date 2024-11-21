import ChatEntries, {
  ChatEntriesRef,
} from "@/components/organisms/ChatEntries";
import Prompt from "@/components/organisms/Prompt";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useChatEntries } from "@/hooks/useChatEntries";
import { useCreateChatEntry } from "@/hooks/useCreateChatEntry";
import { useLastChatCleanupMutation } from "@/hooks/useLastChatCleanupMutation";
import useScrollable, { ScrollPosition } from "@/hooks/useScrollable";
import { cn } from "@/lib/utils";
import { ChatEntry } from "@common/types/back/chat";
import { ChevronDown } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

export type Entry = ChatEntry;

const Chat = ({
  projectSlug,
  question,
}: {
  projectSlug: string | undefined;
  question: string | undefined;
}) => {
  const {
    data: chatEntries,
    isLoading,
    error,
    mutate,
  } = useChatEntries({ projectSlug });
  const { trigger: clearChatHistory } = useLastChatCleanupMutation();
  const { trigger: createChatEntry } = useCreateChatEntry();

  const chatEntriesRef = useRef<ChatEntriesRef>(null);

  useEffect(() => {
    if (projectSlug == null) clearChatHistory();
  }, [clearChatHistory, projectSlug]);

  const sendMessage = useCallback(
    async (message: string) => {
      await createChatEntry(message);

      mutate();
    },
    [createChatEntry, mutate]
  );

  const entries: Entry[] = useMemo(() => {
    return chatEntries ?? [];
  }, [chatEntries]);

  // NOTE always ready for now
  const [isReady, setIsReady] = useState(true);

  const { scrollPositionRef, scrollToBottom } = useScrollable(
    document.documentElement,
    20
  );

  const [firstScrollCalled, setFirstScrollCalled] = useState(false);
  useEffect(() => {
    if (isReady && !firstScrollCalled) {
      scrollToBottom();
      setFirstScrollCalled(true);
    }
  }, [isReady, firstScrollCalled, scrollToBottom]);

  if (error) return <div>Error loading messages</div>;
  if (!chatEntries) return null;

  return (
    <div className="flex w-full h-full justify-center">
      <div className="w-full max-w-[932px] flex flex-col h-full">
        <div className="flex flex-col gap-[2.5rem] h-full w-full flex-grow overflow-hidden justify-end">
          {/* <ChatEntries ref={chatEntriesRef} chatEntries={entries} /> */}
          <div
            className={cn(
              "flex-1 mx-auto mt-4 w-full max-w-[calc(42rem+9rem)]",
              "flex flex-col justify-end",
              isReady ? "animate-in fade-in fill-mode-forwards" : "hidden"
            )}
          >
            <ChatEntries ref={chatEntriesRef} chatEntries={entries} />
          </div>
          <div className="sticky bottom-[10rem] pointer-events-none">
            <div className="max-w-2xl mx-auto flex justify-center">
              <ScrollButton
                isDisabled={!isReady || !firstScrollCalled}
                scrollPositionRef={scrollPositionRef}
                onClick={scrollToBottom}
              />
            </div>
          </div>
          <div className="sticky bottom-[1.5rem]">
            <div className="px-[1px]">
              <Prompt initialValue={question} onSubmit={sendMessage} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;

function ScrollButton({
  onClick,
  isDisabled,
  scrollPositionRef,
}: {
  onClick: () => void;
  isDisabled: boolean;
  scrollPositionRef: React.MutableRefObject<ScrollPosition>;
}) {
  const [isBottom, setIsBottom] = useState(false);
  const [now, setNow] = useState(0);
  const [isNotBottomTime, setIsNotBottomTime] = useState(0);
  useEffect(() => {
    function check() {
      setNow(Date.now());
      setIsBottom((curr) => {
        const ib = scrollPositionRef.current === ScrollPosition.Bottom;
        if (curr && !ib) setIsNotBottomTime(Date.now());
        return ib;
      });
    }
    const interval = setInterval(check, 100);
    return () => clearInterval(interval);
  }, [scrollPositionRef]);

  const [lastClickTime, setLastClickTime] = useState(0);
  const buttonClickHandler = useCallback(() => {
    setLastClickTime(Date.now());
    onClick();
  }, [onClick]);

  const state = useMemo(() => {
    return isDisabled ||
      isBottom ||
      now - lastClickTime < 1000 ||
      now - isNotBottomTime < 500
      ? "disabled"
      : "enabled";
  }, [isBottom, isNotBottomTime, isDisabled, lastClickTime, now]);

  return (
    <Button
      variant="secondary"
      size="icon"
      aria-label="Go to bottom"
      onClick={buttonClickHandler}
      data-state={state}
      className={cn(
        "rounded-full",
        "data-[state=enabled]:pointer-events-auto data-[state=disabled]:pointer-events-none",
        "fill-mode-forwards",
        "data-[state=enabled]:animate-in data-[state=disabled]:animate-out",
        "data-[state=enabled]:fade-in data-[state=disabled]:fade-out"
      )}
    >
      <ChevronDown />
    </Button>
  );
}
