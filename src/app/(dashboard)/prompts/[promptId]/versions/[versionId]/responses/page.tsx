"use client";

import { useParams } from "next/navigation";
import { useGetAllResponsesForVersion } from "@/lib/queries/response";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";
import { PromptVersionViewer } from "@/components/version/prompt-version-viewer";
import { Skeleton } from "@/components/ui/skeleton";

export default function AllResponsesPage() {
  const { versionId } = useParams();
  const { data: responses = [], isLoading: isLoadingResponses } =
    useGetAllResponsesForVersion(versionId as string);

  return (
    <div className="p-0 sm:p-6 space-y-6">
      {/* Prompt Viewer */}
      <PromptVersionViewer
        versionId={versionId as string}
        showTokenEstimate={false}
      />

      {isLoadingResponses ? (
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
      ) : (
        <div className="flex flex-col gap-4">
          {responses.map((res, idx) => (
            <Card key={idx}>
              <CardHeader>
                <h3 className="text-sm font-semibold">
                  {res.provider} - {res.model} (Temp: {res.temperature})
                </h3>
                <p className="text-xs">
                  {new Date(res.createdAt).toLocaleString()}
                </p>
              </CardHeader>
              <CardContent className="prose max-w-none text-sm dark:prose-invert ">
                <ReactMarkdown>{res.response}</ReactMarkdown>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
