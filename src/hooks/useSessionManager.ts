import { useState, useCallback } from "react";
import { PaperSection } from "@/components/PaperStructure";
import { useToast } from "@/hooks/use-toast";

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
      const stored = localStorage.getItem('academic-paper-sessions');
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
      localStorage.setItem('academic-paper-sessions', JSON.stringify(sessionsToSave));
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
      id: `session-${Date.now()}`,
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
      title: "Session saved",
      description: `Session "${newSession.name}" has been saved successfully.`,
    });

    return newSession.id;
  }, [sessions, saveSessionsToStorage, toast]);

  // Load a session
  const loadSession = useCallback((sessionId: string): SessionData | null => {
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      toast({
        title: "Session loaded",
        description: `Session "${session.name}" has been loaded.`,
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
      title: "Session deleted",
      description: "Session has been deleted successfully.",
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