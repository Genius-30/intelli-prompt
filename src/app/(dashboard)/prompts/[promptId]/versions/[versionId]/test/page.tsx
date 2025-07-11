"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ChevronDown, ChevronUp, Star, Trash } from "lucide-react";
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
import { Loader } from "@/components/ui/loader";
import { PromptVersionViewer } from "@/components/version/prompt-version-viewer";
import ReactMarkdown from "react-markdown";

export default function TestPromptPage() {
  const router = useRouter();
  const { promptId, versionId } = useParams();
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
    }[]
  >([]);

  const [expandedCards, setExpandedCards] = useState<string[]>([]);

  const toggleCard = (id: string) => {
    setExpandedCards((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

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
          setResponses(data); // assumed: data[i].response is string
          const expandedIds = data.map(
            (res: any, idx: number) => `${res.provider}-${res.model}-${idx}`
          );
          setExpandedCards(expandedIds);
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
              className="p-4 border rounded-md bg-muted/30 space-y-3"
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
                  <span className="text-sm font-semibold">
                    {provider.toUpperCase()}
                  </span>
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
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={selected.temperature}
                      onChange={(e) =>
                        handleTemperatureChange(
                          provider,
                          parseFloat(e.target.value)
                        )
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
      <div className="flex items-center gap-4">
        <Button onClick={handleTestPrompt} disabled={isTesting}>
          {isTesting ? (
            <>
              <Loader /> Testing...
            </>
          ) : (
            "Run Test"
          )}
        </Button>
      </div>

      {/* AI Responses (as plain text) */}
      <section className="space-y-4">
        {responses.map((res, idx) => {
          const id = `${res.provider}-${res.model}-${idx}`;
          const isOpen = expandedCards.includes(id);

          return (
            <Card key={id} className="overflow-hidden">
              <CardHeader className="flex justify-between items-center bg-muted px-4 py-2">
                <div>
                  <h4 className="font-semibold text-sm capitalize">
                    {res.provider} - {res.model}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Temperature: {res.temperature}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <Star className="w-4 h-4 text-yellow-400" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Trash className="w-4 h-4 text-red-500" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleCard(id)}
                  >
                    {isOpen ? <ChevronUp /> : <ChevronDown />}
                  </Button>
                </div>
              </CardHeader>

              {isOpen && (
                <CardContent className="prose max-w-none text-sm dark:prose-invert ">
                  <ReactMarkdown>{res.response}</ReactMarkdown>
                </CardContent>
              )}
            </Card>
          );
        })}
      </section>
    </div>
  );
}
