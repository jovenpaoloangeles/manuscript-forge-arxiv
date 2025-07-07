import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useApiKey } from "./useApiKey";
import { PaperSection } from "@/components/PaperStructure";
import { 
  generateSectionContent as generateSection,
  generateCaption as generateFigureCaption,
  generateAbstract as generatePaperAbstract,
  suggestTitles as suggestPaperTitles,
  rewriteText as rewriteTextContent
} from "@/lib/openai/generators";

export const useOpenAI = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const { openaiApiKey, setOpenaiApiKey } = useApiKey();

  const validateApiKey = () => {
    if (!openaiApiKey) {
      toast({
        title: "API key required",
        description: "Please enter your OpenAI API key to generate content.",
        variant: "destructive",
      });
      throw new Error("API key required");
    }
  };

  const handleGenerationError = (error: any, operation: string) => {
    console.error(`OpenAI API Error (${operation}):`, error);
    toast({
      title: "Generation failed",
      description: `Failed to ${operation}. Please check your API key and try again.`,
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
      if (section.title.toLowerCase() === 'abstract') {
        const fullPaperContent = getFullPaperContentForContext();
        generatedContent = await generatePaperAbstract(paperTitle, fullPaperContent, openaiApiKey);
      } else {
        generatedContent = await generateSection(section, paperTitle, abstract, openaiApiKey);
      }
      
      toast({
        title: "Content generated",
        description: `Generated academic content for ${section.title}`,
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
        title: "Caption generated",
        description: "Figure caption has been generated successfully.",
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
        title: "Abstract generated",
        description: "Abstract has been generated based on the full paper content.",
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
        title: "Titles suggested",
        description: `Generated ${titles.length} alternative titles.`,
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
    return "No content available yet.";
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