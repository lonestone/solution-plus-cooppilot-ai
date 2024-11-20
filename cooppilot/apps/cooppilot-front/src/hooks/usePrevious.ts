import { useEffect, useRef } from "react";

export default function usePrevious<T = string>(value: T): T | undefined {
  // create a new reference
  const ref = useRef<T>();

  // store current value in ref
  useEffect(() => {
    ref.current = value;
  }, [value]); // only re-run if value changes

  // return previous value (happens before update in useEffect above)
  return ref.current;
}
