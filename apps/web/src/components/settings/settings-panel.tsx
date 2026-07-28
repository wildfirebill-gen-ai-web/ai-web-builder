'use client'

import { useState } from 'react'
import { ScrollArea, cn } from '@awb/ui'
import { DEFAULT_SETTINGS, type AppSettings, type SettingCategory } from '@awb/core'

interface SettingsPanelProps {
  onClose: () => void
}

const categories: { id: SettingCategory; label: string; icon: string }[] = [
  { id: 'general', label: 'General', icon: '⚙' },
  { id: 'providers', label: 'Providers', icon: '🔌' },
  { id: 'generation', label: 'Generation', icon: '▶' },
  { id: 'layers', label: 'Layers', icon: '⊞' },
  { id: 'assets', label: 'Assets', icon: '🖼' },
  { id: 'editor', label: 'Editor', icon: '✎' },
  { id: 'export', label: 'Export', icon: '📦' },
  { id: 'advanced', label: 'Advanced', icon: '⚡' },
]

export function SettingsPanel({ onClose }: SettingsPanelProps) {
  const [activeCategory, setActiveCategory] = useState<SettingCategory>('general')
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS)

  const updateSetting = (category: SettingCategory, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: { ...(prev as any)[category], [key]: value },
    }))
  }

  const renderSetting = (category: SettingCategory, key: string, value: any) => {
    const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())

    if (typeof value === 'boolean') {
      return (
        <label key={key} className="flex items-center justify-between py-2">
          <span className="text-sm text-zinc-300">{label}</span>
          <button onClick={() => updateSetting(category, key, !value)}
            className={cn(
              'relative inline-flex h-5 w-9 items-center rounded-full transition-colors',
              value ? 'bg-indigo-600' : 'bg-zinc-600',
            )}>
            <span className={cn('inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform', value ? 'translate-x-4.5' : 'translate-x-1')} />
          </button>
        </label>
      )
    }

    if (typeof value === 'string' || typeof value === 'number') {
      return (
        <label key={key} className="flex items-center justify-between py-2">
          <span className="text-sm text-zinc-300">{label}</span>
          <input type={typeof value === 'number' ? 'number' : 'text'} value={value}
            onChange={e => updateSetting(category, key, e.target.value)}
            className="w-40 rounded border border-zinc-700 bg-zinc-800 px-2 py-1 text-xs text-zinc-200 text-right" />
        </label>
      )
    }
    return null
  }

  const activeSettings = (settings as any)[activeCategory] || {}
  const activeCategoryLabel = categories.find(c => c.id === activeCategory)?.label || activeCategory

  return (
    <div className="w-96 border-l border-zinc-800 bg-zinc-900 flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
        <h2 className="font-semibold">Settings</h2>
        <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300 text-sm">✕</button>
      </div>
      <div className="flex flex-1">
        <nav className="w-28 border-r border-zinc-800 p-2 space-y-1">
          {categories.map(cat => (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
              className={cn(
                'w-full text-left px-2 py-1.5 rounded text-xs transition-colors',
                activeCategory === cat.id ? 'bg-indigo-600/20 text-indigo-300' : 'text-zinc-400 hover:text-zinc-200',
              )}>
              {cat.icon} {cat.label}
            </button>
          ))}
        </nav>
        <ScrollArea className="flex-1 p-4">
          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">{activeCategoryLabel}</h3>
          <div className="space-y-1">
            {Object.entries(activeSettings).map(([key, value]) => renderSetting(activeCategory, key, value))}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
