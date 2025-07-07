import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, RotateCcw, User, Bot } from "lucide-react";

interface ContentVersion {
  id: string;
  content: string;
  timestamp: number;
  isManualEdit: boolean;
  description: string;
}

interface VersionHistoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  versions: ContentVersion[];
  onRevertToVersion: (version: ContentVersion) => void;
  sectionTitle: string;
}

export const VersionHistoryDialog = ({
  isOpen,
  onClose,
  versions,
  onRevertToVersion,
  sectionTitle
}: VersionHistoryDialogProps) => {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const getPreviewText = (content: string) => {
    return content.length > 150 ? content.substring(0, 150) + "..." : content;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Version History - {sectionTitle}
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-4">
            {versions.length === 0 ? (
              <div className="text-center py-8 text-academic-muted">
                No version history available
              </div>
            ) : (
              versions
                .slice()
                .reverse()
                .map((version) => (
                  <div
                    key={version.id}
                    className="border rounded-lg p-4 space-y-3 hover:bg-academic-light/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {version.isManualEdit ? (
                          <User className="h-4 w-4 text-blue-600" />
                        ) : (
                          <Bot className="h-4 w-4 text-green-600" />
                        )}
                        <span className="font-medium text-academic-text">
                          {version.description}
                        </span>
                        <Badge 
                          variant={version.isManualEdit ? "default" : "secondary"}
                          className={version.isManualEdit ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}
                        >
                          {version.isManualEdit ? "Manual" : "Generated"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-academic-muted">
                          {formatDate(version.timestamp)}
                        </span>
                        <Button
                          onClick={() => onRevertToVersion(version)}
                          variant="ghost"
                          size="sm"
                          className="text-academic-blue hover:bg-academic-blue/10"
                        >
                          <RotateCcw className="h-4 w-4 mr-1" />
                          Revert
                        </Button>
                      </div>
                    </div>
                    
                    <div className="bg-academic-paper p-3 rounded border text-sm font-mono">
                      <div className="text-academic-muted mb-1">Preview:</div>
                      <div className="text-academic-text">
                        {getPreviewText(version.content)}
                      </div>
                    </div>
                  </div>
                ))
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};