export interface UnsplashPhoto {
  id: string
  urls: {
    raw: string
    full: string
    regular: string
    small: string
    thumb: string
  }
  user: { name: string; links: { html: string } }
  alt_description: string
  width: number
  height: number
  color: string
  blur_hash: string
}

export class UnsplashClient {
  private accessKey: string

  constructor(accessKey?: string) {
    this.accessKey = accessKey || process.env.UNSPLASH_ACCESS_KEY || ''
  }

  isConfigured(): boolean {
    return !!this.accessKey
  }

  async search(query: string, options?: {
    perPage?: number
    page?: number
    orientation?: 'landscape' | 'portrait' | 'squarish'
    color?: string
  }): Promise<UnsplashPhoto[]> {
    if (!this.accessKey) return []

    const params = new URLSearchParams({
      query,
      per_page: String(options?.perPage || 10),
      page: String(options?.page || 1),
    })
    if (options?.orientation) params.set('orientation', options.orientation)
    if (options?.color) params.set('color', options.color)

    try {
      const res = await fetch(`https://api.unsplash.com/search/photos?${params}`, {
        headers: { Authorization: `Client-ID ${this.accessKey}` },
      })
      if (!res.ok) return []
      const data = await res.json()
      return data.results || []
    } catch {
      return []
    }
  }

  async random(options?: {
    query?: string
    count?: number
    orientation?: 'landscape' | 'portrait' | 'squarish'
  }): Promise<UnsplashPhoto[]> {
    if (!this.accessKey) return []

    const params = new URLSearchParams({
      count: String(options?.count || 1),
    })
    if (options?.query) params.set('query', options.query)
    if (options?.orientation) params.set('orientation', options.orientation)

    try {
      const res = await fetch(`https://api.unsplash.com/photos/random?${params}`, {
        headers: { Authorization: `Client-ID ${this.accessKey}` },
      })
      if (!res.ok) return []
      const data = await res.json()
      return Array.isArray(data) ? data : [data]
    } catch {
      return []
    }
  }
}
