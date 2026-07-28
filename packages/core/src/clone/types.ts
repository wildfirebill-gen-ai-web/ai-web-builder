export interface CloneRequest {
  url: string
  mode: 'ai' | 'raw'
  depth: number
  includeAssets: boolean
  sameDomain: boolean
  maxPages: number
}

export interface CloneResult {
  url: string
  title: string
  pages: ClonedPage[]
  assets: ClonedAsset[]
  duration: number
  totalSize: number
}

export interface ClonedPage {
  url: string
  depth: number
  title: string
  description: string
  headings: { level: number; text: string }[]
  textContent: string
  links: { href: string; text: string }[]
  images: { src: string; alt: string }[]
  cssFiles: string[]
  jsFiles: string[]
  rawHtml?: string
}

export interface ClonedAsset {
  url: string
  localPath: string
  type: 'image' | 'css' | 'js' | 'font' | 'other'
  size: number
}

export interface CloneProgress {
  type: 'fetching' | 'parsed' | 'downloading' | 'done'
  url?: string
  pageCount?: number
  assetCount?: number
  message?: string
}
