import { useCallback, useEffect, useRef } from "react";

export enum ScrollPosition {
  Middle,
  Bottom,
}

export default function useScrollable(isBottomThreshold: number = 1) {
  const scrollPositionRef = useRef<ScrollPosition>(ScrollPosition.Middle);
  const scrollableElemRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(
    (behavior?: "smooth" | "instant") => {
      if (!scrollableElemRef.current) return;
      const scrollTop =
        scrollableElemRef.current.scrollHeight -
        scrollableElemRef.current.clientHeight;
      const scrollLength = Math.abs(
        scrollableElemRef.current.scrollTop - scrollTop
      );
      if (scrollLength === 0) {
        return;
      }

      scrollableElemRef.current.scrollTo({
        top: scrollTop,
        left: 0,
        behavior: behavior
          ? behavior
          : scrollLength > scrollableElemRef.current.clientHeight * 2
          ? "instant"
          : "smooth",
      });
    },
    [scrollableElemRef]
  );

  // Scroll to bottom when content size changes and scroll position in set to bottom
  useEffect(() => {
    if (!scrollableElemRef.current) {
      console.error("useScrollable: Elem is null");
      return;
    }

    let animationFrameId: number | null = null;
    let previousScrollHeight = scrollableElemRef.current.scrollHeight;
    function handler() {
      if (!scrollableElemRef.current) return;

      // Scroll height has increased
      if (scrollableElemRef.current.scrollHeight > previousScrollHeight) {
        // Keep scroll position at bottom
        if (scrollPositionRef.current === ScrollPosition.Bottom) {
          scrollableElemRef.current.scrollTop =
            scrollableElemRef.current.scrollHeight -
            scrollableElemRef.current.clientHeight;
        }
      }

      // Update scroll position
      scrollPositionRef.current =
        scrollableElemRef.current.scrollTop + isBottomThreshold >=
        scrollableElemRef.current.scrollHeight -
          scrollableElemRef.current.clientHeight
          ? ScrollPosition.Bottom
          : ScrollPosition.Middle;

      previousScrollHeight = scrollableElemRef.current.scrollHeight;

      animationFrameId = window.requestAnimationFrame(handler);
    }
    handler();

    return () => {
      if (animationFrameId != null)
        window.cancelAnimationFrame(animationFrameId);
    };
  }, [isBottomThreshold, scrollableElemRef]);

  return {
    scrollPositionRef,
    scrollableElemRef,
    scrollToBottom,
  };
}
