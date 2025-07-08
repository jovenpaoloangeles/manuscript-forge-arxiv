import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { usePaper } from "@/contexts/PaperContext";
import { SECTION_TYPES } from "@/lib/constants";

export const FormattedPreview = () => {
  const { sections, paperTitle, authors } = usePaper();
  const getAbstractContent = () => {
    const abstractSection = sections.find(s => s.title.toLowerCase() === SECTION_TYPES.ABSTRACT);
    return abstractSection?.generatedContent || '';
  };

  return (
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
        <div className="bg-white p-8 border rounded-lg shadow-sm font-serif max-w-none">
          {/* arXiv-style header */}
          <div className="border-t-2 border-b-2 border-black py-4 mb-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-2 text-academic-text uppercase tracking-wide">
                {paperTitle || "Your Academic Paper Title"}
              </h1>
              <div className="border-b-2 border-black mb-2"></div>
              <p className="text-sm text-academic-text font-sans uppercase tracking-wider">
                A Preprint
              </p>
            </div>
          </div>
          
          {/* Author information */}
          <div className="text-center mb-8">
            <p className="text-academic-text font-semibold">
              {authors || "Author Name"}
            </p>
            <p className="text-sm text-academic-muted mt-1">
              Department/Institution<br/>
              Address<br/>
              email@domain.com
            </p>
          </div>

          {getAbstractContent() && (
            <div className="mb-8">
              <div className="text-center mb-4">
                <h2 className="text-lg font-bold text-academic-text uppercase tracking-wider">Abstract</h2>
              </div>
              <div className="mx-8 text-justify">
                <p className="text-academic-text leading-relaxed italic border-l-4 border-academic-blue pl-4">
                  {getAbstractContent()}
                </p>
              </div>
            </div>
          )}

          {sections
            .filter(s => s.title.toLowerCase() !== SECTION_TYPES.ABSTRACT)
            .map((section, index) => (
            <div key={section.id} className="mb-8">
              <h2 className="text-lg font-bold mb-4 text-academic-text border-b border-academic-text/30 pb-1">
                {index + 1}. {section.title}
              </h2>
              <div className="text-academic-text leading-relaxed text-justify">
                {section.generatedContent ? (
                  <div className="whitespace-pre-wrap font-serif">{section.generatedContent}</div>
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
              
              {/* Figure placeholders */}
              {section.figures && section.figures.length > 0 && (
                <div className="mt-6 space-y-4">
                  {section.figures.map((figure, figIndex) => (
                    <div key={figure.id} className="text-center">
                      <div className="border-2 border-dashed border-academic-text/30 p-8 bg-academic-light/50 rounded">
                        <div className="text-academic-muted text-sm mb-2">Figure {index + 1}.{figIndex + 1}</div>
                        <div className="w-full h-32 bg-academic-text/10 rounded flex items-center justify-center">
                          <span className="text-academic-muted italic">[Figure Placeholder]</span>
                        </div>
                      </div>
                      <p className="text-sm text-academic-text mt-2 italic font-serif">
                        <strong>Figure {index + 1}.{figIndex + 1}:</strong> {figure.caption || figure.description || "Figure caption"}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};