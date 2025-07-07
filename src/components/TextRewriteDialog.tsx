import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Wand2 } from "lucide-react";

interface TextRewriteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedText: string;
  onRewrite: (prompt?: string) => Promise<void>;
  isRewriting: boolean;
}

export const TextRewriteDialog = ({
  isOpen,
  onClose,
  selectedText,
  onRewrite,
  isRewriting
}: TextRewriteDialogProps) => {
  const [rewritePrompt, setRewritePrompt] = useState("");

  const handleRewrite = async () => {
    await onRewrite(rewritePrompt);
    setRewritePrompt("");
  };

  const handleClose = () => {
    setRewritePrompt("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Rewrite Selected Text</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-academic-text mb-2 block">
              Selected Text:
            </label>
            <div className="p-3 bg-academic-light border rounded-lg text-sm font-mono">
              {selectedText}
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium text-academic-text mb-2 block">
              Rewrite Instructions (optional):
            </label>
            <Input
              value={rewritePrompt}
              onChange={(e) => setRewritePrompt(e.target.value)}
              placeholder="e.g., 'Make it more formal', 'Simplify the language', 'Add more detail'..."
              className="text-sm"
            />
          </div>
          
          <div className="flex gap-2 justify-end">
            <Button
              onClick={handleClose}
              variant="ghost"
              disabled={isRewriting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleRewrite}
              variant="academic"
              disabled={isRewriting}
            >
              {isRewriting ? (
                <>
                  <Wand2 className="h-4 w-4 animate-spin mr-2" />
                  Rewriting...
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4 mr-2" />
                  Rewrite
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};