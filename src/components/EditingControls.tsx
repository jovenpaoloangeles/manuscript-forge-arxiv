import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Eye, Save, X, RotateCcw, MessageSquare, History } from "lucide-react";

interface EditingControlsProps {
  isEditing: boolean;
  isManuallyEdited: boolean;
  hasUnsavedChanges: boolean;
  hasGeneratedContent: boolean;
  wordCount: number;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;  
  onPreview: () => void;
  onReview: () => void;
  onRevertToGenerated?: () => void;
  onShowVersionHistory?: () => void;
  hasVersionHistory?: boolean;
}

export const EditingControls = ({
  isEditing,
  isManuallyEdited,
  hasUnsavedChanges,
  hasGeneratedContent,
  wordCount,
  onEdit,
  onSave,
  onCancel,
  onPreview,
  onReview,
  onRevertToGenerated,
  onShowVersionHistory,
  hasVersionHistory
}: EditingControlsProps) => {
  return (
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
              onClick={onPreview}
              variant="ghost"
              size="sm"
              className="text-academic-muted"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              onClick={onReview}
              variant="ghost"
              size="sm"
              className="text-academic-blue"
            >
              <MessageSquare className="h-4 w-4" />
              Review
            </Button>
            <Button
              onClick={onEdit}
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
              onClick={onCancel}
              variant="ghost"
              size="sm"
              className="text-academic-muted"
            >
              <X className="h-4 w-4" />
            </Button>
            <Button
              onClick={onSave}
              variant="academic"
              size="sm"
              disabled={!hasUnsavedChanges}
            >
              <Save className="h-4 w-4" />
              Save
            </Button>
          </>
        )}
        
        {isManuallyEdited && hasGeneratedContent && !isEditing && onRevertToGenerated && (
          <Button
            onClick={onRevertToGenerated}
            variant="ghost"
            size="sm"
            className="text-yellow-600 hover:text-yellow-700"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        )}
        
        {hasVersionHistory && !isEditing && onShowVersionHistory && (
          <Button
            onClick={onShowVersionHistory}
            variant="ghost"
            size="sm"
            className="text-academic-blue hover:bg-academic-blue/10"
            title="View version history"
          >
            <History className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};