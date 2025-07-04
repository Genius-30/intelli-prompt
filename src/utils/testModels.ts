import { callOpenAI, callAnthropic, callGemini, callMistral } from './models'
import { IMessage } from './models'

export interface ITestModelOption {
  provider: 'openai' | 'claude' | 'anthropic' | 'google' | 'mistral' ,
  model: string,
  temperature: number,
  prompt: string;
} 

export async function testPromptOnModels({ provider, model, temperature=0.7, prompt }: ITestModelOption) {
  const messages: IMessage[] = [{ role: 'user', content: prompt }] 

  try {
    switch (provider) {
      case 'openai':
        return await callOpenAI({ model, temperature, messages })
      case 'anthropic': 
        return await callAnthropic({ model, temperature, messages })
      case 'google':
        return await callGemini({ model, temperature, messages })
      case 'mistral':
        return await callMistral({ model, temperature, messages })
      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }
  } catch (err) {
    return { 'err': `Failed to test on ${provider} - ${model}. ${err}`, }
  }
  
}