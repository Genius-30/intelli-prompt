import axios from "axios";

export interface IMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface IModelCallProps {
  model?: string;
  messages: IMessage[];
  temperature?: number;
  max_tokens?: number;
}

export async function callOpenRouter({
  model = "meta-llama/llama-3-8b-instruct",
  messages,
  temperature = 0.7,
  max_tokens = 300,
}: IModelCallProps): Promise<object> {
  try {
    const res = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      { model, messages, temperature, max_tokens },
      { 
        headers: { 
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        } 
      }
    )

    return {
      tokensUsed: res.data.usage?.total_tokens || 0,
      response: res.data.choices?.[0]?.message.content || 'No response',
    }
  } catch (err) {
      console.log('err calling openRouter',err)
      return { tokensUsed: 0, response: "Error calling OpenRouter" };
  }
}