"use client";

import { useParams, redirect } from "next/navigation";
import { useEffect } from "react";
import { PromptForm } from "@/components/prompt/prompt-form";
import { useGetAllVersions } from "@/lib/queries/version";

export default function PromptFormClient() {
  const { promptId } = useParams();
  const { data: versions = [] } = useGetAllVersions(promptId as string);

  useEffect(() => {
    if (versions.length === 0) {
      redirect(`/prompts/${promptId}/versions`);
    }
  }, [versions, promptId]);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create New Prompt</h1>
      <PromptForm />
    </div>
  );
}
