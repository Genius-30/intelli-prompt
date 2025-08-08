"use client";

import ModelTestRunner from "@/components/common/ModelTestRunner";
import { PromptVersionTestCard } from "@/components/response/PromptVersionTestCard";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function TestPromptPage() {
  const { versionId } = useParams();
  const [tokenEstimated, setTokenEstimated] = useState(0);

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

      {/* Model Selection Section */}
      <ModelTestRunner versionId={versionId as string} tokenEstimated={tokenEstimated} />
    </div>
  );
}
