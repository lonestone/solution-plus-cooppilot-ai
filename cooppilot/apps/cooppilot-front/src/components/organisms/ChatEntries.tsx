import ChatAnswer from "@/components/molecules/ChatAnswer";
import ChatQuestion from "@/components/molecules/ChatQuestion";
import { useLastChatCleanup } from "@/hooks/useLastChatCleanup";
import useScrollable, { ScrollPosition } from "@/hooks/useScrollable";
import { Entry } from "@/pages/Chat";
import {
  forwardRef,
  Ref,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";

type ChatEntriesProps = {
  chatEntries: Entry[];
};

export type ChatEntriesRef = {
  scrollToBottom: (behavior?: "smooth" | "instant") => void;
};

const ChatEntries = forwardRef<ChatEntriesRef, ChatEntriesProps>(
  ({ chatEntries }: ChatEntriesProps, ref: Ref<ChatEntriesRef>) => {
    const { scrollToBottom, scrollPositionRef, scrollableElemRef } =
      useScrollable();
    const { data: lastChatCleanup } = useLastChatCleanup();
    const [hasLoaded, setHasLoaded] = useState(false);
    const [nbLoaded, setNbLoaded] = useState(0);

    const requestScrollToBottom = useCallback(() => {
      if (scrollPositionRef.current !== ScrollPosition.Bottom) return;
      scrollToBottom();
    }, [scrollPositionRef, scrollToBottom]);

    const handleEntryLoaded = useCallback(() => {
      setNbLoaded((prevNbLoaded) => prevNbLoaded + 1);
    }, []);

    useImperativeHandle(ref, () => ({
      scrollToBottom,
    }));

    useEffect(() => {
      if (nbLoaded >= chatEntries?.length && !hasLoaded) {
        setHasLoaded(true);
        setTimeout(() => {
          scrollToBottom();
        }, 100);
      }
      // Disabling because of unecessary calls when all dependencies are given
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [nbLoaded]);

    const entriesBeforeCleanup = useMemo(
      () =>
        chatEntries?.filter(
          (chatEntry) =>
            chatEntry.createdAt.getTime() >
            (lastChatCleanup?.lastCleanup.getTime() ?? 0)
        ),
      [chatEntries, lastChatCleanup]
    );

    const entriesAfterCleanup = useMemo(
      () =>
        chatEntries?.filter(
          (chatEntry) =>
            chatEntry.createdAt.getTime() <=
            (lastChatCleanup?.lastCleanup?.getTime() ?? 0)
        ),
      [chatEntries, lastChatCleanup]
    );

    return (
      <div
        id="list-view"
        className="w-full justify-end overflow-y-auto space-y-4 md-pt-0 pt-4"
        ref={scrollableElemRef}
      >
        {Array.isArray(entriesAfterCleanup) &&
          entriesAfterCleanup.map((entry) => (
            <div
              key={entry.id}
              className="flex flex-col gap-4 opacity-40 pointer-events-none"
            >
              <ChatQuestion question={entry.query} />
              <ChatAnswer
                onLoaded={handleEntryLoaded}
                isActive={false}
                projectId={entry.projectId}
                chatEntryId={entry.id}
                onChatEntryUpdated={requestScrollToBottom}
              />
            </div>
          ))}
        {Array.isArray(entriesBeforeCleanup) &&
          entriesBeforeCleanup.map((entry) => (
            <div key={entry.id} className="flex flex-col gap-4">
              <ChatQuestion question={entry.query} />
              <ChatAnswer
                onLoaded={handleEntryLoaded}
                isActive
                projectId={entry.projectId}
                chatEntryId={entry.id}
                onChatEntryUpdated={requestScrollToBottom}
              />
            </div>
          ))}
      </div>
    );
  }
);

export default ChatEntries;
