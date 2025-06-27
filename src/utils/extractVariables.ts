export function extractPromptVariables(prompt: string): string[] {
  const matches = prompt.match(/\{\{(.*?)\}\}/g);
  return matches ? matches.map((m) => m.replace(/[{}]/g, "")) : [];
}
