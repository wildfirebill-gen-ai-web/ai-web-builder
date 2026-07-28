import {
  type Provider,
  type ProviderConfig,
  type ChatMessage,
  type ChatOptions,
  type ChatResponse,
  type ProviderType,
} from './types'

const LLAMACPP_DEFAULT_URL = 'http://localhost:8080'

export class LlamaCppProvider implements Provider {
  readonly type: ProviderType = 'ollama'
  readonly config: ProviderConfig

  constructor(config: Partial<ProviderConfig> = {}) {
    this.config = {
      id: 'llamacpp',
      name: 'llama.cpp (Local)',
      type: 'ollama',
      enabled: true,
      apiUrl: LLAMACPP_DEFAULT_URL,
      models: ['default'],
      defaultModel: 'default',
      capabilities: ['chat', 'code'],
      local: true,
      order: 1,
      maxTokens: 4096,
      temperature: 0.7,
      ...config,
    }
  }

  private get baseUrl(): string {
    return this.config.apiUrl || LLAMACPP_DEFAULT_URL
  }

  async chat(messages: ChatMessage[], options?: ChatOptions): Promise<ChatResponse> {
    const res = await fetch(`${this.baseUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages,
        temperature: options?.temperature ?? this.config.temperature,
        max_tokens: options?.maxTokens ?? this.config.maxTokens,
        stream: false,
      }),
      signal: options?.signal,
    })

    if (!res.ok) throw new Error(`llama.cpp error: ${res.status} ${res.statusText}`)
    const data = await res.json()
    return {
      content: data.choices?.[0]?.message?.content || '',
      model: data.model || 'default',
    }
  }

  async *streamChat(messages: ChatMessage[], options?: ChatOptions): AsyncGenerator<string> {
    const res = await fetch(`${this.baseUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages,
        temperature: options?.temperature ?? this.config.temperature,
        max_tokens: options?.maxTokens ?? this.config.maxTokens,
        stream: true,
      }),
      signal: options?.signal,
    })

    if (!res.ok) throw new Error(`llama.cpp error: ${res.status} ${res.statusText}`)
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
    try {
      const res = await fetch(`${this.baseUrl}/v1/models`, { signal: AbortSignal.timeout(5000) })
      return res.ok
    } catch {
      return false
    }
  }

  async listModels(): Promise<string[]> {
    try {
      const res = await fetch(`${this.baseUrl}/v1/models`)
      if (!res.ok) return ['default']
      const data = await res.json()
      return data.data?.map((m: any) => m.id) || ['default']
    } catch {
      return ['default']
    }
  }
}
