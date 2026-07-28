import { type Provider, type ProviderConfig, type ChatMessage, type ChatOptions, type ChatResponse, type ProviderType } from './types'

export class GroqProvider implements Provider {
  readonly type: ProviderType = 'groq'
  readonly config: ProviderConfig
  constructor(config: Partial<ProviderConfig> = {}) {
    this.config = {
      id: 'groq', name: 'Groq', type: 'groq', enabled: false,
      apiUrl: 'https://api.groq.com/openai/v1',
      models: ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'mixtral-8x7b-32768', 'deepseek-r1-distill-llama-70b'],
      defaultModel: 'llama-3.3-70b-versatile',
      capabilities: ['chat', 'code'], local: false, order: 15, maxTokens: 32768, temperature: 0.7, ...config,
    }
  }
  async chat(messages: ChatMessage[], options?: ChatOptions): Promise<ChatResponse> {
    if (!this.config.apiKey) throw new Error('Groq API key not configured')
    const res = await fetch(`${this.config.apiUrl}/chat/completions`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${this.config.apiKey}` },
      body: JSON.stringify({ model: options?.model || this.config.defaultModel, messages, temperature: options?.temperature ?? this.config.temperature, max_tokens: options?.maxTokens ?? this.config.maxTokens }),
      signal: options?.signal,
    })
    if (!res.ok) throw new Error(`Groq error: ${res.status} ${res.statusText}`)
    const data = await res.json()
    return { content: data.choices?.[0]?.message?.content || '', model: data.model }
  }
  async *streamChat(messages: ChatMessage[], options?: ChatOptions): AsyncGenerator<string> {
    if (!this.config.apiKey) throw new Error('Groq API key not configured')
    const res = await fetch(`${this.config.apiUrl}/chat/completions`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${this.config.apiKey}` },
      body: JSON.stringify({ model: options?.model || this.config.defaultModel, messages, stream: true, temperature: options?.temperature ?? this.config.temperature, max_tokens: options?.maxTokens ?? this.config.maxTokens }),
      signal: options?.signal,
    })
    if (!res.ok) throw new Error(`Groq error: ${res.status} ${res.statusText}`)
    const reader = res.body?.getReader(); if (!reader) return
    const decoder = new TextDecoder(); let buffer = ''
    while (true) {
      const { done, value } = await reader.read(); if (done) break
      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n'); buffer = lines.pop() || ''
      for (const line of lines) {
        const cleaned = line.replace(/^data: /, '').trim()
        if (!cleaned || cleaned === '[DONE]') continue
        try { const p = JSON.parse(cleaned); yield p.choices?.[0]?.delta?.content || '' } catch { }
      }
    }
  }
  async testConnection(): Promise<boolean> {
    if (!this.config.apiKey) return false
    try { const res = await fetch(`${this.config.apiUrl}/models`, { headers: { Authorization: `Bearer ${this.config.apiKey}` }, signal: AbortSignal.timeout(5000) }); return res.ok } catch { return false }
  }
  async listModels(): Promise<string[]> {
    if (!this.config.apiKey) return this.config.models
    try {
      const res = await fetch(`${this.config.apiUrl}/models`, { headers: { Authorization: `Bearer ${this.config.apiKey}` } })
      if (!res.ok) return this.config.models
      const data = await res.json()
      return data.data?.map((m: any) => m.id) || this.config.models
    } catch { return this.config.models }
  }
}
