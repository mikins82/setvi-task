import { useEffect, useState } from "react";
import { TIMING } from "../constants";

/**
 * Custom hook that debounces a value
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds (default from constants)
 * @returns The debounced value
 */
export function useDebounce<T>(
  value: T,
  delay: number = TIMING.DEBOUNCE_DELAY
): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
