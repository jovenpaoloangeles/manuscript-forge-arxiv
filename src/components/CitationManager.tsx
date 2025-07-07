import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AddCitationDialog } from "./AddCitationDialog";
import { CitationSearch } from "./CitationSearch";
import { CitationList } from "./CitationList";

export interface Citation {
  id: string;
  title: string;
  authors: string;
  journal?: string;
  year: string;
  doi?: string;
  url?: string;
  bibtexKey: string;
}

interface CitationManagerProps {
  citations: Citation[];
  onCitationsChange: (citations: Citation[]) => void;
  onInsertCitation: (citationId: string) => void;
}

export const CitationManager = ({ citations, onCitationsChange, onInsertCitation }: CitationManagerProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const addCitation = (citation: Citation) => {
    onCitationsChange([...citations, citation]);
  };

  const deleteCitation = (id: string) => {
    onCitationsChange(citations.filter(c => c.id !== id));
    toast({
      title: "Citation removed",
      description: "Citation has been removed from your library.",
    });
  };

  const filteredCitations = citations.filter(citation =>
    citation.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    citation.authors.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card className="shadow-academic">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-academic-text">
              <BookOpen className="h-5 w-5" />
              Citation Library ({citations.length})
            </CardTitle>
            <p className="text-academic-muted text-sm">Manage your academic references</p>
          </div>
          <AddCitationDialog onAddCitation={addCitation} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <CitationSearch
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        
        <CitationList
          citations={searchQuery ? filteredCitations : citations}
          onInsertCitation={onInsertCitation}
          onDeleteCitation={deleteCitation}
        />
        
        {searchQuery && filteredCitations.length === 0 && (
          <div className="text-center py-8">
            <BookOpen className="h-12 w-12 text-academic-muted mx-auto mb-4" />
            <p className="text-academic-muted">No citations match your search</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};