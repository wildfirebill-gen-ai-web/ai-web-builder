const DEFAULT_USER_AGENT = 'Mozilla/5.0 (compatible; AIWebBuilder/1.0; +https://github.com/wildfirebill-gen-ai-web/ai-web-builder)'
const FETCH_TIMEOUT = 15000
const MAX_RESPONSE_SIZE = 5 * 1024 * 1024

export class FetchError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public url?: string,
  ) {
    super(message)
    this.name = 'FetchError'
  }
}

export interface FetchResult {
  html: string
  url: string
  contentType: string
  size: number
}

export async function fetchPage(url: string): Promise<FetchResult> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT)

  try {
    const parsed = new URL(url)
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': DEFAULT_USER_AGENT,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
      redirect: 'follow',
    })

    if (!response.ok) {
      throw new FetchError(
        `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        url,
      )
    }

    const contentType = response.headers.get('content-type') || ''
    if (!contentType.includes('text/html') && !contentType.includes('application/xhtml')) {
      throw new FetchError(`Not an HTML page (${contentType})`, undefined, url)
    }

    const text = await response.text()
    if (text.length > MAX_RESPONSE_SIZE) {
      throw new FetchError(`Page too large: ${(text.length / 1024 / 1024).toFixed(1)}MB`, undefined, url)
    }

    return {
      html: text,
      url: response.url,
      contentType,
      size: text.length,
    }
  } catch (err) {
    if (err instanceof FetchError) throw err
    if ((err as Error).name === 'AbortError') {
      throw new FetchError(`Timeout after ${FETCH_TIMEOUT}ms`, undefined, url)
    }
    throw new FetchError(`Failed to fetch: ${(err as Error).message}`, undefined, url)
  } finally {
    clearTimeout(timer)
  }
}

export function resolveUrl(base: string, href: string): string | null {
  try {
    return new URL(href, base).href
  } catch {
    return null
  }
}

export function isSameDomain(base: string, target: string): boolean {
  try {
    return new URL(base).hostname === new URL(target).hostname
  } catch {
    return false
  }
}
