import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PaperStructure, PaperSection } from "./PaperStructure";
import { PaperPreview } from "./PaperPreview";
import { PaperMetadata } from "./PaperMetadata";
import { GenerationControls } from "./GenerationControls";
import { EditorCritique } from "./EditorCritique";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useOpenAI } from "@/hooks/useOpenAI";

export const PaperEditor = () => {
  const [paperTitle, setPaperTitle] = useState("");
  const [authors, setAuthors] = useState("");
  const [abstract, setAbstract] = useState("");
  const [sections, setSections] = useState<PaperSection[]>([]);
  const [showGlobalCritique, setShowGlobalCritique] = useState(false);
  const { toast } = useToast();
  
  const {
    openaiApiKey,
    setOpenaiApiKey,
    isGenerating,
    generateSectionContent,
    generateCaption,
    rewriteText
  } = useOpenAI();

  const handleGenerateSection = async (sectionId: string) => {
    const section = sections.find(s => s.id === sectionId);
    if (!section) return;

    try {
      const generatedContent = await generateSectionContent(section, paperTitle, abstract);
      setSections(sections.map(s => 
        s.id === sectionId 
          ? { ...s, generatedContent }
          : s
      ));
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleGenerateCaption = async (sectionId: string, figureId: string) => {
    const section = sections.find(s => s.id === sectionId);
    const figure = section?.figures.find(f => f.id === figureId);
    
    if (!section || !figure || !figure.description.trim()) return;

    try {
      const generatedCaption = await generateCaption(
        figure.description,
        section.title,
        paperTitle,
        abstract
      );
      
      setSections(sections.map(s => 
        s.id === sectionId 
          ? { 
              ...s, 
              figures: s.figures.map(f => 
                f.id === figureId 
                  ? { ...f, caption: generatedCaption }
                  : f
              )
            }
          : s
      ));
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleRewriteSelection = async (sectionId: string, selectedText: string, prompt?: string): Promise<string> => {
    const section = sections.find(s => s.id === sectionId);
    
    return await rewriteText(
      selectedText,
      section?.title || "Unknown Section",
      paperTitle,
      abstract,
      prompt
    );
  };

  const generateAllSections = async () => {
    if (!openaiApiKey) {
      toast({
        title: "API key required",
        description: "Please enter your OpenAI API key to generate content.",
        variant: "destructive",
      });
      return;
    }

    for (const section of sections) {
      if (!section.generatedContent) {
        await handleGenerateSection(section.id);
        // Add delay between generations
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    toast({
      title: "All sections generated",
      description: "Successfully generated content for all sections",
    });
  };

  const getFullPaperContent = () => {
    const fullContent = sections
      .filter(s => s.generatedContent)
      .map(s => `${s.title}\n\n${s.generatedContent}`)
      .join('\n\n');
    
    return `Title: ${paperTitle}\n\nAuthors: ${authors}\n\nAbstract:\n${abstract}\n\n${fullContent}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-academic-light to-background">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-4 py-8">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-academic-blue to-primary-glow bg-clip-text text-transparent">
            <FileText className="h-8 w-8 text-academic-blue" />
            <h1 className="text-4xl font-bold">Academic Paper Assistant</h1>
          </div>
          <p className="text-lg text-academic-muted max-w-2xl mx-auto">
            Create well-structured, properly cited academic manuscripts ready for arXiv submission
          </p>
        </div>

        {/* Paper Metadata */}
        <PaperMetadata
          paperTitle={paperTitle}
          setPaperTitle={setPaperTitle}
          authors={authors}
          setAuthors={setAuthors}
          abstract={abstract}
          setAbstract={setAbstract}
          openaiApiKey={openaiApiKey}
          setOpenaiApiKey={setOpenaiApiKey}
        />

        {/* Main Content */}
        <Tabs defaultValue="structure" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="structure" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Structure
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Preview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="structure" className="space-y-6">
            <GenerationControls
              sections={sections}
              isGenerating={isGenerating}
              onGenerateAll={generateAllSections}
              onShowGlobalCritique={() => setShowGlobalCritique(true)}
            />

            <PaperStructure
              sections={sections}
              onSectionsChange={setSections}
              onGenerateSection={handleGenerateSection}
              onGenerateCaption={handleGenerateCaption}
              onRewriteSelection={handleRewriteSelection}
              paperTitle={paperTitle}
              abstract={abstract}
            />
          </TabsContent>

          <TabsContent value="preview">
            <PaperPreview
              sections={sections}
              paperTitle={paperTitle}
              authors={authors}
              abstract={abstract}
            />
          </TabsContent>
        </Tabs>

        {/* Global Critique Dialog */}
        <Dialog open={showGlobalCritique} onOpenChange={setShowGlobalCritique}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Full Paper Review & Critique</DialogTitle>
            </DialogHeader>
            <EditorCritique
              content={getFullPaperContent()}
              paperTitle={paperTitle}
              abstract={abstract}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};