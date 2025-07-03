import { callGemini } from './models'

export async function enhancedPrompt( content: string ) {
  try {
    const systemPrompt = `You are an expert prompt engineer. 
                          Your job is to rewrite vague or general prompts into clear, powerful, and usable prompts. 

                          Format instructions:
                          - Do NOT include any headings like "Enhanced Prompt:"
                          - Do NOT use line breaks or bullet points
                          - Return ONLY the enhanced prompt as a single paragraph, without quotes or extra explanation.
                          `;
    const userPrompt = `Original Prompt: ${content}`;

    const enhanced = await callGemini({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      model: 'gemini-2.0-flash',
      temperature: 0.7
    })

    return enhanced?.trim()
  } catch (err) {
    console.log('Error in utility fn while enhancing: ',err)
    return null
  }
}