import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

interface EmptyStructureProps {
  onAddDefaultStructure: () => void;
  onAddCustomSection: () => void;
}

export const EmptyStructure = ({ onAddDefaultStructure, onAddCustomSection }: EmptyStructureProps) => {
  return (
    <Card className="border-2 border-dashed border-academic-blue/30">
      <CardContent className="flex flex-col items-center justify-center py-12">
        <FileText className="h-12 w-12 text-academic-blue mb-4" />
        <h3 className="text-lg font-semibold mb-2">Start Your Academic Paper</h3>
        <p className="text-academic-muted text-center mb-6 max-w-md">
          Create your paper structure by adding the standard academic sections or build a custom structure from scratch.
        </p>
        <div className="flex gap-3">
          <Button onClick={onAddDefaultStructure} variant="academic" size="lg">
            Use Standard Structure
          </Button>
          <Button onClick={onAddCustomSection} variant="academicOutline">
            Custom Structure
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};