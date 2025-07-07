import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, ExternalLink, Trash2 } from "lucide-react";
import { Citation } from "./CitationManager";

interface CitationListProps {
  citations: Citation[];
  onInsertCitation: (citationId: string) => void;
  onDeleteCitation: (citationId: string) => void;
}

export const CitationList = ({ citations, onInsertCitation, onDeleteCitation }: CitationListProps) => {
  if (citations.length === 0) {
    return (
      <div className="text-center py-8">
        <BookOpen className="h-12 w-12 text-academic-muted mx-auto mb-4" />
        <p className="text-academic-muted">No citations added yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-96 overflow-y-auto">
      {citations.map((citation) => (
        <div key={citation.id} className="border rounded-lg p-4 hover:bg-academic-light transition-colors">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="font-semibold text-academic-text line-clamp-2">{citation.title}</h4>
              <p className="text-sm text-academic-muted">{citation.authors}</p>
              <div className="flex items-center gap-2 mt-2">
                {citation.journal && (
                  <Badge variant="secondary" className="text-xs">
                    {citation.journal}
                  </Badge>
                )}
                <Badge variant="secondary" className="text-xs">
                  {citation.year}
                </Badge>
                <Badge variant="secondary" className="text-xs bg-academic-blue/10 text-academic-blue">
                  {citation.bibtexKey}
                </Badge>
              </div>
              {citation.doi && (
                <div className="flex items-center gap-1 mt-2">
                  <ExternalLink className="h-3 w-3 text-academic-muted" />
                  <span className="text-xs text-academic-muted">DOI: {citation.doi}</span>
                </div>
              )}
            </div>
            <div className="flex gap-2 ml-4">
              <Button
                onClick={() => onInsertCitation(citation.id)}
                variant="academicOutline"
                size="sm"
              >
                Insert
              </Button>
              <Button
                onClick={() => onDeleteCitation(citation.id)}
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};