import { useState, useEffect } from "react";

export const useApiKey = () => {
  const [openaiApiKey, setOpenaiApiKey] = useState("");

  // Load API key from localStorage on mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem("openai-api-key");
    if (savedApiKey) {
      setOpenaiApiKey(savedApiKey);
    }
  }, []);

  // Save API key to localStorage when it changes
  useEffect(() => {
    if (openaiApiKey) {
      localStorage.setItem("openai-api-key", openaiApiKey);
    }
  }, [openaiApiKey]);

  return {
    openaiApiKey,
    setOpenaiApiKey
  };
};