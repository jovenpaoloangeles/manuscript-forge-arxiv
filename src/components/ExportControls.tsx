import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileDown, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { usePaper } from "@/contexts/PaperContext";
import { SECTION_TYPES } from "@/lib/constants";

export const ExportControls = () => {
  const { sections, paperTitle, authors, citations } = usePaper();
  const { toast } = useToast();

  const getAbstractContent = () => {
    const abstractSection = sections.find(s => s.title.toLowerCase() === SECTION_TYPES.ABSTRACT);
    return abstractSection?.generatedContent || '';
  };

  const generateLatex = () => {
    const abstract = getAbstractContent();
    
    // Generate figure placeholders
    const generateFigurePlaceholders = (section: any) => {
      if (!section.figures || section.figures.length === 0) return '';
      
      return section.figures.map((figure: any, index: number) => `
\\begin{figure}[htbp]
  \\centering
  \\fbox{\\rule[-.5cm]{8cm}{6cm} \\rule[-.5cm]{8cm}{0cm}}
  \\caption{${figure.caption || figure.description || `Figure ${index + 1} placeholder`}}
  \\label{fig:${section.title.toLowerCase().replace(/\s+/g, '_')}_${index + 1}}
\\end{figure}
`).join('\n');
    };

    // Process content to replace citation placeholders with proper citations
    const processContent = (content: string) => {
      if (!content) return content;
      
      // Replace [CITE: reason] with \citep{key} format
      return content.replace(/\[CITE:\s*([^\]]+)\]/g, (match, reason) => {
        // Find citation that matches the reason or create a placeholder
        const citation = citations.find(c => 
          reason.toLowerCase().includes(c.title.toLowerCase()) ||
          reason.toLowerCase().includes(c.authors.toLowerCase())
        );
        return citation ? `\\citep{${citation.bibtexKey}}` : `\\citep{citation_placeholder}`;
      });
    };

    const latexContent = `\\documentclass{article}

\\usepackage{arxiv}

\\usepackage[utf8]{inputenc} % allow utf-8 input
\\usepackage[T1]{fontenc}    % use 8-bit T1 fonts
\\usepackage{hyperref}       % hyperlinks
\\usepackage{url}            % simple URL typesetting
\\usepackage{booktabs}       % professional-quality tables
\\usepackage{amsfonts}       % blackboard math symbols
\\usepackage{nicefrac}       % compact symbols for 1/2, etc.
\\usepackage{microtype}      % microtypography
\\usepackage{cleveref}       % smart cross-referencing
\\usepackage{graphicx}
\\usepackage{natbib}
\\usepackage{doi}

\\title{${paperTitle || "Your Academic Paper Title"}}

\\renewcommand{\\shorttitle}{${paperTitle ? paperTitle.substring(0, 50) + (paperTitle.length > 50 ? '...' : '') : "Paper Title"}}

\\author{${authors || "Author Name"}\\\\
	Department/Institution\\\\
	Address\\\\
	\\texttt{email@domain.com}
}

\\begin{document}
\\maketitle

${abstract ? `\\begin{abstract}
${processContent(abstract)}
\\end{abstract}

\\keywords{Keyword1 \\and Keyword2 \\and Keyword3}` : ''}

${sections
  .filter(s => s.title.toLowerCase() !== SECTION_TYPES.ABSTRACT && !s.title.toLowerCase().includes('reference'))
  .map((section, index) => `
\\section{${section.title}}
\\label{sec:${section.title.toLowerCase().replace(/\s+/g, '_')}}

${processContent(section.generatedContent || section.description || 'Content to be generated...')}

${generateFigurePlaceholders(section)}
`).join('\n')}

\\bibliographystyle{unsrtnat}
\\bibliography{references}

\\end{document}`;

    return latexContent;
  };

  const generateBibTeX = () => {
    if (citations.length === 0) {
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
    }

    const bibEntries = citations.map(citation => {
      const entryType = citation.journal ? 'article' : 'misc';
      let entry = `@${entryType}{${citation.bibtexKey},\n`;
      entry += `  title={${citation.title}},\n`;
      entry += `  author={${citation.authors}},\n`;
      
      if (citation.journal) {
        entry += `  journal={${citation.journal}},\n`;
      }
      
      entry += `  year={${citation.year}},\n`;
      
      if (citation.doi) {
        entry += `  doi={${citation.doi}},\n`;
      }
      
      if (citation.url) {
        entry += `  url={${citation.url}},\n`;
      }
      
      entry += `}`;
      return entry;
    }).join('\n\n');

    return `% Generated BibTeX entries\n\n${bibEntries}`;
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
  );
};