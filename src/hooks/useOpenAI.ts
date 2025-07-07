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
    const sectionTitle = section.title.toLowerCase();
    let prompt = "";
    
    // Section-specific prompts for more natural, human-like content
    if (sectionTitle === "abstract") {
      prompt = `Write a compelling academic abstract for "${title || 'Academic Research Paper'}". This should read like a seasoned researcher's work - clear, confident, and engaging without being overly technical.`;
    } else if (sectionTitle === "introduction") {
      prompt = `Write an engaging introduction for "${title || 'Academic Research Paper'}". Start with the broader context and gradually narrow to your specific research question. Write as if you're telling a story about why this research matters, using natural academic prose that flows smoothly.`;
    } else if (sectionTitle === "methodology") {
      prompt = `Write a clear methodology section for "${title || 'Academic Research Paper'}". Explain your approach as if you're walking a colleague through your research process. Be precise but conversational in tone, focusing on the logic behind your choices.`;
    } else if (sectionTitle.includes("results") || sectionTitle.includes("discussion")) {
      prompt = `Write a results and discussion section for "${title || 'Academic Research Paper'}". Present your findings with confidence and discuss their implications thoughtfully. Write as if you're having an informed conversation with your peers about what you discovered.`;
    } else if (sectionTitle === "conclusion") {
      prompt = `Write a conclusion for "${title || 'Academic Research Paper'}". Synthesize your key contributions and their broader significance. Write with the authority of someone who has made genuine progress in their field.`;
    } else {
      prompt = `Write an academic section for "${section.title}" for a paper titled "${title || 'Academic Research Paper'}". Write in a natural, scholarly voice that demonstrates deep understanding.`;
    }
    
    if (abstract) {
      prompt += ` Context from the paper's abstract: "${abstract}"`;
    }
    
    if (section.description) {
      prompt += ` Focus on: ${section.description}`;
    }
    
    if (section.bulletPoints.length > 0) {
      prompt += ` Key points to address:\n${section.bulletPoints.map(point => `• ${point}`).join('\n')}`;
    }
    
    prompt += `\n\nWrite 2-3 well-developed paragraphs that sound like they were written by an experienced researcher. Use varied sentence structures, natural transitions, and INCLUDE AT LEAST 1-2 citation placeholders in the format [CITE: Short Reason for Citation] where appropriate (e.g., for prior work, methodologies, or specific claims). Avoid formulaic language and write with genuine scholarly voice.`;
    
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
            content: "You are a distinguished academic researcher with years of publication experience. Write in a natural, scholarly voice that demonstrates expertise without sounding artificial or formulaic. Use varied sentence structures, smooth transitions, and confident prose. ALWAYS include citation placeholders in the format [CITE: Short Reason for Citation] where appropriate for academic writing (e.g., prior work, methodologies, specific claims). Your writing should sound distinctly human - thoughtful, engaging, and authoritative."
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

  const generateAbstract = async (paperTitle: string, fullPaperContent: string): Promise<string> => {
    if (!openaiApiKey) {
      toast({
        title: "API key required",
        description: "Please enter your OpenAI API key to generate abstract.",
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

      const prompt = `Write a comprehensive abstract for the academic paper titled "${paperTitle}". 
      
      Full paper content:
      ${fullPaperContent}
      
      Generate a well-structured abstract (150-250 words) that includes:
      - Brief background and motivation
      - Research objectives and methodology
      - Key findings and results
      - Main conclusions and implications
      
      Use formal academic language appropriate for scholarly publication.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4.1-2025-04-14",
        messages: [
          {
            role: "system",
            content: "You are an expert academic writer. Generate comprehensive, well-structured abstracts for research papers that accurately summarize the entire work."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 400,
        temperature: 0.7
      });

      const generatedAbstract = completion.choices[0]?.message?.content || "";
      
      toast({
        title: "Abstract generated",
        description: "Abstract has been generated based on the full paper content.",
      });

      return generatedAbstract;
    } catch (error) {
      console.error("OpenAI API Error:", error);
      toast({
        title: "Generation failed",
        description: "Failed to generate abstract. Please check your API key and try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  const suggestTitles = async (paperTitle: string, abstract: string, fullPaperContent: string): Promise<string[]> => {
    if (!openaiApiKey) {
      toast({
        title: "API key required",
        description: "Please enter your OpenAI API key to suggest titles.",
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

      const context = abstract || fullPaperContent || "No content available";
      const prompt = `Based on the following academic paper content, suggest 5 alternative titles that are:
      - Clear and descriptive
      - Academically appropriate
      - Concise but informative
      - Different from the current title: "${paperTitle}"
      
      Paper content:
      ${context}
      
      Return only the 5 titles, one per line, without numbering or formatting.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4.1-2025-04-14",
        messages: [
          {
            role: "system",
            content: "You are an expert academic writer. Generate clear, descriptive, and academically appropriate titles for research papers."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 300,
        temperature: 0.8
      });

      const response = completion.choices[0]?.message?.content || "";
      const titles = response.split('\n').filter(title => title.trim().length > 0).slice(0, 5);
      
      toast({
        title: "Titles suggested",
        description: `Generated ${titles.length} alternative titles.`,
      });

      return titles;
    } catch (error) {
      console.error("OpenAI API Error:", error);
      toast({
        title: "Generation failed",
        description: "Failed to suggest titles. Please check your API key and try again.",
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
            content: "You are an expert academic editor. Rewrite the provided text to improve clarity, flow, and academic quality while maintaining the original meaning and technical accuracy. Use citation placeholders in the format [CITE: Short Reason for Citation] only when truly necessary - avoid citing common knowledge."
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
    generateAbstract,
    suggestTitles,
    rewriteText
  };
};