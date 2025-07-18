import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Eye } from "lucide-react";
import { PaperStructure } from "./PaperStructure";
import { PaperPreview } from "./PaperPreview";
import { PaperMetadata } from "./PaperMetadata";
import { EditorCritique } from "./EditorCritique";
import { PaperHeader } from "./PaperHeader";
import { PaperControls } from "./PaperControls";
import { PaperProvider, usePaper } from "@/contexts/PaperContext";
import { useCitationDetection } from "@/hooks/useCitationDetection";
import { usePaperContent } from "@/hooks/usePaperContent";
import { useSectionManagement } from "@/hooks/useSectionManagement";
import { SessionData } from "@/hooks/useSessionManager";

const PaperEditorContent = () => {
  const [showGlobalCritique, setShowGlobalCritique] = useState(false);
  const { paperTitle, authors, sections, setPaperTitle, setAuthors, setSections } = usePaper();
  
  const { hasCitationPlaceholders, ensureReferencesSection } = useCitationDetection({ 
    sections, 
    setSections 
  });
  
  const { getFullPaperContent } = usePaperContent({ 
    sections, 
    paperTitle, 
    authors 
  });
  
  const {
    isGenerating,
    handleGenerateSection,
    handleGenerateCaption,
    handleRewriteSelection,
    handleSuggestTitles,
    generateAllSections
  } = useSectionManagement({
    sections,
    setSections,
    paperTitle,
    authors
  });

  const handleLoadSession = (session: SessionData) => {
    setPaperTitle(session.paperTitle);
    setAuthors(session.authors);
    setSections(session.sections);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        <div className="animate-fade-in">
          <PaperHeader />
        </div>

        <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <PaperMetadata
            onSuggestTitles={handleSuggestTitles}
            isGenerating={isGenerating}
          />
        </div>

        <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <Tabs defaultValue="structure" className="space-y-8">
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto glass shadow-card hover:shadow-card-hover transition-all duration-300">
              <TabsTrigger value="structure" className="flex items-center gap-2 transition-all duration-200 hover:-translate-y-0.5">
                <FileText className="h-4 w-4" />
                Structure
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex items-center gap-2 transition-all duration-200 hover:-translate-y-0.5">
                <Eye className="h-4 w-4" />
                Preview
              </TabsTrigger>
            </TabsList>

            <TabsContent value="structure" className="space-y-8">
              <div className="animate-scale-in">
                <PaperControls
                  isGenerating={isGenerating}
                  hasCitationPlaceholders={hasCitationPlaceholders}
                  ensureReferencesSection={ensureReferencesSection}
                  onGenerateAll={generateAllSections}
                  onShowGlobalCritique={() => setShowGlobalCritique(true)}
                  onLoadSession={handleLoadSession}
                />
              </div>

              <div className="animate-scale-in" style={{ animationDelay: '0.1s' }}>
                <PaperStructure
                  onGenerateSection={handleGenerateSection}
                  onGenerateCaption={handleGenerateCaption}
                  onRewriteSelection={handleRewriteSelection}
                />
              </div>
            </TabsContent>

            <TabsContent value="preview" className="animate-fade-in">
              <PaperPreview />
            </TabsContent>
          </Tabs>
        </div>

        <Dialog open={showGlobalCritique} onOpenChange={setShowGlobalCritique}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto glass">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold bg-gradient-academic bg-clip-text text-transparent">
                Full Paper Review & Critique
              </DialogTitle>
            </DialogHeader>
            <EditorCritique
              content={getFullPaperContent()}
              paperTitle={paperTitle}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export const PaperEditor = () => {
  return (
    <PaperProvider>
      <PaperEditorContent />
    </PaperProvider>
  );
};