import { PromptForm } from "@/components/prompt/prompt-form";

export default function NewPromptPage() {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create New Prompt</h1>
      <PromptForm />
    </div>
  );
}
