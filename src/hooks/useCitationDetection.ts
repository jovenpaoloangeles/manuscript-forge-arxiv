import { useEffect, useCallback } from "react";
import { PaperSection } from "@/components/PaperStructure";

interface UseCitationDetectionProps {
  sections: PaperSection[];
  setSections: (sections: PaperSection[] | ((prev: PaperSection[]) => PaperSection[])) => void;
}

export const useCitationDetection = ({ sections, setSections }: UseCitationDetectionProps) => {
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
  const ensureReferencesSection = useCallback((sectionsToCheck = sections) => {
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
  }, [sections, setSections]);

  // Check for citations on mount and when sections change
  useEffect(() => {
    if (sections.length > 0) {
      setTimeout(() => ensureReferencesSection(), 500);
    }
  }, [sections.length, ensureReferencesSection]);

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

  return {
    hasCitationPlaceholders,
    ensureReferencesSection,
    updateReferencesSection,
    generateReferencesFromCitations
  };
};