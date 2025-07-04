"use client";

import { redirect, useParams } from "next/navigation";

export default function PromptPage() {
  const { promptId } = useParams();

  return redirect(`/prompts/${promptId}/versions`);
}
