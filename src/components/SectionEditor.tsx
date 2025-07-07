import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GripVertical, Trash2 } from "lucide-react";
import { EditableSection } from "./EditableSection";
import { BulletPointEditor } from "./BulletPointEditor";
import { SectionFigureEditor } from "./SectionFigureEditor";
import { PaperSection, SectionFigure } from "./PaperStructure";
import { usePaper } from "@/contexts/PaperContext";
import { SECTION_TYPES } from "@/lib/constants";

interface SectionEditorProps {
  section: PaperSection;
  onSectionUpdate: (updates: Partial<PaperSection>) => void;
  onSectionDelete: () => void;
  onGenerateSection: () => void;
  onGenerateCaption?: (figureId: string) => void;
  onRewriteSelection?: (selectedText: string, prompt?: string) => Promise<string>;
}

export const SectionEditor = ({
  section,
  onSectionUpdate,
  onSectionDelete,
  onGenerateSection,
  onGenerateCaption,
  onRewriteSelection
}: SectionEditorProps) => {
  const { paperTitle, sections } = usePaper();
  
  // Get abstract content for passing to EditableSection
  const abstractSection = sections.find(s => s.title.toLowerCase() === SECTION_TYPES.ABSTRACT);
  const abstract = abstractSection?.generatedContent;
  const [editingTitle, setEditingTitle] = useState(false);

  const handleSectionContentChange = (content: string, isManuallyEdited: boolean) => {
    onSectionUpdate({ 
      generatedContent: content,
      isManuallyEdited 
    });
  };

  const updateFigure = (figureId: string, updates: Partial<SectionFigure>) => {
    const updatedFigures = section.figures.map(figure => 
      figure.id === figureId ? { ...figure, ...updates } : figure
    );
    onSectionUpdate({ figures: updatedFigures });
  };

  const deleteFigure = (figureId: string) => {
    const updatedFigures = section.figures.filter(figure => figure.id !== figureId);
    onSectionUpdate({ figures: updatedFigures });
  };

  const addFigure = () => {
    const newFigure: SectionFigure = {
      id: `figure-${Date.now()}`,
      description: "",
      caption: ""
    };
    onSectionUpdate({
      figures: [...section.figures, newFigure]
    });
  };

  return (
    <Card className="shadow-paper hover:shadow-academic transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GripVertical className="h-5 w-5 text-academic-muted cursor-move" />
            {editingTitle ? (
              <Input
                value={section.title}
                onChange={(e) => onSectionUpdate({ title: e.target.value })}
                onBlur={() => setEditingTitle(false)}
                onKeyDown={(e) => e.key === 'Enter' && setEditingTitle(false)}
                className="text-lg font-semibold"
                autoFocus
              />
            ) : (
              <CardTitle 
                className="text-lg cursor-pointer hover:text-academic-blue transition-colors"
                onClick={() => setEditingTitle(true)}
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
              onClick={onGenerateSection}
              variant="academic"
              size="sm"
              disabled={!section.description && section.bulletPoints.length === 0}
            >
              Generate Text
            </Button>
            <Button
              onClick={onSectionDelete}
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
            onChange={(e) => onSectionUpdate({ description: e.target.value })}
            placeholder="Describe what this section should cover..."
            rows={2}
            className="resize-none"
          />
        </div>
        
        <BulletPointEditor
          bulletPoints={section.bulletPoints}
          onBulletPointsChange={(bulletPoints) => onSectionUpdate({ bulletPoints })}
        />
        
        <SectionFigureEditor
          figures={section.figures}
          onAddFigure={addFigure}
          onUpdateFigure={updateFigure}
          onDeleteFigure={deleteFigure}
          onGenerateCaption={onGenerateCaption}
        />
      </CardContent>
      
      {/* Section Content Editor */}
      {section.generatedContent && (
        <CardContent className="pt-0">
          <EditableSection
            content={section.generatedContent}
            generatedContent={section.generatedContent}
            isManuallyEdited={section.isManuallyEdited || false}
            onContentChange={handleSectionContentChange}
            onRegenerate={onGenerateSection}
            onRewriteSelection={onRewriteSelection}
            sectionTitle={section.title}
            sectionId={section.id}
          />
        </CardContent>
      )}
    </Card>
  );
};