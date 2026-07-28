import {
  type Provider,
  type ProviderConfig,
  type ChatMessage,
  type ChatOptions,
  type ChatResponse,
  type ProviderType,
} from './types'

export class GeminiProvider implements Provider {
  readonly type: ProviderType = 'gemini'
  readonly config: ProviderConfig

  constructor(config: Partial<ProviderConfig> = {}) {
    this.config = {
      id: 'gemini',
      name: 'Google Gemini',
      type: 'gemini',
      enabled: false,
      apiUrl: 'https://generativelanguage.googleapis.com/v1beta',
      models: ['gemini-2.5-pro', 'gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-pro'],
      defaultModel: 'gemini-2.5-flash',
      capabilities: ['chat', 'code', 'image', 'vision'],
      local: false,
      order: 12,
      maxTokens: 8192,
      temperature: 0.7,
      ...config,
    }
  }

  private get apiKey(): string { return this.config.apiKey ?? '' }

  async chat(messages: ChatMessage[], options?: ChatOptions): Promise<ChatResponse> {
    if (!this.apiKey) throw new Error('Gemini API key not configured')
    const model = options?.model || this.config.defaultModel
    const contents = messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }))

    const res = await fetch(`${this.config.apiUrl}/models/${model}:generateContent?key=${this.apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: options?.temperature ?? this.config.temperature,
          maxOutputTokens: options?.maxTokens ?? this.config.maxTokens,
        },
      }),
      signal: options?.signal,
    })
    if (!res.ok) throw new Error(`Gemini error: ${res.status} ${res.statusText}`)
    const data = await res.json()
    return {
      content: data.candidates?.[0]?.content?.parts?.[0]?.text || '',
      model: model || '',
    }
  }

  async *streamChat(messages: ChatMessage[], options?: ChatOptions): AsyncGenerator<string> {
    if (!this.apiKey) throw new Error('Gemini API key not configured')
    const model = options?.model || this.config.defaultModel
    const contents = messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }))

    const res = await fetch(`${this.config.apiUrl}/models/${model}:streamGenerateContent?alt=sse&key=${this.apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: options?.temperature ?? this.config.temperature,
          maxOutputTokens: options?.maxTokens ?? this.config.maxTokens,
        },
      }),
      signal: options?.signal,
    })
    if (!res.ok) throw new Error(`Gemini error: ${res.status} ${res.statusText}`)
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
        if (!cleaned) continue
        try {
          const parsed = JSON.parse(cleaned)
          yield parsed.candidates?.[0]?.content?.parts?.[0]?.text || ''
        } catch { }
      }
    }
  }

  async testConnection(): Promise<boolean> {
    if (!this.apiKey) return false
    try {
      const res = await fetch(`${this.config.apiUrl}/models?key=${this.apiKey}`, {
        signal: AbortSignal.timeout(5000),
      })
      return res.ok
    } catch {
      return false
    }
  }

  async listModels(): Promise<string[]> {
    if (!this.apiKey) return this.config.models
    try {
      const res = await fetch(`${this.config.apiUrl}/models?key=${this.apiKey}`)
      if (!res.ok) return this.config.models
      const data = await res.json()
      return data.models?.map((m: any) => m.name.replace('models/', '')).filter((n: string) => n.startsWith('gemini')) || this.config.models
    } catch {
      return this.config.models
    }
  }
}
