import { callGemini } from './models'

export async function enhancedPrompt( rawPrompt: string ) {
  try {
    const systemPrompt = `You are an expert prompt engineer. Your job is to rewrite any vague or general prompt into a short, sharp, and keyword-rich prompt with a clear theme. Your output should be only the enhanced prompt in 3-4 lines, no explanation.`;
    const userPrompt = `Original Prompt: ${rawPrompt}`;

    const enhanced = await callGemini({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      model: 'gemini-2.0-flash',
      temperature: 0.7
    })

    return enhanced
  } catch (err) {
    console.log('Error while enhancing: ',err)
    return null
  }
}