import { type LayerConfig } from '../layers/types'

export type SiteType = 'landing-page' | 'multi-page' | 'saas' | 'ecommerce' | 'blog' | 'portfolio' | 'webapp' | 'documentation'

export const SITE_TYPES: SiteType[] = ['landing-page', 'multi-page', 'saas', 'ecommerce', 'blog', 'portfolio', 'webapp', 'documentation']

export interface SiteConfig {
  name: string
  description: string
  type: SiteType
  framework: string
  styling: string
  pages: string[]
  features: string[]
  colorScheme: string
  typography: string
  language: string
  locale: string
  seo: boolean
  analytics: boolean
  forms: boolean
  blog: boolean
  darkMode: boolean
  multilingual: boolean
}

export interface GenerationRequest {
  prompt: string
  providerId: string
  model?: string
  siteConfig: SiteConfig
  layers: LayerConfig[]
  temperature?: number
  maxTokens?: number
  assets?: {
    images: boolean
    imageStyle: string
    imageCount: number
  }
  clonedContext?: string
}

export interface GenerationResult {
  id: string
  siteConfig: SiteConfig
  layers: LayerConfig[]
  files: GeneratedFile[]
  stdout: string
  model: string
  provider: string
  duration: number
  tokenUsage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
  preview?: string
}

export interface GeneratedFile {
  path: string
  content: string
  language: string
  layer?: string
}
