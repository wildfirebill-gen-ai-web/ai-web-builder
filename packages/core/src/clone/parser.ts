import { parse, type HTMLElement } from 'node-html-parser'
import { type ClonedPage } from './types'
import { resolveUrl, isSameDomain } from './fetcher'

export function parsePage(html: string, url: string): ClonedPage {
  const root = parse(html, { comment: false, blockTextElements: { script: false, style: false } })

  const title = root.querySelector('title')?.textContent?.trim() || ''
  const description =
    root.querySelector('meta[name="description"]')?.getAttribute('content')?.trim() || ''
  const baseUrl = root.querySelector('base')?.getAttribute('href') || url

  const headings: { level: number; text: string }[] = []
  for (let level = 1; level <= 6; level++) {
    root.querySelectorAll(`h${level}`).forEach(el => {
      const text = el.textContent?.trim()
      if (text) headings.push({ level, text })
    })
  }

  const textContent = root.textContent?.trim() || ''
  const visibleText = textContent.replace(/\s+/g, ' ').slice(0, 10000)

  const links: { href: string; text: string }[] = []
  const seenLinks = new Set<string>()
  root.querySelectorAll('a[href]').forEach(el => {
    const href = el.getAttribute('href')
    if (!href || href.startsWith('#') || href.startsWith('javascript:') || href.startsWith('mailto:')) return
    const resolved = resolveUrl(baseUrl, href)
    if (!resolved) return
    const key = resolved.split('#')[0]
    if (seenLinks.has(key)) return
    seenLinks.add(key)
    links.push({ href: resolved, text: el.textContent?.trim()?.slice(0, 100) || '' })
  })

  const images: { src: string; alt: string }[] = []
  const seenImages = new Set<string>()
  root.querySelectorAll('img[src]').forEach(el => {
    const src = el.getAttribute('src')
    if (!src) return
    const resolved = resolveUrl(url, src)
    if (!resolved || seenImages.has(resolved)) return
    seenImages.add(resolved)
    images.push({ src: resolved, alt: el.getAttribute('alt') || '' })
  })

  const cssFiles: string[] = []
  root.querySelectorAll('link[rel="stylesheet"]').forEach(el => {
    const href = el.getAttribute('href')
    if (!href) return
    const resolved = resolveUrl(baseUrl, href)
    if (resolved) cssFiles.push(resolved)
  })

  const jsFiles: string[] = []
  root.querySelectorAll('script[src]').forEach(el => {
    const src = el.getAttribute('src')
    if (!src) return
    const resolved = resolveUrl(baseUrl, src)
    if (resolved) jsFiles.push(resolved)
  })

  return {
    url,
    depth: 0,
    title,
    description,
    headings,
    textContent: visibleText,
    links,
    images,
    cssFiles,
    jsFiles,
    rawHtml: html,
  }
}

export function findInternalLinks(page: ClonedPage, baseUrl: string): string[] {
  return page.links
    .map(l => l.href)
    .filter(href => isSameDomain(baseUrl, href))
    .filter(href => {
      try {
        const u = new URL(href)
        const ext = u.pathname.split('.').pop()?.toLowerCase()
        if (ext && ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'pdf', 'zip'].includes(ext)) return false
        return true
      } catch {
        return false
      }
    })
}

export function buildCloneContext(pages: ClonedPage[]): string {
  const parts: string[] = []
  for (const page of pages) {
    parts.push(`=== Page: ${page.url} ===`)
    parts.push(`Title: ${page.title}`)
    if (page.description) parts.push(`Description: ${page.description}`)
    if (page.headings.length) {
      parts.push(`Structure:`)
      for (const h of page.headings) {
        parts.push(`${'  '.repeat(h.level - 1)}${'#'.repeat(h.level)} ${h.text}`)
      }
    }
    if (page.textContent.length > 500) {
      parts.push(`Content excerpt:\n${page.textContent.slice(0, 3000)}`)
    }
    parts.push(`Images: ${page.images.length}`)
    parts.push(`Internal links: ${page.links.filter(l => isSameDomain(page.url, l.href)).length}`)
    parts.push('')
  }
  return parts.join('\n')
}
