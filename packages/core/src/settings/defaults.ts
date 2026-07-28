import { type AppSettings } from './schema'

export const DEFAULT_SETTINGS: AppSettings = {
  general: {
    appName: 'AI Web Builder',
    theme: 'system',
    language: 'en',
    autoSave: true,
    telemetry: false,
  },
  providers: {
    defaultProvider: 'ollama',
    maxRetries: 3,
    timeout: 120000,
    streaming: true,
  },
  generation: {
    maxTokens: 8192,
    temperature: 0.7,
    topP: 0.9,
    enableLoop: false,
    maxIterations: 3,
    autoPreview: true,
  },
  layers: {
    strictMode: false,
    includeSkipped: false,
    generateAllLayers: true,
  },
  assets: {
    defaultImageProvider: 'placeholder',
    imageStyle: 'modern',
    defaultImageWidth: 1920,
    defaultImageHeight: 1080,
    imageQuality: 80,
  },
  editor: {
    fontSize: 14,
    tabSize: 2,
    wordWrap: true,
    minimap: true,
    lineNumbers: true,
    vimMode: false,
    theme: 'vs-dark',
  },
  export: {
    format: 'zip',
    includeNodeModules: false,
    includeGit: true,
    prettify: true,
    autoDeploy: false,
    deployTarget: 'vercel',
  },
  advanced: {
    debug: false,
    verbose: false,
    experimental: false,
    customScripts: false,
  },
}

export class SettingsManager {
  private settings: AppSettings = { ...DEFAULT_SETTINGS }
  private listeners: Array<(settings: AppSettings) => void> = []

  constructor(initial?: Partial<AppSettings>) {
    if (initial) this.merge(initial)
  }

  get<K extends keyof AppSettings>(category: K): AppSettings[K] {
    return this.settings[category]
  }

  getAll(): AppSettings {
    return { ...this.settings }
  }

  set<K extends keyof AppSettings>(category: K, value: AppSettings[K]): void {
    this.settings[category] = value
    this.notify()
  }

  merge(partial: Partial<AppSettings>): void {
    for (const [key, value] of Object.entries(partial)) {
      if (value !== undefined) {
        (this.settings as any)[key] = value
      }
    }
    this.notify()
  }

  reset(): void {
    this.settings = { ...DEFAULT_SETTINGS }
    this.notify()
  }

  resetCategory<K extends keyof AppSettings>(category: K): void {
    this.settings[category] = { ...DEFAULT_SETTINGS[category] }
    this.notify()
  }

  onChange(listener: (settings: AppSettings) => void): () => void {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  toJSON(): string {
    return JSON.stringify(this.settings, null, 2)
  }

  static fromJSON(json: string): SettingsManager {
    try {
      const parsed = JSON.parse(json)
      return new SettingsManager(parsed)
    } catch {
      return new SettingsManager()
    }
  }

  private notify(): void {
    for (const listener of this.listeners) {
      listener(this.settings)
    }
  }
}
