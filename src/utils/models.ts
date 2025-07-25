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

export interface IModelResponse {
  temperature: number;
  tokensUsed: number;
  response: string;
  error?: any;
}

// Detects errors related to quota/rate limits
const isQuotaOrRateLimitError = (err: any) => {
  const msg = err?.response?.data?.error?.message?.toLowerCase() || "";
  const status = err?.response?.status || 0;

  return (
    status === 402 ||
    status === 429 ||
    msg.includes("insufficient credits") ||
    msg.includes("rate limit")
  );
};

const callWithKey = async (
  key: string,
  model: string,
  messages: IMessage[],
  temperature: number,
  max_tokens: number
) => {
  return await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    { model, messages, temperature, max_tokens },
    {
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
    }
  );
};

export async function callOpenRouter({
  model = "google/gemini-2.0-flash-exp:free",
  messages,
  temperature = 1.5,
  max_tokens = 300,
}: IModelCallProps): Promise<IModelResponse> {
  const keys = [
    process.env.OPENROUTER_API_KEY!,
    process.env.OPENROUTER_API_KEY_2!,
    process.env.OPENROUTER_API_KEY_3!,
  ].filter(Boolean);

  for (const key of keys) {
    try {
      const res = await callWithKey(
        key,
        model,
        messages,
        temperature,
        max_tokens
      );
      const content = res.data.choices?.[0]?.message.content?.trim() || "";
      if (!content) {
        return {
          temperature,
          tokensUsed: 0,
          response: "",
          error: `No response from ${model}`,
        };
      }

      return {
        temperature: temperature || 0,
        tokensUsed: res.data.usage?.total_tokens || 0,
        response: content,
      };
    } catch (err) {
      if (isQuotaOrRateLimitError(err)) {
        console.log(`Key ${key} hit quota/rate limit, trying next key...`);
        continue; // Try next key
      }

      console.error("Error calling OpenRouter:", err);
      return {
        temperature,
        tokensUsed: 0,
        response: "",
        error: err,
      };
    }
  }

  return {
    temperature: 0,
    tokensUsed: 0,
    response: "",
    error: "All api keys are either exhausted or rate limited",
  };
}
