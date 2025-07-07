import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileImage } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AddFigureDialog } from "./AddFigureDialog";
import { FigureCard } from "./FigureCard";

export interface Figure {
  id: string;
  title: string;
  caption: string;
  originalCaption?: string;
  placeholder: string;
  position?: 'top' | 'bottom' | 'center';
}

interface FigureManagerProps {
  figures: Figure[];
  onFiguresChange: (figures: Figure[]) => void;
  onInsertFigure: (figureId: string) => void;
}

export const FigureManager = ({ figures, onFiguresChange, onInsertFigure }: FigureManagerProps) => {
  const [improvingCaption, setImprovingCaption] = useState<string | null>(null);
  const { toast } = useToast();

  const addFigure = (figure: Figure) => {
    onFiguresChange([...figures, figure]);
  };

  const updateFigure = (figureId: string, updates: Partial<Figure>) => {
    onFiguresChange(figures.map(fig => 
      fig.id === figureId ? { ...fig, ...updates } : fig
    ));
  };

  const deleteFigure = (figureId: string) => {
    onFiguresChange(figures.filter(fig => fig.id !== figureId));
    toast({
      title: "Figure removed",
      description: "Figure has been removed from your collection.",
    });
  };

  const improveCaption = async (figureId: string) => {
    const figure = figures.find(f => f.id === figureId);
    if (!figure) return;

    setImprovingCaption(figureId);
    
    try {
      // Mock AI improvement - in real app, would call OpenAI
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const improvedCaption = `Enhanced: ${figure.caption} This figure demonstrates the key concepts with improved clarity and academic precision.`;
      
      updateFigure(figureId, { 
        caption: improvedCaption,
        originalCaption: figure.originalCaption || figure.caption
      });
      
      toast({
        title: "Caption improved",
        description: "Figure caption has been enhanced using AI.",
      });
    } catch (error) {
      toast({
        title: "Improvement failed",
        description: "Could not improve the caption. Please try again.",
        variant: "destructive"
      });
    } finally {
      setImprovingCaption(null);
    }
  };

  return (
    <Card className="shadow-academic">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-academic-text">
              <FileImage className="h-5 w-5" />
              Figure Manager ({figures.length})
            </CardTitle>
            <p className="text-academic-muted text-sm">Manage figures and illustrations for your paper</p>
          </div>
          <AddFigureDialog onAddFigure={addFigure} />
        </div>
      </CardHeader>
      
      <CardContent>
        {figures.length === 0 ? (
          <div className="text-center py-8">
            <FileImage className="h-12 w-12 text-academic-muted mx-auto mb-4" />
            <p className="text-academic-muted">No figures added yet</p>
            <p className="text-sm text-academic-muted mt-1">Add figures to enhance your academic paper</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {figures.map((figure) => (
              <FigureCard
                key={figure.id}
                figure={figure}
                onUpdateFigure={(updates) => updateFigure(figure.id, updates)}
                onDeleteFigure={() => deleteFigure(figure.id)}
                onInsertFigure={() => onInsertFigure(figure.id)}
                onImproveCaption={() => improveCaption(figure.id)}
                isImprovingCaption={improvingCaption === figure.id}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};