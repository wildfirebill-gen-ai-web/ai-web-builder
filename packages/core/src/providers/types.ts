import { z } from 'zod'

export const ProviderCapability = z.enum([
  'chat',
  'code',
  'image',
  'embedding',
  'vision',
])

export type ProviderCapability = z.infer<typeof ProviderCapability>

export const ProviderType = z.enum([
  'ollama',
  'llamacpp',
  'openai',
  'anthropic',
  'gemini',
  'openrouter',
  'groq',
  'deepseek',
  'mistral',
  'together',
  'perplexity',
  'azure_openai',
  'xai',
  'replicate',
  'cohere',
  'github_copilot',
])

export type ProviderType = z.infer<typeof ProviderType>

export const ProviderConfigSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: ProviderType,
  enabled: z.boolean().default(true),
  apiKey: z.string().optional(),
  apiUrl: z.string().optional(),
  models: z.array(z.string()).default([]),
  defaultModel: z.string().optional(),
  capabilities: z.array(ProviderCapability).default(['chat']),
  local: z.boolean().default(false),
  order: z.number().default(0),
  maxTokens: z.number().default(4096),
  temperature: z.number().min(0).max(2).default(0.7),
})

export type ProviderConfig = z.infer<typeof ProviderConfigSchema>

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface ChatOptions {
  model?: string
  temperature?: number
  maxTokens?: number
  stream?: boolean
  onToken?: (token: string) => void
  signal?: AbortSignal
}

export interface ChatResponse {
  content: string
  model: string
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
}

export interface Provider {
  readonly type: ProviderType
  readonly config: ProviderConfig
  chat(messages: ChatMessage[], options?: ChatOptions): Promise<ChatResponse>
  streamChat(messages: ChatMessage[], options?: ChatOptions): AsyncGenerator<string>
  testConnection(): Promise<boolean>
  listModels(): Promise<string[]>
}
