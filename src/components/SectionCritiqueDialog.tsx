import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EditorCritique } from "./EditorCritique";

interface SectionCritiqueDialogProps {
  isOpen: boolean;
  onClose: () => void;
  sectionTitle: string;
  content: string;
  paperTitle?: string;
  abstract?: string;
  sectionId?: string;
}

export const SectionCritiqueDialog = ({
  isOpen,
  onClose,
  sectionTitle,
  content,
  paperTitle,
  abstract,
  sectionId
}: SectionCritiqueDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
  );
};