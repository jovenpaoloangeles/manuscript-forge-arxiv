import { PaperSection } from "@/components/PaperStructure";

interface UsePaperContentProps {
  sections: PaperSection[];
  paperTitle: string;
  authors: string;
}

export const usePaperContent = ({ sections, paperTitle, authors }: UsePaperContentProps) => {
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

  return {
    getFullPaperContent,
    getFullPaperContentForContext
  };
};