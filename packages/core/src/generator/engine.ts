import { nanoid } from 'nanoid'
import { type GenerationRequest, type GenerationResult, type GeneratedFile } from './types'
import { buildSystemPrompt, buildGenerationPrompt } from './prompt'
import { applyLayers } from '../layers/applier'
import { globalProviderRegistry } from '../providers/registry'

function parseGeneratedFiles(text: string): GeneratedFile[] {
  const files: GeneratedFile[] = []
  const fileRegex = /```file:(.+?)\n([\s\S]*?)```/g
  let match: RegExpExecArray | null

  while ((match = fileRegex.exec(text)) !== null) {
    const path = match[1].trim()
    const content = match[2].trim()
    const ext = path.split('.').pop() || ''
    const languageMap: Record<string, string> = {
      ts: 'typescript', tsx: 'typescript', js: 'javascript', jsx: 'javascript',
      css: 'css', html: 'html', json: 'json', md: 'markdown',
      prisma: 'prisma', sql: 'sql', yml: 'yaml', yaml: 'yaml',
      config: 'json', toml: 'toml', dockerfile: 'dockerfile',
    }
    files.push({
      path,
      content,
      language: languageMap[ext] || ext,
    })
  }

  return files
}

export async function generateSite(request: GenerationRequest): Promise<GenerationResult> {
  const startTime = Date.now()
  const provider = globalProviderRegistry.get(request.providerId)
  if (!provider) throw new Error(`Provider "${request.providerId}" not found`)

  const layerResult = applyLayers({
    layers: request.layers,
    siteConfig: request.siteConfig,
  })

  const systemPrompt = buildSystemPrompt()
  const userPrompt = buildGenerationPrompt(
    request.siteConfig,
    request.layers,
    request.prompt,
    request.clonedContext,
  )

  const response = await provider.chat([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ], {
    model: request.model,
    temperature: request.temperature,
    maxTokens: request.maxTokens,
  })

  const files = parseGeneratedFiles(response.content)

  return {
    id: nanoid(12),
    siteConfig: request.siteConfig,
    layers: request.layers,
    files,
    stdout: response.content,
    model: response.model,
    provider: request.providerId,
    duration: Date.now() - startTime,
    tokenUsage: response.usage,
  }
}

export async function* streamGenerateSite(
  request: GenerationRequest,
): AsyncGenerator<{ type: 'token' | 'file' | 'done' | 'error'; data: any }> {
  const startTime = Date.now()
  const provider = globalProviderRegistry.get(request.providerId)
  if (!provider) {
    yield { type: 'error', data: `Provider "${request.providerId}" not found` }
    return
  }

  const layerResult = applyLayers({
    layers: request.layers,
    siteConfig: request.siteConfig,
  })

  yield { type: 'done', data: { layersConfigured: layerResult.layers.length, prompts: layerResult.prompts } }

  const systemPrompt = buildSystemPrompt()
  const userPrompt = buildGenerationPrompt(
    request.siteConfig,
    request.layers,
    request.prompt,
    request.clonedContext,
  )

  let fullText = ''
  try {
    const stream = provider.streamChat([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ], {
      model: request.model,
      temperature: request.temperature,
      maxTokens: request.maxTokens,
    })

    for await (const token of stream) {
      fullText += token
      yield { type: 'token', data: token }
    }

    const files = parseGeneratedFiles(fullText)
    yield { type: 'done', data: { files, duration: Date.now() - startTime } }
  } catch (err: any) {
    yield { type: 'error', data: err.message }
  }
}
