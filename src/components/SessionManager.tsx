import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Save, FolderOpen, Trash2, Calendar } from "lucide-react";
import { useSessionManager, SessionData } from "@/hooks/useSessionManager";
import { PaperSection } from "./PaperStructure";

interface SessionManagerProps {
  paperTitle: string;
  authors: string;
  sections: PaperSection[];
  onLoadSession: (session: SessionData) => void;
}

export const SessionManager = ({
  paperTitle,
  authors,
  sections,
  onLoadSession
}: SessionManagerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [sessionName, setSessionName] = useState("");
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const { sessions, saveSession, loadSession, deleteSession, initializeSessions } = useSessionManager();

  useEffect(() => {
    initializeSessions();
  }, [initializeSessions]);

  const handleSaveSession = () => {
    const name = sessionName.trim() || `Session ${new Date().toLocaleString()}`;
    const abstractSection = sections.find(s => s.title.toLowerCase() === 'abstract');
    const abstractContent = abstractSection?.generatedContent || '';
    saveSession(paperTitle, authors, abstractContent, sections, name);
    setSessionName("");
    setShowSaveDialog(false);
  };

  const handleLoadSession = (sessionId: string) => {
    const session = loadSession(sessionId);
    if (session) {
      onLoadSession(session);
      setIsOpen(false);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const getSectionCount = (sections: PaperSection[]) => {
    return sections.filter(s => s.generatedContent).length;
  };

  return (
    <>
      <div className="flex gap-2">
        <Button
          onClick={() => setShowSaveDialog(true)}
          variant="academicOutline"
          size="sm"
          className="flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          Save Session
        </Button>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              variant="academicOutline"
              size="sm"
              className="flex items-center gap-2"
            >
              <FolderOpen className="h-4 w-4" />
              Load Session
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FolderOpen className="h-5 w-5" />
                Saved Sessions
              </DialogTitle>
            </DialogHeader>
            
            <ScrollArea className="max-h-[60vh]">
              <div className="space-y-4">
                {sessions.length === 0 ? (
                  <div className="text-center py-8 text-academic-muted">
                    No saved sessions found
                  </div>
                ) : (
                  sessions
                    .slice()
                    .reverse()
                    .map((session) => (
                      <Card key={session.id} className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{session.name}</CardTitle>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(session.timestamp)}
                              </Badge>
                              <Button
                                onClick={() => handleLoadSession(session.id)}
                                variant="academic"
                                size="sm"
                              >
                                Load
                              </Button>
                              <Button
                                onClick={() => deleteSession(session.id)}
                                variant="ghost"
                                size="sm"
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-academic-text">Title:</span>
                              <span className="text-academic-muted">
                                {session.paperTitle || "Untitled"}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-academic-text">Sections:</span>
                              <span className="text-academic-muted">
                                {getSectionCount(session.sections)} of {session.sections.length} completed
                              </span>
                            </div>
                            {session.abstract && (
                              <div>
                                <span className="font-medium text-academic-text">Abstract:</span>
                                <p className="text-academic-muted text-xs mt-1 line-clamp-2">
                                  {session.abstract.substring(0, 150)}...
                                </p>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))
                )}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>

      {/* Save Session Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Save Session</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-academic-text mb-2 block">
                Session Name (optional)
              </label>
              <Input
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
                placeholder="Enter a name for this session..."
                onKeyDown={(e) => e.key === 'Enter' && handleSaveSession()}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                onClick={() => setShowSaveDialog(false)}
                variant="ghost"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveSession}
                variant="academic"
              >
                Save Session
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};