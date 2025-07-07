import React, { createContext, useContext, useState, ReactNode } from 'react';
import { PaperSection } from '@/components/PaperStructure';

interface PaperContextType {
  paperTitle: string;
  setPaperTitle: (title: string) => void;
  authors: string;
  setAuthors: (authors: string) => void;
  sections: PaperSection[];
  setSections: (sections: PaperSection[] | ((prev: PaperSection[]) => PaperSection[])) => void;
  openaiApiKey: string;
  setOpenaiApiKey: (key: string) => void;
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

  const value: PaperContextType = {
    paperTitle,
    setPaperTitle,
    authors,
    setAuthors,
    sections,
    setSections,
    openaiApiKey,
    setOpenaiApiKey,
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