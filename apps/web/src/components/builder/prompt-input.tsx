'use client'

import { Button } from '@awb/ui'
import type { SiteConfig } from '@awb/core'

interface PromptInputProps {
  value: string
  onChange: (val: string) => void
  siteConfig: SiteConfig
  loading: boolean
  onSubmit: () => void
}

export function PromptInput({ value, onChange, siteConfig, loading, onSubmit }: PromptInputProps) {
  const suggestions = [
    'A landing page for my AI SaaS product with pricing tiers',
    'A personal portfolio showcasing my design work',
    'An e-commerce store for handmade ceramics',
    'A documentation site for my open-source API',
    'A modern blog about web development',
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {suggestions.slice(0, 3).map(s => (
            <button key={s} onClick={() => onChange(s)}
              className="text-xs px-3 py-1.5 rounded-full border border-zinc-700 text-zinc-400 hover:border-indigo-500 hover:text-indigo-400 transition-colors">
              {s}
            </button>
          ))}
        </div>
        <span className="text-xs text-zinc-500">Building: {siteConfig.name}</span>
      </div>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Describe the website you want to build in detail..."
        rows={6}
        className="w-full rounded-xl border border-zinc-700 bg-zinc-900 p-4 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
        onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); onSubmit() } }}
      />
      <div className="flex items-center justify-between">
        <p className="text-xs text-zinc-500">Press Cmd+Enter to generate</p>
        <Button variant="primary" size="lg" loading={loading} onClick={onSubmit} disabled={!value.trim() || loading}>
          {loading ? 'Generating...' : 'Generate Website'}
        </Button>
      </div>
    </div>
  )
}
