import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Settings, Key } from "lucide-react";

interface PaperMetadataProps {
  paperTitle: string;
  setPaperTitle: (title: string) => void;
  authors: string;
  setAuthors: (authors: string) => void;
  abstract: string;
  setAbstract: (abstract: string) => void;
  openaiApiKey: string;
  setOpenaiApiKey: (key: string) => void;
}

export const PaperMetadata = ({
  paperTitle,
  setPaperTitle,
  authors,
  setAuthors,
  abstract,
  setAbstract,
  openaiApiKey,
  setOpenaiApiKey
}: PaperMetadataProps) => {
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
          <div>
            <label className="text-sm font-medium text-academic-text mb-2 block">
              Paper Title
            </label>
            <Input
              value={paperTitle}
              onChange={(e) => setPaperTitle(e.target.value)}
              placeholder="Enter your paper title..."
              className="text-base"
            />
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-academic-text mb-2 block">
              Abstract
            </label>
            <Textarea
              value={abstract}
              onChange={(e) => setAbstract(e.target.value)}
              placeholder="Write your abstract here..."
              rows={4}
              className="resize-none"
            />
          </div>
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