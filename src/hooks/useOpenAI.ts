import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { usePaper } from "@/contexts/PaperContext";
import { PaperSection } from "@/components/PaperStructure";
import { 
  generateSectionContent as generateSection,
  generateCaption as generateFigureCaption,
  generateAbstract as generatePaperAbstract,
  suggestTitles as suggestPaperTitles,
  rewriteText as rewriteTextContent
} from "@/lib/openai/generators";
import { TOAST_MESSAGES, DEFAULT_MESSAGES, SECTION_TYPES } from "@/lib/constants";

export const useOpenAI = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const { openaiApiKey, setOpenaiApiKey } = usePaper();

  const validateApiKey = () => {
    if (!openaiApiKey) {
      toast({
        title: TOAST_MESSAGES.API_KEY_REQUIRED.title,
        description: TOAST_MESSAGES.API_KEY_REQUIRED.description,
        variant: "destructive",
      });
      throw new Error("API key required");
    }
  };

  const handleGenerationError = (error: any, operation: string) => {
    console.error(`OpenAI API Error (${operation}):`, error);
    toast({
      title: TOAST_MESSAGES.GENERATION_FAILED.title,
      description: TOAST_MESSAGES.GENERATION_FAILED.description.replace("{operation}", operation),
      variant: "destructive",
    });
    throw error;
  };

  const generateSectionContent = async (section: PaperSection, paperTitle: string, abstract: string): Promise<string> => {
    validateApiKey();
    setIsGenerating(true);
    
    try {
      let generatedContent;
      
      // Special handling for Abstract section
      if (section.title.toLowerCase() === SECTION_TYPES.ABSTRACT) {
        const fullPaperContent = getFullPaperContentForContext();
        generatedContent = await generatePaperAbstract(paperTitle, fullPaperContent, openaiApiKey);
      } else {
        generatedContent = await generateSection(section, paperTitle, abstract, openaiApiKey);
      }
      
      toast({
        title: TOAST_MESSAGES.CONTENT_GENERATED.title,
        description: TOAST_MESSAGES.CONTENT_GENERATED.description.replace("{sectionTitle}", section.title),
      });

      return generatedContent;
    } catch (error) {
      handleGenerationError(error, "generate content");
      return "";
    } finally {
      setIsGenerating(false);
    }
  };

  const generateCaption = async (figureDescription: string, sectionTitle: string, paperTitle: string, abstract: string): Promise<string> => {
    validateApiKey();
    setIsGenerating(true);
    
    try {
      const generatedCaption = await generateFigureCaption(
        figureDescription,
        sectionTitle,
        paperTitle,
        abstract,
        openaiApiKey
      );
      
      toast({
        title: TOAST_MESSAGES.CAPTION_GENERATED.title,
        description: TOAST_MESSAGES.CAPTION_GENERATED.description,
      });

      return generatedCaption;
    } catch (error) {
      handleGenerationError(error, "generate caption");
      return "";
    } finally {
      setIsGenerating(false);
    }
  };

  const generateAbstract = async (paperTitle: string, fullPaperContent: string): Promise<string> => {
    validateApiKey();
    setIsGenerating(true);
    
    try {
      const generatedAbstract = await generatePaperAbstract(paperTitle, fullPaperContent, openaiApiKey);
      
      toast({
        title: TOAST_MESSAGES.ABSTRACT_GENERATED.title,
        description: TOAST_MESSAGES.ABSTRACT_GENERATED.description,
      });

      return generatedAbstract;
    } catch (error) {
      handleGenerationError(error, "generate abstract");
      return "";
    } finally {
      setIsGenerating(false);
    }
  };

  const suggestTitles = async (paperTitle: string, abstract: string, fullPaperContent: string): Promise<string[]> => {
    validateApiKey();
    setIsGenerating(true);
    
    try {
      const titles = await suggestPaperTitles(paperTitle, abstract, fullPaperContent, openaiApiKey);
      
      toast({
        title: TOAST_MESSAGES.TITLES_SUGGESTED.title,
        description: TOAST_MESSAGES.TITLES_SUGGESTED.description.replace("{count}", titles.length.toString()),
      });

      return titles;
    } catch (error) {
      handleGenerationError(error, "suggest titles");
      return [];
    } finally {
      setIsGenerating(false);
    }
  };

  const rewriteText = async (selectedText: string, sectionTitle: string, paperTitle: string, abstract: string, prompt?: string): Promise<string> => {
    validateApiKey();

    try {
      return await rewriteTextContent(
        selectedText,
        sectionTitle,
        paperTitle,
        abstract,
        openaiApiKey,
        prompt
      );
    } catch (error) {
      handleGenerationError(error, "rewrite text");
      return selectedText;
    }
  };

  // Helper function to get full paper content for context
  const getFullPaperContentForContext = (): string => {
    // This would need to be passed from the component or stored in context
    // For now, return a default message
    return DEFAULT_MESSAGES.NO_CONTENT_AVAILABLE;
  };

  return {
    openaiApiKey,
    setOpenaiApiKey,
    isGenerating,
    generateSectionContent,
    generateCaption,
    generateAbstract,
    suggestTitles,
    rewriteText
  };
};