import { useCallback, useEffect, useState } from "react";

export const useMostVisibleElement = (
  refs: React.MutableRefObject<HTMLDivElement | null>[]
) => {
  const [mostVisibleElementRef, setMostVisibleRef] =
    useState<HTMLDivElement | null>(null);
  const onScroll = useCallback(() => {
    if (!refs.length) return;

    let mostVisibleRef = refs[0];
    let maxVisibleArea = 0;

    refs.forEach((ref) => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const visibleArea = Math.max(
          0,
          Math.min(window.innerHeight, rect.bottom) - Math.max(0, rect.top)
        );

        if (visibleArea > maxVisibleArea) {
          maxVisibleArea = visibleArea;
          mostVisibleRef = ref;
        }
      }
    });

    setMostVisibleRef(mostVisibleRef.current);
  }, [refs]);

  useEffect(() => {
    onScroll();
  }, [onScroll]);

  return {
    onScroll,
    mostVisibleElementRef,
  };
};
