import { callOpenRouter } from '@/utils/models'

export interface IResponse {
  tokensUsed: number;
  temperature?: number;
  response: string;
  error?: any;
}

export async function enhancedPrompt(content: string): Promise<IResponse> {
  try {
    const systemPrompt = `You are an expert prompt engineer. 
                          Your job is to rewrite vague or general prompts into clear, powerful, and usable prompts. 

                          Format instructions:
                          - Do NOT include any headings like "Enhanced Prompt:"
                          - Do NOT use line breaks or bullet points
                          - Return ONLY the enhanced prompt as a single paragraph, without quotes or extra explanation.
                          `;
    const userPrompt = `Original Prompt: ${content.trim()}`;

    const response = (await callOpenRouter({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      model: "google/gemini-2.0-flash-exp:free",
      temperature: 1.5,
    })) as IResponse;

    return { 
        tokensUsed: response.tokensUsed || 0,
        temperature: response.temperature,
        response: response.response || '',
        error:response.error
      };
  } catch (err) {
    console.log("Error in utility fn while enhancing: ", err);
    return { 
        tokensUsed: 0,
        temperature: 0,
        response: "",
        error: err
      };
  }
}