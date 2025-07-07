import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import OpenAI from "openai";
import { PaperSection } from "@/components/PaperStructure";

export const useOpenAI = () => {
  const [openaiApiKey, setOpenaiApiKey] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  // Load API key from localStorage on mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem("openai-api-key");
    if (savedApiKey) {
      setOpenaiApiKey(savedApiKey);
    }
  }, []);

  // Save API key to localStorage when it changes
  useEffect(() => {
    if (openaiApiKey) {
      localStorage.setItem("openai-api-key", openaiApiKey);
    }
  }, [openaiApiKey]);

  const createSectionPrompt = (section: PaperSection, title: string, abstract: string): string => {
    let prompt = `Write an academic section for "${section.title}" for a paper titled "${title || 'Academic Research Paper'}".`;
    
    if (abstract) {
      prompt += ` The paper's abstract is: "${abstract}"`;
    }
    
    if (section.description) {
      prompt += ` The section should cover: ${section.description}`;
    }
    
    if (section.bulletPoints.length > 0) {
      prompt += ` Key points to address:\n${section.bulletPoints.map(point => `• ${point}`).join('\n')}`;
    }
    
    prompt += `\n\nWrite 2-3 well-structured paragraphs with proper academic citations [1], [2], etc. Use formal scholarly language appropriate for academic publication.`;
    
    return prompt;
  };

  const generateSectionContent = async (section: PaperSection, paperTitle: string, abstract: string): Promise<string> => {
    if (!openaiApiKey) {
      toast({
        title: "API key required",
        description: "Please enter your OpenAI API key to generate content.",
        variant: "destructive",
      });
      throw new Error("API key required");
    }

    setIsGenerating(true);
    
    try {
      const openai = new OpenAI({
        apiKey: openaiApiKey,
        dangerouslyAllowBrowser: true
      });

      const prompt = createSectionPrompt(section, paperTitle, abstract);

      const completion = await openai.chat.completions.create({
        model: "gpt-4.1-2025-04-14",
        messages: [
          {
            role: "system",
            content: "You are an expert academic writer. Generate well-structured, scholarly content with proper citations in brackets [1], [2], etc. Use formal academic language and include relevant references."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.7
      });

      const generatedContent = completion.choices[0]?.message?.content || "";
      
      toast({
        title: "Content generated",
        description: `Generated academic content for ${section.title}`,
      });

      return generatedContent;
    } catch (error) {
      console.error("OpenAI API Error:", error);
      toast({
        title: "Generation failed",
        description: "Failed to generate content. Please check your API key and try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  const generateCaption = async (figureDescription: string, sectionTitle: string, paperTitle: string, abstract: string): Promise<string> => {
    if (!openaiApiKey) {
      toast({
        title: "API key required",
        description: "Please enter your OpenAI API key to generate captions.",
        variant: "destructive",
      });
      throw new Error("API key required");
    }

    setIsGenerating(true);
    
    try {
      const openai = new OpenAI({
        apiKey: openaiApiKey,
        dangerouslyAllowBrowser: true
      });

      const prompt = `Write a brief, academic figure caption for: "${figureDescription}". 
      Context: This figure is in the "${sectionTitle}" section of a paper titled "${paperTitle || 'Academic Research Paper'}".
      ${abstract ? `Paper abstract: "${abstract}"` : ''}
      
      Generate a concise, professional caption (1-2 sentences) that would be appropriate for an academic publication.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4.1-2025-04-14",
        messages: [
          {
            role: "system",
            content: "You are an expert academic writer. Generate brief, professional figure captions suitable for academic publications."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 150,
        temperature: 0.7
      });

      const generatedCaption = completion.choices[0]?.message?.content || "";
      
      toast({
        title: "Caption generated",
        description: "Figure caption has been generated successfully.",
      });

      return generatedCaption;
    } catch (error) {
      console.error("OpenAI API Error:", error);
      toast({
        title: "Generation failed",
        description: "Failed to generate caption. Please check your API key and try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  const rewriteText = async (selectedText: string, sectionTitle: string, paperTitle: string, abstract: string, prompt?: string): Promise<string> => {
    if (!openaiApiKey) {
      toast({
        title: "API key required",
        description: "Please enter your OpenAI API key to rewrite text.",
        variant: "destructive",
      });
      throw new Error("API key required");
    }

    try {
      const openai = new OpenAI({
        apiKey: openaiApiKey,
        dangerouslyAllowBrowser: true
      });

      let rewritePrompt = `Rewrite the following text from an academic paper to improve it while maintaining academic tone and accuracy: "${selectedText}"`;
      
      if (prompt) {
        rewritePrompt += `\n\nSpecific instructions: ${prompt}`;
      }
      
      rewritePrompt += `\n\nContext: This text is from the "${sectionTitle}" section of a paper titled "${paperTitle || 'Academic Research Paper'}".`;
      
      if (abstract) {
        rewritePrompt += `\nPaper abstract: "${abstract}"`;
      }

      const completion = await openai.chat.completions.create({
        model: "gpt-4.1-2025-04-14",
        messages: [
          {
            role: "system",
            content: "You are an expert academic editor. Rewrite the provided text to improve clarity, flow, and academic quality while maintaining the original meaning and technical accuracy."
          },
          {
            role: "user",
            content: rewritePrompt
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      });

      const rewrittenText = completion.choices[0]?.message?.content || selectedText;
      return rewrittenText;
    } catch (error) {
      console.error("OpenAI API Error:", error);
      throw error;
    }
  };

  return {
    openaiApiKey,
    setOpenaiApiKey,
    isGenerating,
    generateSectionContent,
    generateCaption,
    rewriteText
  };
};