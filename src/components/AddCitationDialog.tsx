import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Citation } from "./CitationManager";

interface AddCitationDialogProps {
  onAddCitation: (citation: Citation) => void;
}

export const AddCitationDialog = ({ onAddCitation }: AddCitationDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
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

  const resetForm = () => {
    setNewCitation({
      title: "",
      authors: "",
      journal: "",
      year: "",
      doi: "",
      url: "",
      bibtexKey: ""
    });
  };

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

    onAddCitation(citation);
    resetForm();
    setIsOpen(false);

    toast({
      title: "Citation added",
      description: "Citation has been added to your library.",
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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
            <Button variant="ghost" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={addCitation} variant="academic">
              Add Citation
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};