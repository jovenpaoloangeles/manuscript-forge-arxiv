import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Image, Wand2, Trash2 } from "lucide-react";
import { SectionFigure } from "./PaperStructure";

interface SectionFigureEditorProps {
  figures: SectionFigure[];
  onAddFigure: () => void;
  onUpdateFigure: (figureId: string, updates: Partial<SectionFigure>) => void;
  onDeleteFigure: (figureId: string) => void;
  onGenerateCaption?: (figureId: string) => void;
}

export const SectionFigureEditor = ({
  figures,
  onAddFigure,
  onUpdateFigure,
  onDeleteFigure,
  onGenerateCaption
}: SectionFigureEditorProps) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-academic-text">
          Figures ({figures.length})
        </label>
        <Button
          onClick={onAddFigure}
          variant="ghost"
          size="sm"
          className="text-academic-blue"
        >
          <Plus className="h-4 w-4" />
          Add Figure
        </Button>
      </div>
      <div className="space-y-3">
        {figures.map((figure) => (
          <div key={figure.id} className="border rounded-md p-3 bg-academic-light/50">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Image className="h-4 w-4 text-academic-blue" />
                <Input
                  value={figure.description}
                  onChange={(e) => onUpdateFigure(figure.id, { description: e.target.value })}
                  placeholder="Brief description of the figure..."
                  className="flex-1 text-sm"
                />
                <Button
                  onClick={() => onGenerateCaption?.(figure.id)}
                  variant="ghost"
                  size="sm"
                  disabled={!figure.description.trim() || !onGenerateCaption}
                  className="text-academic-blue"
                >
                  <Wand2 className="h-4 w-4" />
                  Generate Caption
                </Button>
                <Button
                  onClick={() => onDeleteFigure(figure.id)}
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
                    onChange={(e) => onUpdateFigure(figure.id, { caption: e.target.value })}
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
  );
};