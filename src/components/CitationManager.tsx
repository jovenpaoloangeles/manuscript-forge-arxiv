import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, BookOpen, ExternalLink, Trash2, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  const [isAddingCitation, setIsAddingCitation] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [newCitation, setNewCitation] = useState<Partial<Citation>>({
    title: "",
    authors: "",
    journal: "",
    year: "",
    doi: "",
    url: "",
    bibtexKey: ""
  });
  const { toast } = useToast();

  const addCitation = () => {
    if (!newCitation.title || !newCitation.authors || !newCitation.year) {
      toast({
        title: "Missing information",
        description: "Please fill in title, authors, and year at minimum.",
        variant: "destructive"
      });
      return;
    }

    const citation: Citation = {
      id: `citation-${Date.now()}`,
      title: newCitation.title!,
      authors: newCitation.authors!,
      journal: newCitation.journal || "",
      year: newCitation.year!,
      doi: newCitation.doi || "",
      url: newCitation.url || "",
      bibtexKey: newCitation.bibtexKey || `${newCitation.authors?.split(',')[0]?.split(' ').pop()?.toLowerCase()}${newCitation.year}`
    };

    onCitationsChange([...citations, citation]);
    setNewCitation({
      title: "",
      authors: "",
      journal: "",
      year: "",
      doi: "",
      url: "",
      bibtexKey: ""
    });
    setIsAddingCitation(false);

    toast({
      title: "Citation added",
      description: "Citation has been added to your library.",
    });
  };

  const deleteCitation = (id: string) => {
    onCitationsChange(citations.filter(c => c.id !== id));
    toast({
      title: "Citation removed",
      description: "Citation has been removed from your library.",
    });
  };

  const fetchMetadata = async (doi: string) => {
    if (!doi) return;
    
    try {
      // Mock metadata fetching - in real app, would use CrossRef API
      toast({
        title: "Fetching metadata",
        description: "Retrieving citation information...",
      });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Metadata fetched",
        description: "Citation information has been updated.",
      });
    } catch (error) {
      toast({
        title: "Failed to fetch metadata",
        description: "Could not retrieve citation information.",
        variant: "destructive"
      });
    }
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
          <Dialog open={isAddingCitation} onOpenChange={setIsAddingCitation}>
            <DialogTrigger asChild>
              <Button variant="academic" size="sm">
                <Plus className="h-4 w-4" />
                Add Citation
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Citation</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Title *</label>
                    <Input
                      value={newCitation.title || ""}
                      onChange={(e) => setNewCitation({ ...newCitation, title: e.target.value })}
                      placeholder="Paper title"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Authors *</label>
                    <Input
                      value={newCitation.authors || ""}
                      onChange={(e) => setNewCitation({ ...newCitation, authors: e.target.value })}
                      placeholder="Author1, Author2, ..."
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Journal</label>
                    <Input
                      value={newCitation.journal || ""}
                      onChange={(e) => setNewCitation({ ...newCitation, journal: e.target.value })}
                      placeholder="Journal name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Year *</label>
                    <Input
                      value={newCitation.year || ""}
                      onChange={(e) => setNewCitation({ ...newCitation, year: e.target.value })}
                      placeholder="2024"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">BibTeX Key</label>
                    <Input
                      value={newCitation.bibtexKey || ""}
                      onChange={(e) => setNewCitation({ ...newCitation, bibtexKey: e.target.value })}
                      placeholder="author2024"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">DOI</label>
                    <div className="flex gap-2">
                      <Input
                        value={newCitation.doi || ""}
                        onChange={(e) => setNewCitation({ ...newCitation, doi: e.target.value })}
                        placeholder="10.1000/journal.1234"
                      />
                      <Button
                        onClick={() => fetchMetadata(newCitation.doi || "")}
                        variant="academicOutline"
                        size="sm"
                        disabled={!newCitation.doi}
                      >
                        <Search className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">URL</label>
                    <Input
                      value={newCitation.url || ""}
                      onChange={(e) => setNewCitation({ ...newCitation, url: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="ghost" onClick={() => setIsAddingCitation(false)}>
                    Cancel
                  </Button>
                  <Button onClick={addCitation} variant="academic">
                    Add Citation
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-academic-muted" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search citations..."
            className="pl-10"
          />
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredCitations.map((citation) => (
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
                    onClick={() => deleteCitation(citation.id)}
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
          
          {filteredCitations.length === 0 && (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 text-academic-muted mx-auto mb-4" />
              <p className="text-academic-muted">
                {searchQuery ? "No citations match your search" : "No citations added yet"}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};