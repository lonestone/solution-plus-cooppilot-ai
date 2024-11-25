import { RefObject, useCallback, useEffect, useRef } from "react";

export enum ScrollPosition {
  Middle,
  Bottom,
}

export default function useScrollable(
  scrollableElem: RefObject<HTMLElement | undefined>,
  isBottomThreshold: number = 1
) {
  const scrollPositionRef = useRef<ScrollPosition>(ScrollPosition.Middle);

  const scrollToBottom = useCallback(() => {
    if (scrollableElem.current == null) return;
    const scrollTop =
      scrollableElem.current.scrollHeight - scrollableElem.current.clientHeight;
    const scrollLength = Math.abs(scrollableElem.current.scrollTop - scrollTop);
    if (scrollLength === 0) {
      return;
    }

    scrollableElem.current.scrollTo({
      top: scrollTop,
      left: 0,
      behavior:
        scrollLength > scrollableElem.current.clientHeight * 2
          ? "instant"
          : "smooth",
    });
  }, [scrollableElem]);

  // Scroll to bottom when content size changes and scroll position in set to bottom
  useEffect(() => {
    if (scrollableElem.current == null) return;

    const elem = scrollableElem.current;

    let animationFrameId: number | null = null;
    let previousScrollHeight = elem.scrollHeight;
    function handler() {
      // Scroll height has increased
      if (elem.scrollHeight > previousScrollHeight) {
        // Keep scroll position at bottom
        if (scrollPositionRef.current === ScrollPosition.Bottom) {
          elem.scrollTop = elem.scrollHeight - elem.clientHeight;
        }
      }

      // Update scroll position
      scrollPositionRef.current =
        elem.scrollTop + isBottomThreshold >=
        elem.scrollHeight - elem.clientHeight
          ? ScrollPosition.Bottom
          : ScrollPosition.Middle;

      previousScrollHeight = elem.scrollHeight;

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
