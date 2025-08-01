"use client";

import { Eye, Loader2, Play, ThermometerSun } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import { AIModelSelector } from "@/components/version/AiModelSelector";
import { AI_MODELS } from "@/lib/constants/AI_MODELS";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ModelResponseCard } from "@/components/response/ModelResponseCard";
import { ModelResponseSkeleton } from "@/components/skeletons/ModelResponseSkeleton";
import { PromptVersionTestCard } from "@/components/response/PromptVersionTestCard";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { useGetResponse } from "@/lib/queries/response";
import { useParams } from "next/navigation";
import { useState } from "react";

const isUserPremium = false;

export default function TestPromptPage() {
  const { versionId } = useParams();
  const [tokenEstimated, setTokenEstimated] = useState(0);
  const [globalTemperature, setGlobalTemperature] = useState(1.5);
  const { mutate: testPrompt, isPending: isTesting } = useGetResponse();
  const [selectedModels, setSelectedModels] = useState<
    { provider: string; model: string; temperature: number }[]
  >([]);
  const [responses, setResponses] = useState<
    {
      provider: string;
      model: string;
      temperature: number;
      response: string;
      _id: string | null;
      isFavorite?: boolean;
      error?: string;
    }[]
  >([]);

  const handleTestPrompt = () => {
    if (!versionId || selectedModels.length === 0) {
      toast.warning("Please select at least one model.");
      return;
    }

    // Update all selected models with current global temperature
    const modelsWithCurrentTemp = selectedModels.map((model) => ({
      ...model,
      temperature: globalTemperature,
    }));

    testPrompt(
      {
        versionId: versionId as string,
        models: modelsWithCurrentTemp,
        tokenEstimated,
      },
      {
        onSuccess: (data) => {
          setResponses(data);
        },
      },
    );
  };

  const handleModelSelect = (provider: string, modelId: string) => {
    const providerData = AI_MODELS[provider as keyof typeof AI_MODELS];

    // Check if model requires premium and user is not premium
    if (providerData?.premium && !isUserPremium) {
      toast.error("This model is only available for premium users. Please upgrade your plan.");
      return;
    }

    setSelectedModels((prev) => {
      const others = prev.filter((m) => m.provider !== provider);
      return [...others, { provider, model: modelId, temperature: globalTemperature }];
    });
  };

  const handleDeselectModel = (provider: string) => {
    setSelectedModels((prev) => prev.filter((m) => m.provider !== provider));
  };

  const handleRemoveResponse = (id: string) => {
    setResponses((prev) => prev.filter((res) => res.model !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-start">
        <h1 className="text-2xl font-bold tracking-tight">AI Model Testing</h1>
        <p className="text-muted-foreground text-sm">
          Test your prompts across multiple AI models and compare responses
        </p>
      </div>

      {/* Prompt Viewer */}
      <PromptVersionTestCard
        versionId={versionId as string}
        showTokenEstimate={true}
        onTokenEstimated={(value) => setTokenEstimated(value)}
      />

      {/* Model Selection Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Select Models</h2>
          <Badge variant="secondary" className="text-sm">
            {selectedModels.length} selected
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
          {Object.keys(AI_MODELS).map((provider) => {
            const selected = selectedModels.find((m) => m.provider === provider);
            return (
              <AIModelSelector
                key={provider}
                provider={provider}
                selectedModel={selected?.model}
                isUserPremium={isUserPremium}
                onSelect={handleModelSelect}
                onDeselect={handleDeselectModel}
              />
            );
          })}
        </div>
      </div>

      {/* Temperature Control & Test Button */}
      <div className="rounded-lg border">
        <div className="bg-muted/30 flex items-center gap-2 border-b px-3 py-2">
          <ThermometerSun className="text-muted-foreground h-3 w-3" />
          <span className="text-muted-foreground text-xs">Temperature & Test</span>
        </div>
        <div className="p-3">
          <div className="flex items-center justify-around gap-4">
            {/* Temperature Control */}
            <div className="w-full max-w-[400px] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Temperature</span>
                <span className="bg-muted rounded px-2 py-1 font-mono text-xs">
                  {globalTemperature.toFixed(1)}
                </span>
              </div>
              <Slider
                min={0}
                max={2}
                step={0.1}
                value={[globalTemperature]}
                onValueChange={([value]) => setGlobalTemperature(value)}
                className="w-full"
                disabled={isTesting || selectedModels.length === 0}
              />
              <div className="text-muted-foreground flex justify-between text-xs">
                <span>Focused</span>
                <span>Creative</span>
              </div>
            </div>

            {/* Test Button */}
            <div className="flex-shrink-0">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={handleTestPrompt}
                      disabled={isTesting || selectedModels.length === 0}
                      size="lg"
                      className="px-6"
                    >
                      {isTesting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Testing...
                        </>
                      ) : (
                        <>
                          <Play className="mr-2 h-4 w-4" />
                          Run Test
                        </>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-muted" arrowClassName="bg-muted fill-muted">
                    {selectedModels.length === 0
                      ? "Select at least one model to test"
                      : `Test ${selectedModels.length} models at temperature ${globalTemperature}`}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      {(isTesting || responses.length > 0) && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            <h2 className="text-lg font-semibold">Results</h2>
          </div>

          <div className="grid gap-4">
            {isTesting
              ? selectedModels.map((m) => (
                  <ModelResponseSkeleton
                    key={`${m.provider}-${m.model}`}
                    provider={m.provider as keyof typeof AI_MODELS}
                    model={m.model}
                  />
                ))
              : responses.map((res) => {
                  const hasError = !!res.error || res.response?.toLowerCase().includes("error");

                  return (
                    <div key={`${res.model}-${res.provider}`}>
                      {hasError ? (
                        <div className="border-destructive/50 bg-destructive/5 rounded-lg border p-4">
                          <div className="mb-2 flex items-center gap-2">
                            <div className="bg-destructive h-2 w-2 rounded-full" />
                            <span className="text-sm font-semibold">
                              {res.provider.toUpperCase()} - {res.model}
                            </span>
                          </div>
                          <p className="text-destructive text-sm">
                            {(() => {
                              if (typeof res.error === "string") {
                                return res.error;
                              }
                              if (typeof res.response === "string") {
                                return res.response;
                              }
                              return JSON.stringify(
                                res.error ?? res.response ?? "No response",
                                null,
                                2,
                              );
                            })()}
                          </p>
                        </div>
                      ) : (
                        <ModelResponseCard
                          provider={res.provider as keyof typeof AI_MODELS}
                          model={res.model}
                          temperature={res.temperature}
                          response={res.response}
                          onRemove={handleRemoveResponse}
                          showRemoveButton
                        />
                      )}
                    </div>
                  );
                })}
          </div>
        </div>
      )}
    </div>
  );
}
