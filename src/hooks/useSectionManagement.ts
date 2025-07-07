import { useToast } from "@/hooks/use-toast";
import { useOpenAI } from "@/hooks/useOpenAI";
import { PaperSection } from "@/components/PaperStructure";
import { usePaperContent } from "./usePaperContent";
import { useCitationDetection } from "./useCitationDetection";
import { usePaper } from "@/contexts/PaperContext";

interface UseSectionManagementProps {
  sections: PaperSection[];
  setSections: (sections: PaperSection[] | ((prev: PaperSection[]) => PaperSection[])) => void;
  paperTitle: string;
  authors: string;
}

export const useSectionManagement = ({ 
  sections, 
  setSections, 
  paperTitle, 
  authors 
}: UseSectionManagementProps) => {
  const { toast } = useToast();
  const { openaiApiKey } = usePaper();
  const { 
    isGenerating,
    generateSectionContent,
    generateCaption,
    generateAbstract,
    suggestTitles,
    rewriteText
  } = useOpenAI();
  
  const { getFullPaperContentForContext } = usePaperContent({ sections, paperTitle, authors });
  const { ensureReferencesSection, updateReferencesSection } = useCitationDetection({ sections, setSections });

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

  return {
    isGenerating,
    handleGenerateSection,
    handleGenerateCaption,
    handleRewriteSelection,
    handleSuggestTitles,
    generateAllSections
  };
};