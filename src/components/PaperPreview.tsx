import { ExportControls } from "./ExportControls";
import { FormattedPreview } from "./FormattedPreview";
import { CitationManager } from "./CitationManager";
import { usePaper } from "@/contexts/PaperContext";

export const PaperPreview = () => {
  const { sections, paperTitle, authors, citations, setCitations } = usePaper();
  
  const handleInsertCitation = (citationId: string) => {
    // This would typically insert the citation at the current cursor position
    // For now, we'll just show a toast
    console.log('Insert citation:', citationId);
  };

  return (
    <div className="space-y-6">
      <ExportControls />
      
      <CitationManager 
        citations={citations}
        onCitationsChange={setCitations}
        onInsertCitation={handleInsertCitation}
      />
      
      <FormattedPreview />
    </div>
  );
};