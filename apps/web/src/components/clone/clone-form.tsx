'use client'

import { useState, useCallback } from 'react'
import { Card } from '@awb/ui'
import {
  cloneSite, buildPromptContext,
  type CloneRequest, type CloneResult, type CloneProgress,
} from '@awb/core'

interface CloneFormProps {
  onCloneResult: (result: CloneResult, context: string) => void
  onSwitchToBuild: (prompt: string) => void
}

export function CloneForm({ onCloneResult, onSwitchToBuild }: CloneFormProps) {
  const [url, setUrl] = useState('')
  const [depth, setDepth] = useState(0)
  const [maxPages, setMaxPages] = useState(5)
  const [includeAssets, setIncludeAssets] = useState(false)
  const [sameDomain, setSameDomain] = useState(true)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState<CloneProgress[]>([])
  const [result, setResult] = useState<CloneResult | null>(null)
  const [error, setError] = useState('')

  const handleClone = useCallback(async () => {
    if (!url.trim()) return
    setLoading(true)
    setError('')
    setProgress([])
    setResult(null)

    const request: CloneRequest = {
      url: url.trim(),
      mode: 'ai',
      depth,
      includeAssets,
      sameDomain,
      maxPages,
    }

    try {
      const res = await cloneSite(request, (p) => {
        setProgress(prev => [...prev, p])
      })
      setResult(res)
      const context = buildPromptContext(res)
      onCloneResult(res, context)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [url, depth, maxPages, includeAssets, sameDomain, onCloneResult])

  const handleGenerateFromClone = () => {
    if (!result) return
    const context = buildPromptContext(result)
    const promptText = `Create a website inspired by ${result.title || result.url}.\n\nReplicate its visual style, layout, and page structure, but with original content for my project.\n\nOriginal site: ${result.url}`
    onSwitchToBuild(promptText)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1">Clone a Website</h2>
        <p className="text-zinc-400">Enter a URL to analyze its structure and regenerate it with AI.</p>
      </div>

      <Card className="p-5 bg-zinc-900/50 border-zinc-800">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5 text-zinc-300">Website URL</label>
            <input
              type="url"
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full px-4 py-2.5 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onKeyDown={e => e.key === 'Enter' && handleClone()}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5 text-zinc-300">Crawl Depth</label>
              <select
                value={depth}
                onChange={e => setDepth(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value={0}>Single page</option>
                <option value={1}>1 level deep</option>
                <option value={2}>2 levels deep</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5 text-zinc-300">Max Pages</label>
              <input
                type="number"
                min={1}
                max={50}
                value={maxPages}
                onChange={e => setMaxPages(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sameDomain}
                  onChange={e => setSameDomain(e.target.checked)}
                  className="rounded bg-zinc-800 border-zinc-600 text-indigo-500 focus:ring-indigo-500"
                />
                <span className="text-sm text-zinc-300">Same domain only</span>
              </label>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeAssets}
                onChange={e => setIncludeAssets(e.target.checked)}
                className="rounded bg-zinc-800 border-zinc-600 text-indigo-500 focus:ring-indigo-500"
              />
              <span className="text-sm text-zinc-300">Download images & assets</span>
            </label>
          </div>

          <button
            onClick={handleClone}
            disabled={loading || !url.trim()}
            className="px-6 py-2.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Cloning...' : 'Clone'}
          </button>
        </div>
      </Card>

      {progress.length > 0 && (
        <Card className="p-4 bg-zinc-900/30 border-zinc-800">
          <div className="space-y-1">
            {progress.map((p, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                {p.type === 'fetching' && (
                  <span className="text-amber-400">⟳ Fetching {p.url}</span>
                )}
                {p.type === 'parsed' && (
                  <span className="text-emerald-400">✓ Parsed {p.url}</span>
                )}
                {p.message && (
                  <span className="text-red-400">✗ {p.message}</span>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {error && (
        <div className="p-4 rounded-lg bg-red-900/20 border border-red-800 text-red-400 text-sm">
          {error}
        </div>
      )}

      {result && (
        <Card className="p-5 bg-zinc-900/50 border-zinc-800">
          <h3 className="font-semibold text-lg mb-3">Clone Results</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
            <div className="p-3 rounded-lg bg-zinc-800/50">
              <div className="text-2xl font-bold text-indigo-400">{result.pages.length}</div>
              <div className="text-xs text-zinc-400">Pages</div>
            </div>
            <div className="p-3 rounded-lg bg-zinc-800/50">
              <div className="text-2xl font-bold text-indigo-400">{result.pages[0]?.images.length || 0}</div>
              <div className="text-xs text-zinc-400">Images</div>
            </div>
            <div className="p-3 rounded-lg bg-zinc-800/50">
              <div className="text-2xl font-bold text-indigo-400">{result.pages[0]?.cssFiles.length || 0}</div>
              <div className="text-xs text-zinc-400">CSS Files</div>
            </div>
            <div className="p-3 rounded-lg bg-zinc-800/50">
              <div className="text-2xl font-bold text-indigo-400">{(result.duration / 1000).toFixed(1)}s</div>
              <div className="text-xs text-zinc-400">Duration</div>
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <h4 className="text-sm font-medium text-zinc-300">Pages Found</h4>
            {result.pages.slice(0, 10).map((page, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <span className="text-zinc-500 shrink-0 w-6 text-right">{page.depth}</span>
                <span className="text-zinc-300 truncate">{page.title || page.url}</span>
                <span className="text-zinc-500 text-xs truncate hidden sm:inline">{page.url}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleGenerateFromClone}
              className="px-5 py-2 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-500 transition-colors"
            >
              Generate Site from Clone
            </button>
          </div>
        </Card>
      )}
    </div>
  )
}
