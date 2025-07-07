import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { SectionEditor } from "./SectionEditor";
import { EmptyStructure } from "./EmptyStructure";

export interface SectionFigure {
  id: string;
  description: string;
  caption?: string;
}

export interface PaperSection {
  id: string;
  title: string;
  description: string;
  bulletPoints: string[];
  figures: SectionFigure[];
  generatedContent?: string;
  isManuallyEdited?: boolean;
}

interface PaperStructureProps {
  sections: PaperSection[];
  onSectionsChange: (sections: PaperSection[]) => void;
  onGenerateSection: (sectionId: string) => void;
  onGenerateCaption?: (sectionId: string, figureId: string) => void;
  onRewriteSelection?: (sectionId: string, selectedText: string, prompt?: string) => Promise<string>;
  paperTitle?: string;
  abstract?: string;
}

const defaultSections: Omit<PaperSection, 'id'>[] = [
  {
    title: "Abstract",
    description: "Brief summary of the research, methodology, and key findings",
    bulletPoints: [],
    figures: []
  },
  {
    title: "Introduction",
    description: "Background, motivation, and research objectives",
    bulletPoints: [],
    figures: []
  },
  {
    title: "Methodology",
    description: "Research methods, experimental setup, and approach",
    bulletPoints: [],
    figures: []
  },
  {
    title: "Results and Discussion",
    description: "Experimental results, findings, and their interpretation with implications",
    bulletPoints: [],
    figures: []
  },
  {
    title: "Conclusion",
    description: "Summary of contributions and future work",
    bulletPoints: [],
    figures: []
  }
];

export const PaperStructure = ({ 
  sections, 
  onSectionsChange, 
  onGenerateSection, 
  onGenerateCaption, 
  onRewriteSelection,
  paperTitle,
  abstract 
}: PaperStructureProps) => {
  const addDefaultStructure = () => {
    const newSections = defaultSections.map((section, index) => ({
      ...section,
      id: `section-${Date.now()}-${index}`
    }));
    onSectionsChange(newSections);
  };

  const addCustomSection = () => {
    const newSection: PaperSection = {
      id: `section-${Date.now()}`,
      title: "New Section",
      description: "",
      bulletPoints: [],
      figures: []
    };
    onSectionsChange([...sections, newSection]);
  };

  const updateSection = (id: string, updates: Partial<PaperSection>) => {
    onSectionsChange(sections.map(section => 
      section.id === id ? { ...section, ...updates } : section
    ));
  };

  const deleteSection = (id: string) => {
    onSectionsChange(sections.filter(section => section.id !== id));
  };

  const handleSectionRewriteSelection = async (sectionId: string, selectedText: string, prompt?: string) => {
    if (onRewriteSelection) {
      return await onRewriteSelection(sectionId, selectedText, prompt);
    }
    throw new Error("Rewrite selection not available");
  };

  if (sections.length === 0) {
    return (
      <EmptyStructure
        onAddDefaultStructure={addDefaultStructure}
        onAddCustomSection={addCustomSection}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-academic-text">Paper Structure</h2>
          <p className="text-academic-muted">Define and organize your manuscript sections</p>
        </div>
        <Button onClick={addCustomSection} variant="academicOutline" size="sm">
          <Plus className="h-4 w-4" />
          Add Section
        </Button>
      </div>

      {sections.map((section) => (
        <SectionEditor
          key={section.id}
          section={section}
          onSectionUpdate={(updates) => updateSection(section.id, updates)}
          onSectionDelete={() => deleteSection(section.id)}
          onGenerateSection={() => onGenerateSection(section.id)}
          onGenerateCaption={onGenerateCaption ? (figureId) => onGenerateCaption(section.id, figureId) : undefined}
          onRewriteSelection={(selectedText, prompt) => handleSectionRewriteSelection(section.id, selectedText, prompt)}
          paperTitle={paperTitle}
          abstract={abstract}
        />
      ))}
    </div>
  );
};