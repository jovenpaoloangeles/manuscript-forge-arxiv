import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";

interface ContentVersion {
  id: string;
  content: string;
  timestamp: number;
  isManualEdit: boolean;
  description: string;
}

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
  const [contentVersions, setContentVersions] = useState<ContentVersion[]>([]);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  // Initialize version history with current content
  useEffect(() => {
    if (content && contentVersions.length === 0) {
      const initialVersion: ContentVersion = {
        id: `version-${Date.now()}`,
        content,
        timestamp: Date.now(),
        isManualEdit: false,
        description: "Initial content"
      };
      setContentVersions([initialVersion]);
    }
  }, [content, contentVersions.length]);

  useEffect(() => {
    setEditedContent(content);
  }, [content]);

  useEffect(() => {
    setHasUnsavedChanges(editedContent !== content);
  }, [editedContent, content]);

  const saveContentVersion = (newContent: string, isManualEdit: boolean, description: string) => {
    const version: ContentVersion = {
      id: `version-${Date.now()}`,
      content: newContent,
      timestamp: Date.now(),
      isManualEdit,
      description
    };
    setContentVersions(prev => [...prev, version]);
  };

  const handleSave = () => {
    saveContentVersion(editedContent, true, "Manual edit");
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
      saveContentVersion(generatedContent, false, "Reverted to generated");
      onContentChange(generatedContent, false);
      setEditedContent(generatedContent);
      setHasUnsavedChanges(false);
      
      toast({
        title: "Reverted to generated content",
        description: "Section content has been restored to the AI-generated version.",
      });
    }
  };

  const handleRevertToVersion = (version: ContentVersion) => {
    saveContentVersion(version.content, false, `Reverted to ${version.description}`);
    onContentChange(version.content, version.isManualEdit);
    setEditedContent(version.content);
    setHasUnsavedChanges(false);
    setShowVersionHistory(false);
    
    toast({
      title: "Reverted to previous version",
      description: `Content restored to: ${version.description}`,
    });
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
    contentVersions,
    showVersionHistory,
    setShowVersionHistory,
    textareaRef,
    handleSave,
    handleCancel,
    handleRevertToGenerated,
    handleRevertToVersion,
    handleTextSelection,
    handleRewriteSelection
  };
};