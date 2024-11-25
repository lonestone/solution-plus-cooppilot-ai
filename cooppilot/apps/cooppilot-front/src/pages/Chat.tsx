import ChatEntries, {
  ChatEntriesRef,
} from "@/components/organisms/ChatEntries";
import Prompt from "@/components/organisms/Prompt";
import { Button } from "@/components/ui/button";
import { useChatEntries } from "@/hooks/useChatEntries";
import { useCreateChatEntry } from "@/hooks/useCreateChatEntry";
import { useLastChatCleanupMutation } from "@/hooks/useLastChatCleanupMutation";
import useScrollable, { ScrollPosition } from "@/hooks/useScrollable";
import { cn } from "@/lib/utils";
import { ChatEntry } from "@common/types/back/chat";
import { ChevronDown } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export type Entry = ChatEntry;

const Chat = ({
  projectSlug,
  initialQuestion,
  onEmptyChange,
  onQuestionChange,
}: {
  projectSlug: string | undefined;
  initialQuestion: string | undefined;
  onEmptyChange: (empty: boolean) => void;
  onQuestionChange: (question: string) => void;
}) => {
  const {
    data: chatEntries,
    isLoading,
    error,
    mutate,
  } = useChatEntries({ projectSlug });
  const { trigger: clearChatHistory } = useLastChatCleanupMutation();
  const { trigger: createChatEntry } = useCreateChatEntry({ projectSlug });

  const chatEntriesRef = useRef<ChatEntriesRef>(null);

  const [isReady, setIsReady] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  const [isFirstScrollCalled, setIsFirstScrollCalled] = useState(false);

  useEffect(() => {
    if (projectSlug == null) {
      mutate(undefined);
      setIsReady(false);
      setIsTouched(false);
      setIsFirstScrollCalled(false);
      clearChatHistory();
    }
  }, [clearChatHistory, mutate, projectSlug]);

  useEffect(() => {
    if (chatEntries != null) setIsReady(true);
  }, [chatEntries]);

  const entries: Entry[] = useMemo(() => chatEntries ?? [], [chatEntries]);

  useEffect(() => {
    onEmptyChange((isLoading || entries.length === 0) && !isTouched);
  }, [onEmptyChange, isLoading, entries, isTouched]);

  const sendMessage = useCallback(
    async (message: string) => {
      setIsTouched(true);

      await createChatEntry(message);

      mutate();
    },
    [createChatEntry, mutate]
  );

  // const scrollableRef = useRef(document.documentElement);
  const scrollableRef = useRef(null);

  const { scrollPositionRef, scrollToBottom } = useScrollable(
    scrollableRef,
    20
  );

  useEffect(() => {
    if (isReady && !isFirstScrollCalled) {
      scrollToBottom();
      setIsFirstScrollCalled(true);
    }
  }, [isReady, isFirstScrollCalled, scrollToBottom]);

  if (error) return <div>Error loading messages</div>;

  return (
    <div className="justify-end overflow-hidden">
      <div
        ref={scrollableRef}
        className={cn(
          "w-full h-full overflow-x-hidden overflow-y-auto px-10 pb-40",
          "max-w-4xl mx-auto",
          // "flex flex-col justify-end",
          isReady ? "animate-in fade-in fill-mode-forwards" : "hidden"
        )}
      >
        <ChatEntries ref={chatEntriesRef} chatEntries={entries} />
      </div>
      {chatEntries != null && (
        <>
          <div className="sticky bottom-[10rem] pointer-events-none">
            <div className="max-w-2xl mx-auto flex justify-center">
              <ScrollButton
                isDisabled={!isReady || !isFirstScrollCalled}
                scrollPositionRef={scrollPositionRef}
                onClick={scrollToBottom}
              />
            </div>
          </div>
          <div className="sticky bottom-[1.5rem]">
            <div className={cn("max-w-4xl mx-auto", "px-10")}>
              <Prompt
                initialValue={initialQuestion}
                onValueChange={onQuestionChange}
                onSubmit={sendMessage}
              />
            </div>
          </div>
        </>
      )}
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
