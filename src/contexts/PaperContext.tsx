import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { PaperSection } from '@/components/PaperStructure';
import { STORAGE_KEYS } from '@/lib/constants';
import { Citation } from '@/components/CitationManager';

interface PaperContextType {
  paperTitle: string;
  setPaperTitle: (title: string) => void;
  authors: string;
  setAuthors: (authors: string) => void;
  sections: PaperSection[];
  setSections: (sections: PaperSection[] | ((prev: PaperSection[]) => PaperSection[])) => void;
  openaiApiKey: string;
  setOpenaiApiKey: (key: string) => void;
  citations: Citation[];
  setCitations: (citations: Citation[]) => void;
}

const PaperContext = createContext<PaperContextType | undefined>(undefined);

interface PaperProviderProps {
  children: ReactNode;
}

export const PaperProvider = ({ children }: PaperProviderProps) => {
  const [paperTitle, setPaperTitle] = useState("");
  const [authors, setAuthors] = useState("");
  const [sections, setSections] = useState<PaperSection[]>([]);
  const [openaiApiKey, setOpenaiApiKey] = useState("");
  const [citations, setCitations] = useState<Citation[]>([]);

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

  const value: PaperContextType = {
    paperTitle,
    setPaperTitle,
    authors,
    setAuthors,
    sections,
    setSections,
    openaiApiKey,
    setOpenaiApiKey,
    citations,
    setCitations,
  };

  return (
    <PaperContext.Provider value={value}>
      {children}
    </PaperContext.Provider>
  );
};

export const usePaper = () => {
  const context = useContext(PaperContext);
  if (context === undefined) {
    throw new Error('usePaper must be used within a PaperProvider');
  }
  return context;
};