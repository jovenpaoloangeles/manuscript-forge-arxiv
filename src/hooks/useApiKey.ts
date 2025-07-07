import { useState, useEffect } from "react";
import { STORAGE_KEYS } from "@/lib/constants";

export const useApiKey = () => {
  const [openaiApiKey, setOpenaiApiKey] = useState("");

  // Load API key from localStorage on mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem(STORAGE_KEYS.OPENAI_API_KEY);
    if (savedApiKey) {
      setOpenaiApiKey(savedApiKey);
    }
  }, []);

  // Save API key to localStorage when it changes
  useEffect(() => {
    if (openaiApiKey) {
      localStorage.setItem(STORAGE_KEYS.OPENAI_API_KEY, openaiApiKey);
    }
  }, [openaiApiKey]);

  return {
    openaiApiKey,
    setOpenaiApiKey
  };
};