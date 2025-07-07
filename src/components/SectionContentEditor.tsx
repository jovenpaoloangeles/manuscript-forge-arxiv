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
      <div className={`space-y-4 ${className}`}>
        <Textarea
          value={editedContent}
          onChange={(e) => onContentChange(e.target.value)}
          onMouseUp={onTextSelect}
          className="min-h-[300px] resize-none font-serif leading-relaxed glass border-0 shadow-card focus:shadow-card-hover transition-all duration-300 text-academic-text placeholder:text-academic-muted"
          placeholder="Start writing your section content..."
        />
        
        {hasUnsavedChanges && (
          <div className="flex items-center gap-3 text-status-editing bg-gradient-to-r from-status-editing/10 to-status-editing/5 p-4 rounded-xl border border-status-editing/20 animate-fade-in">
            <AlertTriangle className="h-5 w-5" />
            <span className="text-sm font-medium">You have unsaved changes</span>
          </div>
        )}
        
        <div className="flex gap-3">
          <Button onClick={onSaveChanges} variant="academic" size="sm" className="hover-lift">
            Save Changes
          </Button>
          <Button onClick={onCancelEdit} variant="glass" size="sm" className="hover-lift">
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`group prose max-w-none cursor-pointer p-6 rounded-2xl glass hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 ${className}`}
      onClick={onStartEdit}
    >
      <div className="whitespace-pre-wrap font-serif leading-relaxed text-academic-text">
        {content || (
          <span className="text-academic-muted italic">
            Click to start editing this section...
          </span>
        )}
      </div>
      <div className="mt-4 text-sm text-academic-muted opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-2">
        <div className="h-1 w-8 bg-gradient-academic rounded-full"></div>
        <span>Click to edit this section</span>
      </div>
    </div>
  );
};