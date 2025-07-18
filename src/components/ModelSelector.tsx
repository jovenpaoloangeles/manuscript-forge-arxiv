import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bot, Zap, Clock, DollarSign } from "lucide-react";
import { AVAILABLE_MODELS } from "@/lib/constants";
import { getSelectedModel, setSelectedModel } from "@/lib/utils";

interface ModelSelectorProps {
  className?: string;
}

export const ModelSelector = ({ className }: ModelSelectorProps) => {
  const [selectedModel, setSelectedModelState] = useState<string>(getSelectedModel());

  useEffect(() => {
    setSelectedModelState(getSelectedModel());
  }, []);

  const handleModelChange = (modelId: string) => {
    setSelectedModel(modelId);
    setSelectedModelState(modelId);
  };

  const getModelIcon = (modelId: string) => {
    if (modelId.includes("4o")) return <Zap className="h-4 w-4" />;
    if (modelId.includes("turbo")) return <Clock className="h-4 w-4" />;
    if (modelId.includes("3.5")) return <DollarSign className="h-4 w-4" />;
    return <Bot className="h-4 w-4" />;
  };

  const selectedModelInfo = AVAILABLE_MODELS.find(model => model.id === selectedModel);

  return (
    <div className={className}>
      <label className="text-sm font-medium text-academic-text mb-2 flex items-center gap-2">
        <Bot className="h-4 w-4" />
        AI Model Selection
      </label>
      <Select value={selectedModel} onValueChange={handleModelChange}>
        <SelectTrigger className="text-base">
          <SelectValue placeholder="Select a model" />
        </SelectTrigger>
        <SelectContent>
          {AVAILABLE_MODELS.map((model) => (
            <SelectItem key={model.id} value={model.id}>
              <div className="flex items-center gap-2">
                {getModelIcon(model.id)}
                <span className="font-medium">{model.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selectedModelInfo && (
        <p className="text-xs text-academic-muted mt-1">
          {selectedModelInfo.description}
        </p>
      )}
    </div>
  );
};
