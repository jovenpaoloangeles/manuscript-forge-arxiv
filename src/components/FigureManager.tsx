import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Image, Wand2, Trash2, FileImage } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  const [isAddingFigure, setIsAddingFigure] = useState(false);
  const [newFigure, setNewFigure] = useState<Partial<Figure>>({
    title: "",
    caption: "",
    position: 'center'
  });
  const [improvingCaption, setImprovingCaption] = useState<string | null>(null);
  const { toast } = useToast();

  const addFigure = () => {
    if (!newFigure.title || !newFigure.caption) {
      toast({
        title: "Missing information",
        description: "Please provide both title and caption for the figure.",
        variant: "destructive"
      });
      return;
    }

    const figure: Figure = {
      id: `figure-${Date.now()}`,
      title: newFigure.title!,
      caption: newFigure.caption!,
      originalCaption: newFigure.caption!,
      placeholder: `[[FIGURE: ${newFigure.title}]]`,
      position: newFigure.position as 'top' | 'bottom' | 'center'
    };

    onFiguresChange([...figures, figure]);
    setNewFigure({
      title: "",
      caption: "",
      position: 'center'
    });
    setIsAddingFigure(false);

    toast({
      title: "Figure added",
      description: "Figure placeholder has been added to your library.",
    });
  };

  const deleteFigure = (id: string) => {
    onFiguresChange(figures.filter(f => f.id !== id));
    toast({
      title: "Figure removed",
      description: "Figure has been removed from your library.",
    });
  };

  const improveFigureCaption = async (figureId: string) => {
    const figure = figures.find(f => f.id === figureId);
    if (!figure) return;

    setImprovingCaption(figureId);

    try {
      // Simulate AI caption improvement
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const improvedCaption = generateImprovedCaption(figure.originalCaption || figure.caption);
      
      onFiguresChange(figures.map(f => 
        f.id === figureId 
          ? { ...f, caption: improvedCaption }
          : f
      ));

      toast({
        title: "Caption improved",
        description: "Figure caption has been enhanced for academic tone.",
      });
    } catch (error) {
      toast({
        title: "Improvement failed",
        description: "Failed to improve caption. Please try again.",
        variant: "destructive"
      });
    } finally {
      setImprovingCaption(null);
    }
  };

  const generateImprovedCaption = (originalCaption: string): string => {
    // Mock academic caption improvement
    const improvements = [
      `Figure illustrates ${originalCaption.toLowerCase()}. The data demonstrates significant trends and provides insights into the underlying mechanisms discussed in this study.`,
      `This figure presents ${originalCaption.toLowerCase()}, highlighting key patterns observed in our experimental analysis. The results contribute to our understanding of the research question.`,
      `The figure depicts ${originalCaption.toLowerCase()}, showing quantitative relationships that support the theoretical framework presented in this manuscript.`
    ];
    
    return improvements[Math.floor(Math.random() * improvements.length)];
  };

  const revertCaption = (figureId: string) => {
    const figure = figures.find(f => f.id === figureId);
    if (!figure || !figure.originalCaption) return;

    onFiguresChange(figures.map(f => 
      f.id === figureId 
        ? { ...f, caption: f.originalCaption! }
        : f
    ));

    toast({
      title: "Caption reverted",
      description: "Caption has been reverted to original version.",
    });
  };

  const updateFigureCaption = (figureId: string, newCaption: string) => {
    onFiguresChange(figures.map(f => 
      f.id === figureId 
        ? { ...f, caption: newCaption }
        : f
    ));
  };

  return (
    <Card className="shadow-academic">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-academic-text">
              <FileImage className="h-5 w-5" />
              Figure Library ({figures.length})
            </CardTitle>
            <p className="text-academic-muted text-sm">Manage figure placeholders and captions</p>
          </div>
          <Dialog open={isAddingFigure} onOpenChange={setIsAddingFigure}>
            <DialogTrigger asChild>
              <Button variant="academic" size="sm">
                <Plus className="h-4 w-4" />
                Add Figure
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle>Add Figure Placeholder</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Figure Title *</label>
                  <Input
                    value={newFigure.title || ""}
                    onChange={(e) => setNewFigure({ ...newFigure, title: e.target.value })}
                    placeholder="e.g., Experimental Results Overview"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Caption *</label>
                  <Textarea
                    value={newFigure.caption || ""}
                    onChange={(e) => setNewFigure({ ...newFigure, caption: e.target.value })}
                    placeholder="Describe what the figure shows..."
                    rows={3}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Position</label>
                  <select
                    value={newFigure.position || 'center'}
                    onChange={(e) => setNewFigure({ ...newFigure, position: e.target.value as 'top' | 'bottom' | 'center' })}
                    className="w-full p-2 border border-input rounded-md bg-background"
                  >
                    <option value="top">Top of section</option>
                    <option value="center">Center of section</option>
                    <option value="bottom">Bottom of section</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="ghost" onClick={() => setIsAddingFigure(false)}>
                    Cancel
                  </Button>
                  <Button onClick={addFigure} variant="academic">
                    Add Figure
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {figures.map((figure) => (
            <div key={figure.id} className="border rounded-lg p-4 hover:bg-academic-light transition-colors">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-academic-text flex items-center gap-2">
                      <Image className="h-4 w-4" />
                      {figure.title}
                    </h4>
                    <p className="text-xs text-academic-muted font-mono bg-academic-light px-2 py-1 rounded mt-1">
                      {figure.placeholder}
                    </p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      onClick={() => onInsertFigure(figure.id)}
                      variant="academicOutline"
                      size="sm"
                    >
                      Insert
                    </Button>
                    <Button
                      onClick={() => deleteFigure(figure.id)}
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-academic-text">Caption</label>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => improveFigureCaption(figure.id)}
                        variant="ghost"
                        size="sm"
                        disabled={improvingCaption === figure.id}
                        className="text-academic-blue"
                      >
                        <Wand2 className="h-4 w-4" />
                        {improvingCaption === figure.id ? "Improving..." : "Improve"}
                      </Button>
                      {figure.originalCaption && figure.caption !== figure.originalCaption && (
                        <Button
                          onClick={() => revertCaption(figure.id)}
                          variant="ghost"
                          size="sm"
                          className="text-academic-muted"
                        >
                          Revert
                        </Button>
                      )}
                    </div>
                  </div>
                  <Textarea
                    value={figure.caption}
                    onChange={(e) => updateFigureCaption(figure.id, e.target.value)}
                    rows={2}
                    className="text-sm"
                  />
                </div>
              </div>
            </div>
          ))}
          
          {figures.length === 0 && (
            <div className="text-center py-8">
              <FileImage className="h-12 w-12 text-academic-muted mx-auto mb-4" />
              <p className="text-academic-muted">No figures added yet</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};