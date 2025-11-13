import { useState, useEffect, useCallback } from "react";

interface UseTypewriterOptions {
  speed?: number;
  punctuationDelay?: number;
}

/**
 * Custom hook for typewriter animation effect
 * Displays text character by character with configurable delays
 * 
 * @param text - The text to display with typewriter effect
 * @param options - Configuration options
 * @param options.speed - Base delay between characters in milliseconds (default: 30)
 * @param options.punctuationDelay - Additional delay after punctuation in milliseconds (default: 150)
 * @returns Object with typewriter state and control functions
 */
export const useTypewriter = (
  text: string,
  options: UseTypewriterOptions = {}
) => {
  const { speed = 30, punctuationDelay = 150 } = options;
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const start = useCallback(() => {
    setDisplayedText("");
    setCurrentIndex(0);
    setIsComplete(false);
    setIsTyping(true);
  }, []);

  const reset = useCallback(() => {
    setDisplayedText("");
    setCurrentIndex(0);
    setIsComplete(false);
    setIsTyping(false);
  }, []);

  useEffect(() => {
    if (!isTyping || currentIndex >= text.length) {
      if (currentIndex >= text.length && isTyping) {
        setIsComplete(true);
        setIsTyping(false);
      }
      return;
    }

    const currentChar = text[currentIndex];
    const isPunctuation = [".", "!", "?", ","].includes(currentChar);
    const delay = isPunctuation ? punctuationDelay : speed;

    const timer = setTimeout(() => {
      setDisplayedText((prev) => prev + currentChar);
      setCurrentIndex((prev) => prev + 1);
    }, delay);

    return () => clearTimeout(timer);
  }, [text, currentIndex, isTyping, speed, punctuationDelay]);

  return {
    displayedText,
    isComplete,
    isTyping,
    start,
    reset,
  };
};

