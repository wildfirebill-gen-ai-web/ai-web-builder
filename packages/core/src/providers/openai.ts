import {
  type Provider,
  type ProviderConfig,
  type ChatMessage,
  type ChatOptions,
  type ChatResponse,
  type ProviderType,
} from './types'

export class OpenAIProvider implements Provider {
  readonly type: ProviderType = 'openai'
  readonly config: ProviderConfig

  constructor(config: Partial<ProviderConfig> = {}) {
    this.config = {
      id: 'openai',
      name: 'OpenAI',
      type: 'openai',
      enabled: false,
      apiUrl: 'https://api.openai.com/v1',
      models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'o3-mini'],
      defaultModel: 'gpt-4o',
      capabilities: ['chat', 'code', 'image', 'vision'],
      local: false,
      order: 10,
      maxTokens: 16384,
      temperature: 0.7,
      ...config,
    }
  }

  async chat(messages: ChatMessage[], options?: ChatOptions): Promise<ChatResponse> {
    if (!this.config.apiKey) throw new Error('OpenAI API key not configured')
    const res = await fetch(`${this.config.apiUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        model: options?.model || this.config.defaultModel,
        messages,
        temperature: options?.temperature ?? this.config.temperature,
        max_tokens: options?.maxTokens ?? this.config.maxTokens,
      }),
      signal: options?.signal,
    })
    if (!res.ok) throw new Error(`OpenAI error: ${res.status} ${res.statusText}`)
    const data = await res.json()
    return {
      content: data.choices?.[0]?.message?.content || '',
      model: data.model,
      usage: data.usage ? {
        promptTokens: data.usage.prompt_tokens,
        completionTokens: data.usage.completion_tokens,
        totalTokens: data.usage.total_tokens,
      } : undefined,
    }
  }

  async *streamChat(messages: ChatMessage[], options?: ChatOptions): AsyncGenerator<string> {
    if (!this.config.apiKey) throw new Error('OpenAI API key not configured')
    const res = await fetch(`${this.config.apiUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        model: options?.model || this.config.defaultModel,
        messages,
        stream: true,
        temperature: options?.temperature ?? this.config.temperature,
        max_tokens: options?.maxTokens ?? this.config.maxTokens,
      }),
      signal: options?.signal,
    })
    if (!res.ok) throw new Error(`OpenAI error: ${res.status} ${res.statusText}`)
    const reader = res.body?.getReader()
    if (!reader) return
    const decoder = new TextDecoder()
    let buffer = ''
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''
      for (const line of lines) {
        const cleaned = line.replace(/^data: /, '').trim()
        if (!cleaned || cleaned === '[DONE]') continue
        try {
          const parsed = JSON.parse(cleaned)
          yield parsed.choices?.[0]?.delta?.content || ''
        } catch { }
      }
    }
  }

  async testConnection(): Promise<boolean> {
    if (!this.config.apiKey) return false
    try {
      const res = await fetch(`${this.config.apiUrl}/models`, {
        headers: { Authorization: `Bearer ${this.config.apiKey}` },
        signal: AbortSignal.timeout(5000),
      })
      return res.ok
    } catch {
      return false
    }
  }

  async listModels(): Promise<string[]> {
    if (!this.config.apiKey) return this.config.models
    try {
      const res = await fetch(`${this.config.apiUrl}/models`, {
        headers: { Authorization: `Bearer ${this.config.apiKey}` },
      })
      if (!res.ok) return this.config.models
      const data = await res.json()
      return data.data?.map((m: any) => m.id).filter((id: string) => id.startsWith('gpt-') || id.startsWith('o')) || this.config.models
    } catch {
      return this.config.models
    }
  }
}
