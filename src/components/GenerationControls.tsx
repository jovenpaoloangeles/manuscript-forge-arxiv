import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wand2, MessageSquare } from "lucide-react";
import { PaperSection } from "./PaperStructure";

interface GenerationControlsProps {
  sections: PaperSection[];
  isGenerating: boolean;
  onGenerateAll: () => void;
  onShowGlobalCritique: () => void;
}

export const GenerationControls = ({
  sections,
  isGenerating,
  onGenerateAll,
  onShowGlobalCritique
}: GenerationControlsProps) => {
  if (sections.length === 0) return null;

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Badge variant="secondary" className="bg-academic-blue/10 text-academic-blue">
          {sections.filter(s => s.generatedContent).length} / {sections.length} Generated
        </Badge>
        {isGenerating && (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
            Generating...
          </Badge>
        )}
      </div>
      <div className="flex gap-2">
        <Button
          onClick={onShowGlobalCritique}
          variant="academicOutline"
          disabled={sections.filter(s => s.generatedContent).length === 0}
          className="flex items-center gap-2"
        >
          <MessageSquare className="h-4 w-4" />
          Review Full Paper
        </Button>
        <Button
          onClick={onGenerateAll}
          variant="academic"
          disabled={isGenerating || sections.every(s => s.generatedContent)}
          className="flex items-center gap-2"
        >
          <Wand2 className="h-4 w-4" />
          Generate All Sections
        </Button>
      </div>
    </div>
  );
};