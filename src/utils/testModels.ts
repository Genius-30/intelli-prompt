import { callOpenAI, callAnthropic, callGemini, callMistral, callGrok } from './models'

interface TestModelOption {
  provider: 'openai' | 'claude' | 'anthropic' | 'google' | 'mistral' | 'grok',
  model: string,
  prompt: string;
} 

export async function testPromptOnModels({ provider, model, prompt }: TestModelOption) {
  switch (provider) {
    case 'openai':
      return callOpenAI({ model, messages: [{ role: 'user', content: prompt }] })
    case 'anthropic': 
      return callAnthropic({ model, messages: [{ role: 'user', content: prompt }] })
    case 'grok':
      return callGrok({ model, messages: [{ role: 'user', content: prompt }] })
    case 'google':
      return callGemini({ model, messages: [{ role: 'user', content: prompt }] })
    case 'mistral':
      return callMistral({ model, messages: [{ role: 'user', content: prompt }] })
    default:
      return 'Model not supported yet'
  }
}