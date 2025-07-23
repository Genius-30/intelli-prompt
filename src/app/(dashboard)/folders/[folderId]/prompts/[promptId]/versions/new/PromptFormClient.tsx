"use client";

import { redirect, useParams } from "next/navigation";

import { PromptForm } from "@/components/prompt/prompt-form";
import { useEffect } from "react";
import { useGetAllVersions } from "@/lib/queries/version";

export default function PromptFormClient() {
  const { promptId } = useParams();
  const { data: versions = [] } = useGetAllVersions(promptId as string);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Create New Prompt</h1>
      <PromptForm />
    </div>
  );
}
