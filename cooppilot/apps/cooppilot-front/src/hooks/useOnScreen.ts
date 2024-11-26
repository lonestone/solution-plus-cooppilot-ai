import { RefObject, useEffect, useMemo, useState } from "react";

export default function useOnScreen(ref: RefObject<HTMLElement>) {
  const [isIntersecting, setIntersecting] = useState(false);
  const [entry, setEntry] = useState<IntersectionObserverEntry | undefined>();

  const observer = useMemo(
    () =>
      new IntersectionObserver(([entry]) => {
        setIntersecting(entry.isIntersecting && entry.intersectionRatio > 0);
        setEntry(entry);
      }),
    [setIntersecting]
  );

  useEffect(() => {
    if (!ref.current) return;

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, observer]);

  return {
    isIntersecting,
    entry,
  };
}
