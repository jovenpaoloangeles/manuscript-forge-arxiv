import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Figure } from "./FigureManager";

interface AddFigureDialogProps {
  onAddFigure: (figure: Figure) => void;
}

export const AddFigureDialog = ({ onAddFigure }: AddFigureDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newFigure, setNewFigure] = useState<Partial<Figure>>({
    title: "",
    caption: "",
    position: 'center'
  });
  const { toast } = useToast();

  const resetForm = () => {
    setNewFigure({
      title: "",
      caption: "",
      position: 'center'
    });
  };

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
      position: newFigure.position as 'top' | 'bottom' | 'center' || 'center'
    };

    onAddFigure(figure);
    resetForm();
    setIsOpen(false);

    toast({
      title: "Figure added",
      description: "Figure has been added to your collection.",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="academic" size="sm">
          <Plus className="h-4 w-4" />
          Add Figure
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Figure</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Figure Title *</label>
            <Input
              value={newFigure.title || ""}
              onChange={(e) => setNewFigure({ ...newFigure, title: e.target.value })}
              placeholder="e.g., System Architecture"
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
            <Select
              value={newFigure.position || 'center'}
              onValueChange={(value) => setNewFigure({ ...newFigure, position: value as 'top' | 'bottom' | 'center' })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="top">Top of section</SelectItem>
                <SelectItem value="center">Center of section</SelectItem>
                <SelectItem value="bottom">Bottom of section</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={addFigure} variant="academic">
              Add Figure
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};