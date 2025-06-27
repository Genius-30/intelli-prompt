"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "../ui/slider";
import { ModelSelector } from "../ModelSelector";

type PromptTesterProps = Readonly<{
  prompt: string;
  temperature: number;
  model: string;
  variables: string[];
}>;

export function PromptTester() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [temperature, setTemperature] = useState(0.7);
  const [model, setModel] = useState("gpt-4");
  const [renderedOutput, setRenderedOutput] = useState<string | null>(null);

  const handleChange = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleTest = () => {
    let rendered = prompt;
    for (const key of variables) {
      const placeholder = `{{${key}}}`;
      rendered = rendered.replaceAll(placeholder, values[key] || "");
    }
    setRenderedOutput(`🤖 (${model}): ${rendered}`);
  };

  return (
    <div className="flex-1 space-y-6 p-4 border rounded-md">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">🧪 Test Prompt</h3>
        <Button variant="outline" size="sm">
          View History
        </Button>
      </div>

      {/* Model + Temperature */}
      <div className="flex flex-col items-start gap-4">
        <div className="w-full">
          <ModelSelector model={model} onChange={setModel} />
        </div>

        <div className="w-full mt-2">
          <Label>
            Temperature{" "}
            <span className="text-muted-foreground">( {temperature} )</span>
          </Label>
          <Slider
            min={0}
            max={1}
            step={0.1}
            value={[temperature]}
            onValueChange={([val]) => setTemperature(val)}
            className="mt-3"
          />
        </div>
      </div>

      {/* {variables.length === 0 ? (
        <p className="text-muted-foreground">No variables found in prompt.</p>
      ) : (
        variables.map((key) => (
          <div key={key}>
            <Label>{key}</Label>
            <Input
              placeholder={`Enter value for ${key}`}
              value={values[key] || ""}
              onChange={(e) => handleChange(key, e.target.value)}
              className="mt-2"
            />
          </div>
        ))
      )} */}

      <Button type="button" onClick={handleTest} className="mt-2">
        Run Test
      </Button>

      {/* Rendered Prompt Output */}
      {renderedOutput && (
        <div className="bg-background p-4 rounded-md border text-sm whitespace-pre-wrap mt-4">
          {renderedOutput}
        </div>
      )}
    </div>
  );
}
