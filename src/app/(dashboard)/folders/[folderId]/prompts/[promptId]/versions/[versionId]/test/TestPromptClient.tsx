"use client";

import { Eye, Loader2, Play, ThermometerSun } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { lazy, Suspense } from "react";

const AIModelSelector = lazy(() =>
  import("@/components/version/AiModelSelector").then((m) => ({
    default: m.AIModelSelector,
  }))
);
const ModelResponseCard = lazy(() =>
  import("@/components/response/ModelResponseCard").then((m) => ({
    default: m.ModelResponseCard,
  }))
);
const ModelResponseSkeleton = lazy(() =>
  import("@/components/skeletons/ModelResponseSkeleton").then((m) => ({
    default: m.ModelResponseSkeleton,
  }))
);
const PromptVersionTestCard = lazy(() =>
  import("@/components/response/PromptVersionTestCard").then((m) => ({
    default: m.PromptVersionTestCard,
  }))
);

import { AI_MODELS } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { useGetResponse } from "@/lib/queries/response";
import { useParams } from "next/navigation";
import { useState } from "react";

const isUserPremium = false;

export default function TestPromptClient() {
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
      }
    );
  };

  const handleModelSelect = (provider: string, modelId: string) => {
    const providerData = AI_MODELS[provider as keyof typeof AI_MODELS];

    // Check if model requires premium and user is not premium
    if (providerData?.premium && !isUserPremium) {
      toast.error(
        "This model is only available for premium users. Please upgrade your plan."
      );
      return;
    }

    setSelectedModels((prev) => {
      const others = prev.filter((m) => m.provider !== provider);
      return [
        ...others,
        { provider, model: modelId, temperature: globalTemperature },
      ];
    });
  };

  const handleDeselectModel = (provider: string) => {
    setSelectedModels((prev) => prev.filter((m) => m.provider !== provider));
  };

  const handleDeleteResponse = (id: string) => {
    setResponses((prev) => prev.filter((res) => res._id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-start">
        <h1 className="text-2xl font-bold tracking-tight">AI Model Testing</h1>
        <p className="text-sm text-muted-foreground">
          Test your prompts across multiple AI models and compare responses
        </p>
      </div>

      {/* Prompt Viewer */}
      <Suspense
        fallback={<div className="h-32 bg-muted animate-pulse rounded-lg" />}
      >
        <PromptVersionTestCard
          versionId={versionId as string}
          showTokenEstimate={true}
          onTokenEstimated={(value) => setTokenEstimated(value)}
        />
      </Suspense>

      {/* Model Selection Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Select Models</h2>
          <Badge variant="secondary" className="text-sm">
            {selectedModels.length} selected
          </Badge>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Object.keys(AI_MODELS).map((provider) => {
            const selected = selectedModels.find(
              (m) => m.provider === provider
            );
            return (
              <Suspense
                key={provider}
                fallback={
                  <div className="h-24 bg-muted animate-pulse rounded-lg" />
                }
              >
                <AIModelSelector
                  provider={provider}
                  selectedModel={selected?.model}
                  isUserPremium={isUserPremium}
                  onSelect={handleModelSelect}
                  onDeselect={handleDeselectModel}
                />
              </Suspense>
            );
          })}
        </div>
      </div>

      {/* Temperature Control & Test Button */}
      <div className="border rounded-lg">
        <div className="flex items-center gap-2 px-3 py-2 border-b bg-muted/30">
          <ThermometerSun className="w-3 h-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            Temperature & Test
          </span>
        </div>
        <div className="p-3">
          <div className="flex items-center justify-around gap-4">
            {/* Temperature Control */}
            <div className="w-full max-w-[400px] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Temperature</span>
                <span className="text-xs font-mono bg-muted px-2 py-1 rounded">
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
              />
              <div className="flex justify-between text-xs text-muted-foreground">
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
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Testing...
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Run Test
                        </>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
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
            <Eye className="w-4 h-4" />
            <h2 className="text-lg font-semibold">Results</h2>
          </div>

          <div className="grid gap-4">
            {isTesting
              ? selectedModels.map((m) => (
                  <Suspense
                    key={`${m.provider}-${m.model}`}
                    fallback={
                      <div className="h-32 bg-muted animate-pulse rounded-lg" />
                    }
                  >
                    <ModelResponseSkeleton
                      provider={m.provider as keyof typeof AI_MODELS}
                      model={m.model}
                    />
                  </Suspense>
                ))
              : responses.map((res) => {
                  const hasError =
                    !!res.error ||
                    res.response?.toLowerCase().includes("error");

                  return (
                    <div key={`${res.model}-${res.provider}`}>
                      {hasError ? (
                        <div className="border border-destructive/50 bg-destructive/5 p-4 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 rounded-full bg-destructive" />
                            <span className="font-semibold text-sm">
                              {res.provider.toUpperCase()} - {res.model}
                            </span>
                          </div>
                          <p className="text-sm text-destructive">
                            {res.error ||
                              res.response ||
                              "Unknown error occurred"}
                          </p>
                        </div>
                      ) : (
                        <Suspense
                          fallback={
                            <div className="h-32 bg-muted animate-pulse rounded-lg" />
                          }
                        >
                          <ModelResponseCard
                            provider={res.provider as keyof typeof AI_MODELS}
                            model={res.model}
                            temperature={res.temperature}
                            response={res.response}
                            modelId={res._id || ""}
                            onDelete={handleDeleteResponse}
                          />
                        </Suspense>
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
