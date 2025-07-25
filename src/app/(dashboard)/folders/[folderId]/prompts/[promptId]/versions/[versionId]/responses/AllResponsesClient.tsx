"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { AI_MODELS } from "@/lib/constants";
import { ModelResponseCard } from "@/components/response/ModelResponseCard";
import { PromptVersionTestCard } from "@/components/response/PromptVersionTestCard";
import { Skeleton } from "@/components/ui/skeleton";
import { getProviderByModelId } from "@/utils/ai-model-utils";
import { useGetAllResponsesForVersion } from "@/lib/queries/response";
import { useParams } from "next/navigation";

export default function AllResponsesClient() {
  const { versionId } = useParams();
  const { data: responses = [], isLoading: isLoadingResponses } =
    useGetAllResponsesForVersion(versionId as string);

  let content: React.ReactNode;

  if (isLoadingResponses) {
    content = (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, idx) => (
          <Card key={idx}>
            <CardHeader>
              <Skeleton className="h-6 w-1/2 mb-2" />
              <Skeleton className="h-4 w-1/3" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  } else if (responses.length === 0) {
    content = (
      <div className="text-muted-foreground text-sm italic">
        No responses generated yet.
      </div>
    );
  } else {
    content = (
      <div className="flex flex-col gap-4">
        {responses.map((res) => {
          const provider = getProviderByModelId(res.model);
          if (!provider) return null;

          return (
            <ModelResponseCard
              key={`${res._id}-${res.model}`}
              provider={provider as keyof typeof AI_MODELS}
              model={res.model}
              temperature={res.temperature}
              response={res.response}
              modelId={res._id}
              isFavorite={res.isFavorite}
            />
          );
        })}
      </div>
    );
  }

  return (
    <div>
      <PromptVersionTestCard
        versionId={versionId as string}
        showTokenEstimate={false}
      />

      <h2 className="mt-6 sm:mt-8 mb-3 font-semibold text-shadow-foreground text-lg">
        All Responses
      </h2>

      {content}
    </div>
  );
}
