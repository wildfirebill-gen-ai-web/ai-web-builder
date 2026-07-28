import {
  type Provider,
  type ProviderConfig,
  type ChatMessage,
  type ChatOptions,
  type ChatResponse,
  type ProviderType,
} from './types'

export class OpenRouterProvider implements Provider {
  readonly type: ProviderType = 'openrouter'
  readonly config: ProviderConfig

  constructor(config: Partial<ProviderConfig> = {}) {
    this.config = {
      id: 'openrouter',
      name: 'OpenRouter',
      type: 'openrouter',
      enabled: false,
      apiUrl: 'https://openrouter.ai/api/v1',
      models: [
        'anthropic/claude-sonnet-4-20250514',
        'openai/gpt-4o',
        'google/gemini-2.5-flash',
        'deepseek/deepseek-chat',
        'meta-llama/llama-3-70b-instruct',
        'mistralai/mistral-large',
      ],
      defaultModel: 'openai/gpt-4o',
      capabilities: ['chat', 'code', 'vision'],
      local: false,
      order: 20,
      maxTokens: 8192,
      temperature: 0.7,
      ...config,
    }
  }

  async chat(messages: ChatMessage[], options?: ChatOptions): Promise<ChatResponse> {
    if (!this.config.apiKey) throw new Error('OpenRouter API key not configured')
    const res = await fetch(`${this.config.apiUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.config.apiKey}`,
        'HTTP-Referer': 'https://ai-web-builder.local',
      },
      body: JSON.stringify({
        model: options?.model || this.config.defaultModel,
        messages,
        temperature: options?.temperature ?? this.config.temperature,
        max_tokens: options?.maxTokens ?? this.config.maxTokens,
      }),
      signal: options?.signal,
    })
    if (!res.ok) throw new Error(`OpenRouter error: ${res.status} ${res.statusText}`)
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
    if (!this.config.apiKey) throw new Error('OpenRouter API key not configured')
    const res = await fetch(`${this.config.apiUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.config.apiKey}`,
        'HTTP-Referer': 'https://ai-web-builder.local',
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
    if (!res.ok) throw new Error(`OpenRouter error: ${res.status} ${res.statusText}`)
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
      return data.data?.map((m: any) => m.id) || this.config.models
    } catch {
      return this.config.models
    }
  }
}
