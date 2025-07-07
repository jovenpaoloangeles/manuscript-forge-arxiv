import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings, Key, Lightbulb, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { usePaper } from "@/contexts/PaperContext";

interface PaperMetadataProps {
  onSuggestTitles?: () => Promise<string[]>;
  isGenerating?: boolean;
}

export const PaperMetadata = ({
  onSuggestTitles,
  isGenerating
}: PaperMetadataProps) => {
  const { paperTitle, setPaperTitle, authors, setAuthors, openaiApiKey, setOpenaiApiKey } = usePaper();
  const [suggestedTitles, setSuggestedTitles] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { toast } = useToast();

  const handleSuggestTitles = async () => {
    if (onSuggestTitles) {
      try {
        setShowSuggestions(true);
        const titles = await onSuggestTitles();
        setSuggestedTitles(titles || []);
      } catch (error) {
        console.error("Failed to get title suggestions:", error);
        setShowSuggestions(false);
      }
    }
  };

  const handleSelectTitle = (title: string) => {
    setPaperTitle(title);
    setShowSuggestions(false);
    setSuggestedTitles([]);
    toast({
      title: "Title selected",
      description: "Paper title has been updated.",
    });
  };

  const handleCopyTitle = async (title: string) => {
    try {
      await navigator.clipboard.writeText(title);
      toast({
        title: "Copied",
        description: "Title copied to clipboard.",
      });
    } catch (error) {
      // Fallback for browsers that don't support clipboard API
      console.error("Failed to copy:", error);
    }
  };

  return (
    <Card className="shadow-academic">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-academic-text">
          <Settings className="h-5 w-5" />
          Paper Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-academic-text">
                Paper Title
              </label>
              <Button
                onClick={handleSuggestTitles}
                variant="ghost"
                size="sm"
                disabled={isGenerating || !paperTitle.trim()}
                className="text-academic-blue"
              >
                <Lightbulb className="h-4 w-4 mr-1" />
                Suggest Titles
              </Button>
            </div>
            <Input
              value={paperTitle}
              onChange={(e) => setPaperTitle(e.target.value)}
              placeholder="Enter your paper title..."
              className="text-base"
            />
            
            {showSuggestions && suggestedTitles.length > 0 && (
              <div className="space-y-2 p-3 bg-academic-light/50 rounded-md">
                <label className="text-xs font-medium text-academic-muted">
                  Suggested Titles:
                </label>
                {suggestedTitles.map((title, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-white rounded border hover:bg-academic-light/30 transition-colors">
                    <span className="flex-1 text-sm">{title}</span>
                    <Button
                      onClick={() => handleCopyTitle(title)}
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button
                      onClick={() => handleSelectTitle(title)}
                      variant="ghost"
                      size="sm"
                      className="text-academic-blue text-xs"
                    >
                      Use This
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <label className="text-sm font-medium text-academic-text mb-2 block">
              Authors
            </label>
            <Input
              value={authors}
              onChange={(e) => setAuthors(e.target.value)}
              placeholder="Author Name, Co-author Name..."
              className="text-base"
            />
          </div>
        </div>
        <div>
          <div>
            <label className="text-sm font-medium text-academic-text mb-2 flex items-center gap-2">
              <Key className="h-4 w-4" />
              OpenAI API Key
            </label>
            <Input
              type="password"
              value={openaiApiKey}
              onChange={(e) => setOpenaiApiKey(e.target.value)}
              placeholder="Enter your OpenAI API key..."
              className="text-base"
            />
            <p className="text-xs text-academic-muted mt-1">
              Required for AI text generation. Stored locally in your browser.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};