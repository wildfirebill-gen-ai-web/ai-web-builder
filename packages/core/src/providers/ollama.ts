import {
  type Provider,
  type ProviderConfig,
  type ChatMessage,
  type ChatOptions,
  type ChatResponse,
  type ProviderType,
} from './types'

const OLLAMA_DEFAULT_URL = 'http://localhost:11434'

export class OllamaProvider implements Provider {
  readonly type: ProviderType = 'ollama'
  readonly config: ProviderConfig

  constructor(config: Partial<ProviderConfig> = {}) {
    this.config = {
      id: 'ollama',
      name: 'Ollama (Local)',
      type: 'ollama',
      enabled: true,
      apiUrl: OLLAMA_DEFAULT_URL,
      models: ['llama3', 'llama3.1', 'mistral', 'codellama', 'mixtral', 'deepseek-coder', 'qwen2.5-coder'],
      defaultModel: 'qwen2.5-coder',
      capabilities: ['chat', 'code', 'embedding'],
      local: true,
      order: 0,
      maxTokens: 8192,
      temperature: 0.7,
      ...config,
    }
  }

  private get baseUrl(): string {
    return this.config.apiUrl || OLLAMA_DEFAULT_URL
  }

  async chat(messages: ChatMessage[], options?: ChatOptions): Promise<ChatResponse> {
    const model = options?.model || this.config.defaultModel || 'llama3'
    const res = await fetch(`${this.baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        messages,
        stream: false,
        options: {
          temperature: options?.temperature ?? this.config.temperature,
          num_predict: options?.maxTokens ?? this.config.maxTokens,
        },
      }),
      signal: options?.signal,
    })

    if (!res.ok) throw new Error(`Ollama error: ${res.status} ${res.statusText}`)
    const data = await res.json()
    return { content: data.message?.content || '', model }
  }

  async *streamChat(messages: ChatMessage[], options?: ChatOptions): AsyncGenerator<string> {
    const model = options?.model || this.config.defaultModel || 'llama3'
    const res = await fetch(`${this.baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        messages,
        stream: true,
        options: {
          temperature: options?.temperature ?? this.config.temperature,
          num_predict: options?.maxTokens ?? this.config.maxTokens,
        },
      }),
      signal: options?.signal,
    })

    if (!res.ok) throw new Error(`Ollama error: ${res.status} ${res.statusText}`)
    const reader = res.body?.getReader()
    if (!reader) return

    const decoder = new TextDecoder()
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      const lines = decoder.decode(value).split('\n').filter(Boolean)
      for (const line of lines) {
        try {
          const parsed = JSON.parse(line)
          if (parsed.message?.content) yield parsed.message.content
          if (parsed.done) return
        } catch { }
      }
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      const res = await fetch(`${this.baseUrl}/api/tags`, { signal: AbortSignal.timeout(5000) })
      return res.ok
    } catch {
      return false
    }
  }

  async listModels(): Promise<string[]> {
    try {
      const res = await fetch(`${this.baseUrl}/api/tags`)
      if (!res.ok) return this.config.models
      const data = await res.json()
      return data.models?.map((m: any) => m.name) || this.config.models
    } catch {
      return this.config.models
    }
  }
}
