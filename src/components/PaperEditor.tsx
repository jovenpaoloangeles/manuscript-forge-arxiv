import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PaperStructure, PaperSection } from "./PaperStructure";
import { PaperPreview } from "./PaperPreview";
import { PaperMetadata } from "./PaperMetadata";
import { GenerationControls } from "./GenerationControls";
import { EditorCritique } from "./EditorCritique";
import { SessionManager } from "./SessionManager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useOpenAI } from "@/hooks/useOpenAI";
import { SessionData } from "@/hooks/useSessionManager";

export const PaperEditor = () => {
  const [paperTitle, setPaperTitle] = useState("");
  const [authors, setAuthors] = useState("");
  const [sections, setSections] = useState<PaperSection[]>([]);
  const [showGlobalCritique, setShowGlobalCritique] = useState(false);
  const { toast } = useToast();
  
  const {
    openaiApiKey,
    setOpenaiApiKey,
    isGenerating,
    generateSectionContent,
    generateCaption,
    generateAbstract,
    suggestTitles,
    rewriteText
  } = useOpenAI();

  const handleGenerateSection = async (sectionId: string) => {
    const section = sections.find(s => s.id === sectionId);
    if (!section) return;

    try {
      let generatedContent;
      
      // Special handling for Abstract section
      if (section.title.toLowerCase() === 'abstract') {
        const fullPaperContent = getFullPaperContentForContext();
        generatedContent = await generateAbstract(paperTitle, fullPaperContent);
      } else {
        const abstractSection = sections.find(s => s.title.toLowerCase() === 'abstract');
        const abstractContent = abstractSection?.generatedContent || '';
        generatedContent = await generateSectionContent(section, paperTitle, abstractContent);
      }
      
      const updatedSections = sections.map(s => 
        s.id === sectionId 
          ? { ...s, generatedContent }
          : s
      );
      setSections(updatedSections);
      
      // Check if we need to add References section after content generation
      setTimeout(() => {
        ensureReferencesSection(updatedSections);
        // Also update existing References section if citations changed
        const hasReferences = updatedSections.some(s => s.title.toLowerCase().includes('reference'));
        if (hasReferences) {
          setTimeout(() => updateReferencesSection(), 200);
        }
      }, 100);
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleGenerateCaption = async (sectionId: string, figureId: string) => {
    const section = sections.find(s => s.id === sectionId);
    const figure = section?.figures.find(f => f.id === figureId);
    
    if (!section || !figure || !figure.description.trim()) return;

    try {
      const abstractSection = sections.find(s => s.title.toLowerCase() === 'abstract');
      const abstractContent = abstractSection?.generatedContent || '';
      
      const generatedCaption = await generateCaption(
        figure.description,
        section.title,
        paperTitle,
        abstractContent
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
    const abstractSection = sections.find(s => s.title.toLowerCase() === 'abstract');
    const abstractContent = abstractSection?.generatedContent || '';
    
    return await rewriteText(
      selectedText,
      section?.title || "Unknown Section",
      paperTitle,
      abstractContent,
      prompt
    );
  };

  const handleSuggestTitles = async () => {
    try {
      const abstractSection = sections.find(s => s.title.toLowerCase() === 'abstract');
      const abstractContent = abstractSection?.generatedContent || '';
      const fullPaperContent = getFullPaperContentForContext();
      
      const titles = await suggestTitles(paperTitle, abstractContent, fullPaperContent);
      
      // Update the PaperMetadata component with suggested titles
      // This will be handled through a state update mechanism
      return titles;
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleLoadSession = (session: SessionData) => {
    setPaperTitle(session.paperTitle);
    setAuthors(session.authors);
    setSections(session.sections);
  };

  // Check for citations on mount and when sections change
  useEffect(() => {
    if (sections.length > 0) {
      setTimeout(() => ensureReferencesSection(), 500);
    }
  }, [sections.length]);

  // Function to detect citation placeholders in content
  const hasCitationPlaceholders = () => {
    return sections.some(section => 
      section.generatedContent && section.generatedContent.includes('[CITE:')
    );
  };

  // Function to extract citation reasons and generate numbered references
  const generateReferencesFromCitations = (sectionsToCheck = sections) => {
    const citationReasons = new Set<string>();
    
    // Extract all unique citation reasons from all sections
    sectionsToCheck.forEach(section => {
      if (section.generatedContent) {
        const citeMatches = section.generatedContent.match(/\[CITE:\s*([^\]]+)\]/g);
        if (citeMatches) {
          citeMatches.forEach(match => {
            const reason = match.replace(/\[CITE:\s*/, '').replace(/\]/, '').trim();
            citationReasons.add(reason);
          });
        }
      }
    });

    // Convert to numbered reference list
    const references = Array.from(citationReasons).map((reason, index) => 
      `[${index + 1}] ${reason}`
    ).join('\n');

    return references || "No citations found in the text.";
  };

  // Automatically add References section when citations are detected
  const ensureReferencesSection = (sectionsToCheck = sections) => {
    const hasReferences = sectionsToCheck.some(s => s.title.toLowerCase().includes('reference'));
    const hasCitations = sectionsToCheck.some(section => 
      section.generatedContent && section.generatedContent.includes('[CITE:')
    );
    
    console.log('Checking for citations:', { hasCitations, hasReferences, sectionsCount: sectionsToCheck.length });
    
    if (hasCitations && !hasReferences) {
      const referencesContent = generateReferencesFromCitations(sectionsToCheck);
      const referencesSection = {
        id: `section-references-${Date.now()}`,
        title: "References",
        description: "Academic references and citations",
        bulletPoints: [],
        figures: [],
        generatedContent: referencesContent
      };
      setSections(prev => [...prev, referencesSection]);
      console.log('Added References section with generated content');
    }
  };

  // Update References section when citations change
  const updateReferencesSection = () => {
    const referencesSection = sections.find(s => s.title.toLowerCase().includes('reference'));
    if (referencesSection) {
      const updatedReferences = generateReferencesFromCitations();
      setSections(prev => prev.map(s => 
        s.id === referencesSection.id 
          ? { ...s, generatedContent: updatedReferences }
          : s
      ));
    }
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
    
    return `Title: ${paperTitle}\n\nAuthors: ${authors}\n\n${fullContent}`;
  };

  const getFullPaperContentForContext = () => {
    const sectionsWithContent = sections
      .filter(s => s.generatedContent && s.title.toLowerCase() !== 'abstract')
      .map(s => `${s.title}\n\n${s.generatedContent}`)
      .join('\n\n');
    
    return sectionsWithContent || "No content available yet.";
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
          openaiApiKey={openaiApiKey}
          setOpenaiApiKey={setOpenaiApiKey}
          onSuggestTitles={handleSuggestTitles}
          isGenerating={isGenerating}
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
          <div className="flex justify-between items-center">
              <div className="flex gap-3">
                <GenerationControls
                  sections={sections}
                  isGenerating={isGenerating}
                  onGenerateAll={generateAllSections}
                  onShowGlobalCritique={() => setShowGlobalCritique(true)}
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
                onLoadSession={handleLoadSession}
              />
            </div>

            <PaperStructure
              sections={sections}
              onSectionsChange={setSections}
              onGenerateSection={handleGenerateSection}
              onGenerateCaption={handleGenerateCaption}
              onRewriteSelection={handleRewriteSelection}
              paperTitle={paperTitle}
            />
          </TabsContent>

          <TabsContent value="preview">
            <PaperPreview
              sections={sections}
              paperTitle={paperTitle}
              authors={authors}
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
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};