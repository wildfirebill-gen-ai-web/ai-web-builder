'use client'

import { useState, useEffect } from 'react'
import { BuilderSidebar } from '@/components/layout/sidebar'
import { BuilderHeader } from '@/components/layout/header'
import { PromptInput } from '@/components/builder/prompt-input'
import { SiteConfigForm } from '@/components/builder/site-config'
import { LayerConfigPanel } from '@/components/builder/layer-config'
import { PreviewPane } from '@/components/preview/preview-pane'
import { FileExplorer } from '@/components/builder/file-explorer'
import { SettingsPanel } from '@/components/settings/settings-panel'
import { CloneForm } from '@/components/clone/clone-form'
import {
  globalProviderRegistry, OllamaProvider, OpenAIProvider, AnthropicProvider,
  GeminiProvider, OpenRouterProvider, GroqProvider, DeepSeekProvider,
  MistralProvider, TogetherProvider, LlamaCppProvider,
  generateSite, starterTemplates, createDefaultLayerConfigs,
  type GenerationResult, type SiteConfig, type LayerConfig, type CloneResult,
} from '@awb/core'

type View = 'prompt' | 'config' | 'layers' | 'preview' | 'templates' | 'clone'

export default function Home() {
  const [view, setView] = useState<View>('templates')
  const [providerId, setProviderId] = useState('ollama')
  const [model, setModel] = useState('')
  const [prompt, setPrompt] = useState('')
  const [generating, setGenerating] = useState(false)
  const [result, setResult] = useState<GenerationResult | null>(null)
  const [error, setError] = useState('')
  const [cloneResult, setCloneResult] = useState<CloneResult | null>(null)
  const [clonedContext, setClonedContext] = useState('')
  const [siteConfig, setSiteConfig] = useState<SiteConfig>({
    name: 'My Website', description: '', type: 'landing-page',
    framework: 'nextjs', styling: 'tailwind',
    pages: ['home', 'features', 'pricing', 'faq', 'contact'],
    features: [], colorScheme: 'indigo', typography: 'inter',
    language: 'typescript', locale: 'en',
    seo: true, analytics: false, forms: true, blog: false, darkMode: true, multilingual: false,
  })
  const [layers, setLayers] = useState<LayerConfig[]>(createDefaultLayerConfigs())
  const [selectedFile, setSelectedFile] = useState<{ path: string; content: string } | null>(null)
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    globalProviderRegistry.register(new OllamaProvider())
    globalProviderRegistry.register(new LlamaCppProvider())
    globalProviderRegistry.register(new OpenAIProvider())
    globalProviderRegistry.register(new AnthropicProvider())
    globalProviderRegistry.register(new GeminiProvider())
    globalProviderRegistry.register(new OpenRouterProvider())
    globalProviderRegistry.register(new GroqProvider())
    globalProviderRegistry.register(new DeepSeekProvider())
    globalProviderRegistry.register(new MistralProvider())
    globalProviderRegistry.register(new TogetherProvider())
  }, [])

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    setGenerating(true); setError(''); setResult(null)
    try {
      const res = await generateSite({ prompt, providerId, model: model || undefined, siteConfig, layers, temperature: 0.7, clonedContext: clonedContext || undefined })
      setResult(res); setView('preview')
    } catch (err: any) { setError(err.message) }
    finally { setGenerating(false) }
  }

  const handleSelectTemplate = (id: string) => {
    const tpl = starterTemplates.find(t => t.id === id)
    if (!tpl) return
    setSiteConfig(prev => ({ ...prev, name: tpl.name, description: tpl.description, type: tpl.type, pages: tpl.pages, features: tpl.features, colorScheme: tpl.colorScheme, typography: tpl.typography }))
    setView('prompt')
  }

  const handleCloneResult = (result: CloneResult, context: string) => {
    setCloneResult(result)
    setClonedContext(context)
  }

  const handleSwitchToBuild = (clonePrompt: string) => {
    setPrompt(clonePrompt)
    setView('prompt')
  }

  const sidebarNav: { id: View; label: string; icon: string }[] = [
    { id: 'templates', label: 'Templates', icon: 'layout' },
    { id: 'prompt', label: 'Build', icon: 'code' },
    { id: 'config', label: 'Config', icon: 'settings' },
    { id: 'layers', label: 'Layers', icon: 'layers' },
    { id: 'clone', label: 'Clone', icon: 'copy' },
    { id: 'preview', label: 'Preview', icon: 'eye' },
  ]

  return (
    <div className="flex h-screen overflow-hidden">
      <BuilderSidebar nav={sidebarNav} activeView={view} onViewChange={setView} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <BuilderHeader providerId={providerId} onProviderChange={setProviderId} model={model} onModelChange={setModel} onSettingsClick={() => setShowSettings(!showSettings)} />
        <main className="flex-1 overflow-auto p-6">
          {view === 'templates' && (
            <div className="max-w-6xl mx-auto">
              <h1 className="text-3xl font-bold mb-2">AI Web Builder</h1>
              <p className="text-zinc-400 mb-8">Choose a template or go straight to the builder.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {starterTemplates.map(tpl => (
                  <button key={tpl.id} onClick={() => handleSelectTemplate(tpl.id)}
                    className="text-left p-5 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:border-indigo-500/50 hover:bg-zinc-800/50 transition-all group">
                    <h3 className="font-semibold text-lg group-hover:text-indigo-400">{tpl.name}</h3>
                    <p className="text-sm text-zinc-400 mt-1 line-clamp-2">{tpl.description}</p>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300">{tpl.type}</span>
                      {tpl.features.slice(0, 3).map(f => <span key={f} className="text-xs px-2 py-0.5 rounded-full bg-zinc-800/50 text-zinc-400">{f}</span>)}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
          {view === 'clone' && (
            <div className="max-w-4xl mx-auto">
              <CloneForm onCloneResult={handleCloneResult} onSwitchToBuild={handleSwitchToBuild} />
            </div>
          )}
          {view === 'prompt' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div><h2 className="text-2xl font-bold mb-1">Build Your Website</h2><p className="text-zinc-400">Describe what you want to build.</p></div>
              <PromptInput value={prompt} onChange={setPrompt} siteConfig={siteConfig} loading={generating} onSubmit={handleGenerate} />
              {error && <div className="p-4 rounded-lg bg-red-900/20 border border-red-800 text-red-400 text-sm">{error}</div>}
              {result && <div className="p-4 rounded-lg bg-emerald-900/20 border border-emerald-800"><p className="text-emerald-400 font-medium">Generated!</p><p className="text-sm text-emerald-300/60 mt-1">{result.files.length} files in {(result.duration / 1000).toFixed(1)}s</p></div>}
            </div>
          )}
          {view === 'config' && (
            <div className="max-w-4xl mx-auto"><h2 className="text-2xl font-bold mb-4">Site Configuration</h2><SiteConfigForm config={siteConfig} onChange={setSiteConfig} /></div>
          )}
          {view === 'layers' && (
            <div className="max-w-5xl mx-auto"><h2 className="text-2xl font-bold mb-4">13 Architecture Layers</h2><p className="text-zinc-400 mb-6">Configure each layer of your generated website.</p><LayerConfigPanel layers={layers} onChange={setLayers} /></div>
          )}
          {view === 'preview' && result && (
            <div className="flex h-full gap-4">
              <div className="flex-1"><PreviewPane files={result.files} /></div>
              <div className="w-72 shrink-0"><FileExplorer files={result.files} selectedFile={selectedFile?.path} onSelect={f => setSelectedFile(f)} /></div>
            </div>
          )}
        </main>
      </div>
      {showSettings && <SettingsPanel onClose={() => setShowSettings(false)} />}
    </div>
  )
}
