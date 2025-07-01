import axios from "axios";

export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ModelCallProps {
  model?: string;
  messages: Message[];
  temperature?: number;
  max_tokens?: number;
}

export async function callOpenAI({
  model = 'gpt-3.5-turbo',
  messages,
  temperature = 0.7,
  max_tokens = 1000
}: ModelCallProps): Promise<string> {
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
    return response.data.choices?.[0]?.message?.content || 'no response'
  } catch (err) {
    return 'Error calling OpenAI'
  }
}

export async function callAnthropic({
  model = 'claude-3-opus-20240229',
  messages,
  temperature = 0.7,
  max_tokens = 1000,
}: ModelCallProps): Promise<string> {
  try {
    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      { model, messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content
      })), temperature, max_tokens },
      {
        headers: {
          'x-api-key': process.env.ANTHROPIC_API_KEY!,
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.content?.[0]?.text || 'No response';
  } catch (error) {
    return 'Error calling Anthropic';
  }
}

export async function callGemini({
  model = 'gemini-2.0-flash',
  messages,
  temperature = 0.7
}: ModelCallProps): Promise<string> {
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
    
    return response.data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response'
  } catch (err) {
    return 'Error calling Gemini'
  }
}

export async function callMistral({
  model = 'mistral-small-latest',
  messages,
  temperature = 0.7,
  max_tokens = 1000
}: ModelCallProps): Promise<string>{
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

    return response.data.choices?.[0]?.message?.content || 'No response'
  } catch (err) {
    return 'Error calling Mistral'
  }
}

export async function callGrok({
  model = 'mistral-small-latest',
  messages
}: ModelCallProps) {
  try {
    
  } catch (err) {
    
  }
}