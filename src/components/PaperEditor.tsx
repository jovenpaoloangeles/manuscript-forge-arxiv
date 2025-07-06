import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PaperStructure, PaperSection } from "./PaperStructure";
import { PaperPreview } from "./PaperPreview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Settings, Eye, Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const PaperEditor = () => {
  const [paperTitle, setPaperTitle] = useState("");
  const [authors, setAuthors] = useState("");
  const [abstract, setAbstract] = useState("");
  const [sections, setSections] = useState<PaperSection[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateSectionContent = async (sectionId: string) => {
    const section = sections.find(s => s.id === sectionId);
    if (!section) return;

    setIsGenerating(true);
    
    try {
      // Simulate AI content generation
      // In a real implementation, this would call an AI service
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockContent = generateMockContent(section);
      
      setSections(sections.map(s => 
        s.id === sectionId 
          ? { ...s, generatedContent: mockContent }
          : s
      ));

      toast({
        title: "Content generated",
        description: `Generated academic content for ${section.title}`,
      });
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "Failed to generate content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateMockContent = (section: PaperSection): string => {
    const baseContent = section.description || `This section covers ${section.title.toLowerCase()}.`;
    const bulletContent = section.bulletPoints.length > 0 
      ? `\n\nKey aspects include:\n${section.bulletPoints.map(point => `• ${point}`).join('\n')}`
      : '';
    
    // Mock academic-style content with citations
    const mockCitations = [
      "Recent studies have shown significant progress in this area [1, 2].",
      "This approach builds upon the work of previous researchers [3].",
      "The methodology follows established protocols [4, 5].",
      "Our findings are consistent with recent literature [6]."
    ];
    
    const randomCitation = mockCitations[Math.floor(Math.random() * mockCitations.length)];
    
    return `${baseContent}${bulletContent}\n\n${randomCitation}\n\nThis section provides a comprehensive overview of the topic, incorporating established methodologies and current best practices in the field. The analysis presented here contributes to the broader understanding of the subject matter and establishes a foundation for the subsequent sections of this manuscript.`;
  };

  const generateAllSections = async () => {
    setIsGenerating(true);
    
    for (const section of sections) {
      if (!section.generatedContent) {
        await generateSectionContent(section.id);
        // Add delay between generations
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    setIsGenerating(false);
    toast({
      title: "All sections generated",
      description: "Successfully generated content for all sections",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-academic-light to-background">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-4 py-8">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-academic-blue to-primary-glow bg-clip-text text-transparent">
            <FileText className="h-8 w-8 text-academic-blue" />
            <h1 className="text-4xl font-bold">Academic Paper Assistant</h1>
          </div>
          <p className="text-lg text-academic-muted max-w-2xl mx-auto">
            Create well-structured, properly cited academic manuscripts ready for arXiv submission
          </p>
        </div>

        {/* Paper Metadata */}
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
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs defaultValue="structure" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="structure" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Structure
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Preview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="structure" className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Badge variant="secondary" className="bg-academic-blue/10 text-academic-blue">
                  {sections.filter(s => s.generatedContent).length} / {sections.length} Generated
                </Badge>
                {isGenerating && (
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                    Generating...
                  </Badge>
                )}
              </div>
              {sections.length > 0 && (
                <Button
                  onClick={generateAllSections}
                  variant="academic"
                  disabled={isGenerating || sections.every(s => s.generatedContent)}
                  className="flex items-center gap-2"
                >
                  <Wand2 className="h-4 w-4" />
                  Generate All Sections
                </Button>
              )}
            </div>

            <PaperStructure
              sections={sections}
              onSectionsChange={setSections}
              onGenerateSection={generateSectionContent}
            />
          </TabsContent>

          <TabsContent value="preview">
            <PaperPreview
              sections={sections}
              paperTitle={paperTitle}
              authors={authors}
              abstract={abstract}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};