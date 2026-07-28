import {
  type Provider,
  type ProviderConfig,
  type ChatMessage,
  type ChatOptions,
  type ChatResponse,
  type ProviderType,
} from './types'

export class AnthropicProvider implements Provider {
  readonly type: ProviderType = 'anthropic'
  readonly config: ProviderConfig

  constructor(config: Partial<ProviderConfig> = {}) {
    this.config = {
      id: 'anthropic',
      name: 'Anthropic Claude',
      type: 'anthropic',
      enabled: false,
      apiUrl: 'https://api.anthropic.com/v1',
      models: ['claude-sonnet-4-20250514', 'claude-3-5-sonnet-latest', 'claude-3-5-haiku-latest', 'claude-3-opus-latest'],
      defaultModel: 'claude-sonnet-4-20250514',
      capabilities: ['chat', 'code', 'vision'],
      local: false,
      order: 11,
      maxTokens: 8192,
      temperature: 0.7,
      ...config,
    }
  }

  private convertMessages(messages: ChatMessage[]): { system?: string; messages: any[] } {
    const systemMsg = messages.find(m => m.role === 'system')
    const rest = messages.filter(m => m.role !== 'system')
    return {
      system: systemMsg?.content,
      messages: rest.map(m => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content,
      })),
    }
  }

  async chat(messages: ChatMessage[], options?: ChatOptions): Promise<ChatResponse> {
    if (!this.config.apiKey) throw new Error('Anthropic API key not configured')
    const { system, messages: msgs } = this.convertMessages(messages)
    const body: any = {
      model: options?.model || this.config.defaultModel,
      messages: msgs,
      max_tokens: options?.maxTokens ?? this.config.maxTokens,
      temperature: options?.temperature ?? this.config.temperature,
    }
    if (system) body.system = system

    const res = await fetch(`${this.config.apiUrl}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.config.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(body),
      signal: options?.signal,
    })
    if (!res.ok) throw new Error(`Anthropic error: ${res.status} ${res.statusText}`)
    const data = await res.json()
    return {
      content: data.content?.[0]?.text || '',
      model: data.model,
      usage: data.usage ? {
        promptTokens: data.usage.input_tokens,
        completionTokens: data.usage.output_tokens,
        totalTokens: data.usage.input_tokens + data.usage.output_tokens,
      } : undefined,
    }
  }

  async *streamChat(messages: ChatMessage[], options?: ChatOptions): AsyncGenerator<string> {
    if (!this.config.apiKey) throw new Error('Anthropic API key not configured')
    const { system, messages: msgs } = this.convertMessages(messages)
    const body: any = {
      model: options?.model || this.config.defaultModel,
      messages: msgs,
      max_tokens: options?.maxTokens ?? this.config.maxTokens,
      temperature: options?.temperature ?? this.config.temperature,
      stream: true,
    }
    if (system) body.system = system

    const res = await fetch(`${this.config.apiUrl}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.config.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(body),
      signal: options?.signal,
    })
    if (!res.ok) throw new Error(`Anthropic error: ${res.status} ${res.statusText}`)

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
          if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
            yield parsed.delta.text
          }
        } catch { }
      }
    }
  }

  async testConnection(): Promise<boolean> {
    if (!this.config.apiKey) return false
    try {
      const res = await fetch(`${this.config.apiUrl}/models`, {
        headers: {
          'x-api-key': this.config.apiKey,
          'anthropic-version': '2023-06-01',
        },
        signal: AbortSignal.timeout(5000),
      })
      return res.ok
    } catch {
      return false
    }
  }

  async listModels(): Promise<string[]> { return this.config.models }
}
