import { useEffect, useState } from "react";

export function useDebounceValue<T>(
  value: T,
  delay: number,
  delayOnNullish?: number
): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(
      () => setDebouncedValue(value),
      value == null ? delayOnNullish ?? delay : delay
    );
    return () => clearTimeout(timeout);
  }, [value, delay, delayOnNullish, debouncedValue]);

  return debouncedValue;
}
