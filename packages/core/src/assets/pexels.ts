export interface PexelsPhoto {
  id: number
  url: string
  photographer: string
  photographerUrl: string
  src: {
    original: string
    large2x: string
    large: string
    medium: string
    small: string
    portrait: string
    landscape: string
    tiny: string
  }
  alt: string
  width: number
  height: number
}

export class PexelsClient {
  private apiKey: string

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.PEXELS_API_KEY || ''
  }

  isConfigured(): boolean {
    return !!this.apiKey
  }

  async search(query: string, options?: {
    perPage?: number
    page?: number
    orientation?: 'landscape' | 'portrait' | 'square'
    size?: 'large' | 'medium' | 'small'
    color?: string
  }): Promise<{ photos: PexelsPhoto[]; totalResults: number }> {
    if (!this.apiKey) return this.getFallback(query, options?.perPage || 10)

    const params = new URLSearchParams({
      query,
      per_page: String(options?.perPage || 10),
      page: String(options?.page || 1),
    })
    if (options?.orientation) params.set('orientation', options.orientation)
    if (options?.size) params.set('size', options.size)
    if (options?.color) params.set('color', options.color)

    const res = await fetch(`https://api.pexels.com/v1/search?${params}`, {
      headers: { Authorization: this.apiKey },
    })
    if (!res.ok) return this.getFallback(query, options?.perPage || 10)
    const data = await res.json()
    return { photos: data.photos || [], totalResults: data.total_results || 0 }
  }

  async curated(options?: { perPage?: number; page?: number }): Promise<PexelsPhoto[]> {
    if (!this.apiKey) return []
    const params = new URLSearchParams({
      per_page: String(options?.perPage || 10),
      page: String(options?.page || 1),
    })
    const res = await fetch(`https://api.pexels.com/v1/curated?${params}`, {
      headers: { Authorization: this.apiKey },
    })
    if (!res.ok) return []
    const data = await res.json()
    return data.photos || []
  }

  private async getFallback(query: string, count: number) {
    const photos: PexelsPhoto[] = []
    const colors = ['6366f1', '8b5cf6', 'ec4899', 'f43f5e', '14b8a6', 'f97316', '06b6d4', '84cc16']
    for (let i = 0; i < count; i++) {
      const color = colors[i % colors.length]
      const width = 1920
      const height = 1080
      photos.push({
        id: i,
        url: `https://placehold.co/${width}x${height}/${color}/ffffff?text=${encodeURIComponent(query)}+${i + 1}`,
        photographer: 'Placeholder',
        photographerUrl: '#',
        src: {
          original: `https://placehold.co/${width}x${height}/${color}/ffffff?text=${encodeURIComponent(query)}`,
          large2x: `https://placehold.co/${width}x${height}/${color}/ffffff?text=${encodeURIComponent(query)}`,
          large: `https://placehold.co/${Math.floor(width / 2)}x${Math.floor(height / 2)}/${color}/ffffff`,
          medium: `https://placehold.co/${Math.floor(width / 3)}x${Math.floor(height / 3)}/${color}/ffffff`,
          small: `https://placehold.co/${Math.floor(width / 4)}x${Math.floor(height / 4)}/${color}/ffffff`,
          portrait: `https://placehold.co/${Math.floor(height / 2)}x${width}/${color}/ffffff`,
          landscape: `https://placehold.co/${width}x${Math.floor(height / 2)}/${color}/ffffff`,
          tiny: `https://placehold.co/150x150/${color}/ffffff`,
        },
        alt: `${query} image ${i + 1}`,
        width,
        height,
      })
    }
    return { photos, totalResults: count }
  }
}
