import { useState } from "react";
import { SectionContentEditor } from "./SectionContentEditor";
import { SectionActionButtons } from "./SectionActionButtons";
import { SectionPreviewDialog } from "./SectionPreviewDialog";
import { SectionCritiqueDialog } from "./SectionCritiqueDialog";
import { TextRewriteDialog } from "./TextRewriteDialog";
import { VersionHistoryDialog } from "./VersionHistoryDialog";
import { useEditableSection } from "@/hooks/useEditableSection";

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
  const [showPreview, setShowPreview] = useState(false);
  const [showCritique, setShowCritique] = useState(false);

  const {
    isEditing,
    setIsEditing,
    editedContent,
    setEditedContent,
    hasUnsavedChanges,
    setHasUnsavedChanges,
    selectedText,
    showRewriteDialog,
    setShowRewriteDialog,
    showVersionHistory,
    setShowVersionHistory,
    contentVersions,
    handleTextSelection,
    handleRewriteSelection,
    handleRevertToVersion
  } = useEditableSection({
    content,
    generatedContent,
    onContentChange,
    onRewriteSelection
  });

  const handleStartEdit = () => {
    setIsEditing(true);
    setEditedContent(content);
  };

  const handleSaveChanges = () => {
    if (hasUnsavedChanges) {
      onContentChange(editedContent, true);
    }
    setIsEditing(false);
    setHasUnsavedChanges(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedContent(content);
    setHasUnsavedChanges(false);
  };

  const handleContentChange = (newContent: string) => {
    setEditedContent(newContent);
    setHasUnsavedChanges(newContent !== content);
  };

  return (
    <div className={`group space-y-6 ${className}`}>
      <SectionActionButtons
        isEditing={isEditing}
        isManuallyEdited={isManuallyEdited}
        onRegenerate={onRegenerate}
        onShowPreview={() => setShowPreview(true)}
        onShowCritique={() => setShowCritique(true)}
        onShowVersionHistory={() => setShowVersionHistory(true)}
      />

      <SectionContentEditor
        content={content}
        isEditing={isEditing}
        editedContent={editedContent}
        hasUnsavedChanges={hasUnsavedChanges}
        onContentChange={handleContentChange}
        onStartEdit={handleStartEdit}
        onSaveChanges={handleSaveChanges}
        onCancelEdit={handleCancelEdit}
        onTextSelect={handleTextSelection}
        className="animate-fade-in"
      />

      {/* Dialogs with enhanced styling */}
      <SectionPreviewDialog
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        content={content}
        sectionTitle={sectionTitle}
      />

      <SectionCritiqueDialog
        isOpen={showCritique}
        onClose={() => setShowCritique(false)}
        content={content}
        sectionTitle={sectionTitle}
        paperTitle={paperTitle}
        abstract={abstract}
      />

      <TextRewriteDialog
        isOpen={showRewriteDialog}
        onClose={() => setShowRewriteDialog(false)}
        selectedText={selectedText}
        onRewrite={handleRewriteSelection}
        isRewriting={false}
      />

      <VersionHistoryDialog
        isOpen={showVersionHistory}
        onClose={() => setShowVersionHistory(false)}
        versions={contentVersions}
        onRevertToVersion={handleRevertToVersion}
        sectionTitle={sectionTitle}
      />
    </div>
  );
};