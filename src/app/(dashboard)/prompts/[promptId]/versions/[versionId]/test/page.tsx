"use client";

import { useParams } from "next/navigation";
import React from "react";

function PromptTestPage() {
  const { versionId } = useParams();

  return <div>Test prompt for: {versionId}</div>;
}

export default PromptTestPage;
