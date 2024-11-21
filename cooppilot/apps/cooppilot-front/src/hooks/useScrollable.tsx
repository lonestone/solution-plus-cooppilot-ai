import { useCallback, useEffect, useRef } from "react";

export enum ScrollPosition {
  Middle,
  Bottom,
}

export default function useScrollable(
  scrollableElem: HTMLElement,
  isBottomThreshold: number = 1
) {
  const scrollPositionRef = useRef<ScrollPosition>(ScrollPosition.Middle);

  const scrollToBottom = useCallback(() => {
    if (!scrollableElem) return;
    const scrollTop = scrollableElem.scrollHeight - scrollableElem.clientHeight;
    const scrollLength = Math.abs(scrollableElem.scrollTop - scrollTop);
    if (scrollLength === 0) {
      return;
    }

    scrollableElem.scrollTo({
      top: scrollTop,
      left: 0,
      behavior:
        scrollLength > scrollableElem.clientHeight * 2 ? "instant" : "smooth",
    });
  }, [scrollableElem]);

  // Scroll to bottom when content size changes and scroll position in set to bottom
  useEffect(() => {
    if (!scrollableElem) {
      console.error("useScrollable: Elem is null");
      return;
    }

    let animationFrameId: number | null = null;
    let previousScrollHeight = scrollableElem.scrollHeight;
    function handler() {
      // Scroll height has increased
      if (scrollableElem.scrollHeight > previousScrollHeight) {
        // Keep scroll position at bottom
        if (scrollPositionRef.current === ScrollPosition.Bottom) {
          scrollableElem.scrollTop =
            scrollableElem.scrollHeight - scrollableElem.clientHeight;
        }
      }

      // Update scroll position
      scrollPositionRef.current =
        scrollableElem.scrollTop + isBottomThreshold >=
        scrollableElem.scrollHeight - scrollableElem.clientHeight
          ? ScrollPosition.Bottom
          : ScrollPosition.Middle;

      previousScrollHeight = scrollableElem.scrollHeight;

      animationFrameId = window.requestAnimationFrame(handler);
    }
    handler();

    return () => {
      if (animationFrameId != null)
        window.cancelAnimationFrame(animationFrameId);
    };
  }, [isBottomThreshold, scrollableElem]);

  return {
    scrollPositionRef,
    scrollToBottom,
  };
}
