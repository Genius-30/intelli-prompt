export function estimateTokens(text: string): number {
  // Roughly estimates that 1 token ≈ 4 characters in English
  // Source: OpenAI documentation
  const avgCharsPerToken = 4;
  const estimated = Math.ceil(text.trim().length / avgCharsPerToken);
  return estimated;
}
