"use client";

import { useParams } from "next/navigation";
import React from "react";

function PromptTestPage() {
  const { id } = useParams();

  return <div>Test prompt for: {id}</div>;
}

export default PromptTestPage;
