import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface CitationSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const CitationSearch = ({ searchQuery, onSearchChange }: CitationSearchProps) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-academic-muted" />
      <Input
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search citations..."
        className="pl-10"
      />
    </div>
  );
};