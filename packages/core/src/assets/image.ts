import { generateComfyUIImage } from './comfyui'
import { generateSvgImage, type SvgStyle } from './svg'

export interface ImageGenRequest {
  prompt: string
  style: string
  width: number
  height: number
  count: number
  provider?: string
  comfyuiUrl?: string
  primaryColor?: string
  backgroundColor?: string
  density?: number
}

export interface ImageGenResult {
  urls: string[]
  provider: string
}

export type ImageStyle = 'modern' | 'minimal' | 'isometric' | 'abstract' | 'photorealistic' | 'illustration' | '3d-render' | 'gradient' | SvgStyle

export const IMAGE_STYLES: { id: ImageStyle; name: string; description: string }[] = [
  { id: 'modern', name: 'Modern', description: 'Clean, contemporary style with vibrant colors' },
  { id: 'minimal', name: 'Minimal', description: 'Simple, elegant, with plenty of whitespace' },
  { id: 'isometric', name: 'Isometric', description: '3D isometric perspective illustrations' },
  { id: 'abstract', name: 'Abstract', description: 'Artistic abstract compositions' },
  { id: 'photorealistic', name: 'Photorealistic', description: 'Realistic photographs' },
  { id: 'illustration', name: 'Illustration', description: 'Hand-drawn style vector illustrations' },
  { id: '3d-render', name: '3D Render', description: '3D rendered objects and scenes' },
  { id: 'gradient', name: 'Gradient', description: 'Smooth color gradient compositions' },
  { id: 'dots', name: 'Dots', description: 'Scattered dot patterns' },
  { id: 'waves', name: 'Waves', description: 'Flowing sine wave lines' },
  { id: 'grid', name: 'Grid', description: 'Subtle grid lines' },
  { id: 'crosshatch', name: 'Crosshatch', description: 'Multi-angle line hatching' },
  { id: 'geometric', name: 'Geometric', description: 'Random geometric shapes' },
  { id: 'hero', name: 'Hero', description: 'Hero section layout with content blocks' },
]

export async function generateImages(request: ImageGenRequest): Promise<ImageGenResult> {
  const provider = request.provider || 'pexels'

  switch (provider) {
    case 'pexels':
      return searchPexels(request)
    case 'unsplash':
      return searchUnsplash(request)
    case 'openai':
      return generateOpenAIImage(request)
    case 'comfyui':
      return generateComfyUIImage({
        prompt: request.prompt,
        style: request.style,
        width: request.width,
        height: request.height,
        count: request.count,
        baseUrl: request.comfyuiUrl,
      })
    case 'svg':
      return generateSvgImage({
        style: request.style as any,
        prompt: request.prompt,
        width: request.width,
        height: request.height,
        count: request.count,
        primaryColor: request.primaryColor,
        backgroundColor: request.backgroundColor,
        density: request.density,
      })
    default:
      return searchPexels(request)
  }
}

async function searchPexels(request: ImageGenRequest): Promise<ImageGenResult> {
  const apiKey = process.env.PEXELS_API_KEY
  if (!apiKey) {
    return {
      urls: generatePlaceholderUrls(request.count, request.style, request.width, request.height),
      provider: 'placeholder',
    }
  }

  try {
    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(request.prompt)}&per_page=${request.count}&orientation=${request.width > request.height ? 'landscape' : 'portrait'}`,
      { headers: { Authorization: apiKey } },
    )
    if (!res.ok) throw new Error('Pexels API error')
    const data = await res.json()
    return {
      urls: data.photos?.map((p: any) => p.src.large2x) || [],
      provider: 'pexels',
    }
  } catch {
    return {
      urls: generatePlaceholderUrls(request.count, request.style, request.width, request.height),
      provider: 'placeholder',
    }
  }
}

async function searchUnsplash(request: ImageGenRequest): Promise<ImageGenResult> {
  const apiKey = process.env.UNSPLASH_ACCESS_KEY
  if (!apiKey) {
    return {
      urls: generatePlaceholderUrls(request.count, request.style, request.width, request.height),
      provider: 'placeholder',
    }
  }

  try {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(request.prompt)}&per_page=${request.count}&orientation=${request.width > request.height ? 'landscape' : 'portrait'}`,
      { headers: { Authorization: `Client-ID ${apiKey}` } },
    )
    if (!res.ok) throw new Error('Unsplash API error')
    const data = await res.json()
    return {
      urls: data.results?.map((p: any) => p.urls.regular) || [],
      provider: 'unsplash',
    }
  } catch {
    return {
      urls: generatePlaceholderUrls(request.count, request.style, request.width, request.height),
      provider: 'placeholder',
    }
  }
}

async function generateOpenAIImage(request: ImageGenRequest): Promise<ImageGenResult> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return {
      urls: generatePlaceholderUrls(request.count, request.style, request.width, request.height),
      provider: 'placeholder',
    }
  }

  try {
    const res = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: `${request.style} style: ${request.prompt}`,
        n: Math.min(request.count, 1),
        size: `${request.width}x${request.height}`,
      }),
    })
    if (!res.ok) throw new Error('OpenAI image error')
    const data = await res.json()
    return {
      urls: data.data?.map((d: any) => d.url) || [],
      provider: 'openai',
    }
  } catch {
    return {
      urls: generatePlaceholderUrls(request.count, request.style, request.width, request.height),
      provider: 'placeholder',
    }
  }
}

function generatePlaceholderUrls(count: number, style: string, width: number, height: number): string[] {
  const colors = ['6366f1', '8b5cf6', 'ec4899', 'f43f5e', '14b8a6', 'f97316', '06b6d4', '84cc16']
  const urls: string[] = []
  for (let i = 0; i < count; i++) {
    const color = colors[i % colors.length]
    urls.push(`https://placehold.co/${width}x${height}/${color}/ffffff?text=${encodeURIComponent(style)}+${i + 1}`)
  }
  return urls
}
