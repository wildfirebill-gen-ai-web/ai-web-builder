import { z } from 'zod'

export const SettingValueType = z.enum(['string', 'number', 'boolean', 'select', 'multiselect', 'secret', 'json'])
export type SettingValueType = z.infer<typeof SettingValueType>

export const SettingCategory = z.enum([
  'general',
  'providers',
  'generation',
  'layers',
  'assets',
  'editor',
  'export',
  'advanced',
])
export type SettingCategory = z.infer<typeof SettingCategory>

export const SettingSchema = z.object({
  id: z.string(),
  key: z.string(),
  label: z.string(),
  description: z.string().optional(),
  category: SettingCategory,
  type: SettingValueType,
  defaultValue: z.any(),
  value: z.any().optional(),
  options: z.array(z.object({ label: z.string(), value: z.any() })).optional(),
  placeholder: z.string().optional(),
  required: z.boolean().default(false),
  order: z.number().default(0),
})

export type Setting = z.infer<typeof SettingSchema>

export const SettingsGroup = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  category: SettingCategory,
  icon: z.string(),
  order: z.number(),
  settings: z.array(SettingSchema),
})

export type SettingsGroup = z.infer<typeof SettingsGroup>

export const AppSettingsSchema = z.object({
  general: z.object({
    appName: z.string().default('AI Web Builder'),
    theme: z.enum(['light', 'dark', 'system']).default('system'),
    language: z.string().default('en'),
    autoSave: z.boolean().default(true),
    telemetry: z.boolean().default(false),
  }),
  providers: z.object({
    defaultProvider: z.string().default('ollama'),
    maxRetries: z.number().default(3),
    timeout: z.number().default(120000),
    streaming: z.boolean().default(true),
  }),
  generation: z.object({
    maxTokens: z.number().default(8192),
    temperature: z.number().min(0).max(2).default(0.7),
    topP: z.number().min(0).max(1).default(0.9),
    enableLoop: z.boolean().default(false),
    maxIterations: z.number().default(3),
    autoPreview: z.boolean().default(true),
  }),
  layers: z.object({
    strictMode: z.boolean().default(false),
    includeSkipped: z.boolean().default(false),
    generateAllLayers: z.boolean().default(true),
  }),
  assets: z.object({
    defaultImageProvider: z.enum(['pexels', 'unsplash', 'openai', 'placeholder']).default('placeholder'),
    imageStyle: z.string().default('modern'),
    defaultImageWidth: z.number().default(1920),
    defaultImageHeight: z.number().default(1080),
    imageQuality: z.number().default(80),
  }),
  editor: z.object({
    fontSize: z.number().default(14),
    tabSize: z.number().default(2),
    wordWrap: z.boolean().default(true),
    minimap: z.boolean().default(true),
    lineNumbers: z.boolean().default(true),
    vimMode: z.boolean().default(false),
    theme: z.string().default('vs-dark'),
  }),
  export: z.object({
    format: z.enum(['zip', 'directory', 'git']).default('zip'),
    includeNodeModules: z.boolean().default(false),
    includeGit: z.boolean().default(true),
    prettify: z.boolean().default(true),
    autoDeploy: z.boolean().default(false),
    deployTarget: z.string().default('vercel'),
  }),
  advanced: z.object({
    debug: z.boolean().default(false),
    verbose: z.boolean().default(false),
    experimental: z.boolean().default(false),
    customScripts: z.boolean().default(false),
  }),
})

export type AppSettings = z.infer<typeof AppSettingsSchema>
