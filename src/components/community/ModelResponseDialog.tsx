"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Eye, ThermometerSun } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import { getModelProviderDetails } from "@/utils/ai-model-utils";
import { useModelResponse } from "@/lib/queries/response";
import { useState } from "react";

export const ModelResponseDialog = ({ responseId }: { responseId: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  const { data: modelResponse, isLoading } = useModelResponse(responseId, {
    enabled: isOpen,
  });

  const metadata = getModelProviderDetails(modelResponse?.model);
  const color = metadata?.color || "#888";
  const IconComponent = metadata?.Icon ?? null;
  const model = metadata?.modelName || modelResponse?.model;
  const providerName = metadata?.providerName || "Unknown";

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Eye className="mr-1 h-4 w-4" />
          Response
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] max-w-4xl overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <span className="mr-2">🤖</span> Model Response
          </DialogTitle>
        </DialogHeader>

        <div className="max-h-[60vh] overflow-y-auto pr-2">
          {/* Show loading state */}
          {isLoading && (
            <div className="flex items-center justify-center p-8">
              <div className="flex items-center space-x-2">
                <div className="border-primary h-6 w-6 animate-spin rounded-full border-2 border-t-transparent"></div>
                <p className="text-muted-foreground">Loading model response...</p>
              </div>
            </div>
          )}

          {/* Show the model response */}
          {!isLoading && modelResponse?.response && (
            <div
              className="group overflow-hidden rounded-md border-l-4 py-2 transition-all duration-200 hover:shadow-lg"
              style={{ borderLeftColor: color }}
            >
              <div className="mb-2 flex items-center justify-between gap-4 px-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg p-2" style={{ backgroundColor: `${color}15` }}>
                    {IconComponent && (
                      <IconComponent className="h-4 w-4" style={{ color: color }} />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className="text-xs font-medium"
                        style={{
                          backgroundColor: `${color}20`,
                          color: color,
                        }}
                      >
                        {providerName}
                      </Badge>
                      <span className="text-sm font-medium">{model}</span>
                    </div>
                    {modelResponse?.temperature !== undefined && (
                      <div className="mt-1 flex items-center gap-2">
                        <ThermometerSun className="text-muted-foreground h-3 w-3" />
                        <span className="text-muted-foreground text-xs">
                          Temperature: {modelResponse.temperature}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="prose prose-sm dark:prose-invert max-w-none px-4">
                <ReactMarkdown>{modelResponse.response}</ReactMarkdown>
              </div>
            </div>
          )}

          {/* Show fallback error */}
          {!isLoading && !modelResponse?.response && (
            <div className="rounded-lg border border-red-200 bg-red-50/50 p-6 text-red-600 dark:border-red-800/50 dark:bg-red-950/20 dark:text-red-400">
              <p className="flex items-center">
                <span className="mr-2">⚠️</span> Model response not available or has been deleted.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
