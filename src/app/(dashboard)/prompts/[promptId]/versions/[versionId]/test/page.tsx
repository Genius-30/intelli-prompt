"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useGetResponse } from "@/lib/queries/response";
import { AI_MODELS } from "@/lib/constants";
import Image from "next/image";
import { toast } from "sonner";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { PromptVersionViewer } from "@/components/version/prompt-version-viewer";
import { ModelResponseCard } from "@/components/version/model-response-card";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Loader2 } from "lucide-react";
import { ModelResponseSkeleton } from "@/components/skeletons/ModelResponseSkeleton";

export default function TestPromptPage() {
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
    <div className="p-0 sm:p-6 space-y-6">
      {/* Prompt Viewer */}
      <PromptVersionViewer
        versionId={versionId as string}
        showTokenEstimate={true}
        onTokenEstimated={(value) => setTokenEstimated(value)}
      />

      {/* Model Selectors */}
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Object.entries(AI_MODELS).map(([provider, data]) => {
          const selected = selectedModels.find((m) => m.provider === provider);

          return (
            <div
              key={provider}
              className={`p-4 border rounded-md bg-muted/30 space-y-3`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Image
                    src={data.logo}
                    alt={`${provider} logo`}
                    width={24}
                    height={24}
                    className="rounded"
                  />
                  <div>
                    <span className="text-sm font-semibold flex items-center gap-2">
                      {provider.toUpperCase()}
                      <span
                        className="inline-block w-2 h-2 rounded-full"
                        style={{ backgroundColor: data.color }}
                        title={data.description}
                      ></span>
                    </span>
                    <p className="text-xs text-muted-foreground">
                      {data.description}
                    </p>
                  </div>
                </div>

                {selected && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-red-500"
                    onClick={() => handleDeselectModel(provider)}
                  >
                    Deselect
                  </Button>
                )}
              </div>

              <div className="space-y-3">
                <Select
                  value={selected?.model || ""}
                  onValueChange={(value) =>
                    handleModelSelect(
                      provider,
                      value,
                      selected?.temperature ?? 0.7
                    )
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a model" />
                  </SelectTrigger>
                  <SelectContent>
                    {data.models.map((model) => (
                      <SelectItem key={model.id} value={model.id}>
                        {model.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {selected && (
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1">
                      Temperature: {selected.temperature.toFixed(1)}
                    </label>
                    <Slider
                      min={0}
                      max={1}
                      step={0.1}
                      value={[selected.temperature]}
                      onValueChange={([value]) =>
                        handleTemperatureChange(provider, value)
                      }
                      className="w-full"
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </section>

      {/* Test + View All Button */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button onClick={handleTestPrompt} disabled={isTesting}>
            {isTesting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Run Test"
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {isTesting ? "Testing in progress..." : "Run your selected models"}
        </TooltipContent>
      </Tooltip>

      {/* AI Responses (as plain text) */}
      <section className="space-y-4">
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
                !!res.error || res.response?.toLowerCase().includes("error");

              return (
                <div key={`${res.model}-${res.provider}`} className="relative">
                  {hasError ? (
                    <div className="border border-red-500 p-4 rounded-md bg-muted text-sm text-red-600">
                      <strong>
                        {res.provider.toUpperCase()} - {res.model}
                      </strong>
                      <br />
                      {res.error || res.response || "Unknown error!"}
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
      </section>
    </div>
  );
}
