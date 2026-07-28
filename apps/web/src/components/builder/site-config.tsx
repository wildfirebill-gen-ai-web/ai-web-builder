'use client'

import { Input, Select, Switch } from '@awb/ui'
import type { SiteConfig, SiteType } from '@awb/core'
import { SITE_TYPES } from '@awb/core'

interface SiteConfigFormProps {
  config: SiteConfig
  onChange: (config: SiteConfig) => void
}

const frameworks = [
  { label: 'Next.js', value: 'nextjs' },
  { label: 'React (Vite)', value: 'react' },
  { label: 'Astro', value: 'astro' },
  { label: 'Static HTML', value: 'static' },
]
const stylings = [
  { label: 'Tailwind CSS', value: 'tailwind' },
  { label: 'CSS Modules', value: 'css-modules' },
  { label: 'Styled Components', value: 'styled' },
  { label: 'Vanilla CSS', value: 'vanilla' },
]
const colorSchemes = [
  { label: 'Indigo', value: 'indigo' }, { label: 'Blue', value: 'blue' },
  { label: 'Emerald', value: 'emerald' }, { label: 'Amber', value: 'amber' },
  { label: 'Rose', value: 'rose' }, { label: 'Violet', value: 'violet' },
  { label: 'Slate', value: 'slate' }, { label: 'Cyan', value: 'cyan' },
]
const siteTypes = SITE_TYPES.map(t => ({ label: t.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()), value: t }))

export function SiteConfigForm({ config, onChange }: SiteConfigFormProps) {
  const update = (partial: Partial<SiteConfig>) => onChange({ ...config, ...partial })

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Input label="Site Name" value={config.name} onChange={e => update({ name: e.target.value })} />
        <Select label="Site Type" options={siteTypes} value={config.type} onChange={e => update({ type: e.target.value as SiteType })} />
      </div>
      <div>
        <label className="text-sm font-medium text-zinc-300 block mb-1.5">Description</label>
        <textarea value={config.description} onChange={e => update({ description: e.target.value })} rows={2}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Select label="Framework" options={frameworks} value={config.framework} onChange={e => update({ framework: e.target.value })} />
        <Select label="Styling" options={stylings} value={config.styling} onChange={e => update({ styling: e.target.value })} />
        <Select label="Color Scheme" options={colorSchemes} value={config.colorScheme} onChange={e => update({ colorScheme: e.target.value })} />
        <Select label="Typography" options={[{ label: 'Inter', value: 'inter' }, { label: 'Plus Jakarta Sans', value: 'plus-jakarta-sans' }, { label: 'Literata', value: 'literata' }, { label: 'Satoshi', value: 'satoshi' }]} value={config.typography} onChange={e => update({ typography: e.target.value })} />
      </div>
      <div>
        <label className="text-sm font-medium text-zinc-300 block mb-1.5">Pages (one per line)</label>
        <textarea value={config.pages.join('\n')} onChange={e => update({ pages: e.target.value.split('\n').filter(Boolean) })} rows={3}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none font-mono" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Switch label="SEO" checked={config.seo} onCheckedChange={v => update({ seo: v })} />
        <Switch label="Analytics" checked={config.analytics} onCheckedChange={v => update({ analytics: v })} />
        <Switch label="Contact Forms" checked={config.forms} onCheckedChange={v => update({ forms: v })} />
        <Switch label="Blog" checked={config.blog} onCheckedChange={v => update({ blog: v })} />
        <Switch label="Dark Mode" checked={config.darkMode} onCheckedChange={v => update({ darkMode: v })} />
        <Switch label="Multilingual" checked={config.multilingual} onCheckedChange={v => update({ multilingual: v })} />
      </div>
    </div>
  )
}
