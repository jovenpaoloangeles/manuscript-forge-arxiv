import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";

interface UseEditableSectionProps {
  content: string;
  generatedContent?: string;
  onContentChange: (content: string, isManuallyEdited: boolean) => void;
  onRewriteSelection?: (selectedText: string, prompt?: string) => Promise<string>;
}

export const useEditableSection = ({
  content,
  generatedContent,
  onContentChange,
  onRewriteSelection
}: UseEditableSectionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const [selectionStart, setSelectionStart] = useState(0);
  const [selectionEnd, setSelectionEnd] = useState(0);
  const [showRewriteDialog, setShowRewriteDialog] = useState(false);
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

  const handleRewriteSelection = async (prompt?: string) => {
    if (!onRewriteSelection || !selectedText.trim()) return;
    
    setIsRewriting(true);
    try {
      const rewrittenText = await onRewriteSelection(selectedText, prompt);
      
      // Replace the selected text with the rewritten version
      const newContent = 
        editedContent.substring(0, selectionStart) + 
        rewrittenText + 
        editedContent.substring(selectionEnd);
      
      setEditedContent(newContent);
      setShowRewriteDialog(false);
      
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

  return {
    isEditing,
    setIsEditing,
    editedContent,
    setEditedContent,
    hasUnsavedChanges,
    setHasUnsavedChanges,
    selectedText,
    showRewriteDialog,
    setShowRewriteDialog,
    isRewriting,
    textareaRef,
    handleSave,
    handleCancel,
    handleRevertToGenerated,
    handleTextSelection,
    handleRewriteSelection
  };
};