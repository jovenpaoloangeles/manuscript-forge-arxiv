import { useState, useCallback } from "react";
import { PaperSection } from "@/components/PaperStructure";
import { useToast } from "@/hooks/use-toast";
import { STORAGE_KEYS, SESSION_CONFIG, TOAST_MESSAGES } from "@/lib/constants";

export interface SessionData {
  id: string;
  name: string;
  timestamp: number;
  paperTitle: string;
  authors: string;
  abstract: string;
  sections: PaperSection[];
}

export const useSessionManager = () => {
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const { toast } = useToast();

  // Load sessions from localStorage on mount
  const loadSessionsFromStorage = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ACADEMIC_PAPER_SESSIONS);
      if (stored) {
        const parsedSessions = JSON.parse(stored);
        setSessions(parsedSessions);
        return parsedSessions;
      }
    } catch (error) {
      console.error('Failed to load sessions:', error);
    }
    return [];
  }, []);

  // Save sessions to localStorage
  const saveSessionsToStorage = useCallback((sessionsToSave: SessionData[]) => {
    try {
      localStorage.setItem(STORAGE_KEYS.ACADEMIC_PAPER_SESSIONS, JSON.stringify(sessionsToSave));
    } catch (error) {
      console.error('Failed to save sessions:', error);
    }
  }, []);

  // Save current state as a new session
  const saveSession = useCallback((
    paperTitle: string,
    authors: string,
    abstract: string,
    sections: PaperSection[],
    sessionName?: string
  ) => {
    const newSession: SessionData = {
      id: `${SESSION_CONFIG.ID_PREFIX}${Date.now()}`,
      name: sessionName || `Session ${new Date().toLocaleString()}`,
      timestamp: Date.now(),
      paperTitle,
      authors,
      abstract,
      sections: JSON.parse(JSON.stringify(sections)) // Deep copy
    };

    const updatedSessions = [...sessions, newSession];
    setSessions(updatedSessions);
    saveSessionsToStorage(updatedSessions);

    toast({
      title: TOAST_MESSAGES.SESSION_SAVED.title,
      description: TOAST_MESSAGES.SESSION_SAVED.description.replace("{name}", newSession.name),
    });

    return newSession.id;
  }, [sessions, saveSessionsToStorage, toast]);

  // Load a session
  const loadSession = useCallback((sessionId: string): SessionData | null => {
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      toast({
        title: TOAST_MESSAGES.SESSION_LOADED.title,
        description: TOAST_MESSAGES.SESSION_LOADED.description.replace("{name}", session.name),
      });
      return session;
    }
    return null;
  }, [sessions, toast]);

  // Delete a session
  const deleteSession = useCallback((sessionId: string) => {
    const updatedSessions = sessions.filter(s => s.id !== sessionId);
    setSessions(updatedSessions);
    saveSessionsToStorage(updatedSessions);

    toast({
      title: TOAST_MESSAGES.SESSION_DELETED.title,
      description: TOAST_MESSAGES.SESSION_DELETED.description,
    });
  }, [sessions, saveSessionsToStorage, toast]);

  // Initialize sessions from storage
  const initializeSessions = useCallback(() => {
    const loadedSessions = loadSessionsFromStorage();
    setSessions(loadedSessions);
  }, [loadSessionsFromStorage]);

  return {
    sessions,
    saveSession,
    loadSession,
    deleteSession,
    initializeSessions
  };
};