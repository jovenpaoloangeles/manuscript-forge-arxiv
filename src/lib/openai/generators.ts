import { createOpenAIClient } from "./client";
import { 
  createSectionPrompt, 
  createCaptionPrompt, 
  createAbstractPrompt, 
  createTitleSuggestionPrompt, 
  createRewritePrompt,
  createFullPaperAnalysisPrompt
} from "./prompts";
import { PaperSection } from "@/components/PaperStructure";
import { OPENAI_CONFIG } from "@/lib/constants";
import { getSelectedModel } from "@/lib/utils";

const SYSTEM_MESSAGES = {
  sectionGeneration: "You are a distinguished academic researcher with years of publication experience. Write in a natural, scholarly voice that demonstrates expertise without sounding artificial or formulaic. Use varied sentence structures, smooth transitions, and confident prose. ALWAYS include citation placeholders in the format [CITE: Short Reason for Citation] where appropriate for academic writing (e.g., prior work, methodologies, specific claims). Your writing should sound distinctly human - thoughtful, engaging, and authoritative.",
  captionGeneration: "You are an expert academic writer. Generate brief, professional figure captions suitable for academic publications.",
  abstractGeneration: "You are an expert academic writer. Generate comprehensive, well-structured abstracts for research papers that accurately summarize the entire work.",
  titleSuggestion: "You are an expert academic writer. Generate clear, descriptive, and academically appropriate titles for research papers.",
  textRewriting: "You are an expert academic editor. Rewrite the provided text to improve clarity, flow, and academic quality while maintaining the original meaning and technical accuracy. Use citation placeholders in the format [CITE: Short Reason for Citation] only when truly necessary - avoid citing common knowledge.",
  fullPaperAnalysis: "You are an expert academic peer reviewer for a top-tier journal. Analyze the provided academic paper comprehensively and return structured feedback in valid JSON format without any markdown formatting."
};

export const generateSectionContent = async (
  section: PaperSection, 
  paperTitle: string, 
  abstract: string, 
  apiKey: string
): Promise<string> => {
  const openai = createOpenAIClient(apiKey);
  const prompt = createSectionPrompt(section, paperTitle, abstract);

  const completion = await openai.chat.completions.create({
    model: getSelectedModel(),
    messages: [
      {
        role: "system",
        content: SYSTEM_MESSAGES.sectionGeneration
      },
      {
        role: "user",
        content: prompt
      }
    ],
    max_tokens: OPENAI_CONFIG.MAX_TOKENS.SECTION_CONTENT,
    temperature: OPENAI_CONFIG.TEMPERATURE.DEFAULT
  });

  return completion.choices[0]?.message?.content || "";
};

export const generateCaption = async (
  figureDescription: string, 
  sectionTitle: string, 
  paperTitle: string, 
  abstract: string, 
  apiKey: string
): Promise<string> => {
  const openai = createOpenAIClient(apiKey);
  const prompt = createCaptionPrompt(figureDescription, sectionTitle, paperTitle, abstract);

  const completion = await openai.chat.completions.create({
    model: getSelectedModel(),
    messages: [
      {
        role: "system",
        content: SYSTEM_MESSAGES.captionGeneration
      },
      {
        role: "user",
        content: prompt
      }
    ],
    max_tokens: OPENAI_CONFIG.MAX_TOKENS.CAPTION,
    temperature: OPENAI_CONFIG.TEMPERATURE.DEFAULT
  });

  return completion.choices[0]?.message?.content || "";
};

export const generateAbstract = async (
  paperTitle: string, 
  fullPaperContent: string, 
  apiKey: string
): Promise<string> => {
  const openai = createOpenAIClient(apiKey);
  const prompt = createAbstractPrompt(paperTitle, fullPaperContent);

  const completion = await openai.chat.completions.create({
    model: getSelectedModel(),
    messages: [
      {
        role: "system",
        content: SYSTEM_MESSAGES.abstractGeneration
      },
      {
        role: "user",
        content: prompt
      }
    ],
    max_tokens: OPENAI_CONFIG.MAX_TOKENS.ABSTRACT,
    temperature: OPENAI_CONFIG.TEMPERATURE.DEFAULT
  });

  return completion.choices[0]?.message?.content || "";
};

export const suggestTitles = async (
  paperTitle: string, 
  abstract: string, 
  fullPaperContent: string, 
  apiKey: string
): Promise<string[]> => {
  const openai = createOpenAIClient(apiKey);
  const context = abstract || fullPaperContent || "No content available";
  const prompt = createTitleSuggestionPrompt(paperTitle, context);

  const completion = await openai.chat.completions.create({
    model: getSelectedModel(),
    messages: [
      {
        role: "system",
        content: SYSTEM_MESSAGES.titleSuggestion
      },
      {
        role: "user",
        content: prompt
      }
    ],
    max_tokens: OPENAI_CONFIG.MAX_TOKENS.TITLE_SUGGESTION,
    temperature: OPENAI_CONFIG.TEMPERATURE.TITLE_SUGGESTION
  });

  const response = completion.choices[0]?.message?.content || "";
  return response.split('\n').filter(title => title.trim().length > 0).slice(0, 5);
};

export const rewriteText = async (
  selectedText: string, 
  sectionTitle: string, 
  paperTitle: string, 
  abstract: string, 
  apiKey: string,
  prompt?: string
): Promise<string> => {
  const openai = createOpenAIClient(apiKey);
  const rewritePrompt = createRewritePrompt(selectedText, sectionTitle, paperTitle, abstract, prompt);

  const completion = await openai.chat.completions.create({
    model: getSelectedModel(),
    messages: [
      {
        role: "system",
        content: SYSTEM_MESSAGES.textRewriting
      },
      {
        role: "user",
        content: rewritePrompt
      }
    ],
    max_tokens: OPENAI_CONFIG.MAX_TOKENS.TEXT_REWRITE,
    temperature: OPENAI_CONFIG.TEMPERATURE.DEFAULT
  });

  return completion.choices[0]?.message?.content || selectedText;
};

export interface FullPaperAnalysisResponse {
  overallScore: number;
  argumentStrength: {
    score: number;
    feedback: string;
    strengths: string[];
    suggestions: string[];
  };
  flowAndCohesion: {
    score: number;
    feedback: string;
    strengths: string[];
    suggestions: string[];
  };
  terminologyConsistency: {
    score: number;
    feedback: string;
    strengths: string[];
    suggestions: string[];
  };
}

export const analyzeFullPaper = async (
  paperTitle: string,
  fullPaperContent: string,
  apiKey: string
): Promise<FullPaperAnalysisResponse> => {
  const openai = createOpenAIClient(apiKey);
  const prompt = createFullPaperAnalysisPrompt(paperTitle, fullPaperContent);

  const completion = await openai.chat.completions.create({
    model: getSelectedModel(),
    messages: [
      {
        role: "system",
        content: SYSTEM_MESSAGES.fullPaperAnalysis
      },
      {
        role: "user",
        content: prompt
      }
    ],
    max_tokens: OPENAI_CONFIG.MAX_TOKENS.SECTION_CONTENT,
    temperature: OPENAI_CONFIG.TEMPERATURE.DEFAULT
  });

  const response = completion.choices[0]?.message?.content || "";
  
  try {
    return JSON.parse(response);
  } catch (error) {
    console.error("Failed to parse full paper analysis response:", error);
    throw new Error("Invalid JSON response from AI analysis");
  }
};