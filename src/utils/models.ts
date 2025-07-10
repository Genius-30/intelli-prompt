import axios from "axios";

export interface IMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface IModelCallProps {
  model?: string;
  messages: IMessage[];
  temperature?: number;
  max_tokens?: number;
}

export async function callOpenAI({
  model = 'gpt-3.5-turbo',
  messages,
  temperature = 0.7,
  max_tokens = 80
}: IModelCallProps): Promise<object> {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      { model, messages, temperature, max_tokens },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        }
      }
    )

    return { tokensUsed: response.data.usage?.total_tokens || 200, 
              response: response.data.choices?.[0]?.message?.content || 'no response'}
  } catch (err) {
    return { tokensUsed: 0, response: 'Error calling OpenAI' }
  }
}

export async function callAnthropic({
  model = 'claude-3-opus-20240229',
  messages,
  temperature = 0.7,
  max_tokens = 80,
}: IModelCallProps): Promise<object> {
  try {
    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      { model, messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content
      })), temperature, max_tokens },
      {
        headers: {
          'x-api-key': process.env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json',
        },
      }
    );

    return { tokensUsed: (response.data.usage?.input_tokens + response.data.usage?.output_tokens) || 200,
              response: response.data.content?.[0]?.text || 'no response'}
  } catch (error) {
    return { tokensUsed: 0, response: 'Error calling Anthropic' }
  }
}

export async function callGemini({
  model = 'gemini-2.0-flash',
  messages,
  temperature = 0.7
}: IModelCallProps): Promise<object> {
  try {
    const formattedMessages = messages.map(msg => ({
      role: msg.role === 'assistant'? 'model': 'user',
      parts: [{ text: msg.content }]
    }))

    const response = await axios.post(
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

    return { tokensUsed: response.data.usageMetadata?.totalTokenCount || 200,
              response: response.data.candidates?.[0]?.content?.parts?.[0]?.text || 'no response'}
  } catch (err) {
    return { tokensUsed: 0, response: 'Error calling Gemini' }
  }
}

export async function callMistral({
  model = 'mistral-small-latest',
  messages,
  temperature = 0.7,
  max_tokens = 80
}: IModelCallProps): Promise<object>{
  try {
    const response = await axios.post(
      'https://api.mistral.ai/v1/chat/completions',
      { model, messages, temperature, max_tokens },
      {
        headers: {
          'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`,
          'Content-Type': 'application/json',
        }
      }
    )

    return { tokensUsed: 200,
              response: response.data.choices?.[0]?.message?.content || 'no response'}
  } catch (err) {
    return { tokensUsed: 0, response: 'Error calling Mistral' }
  }
}