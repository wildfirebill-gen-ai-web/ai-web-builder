export const APP_VERSION = '0.2.0-beta'
export const APP_NAME = 'AI Web Builder'
export const APP_DESCRIPTION = 'Universal AI Website Builder — Desktop & Web'

export const REPO_URL = 'https://github.com/wildfirebill-gen-ai-web/ai-web-builder'
export const DOCS_URL = 'https://wildfirebill-gen-ai-web.github.io/ai-web-builder'

export const SUPPORTED_LOCALES = ['en', 'es', 'fr', 'de', 'ja', 'zh', 'pt', 'ru'] as const
export type Locale = typeof SUPPORTED_LOCALES[number]

export const FILE_SIZE_LIMITS = {
  upload: 10 * 1024 * 1024,
  preview: 5 * 1024 * 1024,
  export: 100 * 1024 * 1024,
} as const

export const DEFAULT_PORTS = {
  web: 3000,
  desktop: 5173,
  ollama: 11434,
  llamacpp: 8080,
} as const

export const THEME_COLORS = {
  slate: { primary: '#64748b', dark: '#1e293b' },
  gray: { primary: '#6b7280', dark: '#1f2937' },
  zinc: { primary: '#71717a', dark: '#18181b' },
  neutral: { primary: '#737373', dark: '#171717' },
  stone: { primary: '#78716c', dark: '#1c1917' },
  red: { primary: '#ef4444', dark: '#7f1d1d' },
  orange: { primary: '#f97316', dark: '#7c2d12' },
  amber: { primary: '#f59e0b', dark: '#78350f' },
  yellow: { primary: '#eab308', dark: '#713f12' },
  lime: { primary: '#84cc16', dark: '#365314' },
  green: { primary: '#22c55e', dark: '#14532d' },
  emerald: { primary: '#10b981', dark: '#064e3b' },
  teal: { primary: '#14b8a6', dark: '#134e4a' },
  cyan: { primary: '#06b6d4', dark: '#164e63' },
  sky: { primary: '#0ea5e9', dark: '#0c4a6e' },
  blue: { primary: '#3b82f6', dark: '#1e3a5f' },
  indigo: { primary: '#6366f1', dark: '#312e81' },
  violet: { primary: '#8b5cf6', dark: '#4c1d95' },
  purple: { primary: '#a855f7', dark: '#581c87' },
  fuchsia: { primary: '#d946ef', dark: '#701a75' },
  pink: { primary: '#ec4899', dark: '#831843' },
  rose: { primary: '#f43f5e', dark: '#881337' },
} as const
