import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Edit, Eye, Save, X, RotateCcw, AlertTriangle, Wand2, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { EditorCritique } from "./EditorCritique";

interface EditableSectionProps {
  content: string;
  generatedContent?: string;
  isManuallyEdited: boolean;
  onContentChange: (content: string, isManuallyEdited: boolean) => void;
  onRegenerate?: () => void;
  onRewriteSelection?: (selectedText: string, prompt?: string) => Promise<string>;
  sectionTitle: string;
  sectionId?: string;
  paperTitle?: string;
  abstract?: string;
  className?: string;
}

export const EditableSection = ({
  content,
  generatedContent,
  isManuallyEdited,
  onContentChange,
  onRegenerate,
  onRewriteSelection,
  sectionTitle,
  sectionId,
  paperTitle,
  abstract,
  className = ""
}: EditableSectionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  const [showPreview, setShowPreview] = useState(false);
  const [showCritique, setShowCritique] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const [selectionStart, setSelectionStart] = useState(0);
  const [selectionEnd, setSelectionEnd] = useState(0);
  const [showRewriteDialog, setShowRewriteDialog] = useState(false);
  const [rewritePrompt, setRewritePrompt] = useState("");
  const [isRewriting, setIsRewriting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
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

  const handleTextSelection = () => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      const selected = editedContent.substring(start, end);
      
      if (selected.trim()) {
        setSelectedText(selected);
        setSelectionStart(start);
        setSelectionEnd(end);
        setShowRewriteDialog(true);
      }
    }
  };

  const handleRewriteSelection = async () => {
    if (!onRewriteSelection || !selectedText.trim()) return;
    
    setIsRewriting(true);
    try {
      const rewrittenText = await onRewriteSelection(selectedText, rewritePrompt);
      
      // Replace the selected text with the rewritten version
      const newContent = 
        editedContent.substring(0, selectionStart) + 
        rewrittenText + 
        editedContent.substring(selectionEnd);
      
      setEditedContent(newContent);
      setShowRewriteDialog(false);
      setRewritePrompt("");
      
      toast({
        title: "Text rewritten",
        description: "Selected text has been rewritten using AI.",
      });
    } catch (error) {
      toast({
        title: "Rewriting failed",
        description: "Failed to rewrite the selected text. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRewriting(false);
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
                onClick={() => setShowCritique(true)}
                variant="ghost"
                size="sm"
                className="text-academic-blue"
              >
                <MessageSquare className="h-4 w-4" />
                Review
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
          <div className="relative">
            <Textarea
              ref={textareaRef}
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              onMouseUp={handleTextSelection}
              onKeyUp={handleTextSelection}
              rows={8}
              className="font-mono text-sm resize-none"
              placeholder="Enter your content here..."
            />
            {onRewriteSelection && (
              <div className="absolute top-2 right-2">
                <Button
                  onClick={handleTextSelection}
                  variant="ghost"
                  size="sm"
                  className="text-academic-blue hover:bg-academic-blue/10"
                  title="Select text to rewrite with AI"
                >
                  <Wand2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
          
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

      {/* Critique Dialog */}
      <Dialog open={showCritique} onOpenChange={setShowCritique}>
        <DialogContent className="max-w-6xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{sectionTitle} - AI Review & Critique</DialogTitle>
          </DialogHeader>
          <EditorCritique
            content={content}
            paperTitle={paperTitle}
            abstract={abstract}
            sectionTitle={sectionTitle}
            sectionId={sectionId}
          />
        </DialogContent>
      </Dialog>

      {/* Rewrite Selection Dialog */}
      <Dialog open={showRewriteDialog} onOpenChange={setShowRewriteDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Rewrite Selected Text</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-academic-text mb-2 block">
                Selected Text:
              </label>
              <div className="p-3 bg-academic-light border rounded-lg text-sm font-mono">
                {selectedText}
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-academic-text mb-2 block">
                Rewrite Instructions (optional):
              </label>
              <Input
                value={rewritePrompt}
                onChange={(e) => setRewritePrompt(e.target.value)}
                placeholder="e.g., 'Make it more formal', 'Simplify the language', 'Add more detail'..."
                className="text-sm"
              />
            </div>
            
            <div className="flex gap-2 justify-end">
              <Button
                onClick={() => setShowRewriteDialog(false)}
                variant="ghost"
                disabled={isRewriting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleRewriteSelection}
                variant="academic"
                disabled={isRewriting}
              >
                {isRewriting ? (
                  <>
                    <Wand2 className="h-4 w-4 animate-spin mr-2" />
                    Rewriting...
                  </>
                ) : (
                  <>
                    <Wand2 className="h-4 w-4 mr-2" />
                    Rewrite
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};