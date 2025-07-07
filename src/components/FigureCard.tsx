import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { FileImage, Wand2, Trash2, RotateCcw, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Figure } from "./FigureManager";

interface FigureCardProps {
  figure: Figure;
  onUpdateFigure: (updates: Partial<Figure>) => void;
  onDeleteFigure: () => void;
  onInsertFigure: () => void;
  onImproveCaption?: () => void;
  isImprovingCaption?: boolean;
}

export const FigureCard = ({
  figure,
  onUpdateFigure,
  onDeleteFigure,
  onInsertFigure,
  onImproveCaption,
  isImprovingCaption
}: FigureCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const copyPlaceholder = () => {
    navigator.clipboard.writeText(figure.placeholder);
    toast({
      title: "Copied to clipboard",
      description: "Figure placeholder has been copied.",
    });
  };

  const revertCaption = () => {
    if (figure.originalCaption) {
      onUpdateFigure({ caption: figure.originalCaption });
      toast({
        title: "Caption reverted",
        description: "Caption has been reverted to original.",
      });
    }
  };

  const getPositionColor = (position: string) => {
    switch (position) {
      case 'top': return 'bg-blue-100 text-blue-700';
      case 'bottom': return 'bg-green-100 text-green-700';
      case 'center': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileImage className="h-5 w-5 text-academic-blue" />
            {isEditing ? (
              <Input
                value={figure.title}
                onChange={(e) => onUpdateFigure({ title: e.target.value })}
                onBlur={() => setIsEditing(false)}
                onKeyDown={(e) => e.key === 'Enter' && setIsEditing(false)}
                className="font-semibold"
                autoFocus
              />
            ) : (
              <h4 
                className="font-semibold text-academic-text cursor-pointer hover:text-academic-blue"
                onClick={() => setIsEditing(true)}
              >
                {figure.title}
              </h4>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className={getPositionColor(figure.position || 'center')}>
              {figure.position || 'center'}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-academic-text">Caption</label>
            <div className="flex gap-1">
              {onImproveCaption && (
                <Button
                  onClick={onImproveCaption}
                  variant="ghost"
                  size="sm"
                  disabled={isImprovingCaption}
                  className="text-academic-blue"
                >
                  <Wand2 className="h-4 w-4" />
                  {isImprovingCaption ? 'Improving...' : 'Improve'}
                </Button>
              )}
              {figure.originalCaption && figure.caption !== figure.originalCaption && (
                <Button
                  onClick={revertCaption}
                  variant="ghost"
                  size="sm"
                  className="text-academic-muted"
                >
                  <RotateCcw className="h-4 w-4" />
                  Revert
                </Button>
              )}
            </div>
          </div>
          <Textarea
            value={figure.caption}
            onChange={(e) => onUpdateFigure({ caption: e.target.value })}
            rows={3}
            className="resize-none"
          />
        </div>
        
        <div>
          <label className="text-sm font-medium text-academic-text mb-2 block">
            Placeholder Text
          </label>
          <div className="flex gap-2">
            <Input
              value={figure.placeholder}
              onChange={(e) => onUpdateFigure({ placeholder: e.target.value })}
              className="font-mono text-sm"
              readOnly
            />
            <Button onClick={copyPlaceholder} variant="outline" size="sm">
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex justify-between pt-2">
          <Button
            onClick={onInsertFigure}
            variant="academic"
            size="sm"
          >
            Insert into Text
          </Button>
          <Button
            onClick={onDeleteFigure}
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};