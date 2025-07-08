import { FileText } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

export const PaperHeader = () => {
  return (
    <div className="text-center space-y-6 py-12 relative">
      <div className="absolute inset-0 bg-gradient-hero opacity-5 rounded-3xl"></div>
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>
      <div className="relative z-10">
        <div className="inline-flex items-center gap-4 mb-4">
          <div className="p-3 bg-gradient-academic rounded-2xl shadow-glow animate-float">
            <FileText className="h-10 w-10 text-white" />
          </div>
        </div>
        <h1 className="text-5xl font-bold bg-gradient-hero bg-clip-text text-transparent mb-4 tracking-tight">
          Academic Paper Assistant
        </h1>
        <p className="text-xl text-academic-muted max-w-3xl mx-auto leading-relaxed">
          Create well-structured, properly cited academic manuscripts ready for arXiv submission
        </p>
        <div className="mt-8 flex justify-center">
          <div className="h-1 w-24 bg-gradient-academic rounded-full shadow-glow"></div>
        </div>
      </div>
    </div>
  );
};