"use client";

import {
  AnimatedSpan,
  Terminal,
  TypingAnimation,
} from "@/components/magicui/terminal";

export function PreviewTerminal() {
  return (
    <Terminal className="w-full max-w-3xl rounded-xl border shadow-lg dark:shadow-zinc-800">
      <TypingAnimation>
        &gt; Run agent: summarize-pdf with file: funding_report.pdf
      </TypingAnimation>

      <AnimatedSpan delay={1500} className="text-green-500">
        <span>✔ Agent initialized: summarize-pdf</span>
      </AnimatedSpan>

      <AnimatedSpan delay={2200} className="text-green-500">
        <span>✔ File uploaded (23 pages)</span>
      </AnimatedSpan>

      <AnimatedSpan delay={3000} className="text-blue-400">
        <span>ℹ Parsing document...</span>
      </AnimatedSpan>

      <AnimatedSpan delay={3800} className="text-green-500">
        <span>✔ Extracted 5 key insights</span>
      </AnimatedSpan>

      <AnimatedSpan delay={4500} className="text-green-500">
        <span>✔ Generated summary report</span>
      </AnimatedSpan>

      <TypingAnimation delay={5200} className="text-muted-foreground">
        ✅ Task complete: summary saved to /workspace/summary.pdf
      </TypingAnimation>
    </Terminal>
  );
}
