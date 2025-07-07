import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, GripVertical, FileText, Image, Wand2 } from "lucide-react";

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
}

interface PaperStructureProps {
  sections: PaperSection[];
  onSectionsChange: (sections: PaperSection[]) => void;
  onGenerateSection: (sectionId: string) => void;
  onGenerateCaption?: (sectionId: string, figureId: string) => void;
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
    title: "Related Work",
    description: "Review of existing literature and previous research",
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
    title: "Results",
    description: "Experimental results and findings",
    bulletPoints: [],
    figures: []
  },
  {
    title: "Discussion",
    description: "Interpretation of results and implications",
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

export const PaperStructure = ({ sections, onSectionsChange, onGenerateSection, onGenerateCaption }: PaperStructureProps) => {
  const [editingSection, setEditingSection] = useState<string | null>(null);

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
    setEditingSection(newSection.id);
  };

  const updateSection = (id: string, updates: Partial<PaperSection>) => {
    onSectionsChange(sections.map(section => 
      section.id === id ? { ...section, ...updates } : section
    ));
  };

  const deleteSection = (id: string) => {
    onSectionsChange(sections.filter(section => section.id !== id));
  };

  const addBulletPoint = (sectionId: string) => {
    updateSection(sectionId, {
      bulletPoints: [...(sections.find(s => s.id === sectionId)?.bulletPoints || []), ""]
    });
  };

  const updateBulletPoint = (sectionId: string, index: number, value: string) => {
    const section = sections.find(s => s.id === sectionId);
    if (section) {
      const newBulletPoints = [...section.bulletPoints];
      newBulletPoints[index] = value;
      updateSection(sectionId, { bulletPoints: newBulletPoints });
    }
  };

  const deleteBulletPoint = (sectionId: string, index: number) => {
    const section = sections.find(s => s.id === sectionId);
    if (section) {
      const newBulletPoints = section.bulletPoints.filter((_, i) => i !== index);
      updateSection(sectionId, { bulletPoints: newBulletPoints });
    }
  };

  const addFigure = (sectionId: string) => {
    const newFigure: SectionFigure = {
      id: `figure-${Date.now()}`,
      description: "",
      caption: ""
    };
    updateSection(sectionId, {
      figures: [...(sections.find(s => s.id === sectionId)?.figures || []), newFigure]
    });
  };

  const updateFigure = (sectionId: string, figureId: string, updates: Partial<SectionFigure>) => {
    const section = sections.find(s => s.id === sectionId);
    if (section) {
      const updatedFigures = section.figures.map(figure => 
        figure.id === figureId ? { ...figure, ...updates } : figure
      );
      updateSection(sectionId, { figures: updatedFigures });
    }
  };

  const deleteFigure = (sectionId: string, figureId: string) => {
    const section = sections.find(s => s.id === sectionId);
    if (section) {
      const updatedFigures = section.figures.filter(figure => figure.id !== figureId);
      updateSection(sectionId, { figures: updatedFigures });
    }
  };

  if (sections.length === 0) {
    return (
      <Card className="border-2 border-dashed border-academic-blue/30">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <FileText className="h-12 w-12 text-academic-blue mb-4" />
          <h3 className="text-lg font-semibold mb-2">Start Your Academic Paper</h3>
          <p className="text-academic-muted text-center mb-6 max-w-md">
            Create your paper structure by adding the standard academic sections or build a custom structure from scratch.
          </p>
          <div className="flex gap-3">
            <Button onClick={addDefaultStructure} variant="academic" size="lg">
              Use Standard Structure
            </Button>
            <Button onClick={addCustomSection} variant="academicOutline">
              Custom Structure
            </Button>
          </div>
        </CardContent>
      </Card>
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
        <Card key={section.id} className="shadow-paper hover:shadow-academic transition-all duration-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <GripVertical className="h-5 w-5 text-academic-muted cursor-move" />
                {editingSection === section.id ? (
                  <Input
                    value={section.title}
                    onChange={(e) => updateSection(section.id, { title: e.target.value })}
                    onBlur={() => setEditingSection(null)}
                    onKeyDown={(e) => e.key === 'Enter' && setEditingSection(null)}
                    className="text-lg font-semibold"
                    autoFocus
                  />
                ) : (
                  <CardTitle 
                    className="text-lg cursor-pointer hover:text-academic-blue transition-colors"
                    onClick={() => setEditingSection(section.id)}
                  >
                    {section.title}
                  </CardTitle>
                )}
                {section.generatedContent && (
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    Generated
                  </Badge>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => onGenerateSection(section.id)}
                  variant="academic"
                  size="sm"
                  disabled={!section.description && section.bulletPoints.length === 0}
                >
                  Generate Text
                </Button>
                <Button
                  onClick={() => deleteSection(section.id)}
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-academic-text mb-2 block">
                Section Description
              </label>
              <Textarea
                value={section.description}
                onChange={(e) => updateSection(section.id, { description: e.target.value })}
                placeholder="Describe what this section should cover..."
                rows={2}
                className="resize-none"
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-academic-text">
                  Key Points ({section.bulletPoints.length})
                </label>
                <Button
                  onClick={() => addBulletPoint(section.id)}
                  variant="ghost"
                  size="sm"
                  className="text-academic-blue"
                >
                  <Plus className="h-4 w-4" />
                  Add Point
                </Button>
              </div>
              <div className="space-y-2">
                {section.bulletPoints.map((point, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={point}
                      onChange={(e) => updateBulletPoint(section.id, index, e.target.value)}
                      placeholder={`Key point ${index + 1}...`}
                      className="flex-1"
                    />
                    <Button
                      onClick={() => deleteBulletPoint(section.id, index)}
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-academic-text">
                  Figures ({section.figures.length})
                </label>
                <Button
                  onClick={() => addFigure(section.id)}
                  variant="ghost"
                  size="sm"
                  className="text-academic-blue"
                >
                  <Plus className="h-4 w-4" />
                  Add Figure
                </Button>
              </div>
              <div className="space-y-3">
                {section.figures.map((figure) => (
                  <div key={figure.id} className="border rounded-md p-3 bg-academic-light/50">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Image className="h-4 w-4 text-academic-blue" />
                        <Input
                          value={figure.description}
                          onChange={(e) => updateFigure(section.id, figure.id, { description: e.target.value })}
                          placeholder="Brief description of the figure..."
                          className="flex-1 text-sm"
                        />
                        <Button
                          onClick={() => onGenerateCaption?.(section.id, figure.id)}
                          variant="ghost"
                          size="sm"
                          disabled={!figure.description.trim() || !onGenerateCaption}
                          className="text-academic-blue"
                        >
                          <Wand2 className="h-4 w-4" />
                          Generate Caption
                        </Button>
                        <Button
                          onClick={() => deleteFigure(section.id, figure.id)}
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      {figure.caption && (
                        <div>
                          <label className="text-xs font-medium text-academic-muted block mb-1">
                            Generated Caption:
                          </label>
                          <Textarea
                            value={figure.caption}
                            onChange={(e) => updateFigure(section.id, figure.id, { caption: e.target.value })}
                            rows={2}
                            className="text-sm resize-none"
                            placeholder="Caption will appear here..."
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};