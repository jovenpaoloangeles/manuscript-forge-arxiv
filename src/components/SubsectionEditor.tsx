import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { BulletPointEditor } from "./BulletPointEditor";
import { Subsection } from "./PaperStructure";

interface SubsectionEditorProps {
  subsections: Subsection[];
  onSubsectionsChange: (subsections: Subsection[]) => void;
}

export const SubsectionEditor = ({
  subsections,
  onSubsectionsChange
}: SubsectionEditorProps) => {
  const [editingTitles, setEditingTitles] = useState<Record<string, boolean>>({});

  const addSubsection = () => {
    const newSubsection: Subsection = {
      id: `subsection-${Date.now()}`,
      title: "New Subsection",
      description: "",
      bulletPoints: []
    };
    onSubsectionsChange([...subsections, newSubsection]);
  };

  const updateSubsection = (id: string, updates: Partial<Subsection>) => {
    const updatedSubsections = subsections.map(subsection =>
      subsection.id === id ? { ...subsection, ...updates } : subsection
    );
    onSubsectionsChange(updatedSubsections);
  };

  const deleteSubsection = (id: string) => {
    const updatedSubsections = subsections.filter(subsection => subsection.id !== id);
    onSubsectionsChange(updatedSubsections);
  };

  const toggleTitleEditing = (id: string, editing: boolean) => {
    setEditingTitles(prev => ({ ...prev, [id]: editing }));
  };

  if (subsections.length === 0) {
    return (
      <div className="border-2 border-dashed border-academic-muted/30 rounded-lg p-6 text-center">
        <p className="text-academic-muted mb-3">No subsections yet</p>
        <Button onClick={addSubsection} variant="academicOutline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Subsection
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-academic-text">Subsections</h4>
        <Button onClick={addSubsection} variant="academicOutline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Subsection
        </Button>
      </div>

      {subsections.map((subsection, index) => (
        <Card key={subsection.id} className="border-l-4 border-l-academic-blue/30 bg-academic-paper/30">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GripVertical className="h-4 w-4 text-academic-muted cursor-move" />
                <Badge variant="outline" className="text-xs">
                  {index + 1}
                </Badge>
                {editingTitles[subsection.id] ? (
                  <Input
                    value={subsection.title}
                    onChange={(e) => updateSubsection(subsection.id, { title: e.target.value })}
                    onBlur={() => toggleTitleEditing(subsection.id, false)}
                    onKeyDown={(e) => e.key === 'Enter' && toggleTitleEditing(subsection.id, false)}
                    className="text-sm font-medium"
                    autoFocus
                  />
                ) : (
                  <CardTitle 
                    className="text-sm cursor-pointer hover:text-academic-blue transition-colors"
                    onClick={() => toggleTitleEditing(subsection.id, true)}
                  >
                    {subsection.title}
                  </CardTitle>
                )}
              </div>
              <Button
                onClick={() => deleteSubsection(subsection.id)}
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive h-6 w-6 p-0"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-3 pt-0">
            <div>
              <label className="text-xs font-medium text-academic-text mb-1 block">
                Description (optional)
              </label>
              <Textarea
                value={subsection.description || ''}
                onChange={(e) => updateSubsection(subsection.id, { description: e.target.value })}
                placeholder="Describe what this subsection should cover..."
                rows={1}
                className="resize-none text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-academic-text mb-1 block">
                Minimum Word Count
              </label>
              <Input
                type="number"
                value={subsection.minWordCount || ''}
                onChange={(e) => updateSubsection(subsection.id, { 
                  minWordCount: e.target.value ? parseInt(e.target.value) : undefined 
                })}
                placeholder="e.g., 100"
                min="0"
                className="w-24 text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-academic-text mb-1 block">
                Key Points
              </label>
              <BulletPointEditor
                bulletPoints={subsection.bulletPoints}
                onBulletPointsChange={(bulletPoints) => 
                  updateSubsection(subsection.id, { bulletPoints })
                }
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
