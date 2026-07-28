'use client'

import { Switch, Badge, cn } from '@awb/ui'
import { layerDefinitions, getLayerDefinitionsByCategory } from '@awb/core'
import type { LayerConfig } from '@awb/core'

interface LayerConfigPanelProps {
  layers: LayerConfig[]
  onChange: (layers: LayerConfig[]) => void
}

const categoryLabels: Record<string, string> = {
  presentation: 'Presentation & UI',
  backend: 'Backend & APIs',
  data: 'Data & Storage',
  security: 'Security & Auth',
  ops: 'Operations & Deployment',
  performance: 'Performance & Scaling',
  observability: 'Observability & Monitoring',
}

export function LayerConfigPanel({ layers, onChange }: LayerConfigPanelProps) {
  const byCategory = getLayerDefinitionsByCategory()

  const toggleLayer = (id: string) => {
    onChange(layers.map(l => l.id === id ? { ...l, enabled: !l.enabled, status: !l.enabled ? 'configured' as const : 'skipped' as const } : l))
  }

  const updateOption = (layerId: string, key: string, value: any) => {
    onChange(layers.map(l => l.id === layerId ? { ...l, options: { ...l.options, [key]: value } } : l))
  }

  return (
    <div className="space-y-6">
      {Object.entries(byCategory).map(([category, defs]) => (
        <div key={category}>
          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">{categoryLabels[category] || category}</h3>
          <div className="space-y-3">
            {defs.map(def => {
              const layer = layers.find(l => l.id === def.id)
              if (!layer) return null
              return (
                <div key={def.id} className={cn(
                  'rounded-xl border p-4 transition-colors',
                  layer.enabled ? 'border-zinc-700 bg-zinc-900/50' : 'border-zinc-800 bg-zinc-900/20 opacity-60',
                )}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <span className="text-lg mt-0.5">{def.icon}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{def.name}</h4>
                          {def.required && <Badge variant="info">Required</Badge>}
                          <Badge variant={layer.enabled ? 'success' : 'default'}>{layer.enabled ? 'Enabled' : 'Disabled'}</Badge>
                        </div>
                        <p className="text-sm text-zinc-500 mt-0.5">{def.description}</p>
                      </div>
                    </div>
                    <Switch checked={layer.enabled} onCheckedChange={() => toggleLayer(def.id)} disabled={def.required} />
                  </div>
                  {layer.enabled && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 ml-9">
                      {Object.entries(def.defaultOptions).map(([key, defaultValue]) => {
                        const value = layer.options[key] ?? defaultValue
                        if (typeof value === 'boolean') {
                          return (
                            <label key={key} className="flex items-center gap-2 text-sm text-zinc-300">
                              <input type="checkbox" checked={value}
                                onChange={e => updateOption(def.id, key, e.target.checked)}
                                className="rounded border-zinc-600 text-indigo-600 focus:ring-indigo-500" />
                              {key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}
                            </label>
                          )
                        }
                        if (typeof value === 'number') {
                          return (
                            <label key={key} className="flex items-center gap-2 text-sm text-zinc-300">
                              <span className="capitalize shrink-0">{key.replace(/([A-Z])/g, ' $1')}:</span>
                              <input type="number" value={value}
                                onChange={e => updateOption(def.id, key, Number(e.target.value))}
                                className="w-20 rounded border border-zinc-700 bg-zinc-800 px-2 py-1 text-xs" />
                            </label>
                          )
                        }
                        if (typeof value === 'string') {
                          return (
                            <label key={key} className="flex items-center gap-2 text-sm text-zinc-300">
                              <span className="capitalize shrink-0">{key.replace(/([A-Z])/g, ' $1')}:</span>
                              <input type="text" value={value}
                                onChange={e => updateOption(def.id, key, e.target.value)}
                                className="flex-1 rounded border border-zinc-700 bg-zinc-800 px-2 py-1 text-xs" />
                            </label>
                          )
                        }
                        return null
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
