import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";

interface BulletPointEditorProps {
  bulletPoints: string[];
  onBulletPointsChange: (bulletPoints: string[]) => void;
}

export const BulletPointEditor = ({ bulletPoints, onBulletPointsChange }: BulletPointEditorProps) => {
  const addBulletPoint = () => {
    onBulletPointsChange([...bulletPoints, ""]);
  };

  const updateBulletPoint = (index: number, value: string) => {
    const newBulletPoints = [...bulletPoints];
    newBulletPoints[index] = value;
    onBulletPointsChange(newBulletPoints);
  };

  const deleteBulletPoint = (index: number) => {
    const newBulletPoints = bulletPoints.filter((_, i) => i !== index);
    onBulletPointsChange(newBulletPoints);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-academic-text">
          Key Points ({bulletPoints.length})
        </label>
        <Button
          onClick={addBulletPoint}
          variant="ghost"
          size="sm"
          className="text-academic-blue"
        >
          <Plus className="h-4 w-4" />
          Add Point
        </Button>
      </div>
      <div className="space-y-2">
        {bulletPoints.map((point, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={point}
              onChange={(e) => updateBulletPoint(index, e.target.value)}
              placeholder={`Key point ${index + 1}...`}
              className="flex-1"
            />
            <Button
              onClick={() => deleteBulletPoint(index)}
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
  );
};