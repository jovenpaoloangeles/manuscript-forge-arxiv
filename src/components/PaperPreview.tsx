import { ExportControls } from "./ExportControls";
import { FormattedPreview } from "./FormattedPreview";
import { usePaper } from "@/contexts/PaperContext";

export const PaperPreview = () => {
  const { sections, paperTitle, authors } = usePaper();
  return (
    <div className="space-y-6">
      <ExportControls />
      
      <FormattedPreview />
    </div>
  );
};