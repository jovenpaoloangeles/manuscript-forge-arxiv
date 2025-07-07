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
    <div className="flex items-center gap-3 mb-6 p-4 glass rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300">
      {onRegenerate && (
        <Button
          onClick={onRegenerate}
          variant="academicOutline"
          size="sm"
          className="flex items-center gap-2 hover-lift"
        >
          <Wand2 className="h-4 w-4" />
          Regenerate
        </Button>
      )}
      
      <Button
        onClick={onShowPreview}
        variant="glass"
        size="sm"
        className="flex items-center gap-2 hover-lift"
      >
        <Eye className="h-4 w-4" />
        Preview
      </Button>
      
      <Button
        onClick={onShowCritique}
        variant="glass"
        size="sm"
        className="flex items-center gap-2 hover-lift"
      >
        <MessageSquare className="h-4 w-4" />
        Critique
      </Button>
      
      {isManuallyEdited && (
        <Button
          onClick={onShowVersionHistory}
          variant="glass"
          size="sm"
          className="flex items-center gap-2 hover-lift"
        >
          <History className="h-4 w-4" />
          History
        </Button>
      )}
    </div>
  );
};