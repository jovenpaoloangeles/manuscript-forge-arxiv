import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Edit, Eye, Save, X, RotateCcw, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EditableSectionProps {
  content: string;
  generatedContent?: string;
  isManuallyEdited: boolean;
  onContentChange: (content: string, isManuallyEdited: boolean) => void;
  onRegenerate?: () => void;
  sectionTitle: string;
  className?: string;
}

export const EditableSection = ({
  content,
  generatedContent,
  isManuallyEdited,
  onContentChange,
  onRegenerate,
  sectionTitle,
  className = ""
}: EditableSectionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  const [showPreview, setShowPreview] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setEditedContent(content);
  }, [content]);

  useEffect(() => {
    setHasUnsavedChanges(editedContent !== content);
  }, [editedContent, content]);

  const handleSave = () => {
    onContentChange(editedContent, true);
    setIsEditing(false);
    setHasUnsavedChanges(false);
    
    toast({
      title: "Changes saved",
      description: "Section content has been updated with your manual edits.",
    });
  };

  const handleCancel = () => {
    setEditedContent(content);
    setIsEditing(false);
    setHasUnsavedChanges(false);
  };

  const handleRevertToGenerated = () => {
    if (generatedContent) {
      onContentChange(generatedContent, false);
      setEditedContent(generatedContent);
      setHasUnsavedChanges(false);
      
      toast({
        title: "Reverted to generated content",
        description: "Section content has been restored to the AI-generated version.",
      });
    }
  };

  const handleRegenerate = () => {
    if (isManuallyEdited && hasUnsavedChanges) {
      // Show warning about losing manual changes
      if (!window.confirm("Regenerating will overwrite your manual edits. Continue?")) {
        return;
      }
    }
    
    if (onRegenerate) {
      onRegenerate();
      setHasUnsavedChanges(false);
    }
  };

  const wordCount = editedContent.split(/\s+/).filter(word => word.length > 0).length;

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isManuallyEdited && (
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              Manually Edited
            </Badge>
          )}
          {hasUnsavedChanges && (
            <Badge variant="secondary" className="bg-orange-100 text-orange-700">
              Unsaved Changes
            </Badge>
          )}
          <span className="text-xs text-academic-muted">
            {wordCount} words
          </span>
        </div>
        
        <div className="flex gap-2">
          {!isEditing && (
            <>
              <Button
                onClick={() => setShowPreview(true)}
                variant="ghost"
                size="sm"
                className="text-academic-muted"
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                onClick={() => setIsEditing(true)}
                variant="academicOutline"
                size="sm"
              >
                <Edit className="h-4 w-4" />
                Edit
              </Button>
            </>
          )}
          
          {isEditing && (
            <>
              <Button
                onClick={handleCancel}
                variant="ghost"
                size="sm"
                className="text-academic-muted"
              >
                <X className="h-4 w-4" />
              </Button>
              <Button
                onClick={handleSave}
                variant="academic"
                size="sm"
                disabled={!hasUnsavedChanges}
              >
                <Save className="h-4 w-4" />
                Save
              </Button>
            </>
          )}
          
          {isManuallyEdited && generatedContent && !isEditing && (
            <Button
              onClick={handleRevertToGenerated}
              variant="ghost"
              size="sm"
              className="text-yellow-600 hover:text-yellow-700"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {isEditing ? (
        <div className="space-y-3">
          <Textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            rows={8}
            className="font-mono text-sm resize-none"
            placeholder="Enter your content here..."
          />
          
          {isManuallyEdited && onRegenerate && (
            <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <div className="flex-1 text-sm text-yellow-700">
                <strong>Note:</strong> This section has manual edits. Regenerating will overwrite your changes.
              </div>
              <Button
                onClick={handleRegenerate}
                variant="ghost"
                size="sm"
                className="text-yellow-600 hover:text-yellow-700"
              >
                Regenerate Anyway
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-academic-paper border rounded-lg p-4 min-h-[200px] overflow-y-auto">
          {content ? (
            <div className="whitespace-pre-wrap text-academic-text font-serif leading-relaxed">
              {content}
            </div>
          ) : (
            <div className="text-academic-muted italic text-center py-8">
              No content generated yet
            </div>
          )}
        </div>
      )}

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{sectionTitle} - Preview</DialogTitle>
          </DialogHeader>
          <div className="bg-white p-8 border rounded-lg font-serif">
            <h3 className="text-xl font-bold mb-4 text-academic-text">{sectionTitle}</h3>
            <div className="whitespace-pre-wrap text-academic-text leading-relaxed">
              {content || "No content to preview"}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};