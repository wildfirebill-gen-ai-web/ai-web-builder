import { nanoid } from 'nanoid'
import { type CloneRequest, type CloneResult, type ClonedPage, type CloneProgress } from './types'
import { fetchPage, resolveUrl } from './fetcher'
import { parsePage, findInternalLinks, buildCloneContext } from './parser'

export type { CloneRequest, CloneResult, ClonedPage, CloneProgress }

export async function cloneSite(
  request: CloneRequest,
  onProgress?: (progress: CloneProgress) => void,
): Promise<CloneResult> {
  const startTime = Date.now()
  const visited = new Set<string>()
  const pages: ClonedPage[] = []
  const assets: CloneResult['assets'] = []
  const queue: { url: string; depth: number }[] = [{ url: request.url, depth: 0 }]

  while (queue.length > 0 && pages.length < request.maxPages) {
    const item = queue.shift()!
    const normalizedUrl = item.url.split('#')[0]

    if (visited.has(normalizedUrl)) continue
    visited.add(normalizedUrl)

    onProgress?.({ type: 'fetching', url: normalizedUrl, pageCount: pages.length })

    try {
      const result = await fetchPage(normalizedUrl)
      const page = parsePage(result.html, result.url)
      page.depth = item.depth
      pages.push(page)

      onProgress?.({ type: 'parsed', url: normalizedUrl, pageCount: pages.length })

      if (request.depth > item.depth) {
        const internalLinks = findInternalLinks(page, request.url)
        for (const link of internalLinks) {
          const normalized = link.split('#')[0]
          if (!visited.has(normalized)) {
            queue.push({ url: link, depth: item.depth + 1 })
          }
        }
      }
    } catch (err) {
      onProgress?.({ type: 'fetching', url: normalizedUrl, message: (err as Error).message })
    }
  }

  const totalSize = pages.reduce((sum, p) => sum + (p.rawHtml?.length || 0), 0)

  return {
    url: request.url,
    title: pages[0]?.title || '',
    pages,
    assets,
    duration: Date.now() - startTime,
    totalSize,
  }
}

export function buildPromptContext(cloneResult: CloneResult): string {
  return buildCloneContext(cloneResult.pages)
}

export function estimateClone(cloneResult: CloneResult): {
  pages: number
  images: number
  cssFiles: number
  jsFiles: number
  totalSize: string
  duration: string
} {
  const page = cloneResult.pages[0]
  return {
    pages: cloneResult.pages.length,
    images: page?.images.length || 0,
    cssFiles: page?.cssFiles.length || 0,
    jsFiles: page?.jsFiles.length || 0,
    totalSize: `${(cloneResult.totalSize / 1024).toFixed(0)} KB`,
    duration: `${(cloneResult.duration / 1000).toFixed(1)}s`,
  }
}
