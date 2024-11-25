import { useEffect, useRef, useState } from "react";

export const useDebounceValue = <T>(
  value: T,
  delay: number,
  delayOnNullish?: number
): T => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(
      () => {
        setDebouncedValue(value);
      },
      value == null ? delayOnNullish ?? delay : delay
    );
  }, [value, delay, delayOnNullish]);

  return debouncedValue;
};
