import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, GripVertical, FileText } from "lucide-react";

export interface PaperSection {
  id: string;
  title: string;
  description: string;
  bulletPoints: string[];
  generatedContent?: string;
}

interface PaperStructureProps {
  sections: PaperSection[];
  onSectionsChange: (sections: PaperSection[]) => void;
  onGenerateSection: (sectionId: string) => void;
}

const defaultSections: Omit<PaperSection, 'id'>[] = [
  {
    title: "Abstract",
    description: "Brief summary of the research, methodology, and key findings",
    bulletPoints: []
  },
  {
    title: "Introduction",
    description: "Background, motivation, and research objectives",
    bulletPoints: []
  },
  {
    title: "Related Work",
    description: "Review of existing literature and previous research",
    bulletPoints: []
  },
  {
    title: "Methodology",
    description: "Research methods, experimental setup, and approach",
    bulletPoints: []
  },
  {
    title: "Results",
    description: "Experimental results and findings",
    bulletPoints: []
  },
  {
    title: "Discussion",
    description: "Interpretation of results and implications",
    bulletPoints: []
  },
  {
    title: "Conclusion",
    description: "Summary of contributions and future work",
    bulletPoints: []
  }
];

export const PaperStructure = ({ sections, onSectionsChange, onGenerateSection }: PaperStructureProps) => {
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
      bulletPoints: []
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
          </CardContent>
        </Card>
      ))}
    </div>
  );
};