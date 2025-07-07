import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, Wand2, History } from "lucide-react";
import { EditingControls } from "./EditingControls";
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
  } = useEditableSection({
    content,
    generatedContent,
    onContentChange,
    onRewriteSelection
  });

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
      <EditingControls
        isEditing={isEditing}
        isManuallyEdited={isManuallyEdited}
        hasUnsavedChanges={hasUnsavedChanges}
        hasGeneratedContent={!!generatedContent}
        wordCount={wordCount}
        onEdit={() => setIsEditing(true)}
        onSave={handleSave}
        onCancel={handleCancel}
        onPreview={() => setShowPreview(true)}
        onReview={() => setShowCritique(true)}
        onRevertToGenerated={generatedContent ? handleRevertToGenerated : undefined}
        onShowVersionHistory={() => setShowVersionHistory(true)}
        hasVersionHistory={contentVersions.length > 1}
      />

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

      {/* Dialogs */}
      <SectionPreviewDialog
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        sectionTitle={sectionTitle}
        content={content}
      />

      <SectionCritiqueDialog
        isOpen={showCritique}
        onClose={() => setShowCritique(false)}
        sectionTitle={sectionTitle}
        content={content}
        paperTitle={paperTitle}
        abstract={abstract}
        sectionId={sectionId}
      />

      <TextRewriteDialog
        isOpen={showRewriteDialog}
        onClose={() => setShowRewriteDialog(false)}
        selectedText={selectedText}
        onRewrite={handleRewriteSelection}
        isRewriting={isRewriting}
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