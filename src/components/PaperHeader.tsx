import { FileText } from "lucide-react";

export const PaperHeader = () => {
  return (
    <div className="text-center space-y-4 py-8">
      <div className="inline-flex items-center gap-3 bg-gradient-to-r from-academic-blue to-primary-glow bg-clip-text text-transparent">
        <FileText className="h-8 w-8 text-academic-blue" />
        <h1 className="text-4xl font-bold">Academic Paper Assistant</h1>
      </div>
      <p className="text-lg text-academic-muted max-w-2xl mx-auto">
        Create well-structured, properly cited academic manuscripts ready for arXiv submission
      </p>
    </div>
  );
};