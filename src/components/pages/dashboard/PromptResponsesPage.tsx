"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Filter, X } from "lucide-react";
import { useMemo, useState } from "react";

import { AI_MODELS } from "@/lib/constants/AI_MODELS";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ModelResponseCard } from "@/components/response/ModelResponseCard";
import { PromptVersionTestCard } from "@/components/response/PromptVersionTestCard";
import type React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { getProviderByModelId } from "@/utils/ai-model-utils";
import { useGetAllResponsesForVersion } from "@/lib/queries/response";
import { useParams } from "next/navigation";

interface Response {
  _id: string;
  model: string;
  temperature: number;
  response: string;
  createdAt: string;
}

export default function PromptResponsesPage() {
  const { versionId } = useParams();
  const { data: responses = [], isLoading: isLoadingResponses } = useGetAllResponsesForVersion(
    versionId as string,
  );

  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Get unique providers from responses
  const availableProviders = useMemo(() => {
    const providers = new Set<string>();
    responses.forEach((response: Response) => {
      const provider = getProviderByModelId(response.model);
      if (provider) {
        providers.add(provider);
      }
    });
    return Array.from(providers);
  }, [responses]);

  // Filter responses based on selected providers
  const filteredResponses = useMemo(() => {
    if (selectedProviders.length === 0) return responses;
    return responses.filter((response: Response) => {
      const provider = getProviderByModelId(response.model);
      return provider && selectedProviders.includes(provider);
    });
  }, [responses, selectedProviders]);

  // Group responses by date
  const groupedResponses = useMemo(() => {
    const groups: { [key: string]: Response[] } = {};

    filteredResponses.forEach((response: Response) => {
      const date = new Date(response.createdAt);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      let dateKey: string;
      if (date.toDateString() === today.toDateString()) {
        dateKey = "Today";
      } else if (date.toDateString() === yesterday.toDateString()) {
        dateKey = "Yesterday";
      } else {
        dateKey = date.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      }

      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(response);
    });

    // Sort responses within each group by time (newest first)
    Object.keys(groups).forEach((key) => {
      groups[key].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    });

    return groups;
  }, [filteredResponses]);

  const toggleProvider = (provider: string) => {
    setSelectedProviders((prev) =>
      prev.includes(provider) ? prev.filter((p) => p !== provider) : [...prev, provider],
    );
  };

  const clearFilters = () => {
    setSelectedProviders([]);
  };

  let content: React.ReactNode;

  if (isLoadingResponses) {
    content = (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, idx) => (
          <Card key={idx}>
            <CardHeader>
              <Skeleton className="mb-2 h-6 w-1/2" />
              <Skeleton className="h-4 w-1/3" />
            </CardHeader>
            <CardContent>
              <Skeleton className="mb-2 h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  } else if (filteredResponses.length === 0) {
    content = (
      <div className="text-muted-foreground text-sm italic">
        {responses.length === 0
          ? "No responses generated yet."
          : "No responses match the selected filters."}
      </div>
    );
  } else {
    content = (
      <div className="space-y-6">
        {Object.entries(groupedResponses).map(([dateKey, dateResponses]) => (
          <div key={dateKey} className="space-y-4">
            {/* Date separator */}
            <div className="flex items-center">
              <div className="bg-muted rounded-lg px-3 py-1">
                <span className="text-muted-foreground text-xs font-medium">{dateKey}</span>
              </div>
            </div>

            {/* Responses for this date */}
            <div className="space-y-4">
              {dateResponses.map((res) => {
                const provider = getProviderByModelId(res.model);
                if (!provider) return null;

                return (
                  <div key={`${res._id}-${res.model}`} className="space-y-2">
                    <div className="text-muted-foreground flex items-center gap-2 text-xs">
                      <span>
                        {new Date(res.createdAt).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <ModelResponseCard
                      responseId={res._id}
                      provider={provider as keyof typeof AI_MODELS}
                      model={res.model}
                      temperature={res.temperature}
                      response={res.response}
                      initiallySaved
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <PromptVersionTestCard versionId={versionId as string} showTokenEstimate={false} />

      <div className="mt-6 mb-3 flex items-center justify-between sm:mt-8">
        <h2 className="text-shadow-foreground text-lg font-semibold">All Responses</h2>

        {availableProviders.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2"
          >
            <Filter className="h-4 w-4" />
            Filter
            {selectedProviders.length > 0 && (
              <Badge variant="secondary" className="ml-1">
                {selectedProviders.length}
              </Badge>
            )}
          </Button>
        )}
      </div>

      {/* Filter UI */}
      {showFilters && availableProviders.length > 0 && (
        <div className="mb-4 border-b pb-3">
          <div className="flex flex-wrap gap-2">
            {availableProviders.map((provider) => {
              const providerConfig = AI_MODELS[provider as keyof typeof AI_MODELS];
              if (!providerConfig) return null;

              const Icon = providerConfig.icon;
              const isSelected = selectedProviders.includes(provider);

              return (
                <Button
                  key={provider}
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleProvider(provider)}
                  className="h-8 w-8 p-2"
                  title={providerConfig.name}
                >
                  <Icon className="h-4 w-4" />
                </Button>
              );
            })}
            {selectedProviders.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="ml-auto h-auto p-1 text-xs"
              >
                <X className="mr-1 h-3 w-3" />
                Clear
              </Button>
            )}
          </div>
        </div>
      )}

      {content}
    </div>
  );
}
