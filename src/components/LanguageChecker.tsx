import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, Lightbulb, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface LanguageIssue {
  id: string;
  type: 'grammar' | 'style' | 'conciseness' | 'academic';
  severity: 'low' | 'medium' | 'high';
  message: string;
  suggestion?: string;
  originalText: string;
  suggestedText?: string;
  sectionId?: string;
}

interface LanguageCheckerProps {
  content: string;
  sectionId?: string;
  onContentUpdate?: (newContent: string) => void;
}

export const LanguageChecker = ({ content, sectionId, onContentUpdate }: LanguageCheckerProps) => {
  const [issues, setIssues] = useState<LanguageIssue[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const { toast } = useToast();

  const runLanguageCheck = async () => {
    if (!content.trim()) {
      toast({
        title: "No content to check",
        description: "Please provide some text to analyze.",
        variant: "destructive"
      });
      return;
    }

    setIsChecking(true);
    
    try {
      // Simulate language analysis
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const detectedIssues = generateMockIssues(content, sectionId);
      setIssues(detectedIssues);
      setLastChecked(new Date());

      toast({
        title: "Language check complete",
        description: `Found ${detectedIssues.length} suggestions for improvement.`,
      });
    } catch (error) {
      toast({
        title: "Check failed",
        description: "Language analysis failed. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsChecking(false);
    }
  };

  const generateMockIssues = (text: string, sectionId?: string): LanguageIssue[] => {
    const mockIssues: LanguageIssue[] = [];
    
    // Mock grammar issues
    if (text.includes("it's")) {
      mockIssues.push({
        id: `issue-${Date.now()}-1`,
        type: 'grammar',
        severity: 'medium',
        message: "Contractions should be avoided in academic writing",
        suggestion: "Use 'it is' instead of 'it's'",
        originalText: "it's",
        suggestedText: "it is",
        sectionId
      });
    }

    // Mock style issues
    if (text.split(' ').length > 30) {
      mockIssues.push({
        id: `issue-${Date.now()}-2`,
        type: 'style',
        severity: 'low',
        message: "Consider breaking long sentences for better readability",
        suggestion: "This sentence could be split into shorter, clearer statements",
        originalText: text.substring(0, 50) + "...",
        sectionId
      });
    }

    // Mock academic tone issues
    if (text.toLowerCase().includes("very") || text.toLowerCase().includes("really")) {
      mockIssues.push({
        id: `issue-${Date.now()}-3`,
        type: 'academic',
        severity: 'medium',
        message: "Avoid subjective intensifiers in academic writing",
        suggestion: "Use more precise, objective language",
        originalText: "very/really",
        suggestedText: "significantly/considerably",
        sectionId
      });
    }

    // Mock conciseness issues
    if (text.includes("in order to")) {
      mockIssues.push({
        id: `issue-${Date.now()}-4`,
        type: 'conciseness',
        severity: 'low',
        message: "Phrase can be simplified",
        suggestion: "Replace 'in order to' with 'to'",
        originalText: "in order to",
        suggestedText: "to",
        sectionId
      });
    }

    return mockIssues;
  };

  const applySuggestion = (issue: LanguageIssue) => {
    if (!issue.suggestedText || !onContentUpdate) return;

    const updatedContent = content.replace(issue.originalText, issue.suggestedText);
    onContentUpdate(updatedContent);
    
    // Remove the applied issue
    setIssues(issues.filter(i => i.id !== issue.id));

    toast({
      title: "Suggestion applied",
      description: "Text has been updated with the suggested change.",
    });
  };

  const dismissIssue = (issueId: string) => {
    setIssues(issues.filter(i => i.id !== issueId));
    toast({
      title: "Issue dismissed",
      description: "Suggestion has been dismissed.",
    });
  };

  const getIssueIcon = (type: LanguageIssue['type']) => {
    switch (type) {
      case 'grammar': return <AlertTriangle className="h-4 w-4" />;
      case 'style': return <Lightbulb className="h-4 w-4" />;
      case 'conciseness': return <Zap className="h-4 w-4" />;
      case 'academic': return <CheckCircle className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getIssueColor = (severity: LanguageIssue['severity']) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const issuesByType = issues.reduce((acc, issue) => {
    if (!acc[issue.type]) acc[issue.type] = [];
    acc[issue.type].push(issue);
    return acc;
  }, {} as Record<string, LanguageIssue[]>);

  return (
    <Card className="shadow-academic">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-academic-text">
              <CheckCircle className="h-5 w-5" />
              Language & Style Check
            </CardTitle>
            <p className="text-academic-muted text-sm">
              {lastChecked ? `Last checked: ${lastChecked.toLocaleTimeString()}` : "Grammar, style, and academic tone analysis"}
            </p>
          </div>
          <Button
            onClick={runLanguageCheck}
            variant="academic"
            size="sm"
            disabled={isChecking || !content.trim()}
          >
            {isChecking ? "Analyzing..." : "Run Check"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {issues.length === 0 && lastChecked && (
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <p className="text-academic-text font-medium">Great work!</p>
            <p className="text-academic-muted">No issues found in your text.</p>
          </div>
        )}

        {issues.length === 0 && !lastChecked && (
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 text-academic-muted mx-auto mb-4" />
            <p className="text-academic-muted">Click "Run Check" to analyze your text for grammar, style, and academic tone.</p>
          </div>
        )}

        {Object.entries(issuesByType).map(([type, typeIssues]) => (
          <div key={type} className="space-y-3">
            <div className="flex items-center gap-2">
              {getIssueIcon(type as LanguageIssue['type'])}
              <h4 className="font-semibold text-academic-text capitalize">
                {type} Issues ({typeIssues.length})
              </h4>
            </div>
            
            {typeIssues.map((issue) => (
              <div key={issue.id} className={`border rounded-lg p-4 ${getIssueColor(issue.severity)}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {issue.severity.toUpperCase()}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {issue.type.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="font-medium mb-1">{issue.message}</p>
                    {issue.suggestion && (
                      <p className="text-sm mb-2">{issue.suggestion}</p>
                    )}
                    {issue.originalText && (
                      <div className="text-sm">
                        <span className="font-medium">Original: </span>
                        <code className="bg-white/50 px-1 rounded">{issue.originalText}</code>
                        {issue.suggestedText && (
                          <>
                            <span className="font-medium ml-3">Suggested: </span>
                            <code className="bg-white/50 px-1 rounded">{issue.suggestedText}</code>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4">
                    {issue.suggestedText && onContentUpdate && (
                      <Button
                        onClick={() => applySuggestion(issue)}
                        variant="ghost"
                        size="sm"
                        className="text-green-600 hover:text-green-700"
                      >
                        Apply
                      </Button>
                    )}
                    <Button
                      onClick={() => dismissIssue(issue.id)}
                      variant="ghost"
                      size="sm"
                      className="text-gray-600 hover:text-gray-700"
                    >
                      Dismiss
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};