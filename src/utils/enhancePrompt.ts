import { IModelCallProps } from '@/utils/models';
import { IModelResponse } from '@/utils/models';
import axios from 'axios';

async function callGemini({
  model = 'gemini-2.0-flash',
  messages,
  temperature = 1.5
}: IModelCallProps): Promise<IModelResponse> {
  try {
    const formattedMessages = messages.map(msg => ({
      role: msg.role === 'assistant'? 'model': 'user',
      parts: [{ text: msg.content }]
    }))
  
    const res = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,
      { 
        contents: formattedMessages, 
        generationConfig: { temperature } 
      },
      { 
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
  
    return { 
      temperature: temperature || 0,
      tokensUsed: res.data.usageMetadata?.totalTokenCount || 0,
      response: res.data.candidates?.[0]?.content?.parts?.[0]?.text || ''
    }
  } catch (err) {
    console.error('Error in callGemini:', err);
    return {
      temperature,
      tokensUsed: 0,
      response: '',
      error: err,
    };
  }
}

export async function enhancedPrompt(content: string): Promise<IModelResponse> {
  const systemPrompt = `You are an expert prompt engineer. 
                        Your job is to rewrite vague or general prompts into clear, powerful, and usable prompts. 

                        Format instructions:
                        - Do NOT include any headings like "Enhanced Prompt:"
                        - Do NOT use line breaks or bullet points
                        - Return ONLY the enhanced prompt as a single paragraph, without quotes or extra explanation.
                        `;
  const userPrompt = `Original Prompt: ${content.trim()}`;

  try {
    const response = await callGemini({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      model: "gemini-2.0-flash",
      temperature: 1.5,
    }) as IModelResponse;

    return { 
      temperature: response.temperature,
      tokensUsed: response.tokensUsed,
      response: response.response,
      error:response.error
    };
  } catch (err) {
    console.log("Error in enhancePrompt: ", err);
    return { 
      tokensUsed: 0,
      temperature: 0,
      response: "",
      error: err
    };
  }
}