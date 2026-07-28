import { type Provider, type ProviderConfig, type ProviderType } from './types'

export class ProviderRegistry {
  private providers = new Map<string, Provider>()

  register(provider: Provider): void {
    this.providers.set(provider.config.id, provider)
  }

  get(id: string): Provider | undefined {
    return this.providers.get(id)
  }

  getAll(): Provider[] {
    return Array.from(this.providers.values())
  }

  getByType(type: ProviderType): Provider[] {
    return this.getAll().filter(p => p.config.type === type)
  }

  getLocal(): Provider[] {
    return this.getAll().filter(p => p.config.local)
  }

  getCloud(): Provider[] {
    return this.getAll().filter(p => !p.config.local)
  }

  getEnabled(): Provider[] {
    return this.getAll().filter(p => p.config.enabled)
  }

  remove(id: string): void {
    this.providers.delete(id)
  }

  async testAll(): Promise<Map<string, boolean>> {
    const results = new Map<string, boolean>()
    for (const [id, provider] of this.providers) {
      try {
        results.set(id, await provider.testConnection())
      } catch {
        results.set(id, false)
      }
    }
    return results
  }
}

export const globalProviderRegistry = new ProviderRegistry()
