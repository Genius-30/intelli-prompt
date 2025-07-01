import { callGemini } from './models'

export async function enhancedPrompt( rawPrompt: string ) {
  const systemPrompt = `You are an expert prompt engineer. Enhance the following prompt to be clearer, more effective, and concise.`;
  const userPrompt = `Raw prompt: ${rawPrompt}`;

  const enhanced = await callGemini({
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    model: 'gemini-2.0-flash',
    temperature: 0.7
  })

  return enhanced
}