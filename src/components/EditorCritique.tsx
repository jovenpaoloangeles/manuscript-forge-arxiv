import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, MessageSquare, Target, Zap, AlertCircle, CheckCircle, Lightbulb } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useOpenAI } from "@/hooks/useOpenAI";
import { FullPaperAnalysisResponse } from "@/lib/openai/generators";
import { ArgumentStrengthReport } from "./ArgumentStrengthReport";
import { FlowAnalysisReport } from "./FlowAnalysisReport";
import { TerminologyReport } from "./TerminologyReport";

export interface CritiqueResponse {
  id: string;
  type: 'structure' | 'clarity' | 'flow' | 'academic_tone' | 'completeness';
  score: number; // 1-10
  feedback: string;
  suggestions: string[];
  strengths: string[];
  timestamp: Date;
}

interface EditorCritiqueProps {
  content: string;
  paperTitle?: string;
  abstract?: string;
  sectionTitle?: string;
  sectionId?: string;
}

export const EditorCritique = ({ content, paperTitle, abstract, sectionTitle, sectionId }: EditorCritiqueProps) => {
  const [critiques, setCritiques] = useState<CritiqueResponse[]>([]);
  const [fullPaperAnalysis, setFullPaperAnalysis] = useState<FullPaperAnalysisResponse | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzeType, setAnalyzeType] = useState<'full' | 'section'>('section');
  const [customPrompt, setCustomPrompt] = useState("");
  const { toast } = useToast();
  const { fullPaperAnalysis: runFullPaperAnalysis, isGenerating } = useOpenAI();

  // Determine if this is a full paper analysis based on content length and presence of multiple sections
  const isFullPaper = content.length > 2000 || (content.includes('# ') && content.split('# ').length > 3);

  const runCritique = async (type: 'full' | 'section' | 'custom' = analyzeType) => {
    if (!content.trim() && type !== 'full') {
      toast({
        title: "No content to analyze",
        description: "Please provide content for analysis.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    
    try {
      if (type === 'full' && isFullPaper && paperTitle) {
        // Use real OpenAI API for full paper analysis
        const analysis = await runFullPaperAnalysis(paperTitle, content);
        setFullPaperAnalysis(analysis);
      } else {
        // Use mock critique for section/custom analysis
        const newCritique = generateMockCritique(type, content, sectionTitle, customPrompt);
        setCritiques([newCritique, ...critiques]);

        toast({
          title: "Analysis complete",
          description: "Editor critique has been generated.",
        });
      }
    } catch (error) {
      toast({
        title: "Analysis failed",
        description: "Failed to generate critique. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
      setCustomPrompt("");
    }
  };

  const generateMockCritique = (
    type: 'full' | 'section' | 'custom',
    content: string,
    sectionTitle?: string,
    customPrompt?: string
  ): CritiqueResponse => {
    const mockCritiques = {
      full: {
        structure: {
          score: 8,
          feedback: "The overall paper structure follows academic conventions well. The logical flow from introduction through methodology to results is clear and appropriate for the discipline.",
          suggestions: [
            "Consider adding transitional paragraphs between major sections",
            "The conclusion could better tie back to the research questions posed in the introduction",
            "Consider reordering some subsections for better narrative flow"
          ],
          strengths: [
            "Clear section organization",
            "Appropriate use of headings and subheadings",
            "Good balance between sections"
          ]
        },
        clarity: {
          score: 7,
          feedback: "The writing is generally clear but could benefit from more concise expression in places. Some technical concepts need better explanation for broader accessibility.",
          suggestions: [
            "Simplify complex sentences without losing technical accuracy",
            "Add definitions for specialized terminology",
            "Use more active voice where appropriate"
          ],
          strengths: [
            "Technical accuracy is maintained",
            "Key concepts are well-explained",
            "Good use of examples"
          ]
        }
      },
      section: {
        flow: {
          score: 6,
          feedback: `This section (${sectionTitle || 'Current section'}) presents information logically but could improve in transitional coherence. The ideas are sound but the connection between paragraphs needs strengthening.`,
          suggestions: [
            "Add topic sentences that clearly connect to the previous paragraph",
            "Use transitional phrases to guide readers through your argument",
            "Consider reorganizing some points for better logical progression"
          ],
          strengths: [
            "Core arguments are well-developed",
            "Evidence is appropriately cited",
            "Technical details are accurate"
          ]
        },
        academic_tone: {
          score: 8,
          feedback: "The academic tone is appropriate and consistent with scholarly standards. The writing maintains objectivity while presenting compelling arguments.",
          suggestions: [
            "Consider using more hedging language for stronger claims",
            "Ensure all statements are properly supported with citations",
            "Minor adjustments to formality level in a few places"
          ],
          strengths: [
            "Consistent formal register",
            "Objective presentation of findings",
            "Appropriate academic vocabulary"
          ]
        }
      },
      custom: {
        completeness: {
          score: 7,
          feedback: customPrompt 
            ? `Based on your specific request: "${customPrompt}". The content addresses most key aspects but could be more comprehensive in certain areas.`
            : "The content covers the essential elements but could benefit from additional depth and supporting details.",
          suggestions: [
            "Expand on key points with more detailed examples",
            "Include additional supporting evidence",
            "Consider addressing potential counterarguments"
          ],
          strengths: [
            "Core concepts are well-covered",
            "Good foundational structure",
            "Clear presentation of main ideas"
          ]
        }
      }
    };

    const critiqueType = type === 'full' ? 'structure' : type === 'section' ? 'flow' : 'completeness';
    const critiqueData = type === 'full' 
      ? mockCritiques.full[Math.random() > 0.5 ? 'structure' : 'clarity']
      : type === 'section'
      ? mockCritiques.section[Math.random() > 0.5 ? 'flow' : 'academic_tone']
      : mockCritiques.custom.completeness;

    return {
      id: `critique-${Date.now()}`,
      type: critiqueType as CritiqueResponse['type'],
      score: critiqueData.score,
      feedback: critiqueData.feedback,
      suggestions: critiqueData.suggestions,
      strengths: critiqueData.strengths,
      timestamp: new Date()
    };
  };

  const getCritiqueIcon = (type: CritiqueResponse['type']) => {
    switch (type) {
      case 'structure': return <Target className="h-4 w-4" />;
      case 'clarity': return <Lightbulb className="h-4 w-4" />;
      case 'flow': return <Zap className="h-4 w-4" />;
      case 'academic_tone': return <MessageSquare className="h-4 w-4" />;
      case 'completeness': return <CheckCircle className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600 bg-green-100';
    if (score >= 6) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <Card className="shadow-academic">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-academic-text">
          <Brain className="h-5 w-5" />
          Editor Critique & Feedback
        </CardTitle>
        <p className="text-academic-muted text-sm">AI-powered analysis of structure, clarity, and academic quality</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Analysis Controls */}
        <div className="space-y-4">
          <div className="flex gap-2">
            <Button
              onClick={() => { setAnalyzeType('section'); runCritique('section'); }}
              variant={analyzeType === 'section' ? 'academic' : 'academicOutline'}
              size="sm"
              disabled={isAnalyzing}
            >
              Analyze Section
            </Button>
            <Button
              onClick={() => { setAnalyzeType('full'); runCritique('full'); }}
              variant={analyzeType === 'full' ? 'academic' : 'academicOutline'}
              size="sm"
              disabled={isAnalyzing}
            >
              Analyze Full Paper
            </Button>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-academic-text">Custom Analysis Request</label>
            <div className="flex gap-2">
              <Textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Ask for specific feedback (e.g., 'Focus on methodology section coherence' or 'Check argument strength')"
                rows={2}
                className="flex-1"
              />
              <Button
                onClick={() => runCritique('custom')}
                variant="academicOutline"
                size="sm"
                disabled={isAnalyzing || !customPrompt.trim()}
                className="self-start"
              >
                Analyze
              </Button>
            </div>
          </div>

          {isAnalyzing && (
            <div className="flex items-center gap-2 text-academic-blue">
              <Brain className="h-4 w-4 animate-pulse" />
              <span className="text-sm">Analyzing your content...</span>
            </div>
          )}
        </div>

        {/* Full Paper Analysis Results */}
        {fullPaperAnalysis && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-academic-text">Comprehensive Paper Analysis</h3>
              <Badge className={`${getScoreColor(fullPaperAnalysis.overallScore)} font-bold text-lg px-3 py-1`}>
                Overall: {fullPaperAnalysis.overallScore}/10
              </Badge>
            </div>
            
            <Tabs defaultValue="argument" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="argument">Argument Strength</TabsTrigger>
                <TabsTrigger value="flow">Flow & Cohesion</TabsTrigger>
                <TabsTrigger value="terminology">Terminology</TabsTrigger>
              </TabsList>
              
              <TabsContent value="argument">
                <ArgumentStrengthReport data={fullPaperAnalysis.argumentStrength} />
              </TabsContent>
              
              <TabsContent value="flow">
                <FlowAnalysisReport data={fullPaperAnalysis.flowAndCohesion} />
              </TabsContent>
              
              <TabsContent value="terminology">
                <TerminologyReport data={fullPaperAnalysis.terminologyConsistency} />
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Section/Custom Critique Results */}
        {!fullPaperAnalysis && (
          <div className="space-y-4">
            {critiques.length === 0 && !isAnalyzing && (
              <div className="text-center py-8">
                <Brain className="h-12 w-12 text-academic-muted mx-auto mb-4" />
                <p className="text-academic-muted">No critiques generated yet. Choose an analysis type above to get started.</p>
              </div>
            )}

            {critiques.map((critique) => (
              <div key={critique.id} className="border rounded-lg p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getCritiqueIcon(critique.type)}
                    <div>
                      <h4 className="font-semibold text-academic-text capitalize">
                        {critique.type.replace('_', ' ')} Analysis
                      </h4>
                      <p className="text-sm text-academic-muted">
                        {critique.timestamp.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <Badge className={`${getScoreColor(critique.score)} font-bold`}>
                    {critique.score}/10
                  </Badge>
                </div>

                <div className="space-y-4">
                  <div>
                    <h5 className="font-medium text-academic-text mb-2">Overall Feedback</h5>
                    <p className="text-academic-text bg-academic-light p-3 rounded-lg">
                      {critique.feedback}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium text-academic-text mb-2 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-yellow-600" />
                        Suggestions for Improvement
                      </h5>
                      <ul className="space-y-2">
                        {critique.suggestions.map((suggestion, idx) => (
                          <li key={idx} className="text-sm text-academic-text bg-yellow-50 p-2 rounded border-l-2 border-yellow-200">
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h5 className="font-medium text-academic-text mb-2 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Identified Strengths
                      </h5>
                      <ul className="space-y-2">
                        {critique.strengths.map((strength, idx) => (
                          <li key={idx} className="text-sm text-academic-text bg-green-50 p-2 rounded border-l-2 border-green-200">
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};