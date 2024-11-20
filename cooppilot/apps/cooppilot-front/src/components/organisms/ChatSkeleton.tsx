import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

type ChatEntrySkeletonProps = {
  isLeft: boolean;
  displayUser?: boolean;
};

export const ChatEntrySkeleton = ({
  isLeft,
  displayUser = true,
}: ChatEntrySkeletonProps) => {
  const randomWidth = useMemo(() => {
    return Math.floor(Math.random() * (600 - 300) + 300);
  }, []);

  return (
    <div
      className={cn("flex flex-row w-full items-center gap-2", {
        "justify-end": isLeft,
      })}
      id="list-view-item"
    >
      {!isLeft && displayUser && (
        <div className="rounded-3xl bg-stone-900 py-2 px-4">
          <Skeleton className="w-full h-4 bg-stone-700 rounded-full" />
        </div>
      )}
      <Skeleton
        className={cn(
          `rounded-full max-w-full h-10 p-2 text-xs text-stone-50`,
          isLeft ? "rounded-tr-none" : "rounded-tl-none"
        )}
        style={{ width: `${randomWidth}px` }}
      />
      {isLeft && displayUser && (
        <div className="rounded-3xl bg-stone-900 py-2 px-4">
          <Skeleton className="w-full h-4 bg-stone-700 rounded-full" />
        </div>
      )}
    </div>
  );
};

const ChatSkeleton = () => {
  return (
    <div className="flex w-full h-full justify-center">
      <div className="w-full max-w-[1100px] flex flex-col h-full">
        <div className="flex flex-col gap-4 items-end h-full w-full flex-grow overflow-hidden">
          <div className="flex flex-col w-full items-start gap-4 flex-grow justify-start">
            <ChatEntrySkeleton isLeft={true} />
            <ChatEntrySkeleton isLeft={false} />
            <ChatEntrySkeleton isLeft={true} />
            <ChatEntrySkeleton isLeft={false} />
          </div>
          <div className="flex flex-col w-full items-center gap-4 justify-center">
            <Skeleton className="w-[170px] h-9 bg-stone-700 rounded-full" />
            <div className="md:w-[calc(100%-100px)] lg:w-[calc(100%-200px)] w-full pb-1">
              <Skeleton className="w-full h-12 bg-stone-700 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatSkeleton;
