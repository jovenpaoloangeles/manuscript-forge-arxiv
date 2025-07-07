import { Button } from "@/components/ui/button";
import { GenerationControls } from "./GenerationControls";
import { SessionManager } from "./SessionManager";
import { SessionData } from "@/hooks/useSessionManager";
import { usePaper } from "@/contexts/PaperContext";

interface PaperControlsProps {
  isGenerating: boolean;
  hasCitationPlaceholders: () => boolean;
  ensureReferencesSection: () => void;
  onGenerateAll: () => void;
  onShowGlobalCritique: () => void;
  onLoadSession: (session: SessionData) => void;
}

export const PaperControls = ({
  isGenerating,
  hasCitationPlaceholders,
  ensureReferencesSection,
  onGenerateAll,
  onShowGlobalCritique,
  onLoadSession
}: PaperControlsProps) => {
  const { sections, paperTitle, authors } = usePaper();
  return (
    <div className="flex justify-between items-center">
      <div className="flex gap-3">
        <GenerationControls
          sections={sections}
          isGenerating={isGenerating}
          onGenerateAll={onGenerateAll}
          onShowGlobalCritique={onShowGlobalCritique}
        />
        <Button
          onClick={() => ensureReferencesSection()}
          variant="academicOutline"
          size="sm"
          disabled={!hasCitationPlaceholders()}
        >
          Add References Section
        </Button>
      </div>
      <SessionManager
        paperTitle={paperTitle}
        authors={authors}
        sections={sections}
        onLoadSession={onLoadSession}
      />
    </div>
  );
};