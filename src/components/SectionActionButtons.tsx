import { Button } from "@/components/ui/button";
import { Wand2, History, Eye, MessageSquare } from "lucide-react";

interface SectionActionButtonsProps {
  isEditing: boolean;
  isManuallyEdited: boolean;
  onRegenerate?: () => void;
  onShowPreview: () => void;
  onShowCritique: () => void;
  onShowVersionHistory: () => void;
}

export const SectionActionButtons = ({
  isEditing,
  isManuallyEdited,
  onRegenerate,
  onShowPreview,
  onShowCritique,
  onShowVersionHistory
}: SectionActionButtonsProps) => {
  if (isEditing) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 mb-4">
      {onRegenerate && (
        <Button
          onClick={onRegenerate}
          variant="academicOutline"
          size="sm"
          className="flex items-center gap-2"
        >
          <Wand2 className="h-4 w-4" />
          Regenerate
        </Button>
      )}
      
      <Button
        onClick={onShowPreview}
        variant="ghost"
        size="sm"
        className="flex items-center gap-2"
      >
        <Eye className="h-4 w-4" />
        Preview
      </Button>
      
      <Button
        onClick={onShowCritique}
        variant="ghost"
        size="sm"
        className="flex items-center gap-2"
      >
        <MessageSquare className="h-4 w-4" />
        Critique
      </Button>
      
      {isManuallyEdited && (
        <Button
          onClick={onShowVersionHistory}
          variant="ghost"
          size="sm"
          className="flex items-center gap-2"
        >
          <History className="h-4 w-4" />
          History
        </Button>
      )}
    </div>
  );
};