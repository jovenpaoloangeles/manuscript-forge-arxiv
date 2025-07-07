import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface SectionPreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  sectionTitle: string;
  content: string;
}

export const SectionPreviewDialog = ({
  isOpen,
  onClose,
  sectionTitle,
  content
}: SectionPreviewDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
  );
};