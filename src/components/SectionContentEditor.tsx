import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle } from "lucide-react";

interface SectionContentEditorProps {
  content: string;
  isEditing: boolean;
  editedContent: string;
  hasUnsavedChanges: boolean;
  onContentChange: (content: string) => void;
  onStartEdit: () => void;
  onSaveChanges: () => void;
  onCancelEdit: () => void;
  onTextSelect: (event: React.MouseEvent<HTMLTextAreaElement>) => void;
  className?: string;
}

export const SectionContentEditor = ({
  content,
  isEditing,
  editedContent,
  hasUnsavedChanges,
  onContentChange,
  onStartEdit,
  onSaveChanges,
  onCancelEdit,
  onTextSelect,
  className = ""
}: SectionContentEditorProps) => {
  if (isEditing) {
    return (
      <div className={`space-y-3 ${className}`}>
        <Textarea
          value={editedContent}
          onChange={(e) => onContentChange(e.target.value)}
          onMouseUp={onTextSelect}
          className="min-h-[300px] resize-none font-serif leading-relaxed"
          placeholder="Start writing your section content..."
        />
        
        {hasUnsavedChanges && (
          <div className="flex items-center gap-2 text-amber-600 bg-amber-50 p-2 rounded">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm">You have unsaved changes</span>
          </div>
        )}
        
        <div className="flex gap-2">
          <Button onClick={onSaveChanges} variant="academic" size="sm">
            Save Changes
          </Button>
          <Button onClick={onCancelEdit} variant="ghost" size="sm">
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`prose max-w-none cursor-pointer p-4 rounded-lg hover:bg-academic-light/50 transition-colors ${className}`}
      onClick={onStartEdit}
    >
      <div className="whitespace-pre-wrap font-serif leading-relaxed text-academic-text">
        {content || "Click to start editing..."}
      </div>
      <div className="mt-2 text-sm text-academic-muted opacity-0 group-hover:opacity-100 transition-opacity">
        Click to edit this section
      </div>
    </div>
  );
};