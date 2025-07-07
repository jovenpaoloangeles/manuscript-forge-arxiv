import { PaperSection } from "./PaperStructure";
import { ExportControls } from "./ExportControls";
import { FormattedPreview } from "./FormattedPreview";

interface PaperPreviewProps {
  sections: PaperSection[];
  paperTitle: string;
  authors: string;
}

export const PaperPreview = ({ sections, paperTitle, authors }: PaperPreviewProps) => {
  return (
    <div className="space-y-6">
      <ExportControls
        sections={sections}
        paperTitle={paperTitle}
        authors={authors}
      />
      
      <FormattedPreview
        sections={sections}
        paperTitle={paperTitle}
        authors={authors}
      />
    </div>
  );
};