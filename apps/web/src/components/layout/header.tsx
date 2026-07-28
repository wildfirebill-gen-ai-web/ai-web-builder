'use client'

import { APP_VERSION } from '@awb/config'
import { Select } from '@awb/ui'
import { globalProviderRegistry } from '@awb/core'
import { useEffect, useState } from 'react'

interface HeaderProps {
  providerId: string
  onProviderChange: (id: string) => void
  model: string
  onModelChange: (model: string) => void
  onSettingsClick: () => void
}

export function BuilderHeader({ providerId, onProviderChange, model, onModelChange, onSettingsClick }: HeaderProps) {
  const [providers, setProviders] = useState(() => globalProviderRegistry.getAll())
  const [models, setModels] = useState<string[]>([])

  useEffect(() => {
    setProviders(globalProviderRegistry.getAll())
  }, [])

  useEffect(() => {
    const p = globalProviderRegistry.get(providerId)
    if (p) {
      p.listModels().then(setModels).catch(() => setModels(p.config.models))
    }
  }, [providerId])

  return (
    <header className="h-12 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between px-4">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-zinc-400">Provider:</span>
        <select value={providerId} onChange={e => onProviderChange(e.target.value)}
          className="h-8 rounded-md border border-zinc-700 bg-zinc-800 px-2 text-xs text-zinc-200">
          {providers.map(p => (
            <option key={p.config.id} value={p.config.id}>
              {p.config.name} {p.config.local ? '(local)' : ''}
            </option>
          ))}
        </select>
        <select value={model} onChange={e => onModelChange(e.target.value)}
          className="h-8 rounded-md border border-zinc-700 bg-zinc-800 px-2 text-xs text-zinc-200">
          <option value="">Default model</option>
          {models.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-zinc-500">AI Web Builder v{APP_VERSION}</span>
        <button onClick={onSettingsClick}
          className="h-8 px-3 rounded-md text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors">
          Settings
        </button>
      </div>
    </header>
  )
}
