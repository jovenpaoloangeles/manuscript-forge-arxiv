import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PaperSection } from "./PaperStructure";
import { FileDown, Eye, Code, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PaperPreviewProps {
  sections: PaperSection[];
  paperTitle: string;
  authors: string;
  abstract: string;
}

export const PaperPreview = ({ sections, paperTitle, authors, abstract }: PaperPreviewProps) => {
  const { toast } = useToast();

  const generateLatex = () => {
    const latexContent = `\\documentclass{article}
\\usepackage[utf8]{inputenc}
\\usepackage{amsmath}
\\usepackage{amsfonts}
\\usepackage{amssymb}
\\usepackage{cite}
\\usepackage{url}

\\title{${paperTitle || "Your Academic Paper Title"}}
\\author{${authors || "Author Name"}}
\\date{\\today}

\\begin{document}

\\maketitle

${abstract ? `\\begin{abstract}
${abstract}
\\end{abstract}` : ''}

${sections.map(section => `
\\section{${section.title}}
${section.generatedContent || section.description || 'Content to be generated...'}
`).join('\n')}

\\bibliographystyle{plain}
\\bibliography{references}

\\end{document}`;

    return latexContent;
  };

  const generateBibTeX = () => {
    return `% BibTeX entries for your paper
% Add your references here

@article{example2023,
  title={Example Paper Title},
  author={Author, First and Author, Second},
  journal={Journal Name},
  volume={1},
  number={1},
  pages={1--10},
  year={2023},
  publisher={Publisher}
}`;
  };

  const copyToClipboard = (content: string, type: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied to clipboard",
      description: `${type} content has been copied to your clipboard.`,
    });
  };

  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generatedSections = sections.filter(s => s.generatedContent);
  const totalSections = sections.length;

  return (
    <div className="space-y-6">
      <Card className="border-academic-blue/20 bg-gradient-to-br from-academic-paper to-academic-light">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl text-academic-text">Paper Preview</CardTitle>
              <p className="text-academic-muted">Export and formatting options</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-academic-blue/10 text-academic-blue">
                {generatedSections.length}/{totalSections} sections generated
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-semibold text-academic-text">LaTeX Export</h4>
              <div className="flex gap-2">
                <Button
                  onClick={() => downloadFile(generateLatex(), 'paper.tex')}
                  variant="academic"
                  size="sm"
                  className="flex-1"
                >
                  <FileDown className="h-4 w-4" />
                  Download .tex
                </Button>
                <Button
                  onClick={() => copyToClipboard(generateLatex(), 'LaTeX')}
                  variant="academicOutline"
                  size="sm"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-academic-text">Bibliography</h4>
              <div className="flex gap-2">
                <Button
                  onClick={() => downloadFile(generateBibTeX(), 'references.bib')}
                  variant="academic"
                  size="sm"
                  className="flex-1"
                >
                  <FileDown className="h-4 w-4" />
                  Download .bib
                </Button>
                <Button
                  onClick={() => copyToClipboard(generateBibTeX(), 'BibTeX')}
                  variant="academicOutline"
                  size="sm"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-academic-paper shadow-paper">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg text-academic-text">Formatted Preview</CardTitle>
            <Button variant="ghost" size="sm">
              <Eye className="h-4 w-4" />
              Full Preview
            </Button>
          </div>
        </CardHeader>
        <CardContent className="prose max-w-none">
          <div className="bg-white p-8 border rounded-lg shadow-sm font-serif">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mb-4 text-academic-text">
                {paperTitle || "Your Academic Paper Title"}
              </h1>
              <p className="text-academic-muted italic">
                {authors || "Author Name"}
              </p>
            </div>

            {abstract && (
              <div className="mb-8">
                <h2 className="text-lg font-bold mb-3 text-academic-text">Abstract</h2>
                <p className="text-academic-text leading-relaxed">{abstract}</p>
              </div>
            )}

            {sections.map((section, index) => (
              <div key={section.id} className="mb-6">
                <h2 className="text-lg font-bold mb-3 text-academic-text">
                  {index + 1}. {section.title}
                </h2>
                <div className="text-academic-text leading-relaxed">
                  {section.generatedContent ? (
                    <div className="whitespace-pre-wrap">{section.generatedContent}</div>
                  ) : section.description ? (
                    <div className="italic text-academic-muted bg-academic-light p-4 rounded border-l-4 border-academic-blue">
                      <strong>Section outline:</strong> {section.description}
                      {section.bulletPoints.length > 0 && (
                        <ul className="list-disc list-inside mt-2 space-y-1">
                          {section.bulletPoints.map((point, idx) => (
                            <li key={idx}>{point}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ) : (
                    <div className="text-academic-muted italic">No content generated yet</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};