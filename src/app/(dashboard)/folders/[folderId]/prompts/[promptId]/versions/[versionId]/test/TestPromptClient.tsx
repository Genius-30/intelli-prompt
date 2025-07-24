"use client";

import { Eye, Loader2, Play } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { AI_MODELS } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ModelResponseCard } from "@/components/version/ModelResponseCard";
import { ModelResponseSkeleton } from "@/components/skeletons/ModelResponseSkeleton";
import { PromptVersionTestCard } from "@/components/version/PromptVersionTestCard";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { useGetResponse } from "@/lib/queries/response";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function TestPromptClient() {
  const { versionId } = useParams();
  const [tokenEstimated, setTokenEstimated] = useState(0);
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

    testPrompt(
      {
        versionId: versionId as string,
        models: selectedModels,
        tokenEstimated,
      },
      {
        onSuccess: (data) => {
          setResponses(data);
        },
      }
    );
  };

  const handleModelSelect = (
    provider: string,
    modelId: string,
    temperature: number
  ) => {
    setSelectedModels((prev) => {
      const others = prev.filter((m) => m.provider !== provider);
      return [...others, { provider, model: modelId, temperature }];
    });
  };

  const handleTemperatureChange = (provider: string, temperature: number) => {
    setSelectedModels((prev) =>
      prev.map((m) => (m.provider === provider ? { ...m, temperature } : m))
    );
  };

  const handleDeselectModel = (provider: string) => {
    setSelectedModels((prev) => prev.filter((m) => m.provider !== provider));
  };

  const handleDeleteLocalResponse = (id: string) => {
    setResponses((prev) => prev.filter((res) => res._id !== id));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">AI Model Testing</h1>
        <p className="text-muted-foreground">
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
          <h2 className="text-xl font-semibold">Select Models</h2>
          <Badge variant="secondary" className="text-sm">
            {selectedModels.length} selected
          </Badge>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Object.entries(AI_MODELS).map(([provider, data]) => {
            const selected = selectedModels.find(
              (m) => m.provider === provider
            );
            const IconComponent = data.icon;

            return (
              <div
                key={provider}
                className={`group relative overflow-hidden rounded-xl border transition-all duration-200 hover:shadow-lg ${
                  selected
                    ? "border-primary shadow-md bg-primary/5"
                    : "border-border bg-card hover:border-primary/50"
                }`}
              >
                <div className="p-5 space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: `${data.color}15` }}
                      >
                        <IconComponent
                          className="w-5 h-5"
                          style={{ color: data.color }}
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm capitalize">
                          {data.name}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          {data.description}
                        </p>
                      </div>
                    </div>

                    {selected && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleDeselectModel(provider)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>

                  {/* Model Selection */}
                  <Select
                    value={selected?.model || ""}
                    onValueChange={(value) =>
                      handleModelSelect(
                        provider,
                        value,
                        selected?.temperature ?? 1.0
                      )
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose model" />
                    </SelectTrigger>
                    <SelectContent>
                      {data.models.map((model) => (
                        <SelectItem key={model.id} value={model.id}>
                          <div className="flex flex-col">
                            <span className="font-medium">{model.name}</span>
                            {model.description && (
                              <span className="text-xs text-muted-foreground">
                                {model.description}
                              </span>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Temperature Control */}
                  {selected && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-medium text-muted-foreground">
                          Temperature
                        </label>
                        <span className="text-xs font-mono bg-muted px-2 py-1 rounded">
                          {selected.temperature.toFixed(1)}
                        </span>
                      </div>
                      <Slider
                        min={0}
                        max={2}
                        step={0.1}
                        value={[selected.temperature]}
                        onValueChange={([value]) =>
                          handleTemperatureChange(provider, value)
                        }
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Focused</span>
                        <span>Creative</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Test Button */}
      <TooltipProvider>
        <div className="flex justify-center">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={handleTestPrompt}
                disabled={isTesting || selectedModels.length === 0}
                size="lg"
                className="px-8"
              >
                {isTesting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Testing...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Run Test ({selectedModels.length} models)
                  </>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {selectedModels.length === 0
                ? "Select at least one model to test"
                : `Test prompt with ${selectedModels.length} selected models`}
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>

      {/* Results Section */}
      {(isTesting || responses.length > 0) && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            <h2 className="text-xl font-semibold">Results</h2>
          </div>

          <div className="grid gap-4">
            {isTesting
              ? selectedModels.map((m, i) => (
                  <ModelResponseSkeleton
                    key={i}
                    provider={m.provider as keyof typeof AI_MODELS}
                    model={m.model}
                  />
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
                        <ModelResponseCard
                          provider={res.provider as keyof typeof AI_MODELS}
                          model={res.model}
                          temperature={res.temperature}
                          response={res.response}
                          modelId={res._id || ""}
                          isFavorite={res.isFavorite}
                          onDeleteLocally={handleDeleteLocalResponse}
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
