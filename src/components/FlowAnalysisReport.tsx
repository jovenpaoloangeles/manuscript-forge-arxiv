import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, CheckCircle, AlertCircle } from "lucide-react";

interface FlowAnalysisData {
  score: number;
  feedback: string;
  strengths: string[];
  suggestions: string[];
}

interface FlowAnalysisReportProps {
  data: FlowAnalysisData;
}

export const FlowAnalysisReport = ({ data }: FlowAnalysisReportProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600 bg-green-100';
    if (score >= 6) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <Card className="shadow-academic">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-academic-text">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Flow & Cohesion Analysis
          </div>
          <Badge className={`${getScoreColor(data.score)} font-bold`}>
            {data.score}/10
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="font-medium text-academic-text mb-3">Structural Assessment</h4>
          <p className="text-academic-text bg-academic-light p-4 rounded-lg leading-relaxed">
            {data.feedback}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-academic-text mb-3 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              Flow Strengths
            </h4>
            <ul className="space-y-3">
              {data.strengths.map((strength, idx) => (
                <li key={idx} className="text-sm text-academic-text bg-green-50 p-3 rounded-lg border-l-3 border-green-200">
                  {strength}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-academic-text mb-3 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              Cohesion Improvements
            </h4>
            <ul className="space-y-3">
              {data.suggestions.map((suggestion, idx) => (
                <li key={idx} className="text-sm text-academic-text bg-yellow-50 p-3 rounded-lg border-l-3 border-yellow-200">
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};