import { PaperSection } from "@/components/PaperStructure";
import { DEFAULT_MESSAGES, SECTION_TYPES, CITATION_FORMAT } from "@/lib/constants";

export const createSectionPrompt = (section: PaperSection, title: string, abstract: string): string => {
  const sectionTitle = section.title.toLowerCase();
  let prompt = "";
  
  // Section-specific prompts for more natural, human-like content
  if (sectionTitle === SECTION_TYPES.ABSTRACT) {
    prompt = `Write a compelling academic abstract for "${title || DEFAULT_MESSAGES.PAPER_TITLE_PLACEHOLDER}". This should read like a seasoned researcher's work - clear, confident, and engaging without being overly technical.`;
  } else if (sectionTitle === SECTION_TYPES.INTRODUCTION) {
    prompt = `Write an engaging introduction for "${title || DEFAULT_MESSAGES.PAPER_TITLE_PLACEHOLDER}". Start with the broader context and gradually narrow to your specific research question. Write as if you're telling a story about why this research matters, using natural academic prose that flows smoothly.`;
  } else if (sectionTitle === SECTION_TYPES.METHODOLOGY) {
    prompt = `Write a clear methodology section for "${title || DEFAULT_MESSAGES.PAPER_TITLE_PLACEHOLDER}". Explain your approach as if you're walking a colleague through your research process. Be precise but conversational in tone, focusing on the logic behind your choices.`;
  } else if (sectionTitle.includes(SECTION_TYPES.RESULTS) || sectionTitle.includes(SECTION_TYPES.DISCUSSION)) {
    prompt = `Write a results and discussion section for "${title || DEFAULT_MESSAGES.PAPER_TITLE_PLACEHOLDER}". Present your findings with confidence and discuss their implications thoughtfully. Write as if you're having an informed conversation with your peers about what you discovered.`;
  } else if (sectionTitle === SECTION_TYPES.CONCLUSION) {
    prompt = `Write a conclusion for "${title || DEFAULT_MESSAGES.PAPER_TITLE_PLACEHOLDER}". Synthesize your key contributions and their broader significance. Write with the authority of someone who has made genuine progress in their field.`;
  } else {
    prompt = `Write an academic section for "${section.title}" for a paper titled "${title || DEFAULT_MESSAGES.PAPER_TITLE_PLACEHOLDER}". Write in a natural, scholarly voice that demonstrates deep understanding.`;
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
  
  prompt += `\n\nWrite 2-3 well-developed paragraphs that sound like they were written by an experienced researcher. Use varied sentence structures, natural transitions, and INCLUDE AT LEAST 1-2 citation placeholders in the format ${CITATION_FORMAT.PLACEHOLDER.replace("{reason}", "Short Reason for Citation")} where appropriate (e.g., for prior work, methodologies, or specific claims). Avoid formulaic language and write with genuine scholarly voice.`;
  
  return prompt;
};

export const createCaptionPrompt = (figureDescription: string, sectionTitle: string, paperTitle: string, abstract: string): string => {
  return `Write a brief, academic figure caption for: "${figureDescription}". 
Context: This figure is in the "${sectionTitle}" section of a paper titled "${paperTitle || DEFAULT_MESSAGES.PAPER_TITLE_PLACEHOLDER}".
${abstract ? `Paper abstract: "${abstract}"` : ''}

Generate a concise, professional caption (1-2 sentences) that would be appropriate for an academic publication.`;
};

export const createAbstractPrompt = (paperTitle: string, fullPaperContent: string): string => {
  return `Write a comprehensive abstract for the academic paper titled "${paperTitle}". 

Full paper content:
${fullPaperContent}

Generate a well-structured abstract (150-250 words) that includes:
- Brief background and motivation
- Research objectives and methodology
- Key findings and results
- Main conclusions and implications

Use formal academic language appropriate for scholarly publication.`;
};

export const createTitleSuggestionPrompt = (paperTitle: string, context: string): string => {
  return `Based on the following academic paper content, suggest 5 alternative titles that are:
- Clear and descriptive
- Academically appropriate
- Concise but informative
- Different from the current title: "${paperTitle}"

Paper content:
${context}

Return only the 5 titles, one per line, without numbering or formatting.`;
};

export const createRewritePrompt = (selectedText: string, sectionTitle: string, paperTitle: string, abstract: string, prompt?: string): string => {
  let rewritePrompt = `Rewrite the following text from an academic paper to improve it while maintaining academic tone and accuracy: "${selectedText}"`;
  
  if (prompt) {
    rewritePrompt += `\n\nSpecific instructions: ${prompt}`;
  }
  
  rewritePrompt += `\n\nContext: This text is from the "${sectionTitle}" section of a paper titled "${paperTitle || DEFAULT_MESSAGES.PAPER_TITLE_PLACEHOLDER}".`;
  
  if (abstract) {
    rewritePrompt += `\nPaper abstract: "${abstract}"`;
  }

  return rewritePrompt;
};

export const createFullPaperAnalysisPrompt = (paperTitle: string, fullPaperContent: string): string => {
  return `You are an expert academic peer reviewer for a top-tier journal. Analyze the following academic paper manuscript.

Title: ${paperTitle || DEFAULT_MESSAGES.PAPER_TITLE_PLACEHOLDER}

Full paper content:
${fullPaperContent}

Provide your feedback in a structured JSON format. The root object should have the following keys: "overallScore" (1-10), "argumentStrength", "flowAndCohesion", and "terminologyConsistency".

- For "argumentStrength": Provide feedback on how well the paper's central thesis is introduced, supported by evidence, and concluded. Note any logical gaps.
- For "flowAndCohesion": Analyze the transitions between major sections (e.g., from Introduction to Methodology). Are they smooth or abrupt? Are the sections well-linked?
- For "terminologyConsistency": Identify up to 5 key technical terms used in the paper. For each term, state whether it was used consistently. If not, provide examples of inconsistent usage.
- For each key, provide a "score" (1-10), "feedback" (a summary paragraph), "strengths" (an array of strings), and "suggestions" (an array of strings).

Return only valid JSON without any markdown formatting or code blocks.`;
};