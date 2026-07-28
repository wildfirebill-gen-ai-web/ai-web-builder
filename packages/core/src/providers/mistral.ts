import { type Provider, type ProviderConfig, type ChatMessage, type ChatOptions, type ChatResponse, type ProviderType } from './types'

export class MistralProvider implements Provider {
  readonly type: ProviderType = 'mistral'
  readonly config: ProviderConfig
  constructor(config: Partial<ProviderConfig> = {}) {
    this.config = {
      id: 'mistral', name: 'Mistral AI', type: 'mistral', enabled: false,
      apiUrl: 'https://api.mistral.ai/v1',
      models: ['mistral-large-latest', 'mistral-small-latest', 'codestral-latest'],
      defaultModel: 'mistral-large-latest',
      capabilities: ['chat', 'code'], local: false, order: 17, maxTokens: 8192, temperature: 0.7, ...config,
    }
  }
  async chat(messages: ChatMessage[], options?: ChatOptions): Promise<ChatResponse> {
    if (!this.config.apiKey) throw new Error('Mistral API key not configured')
    const res = await fetch(`${this.config.apiUrl}/chat/completions`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${this.config.apiKey}` },
      body: JSON.stringify({ model: options?.model || this.config.defaultModel, messages, temperature: options?.temperature ?? this.config.temperature, max_tokens: options?.maxTokens ?? this.config.maxTokens }),
      signal: options?.signal,
    })
    if (!res.ok) throw new Error(`Mistral error: ${res.status} ${res.statusText}`)
    const data = await res.json()
    return { content: data.choices?.[0]?.message?.content || '', model: data.model }
  }
  async *streamChat(messages: ChatMessage[], options?: ChatOptions): AsyncGenerator<string> {
    if (!this.config.apiKey) throw new Error('Mistral API key not configured')
    const res = await fetch(`${this.config.apiUrl}/chat/completions`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${this.config.apiKey}` },
      body: JSON.stringify({ model: options?.model || this.config.defaultModel, messages, stream: true, temperature: options?.temperature ?? this.config.temperature, max_tokens: options?.maxTokens ?? this.config.maxTokens }),
      signal: options?.signal,
    })
    if (!res.ok) throw new Error(`Mistral error: ${res.status} ${res.statusText}`)
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
  async listModels(): Promise<string[]> { return this.config.models }
}
