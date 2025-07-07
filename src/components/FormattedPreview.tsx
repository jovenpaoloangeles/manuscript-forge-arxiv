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
        <div className="bg-white p-8 border rounded-lg shadow-sm font-serif">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-4 text-academic-text">
              {paperTitle || "Your Academic Paper Title"}
            </h1>
            <p className="text-academic-muted italic">
              {authors || "Author Name"}
            </p>
          </div>

          {getAbstractContent() && (
            <div className="mb-8">
              <h2 className="text-lg font-bold mb-3 text-academic-text">Abstract</h2>
              <p className="text-academic-text leading-relaxed">{getAbstractContent()}</p>
            </div>
          )}

          {sections
            .filter(s => s.title.toLowerCase() !== SECTION_TYPES.ABSTRACT)
            .map((section, index) => (
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
  );
};