import { type LayerId, type LayerConfig, type LayerStatus } from './types'
import { layerDefinitions, getLayerDefinition } from './definitions'
import { type SiteConfig } from '../generator/types'

export interface ApplyLayersInput {
  layers: LayerConfig[]
  siteConfig: SiteConfig
}

export interface ApplyLayersOutput {
  layers: LayerConfig[]
  generatedFiles: string[]
  prompts: string[]
}

export function applyLayers(input: ApplyLayersInput): ApplyLayersOutput {
  const generatedFiles: string[] = []
  const prompts: string[] = []

  for (const layer of input.layers) {
    const def = getLayerDefinition(layer.id)
    if (!def || !layer.enabled) continue

    const rendered = renderPrompt(
      def.promptTemplate,
      { ...def.defaultOptions, ...layer.options },
    )

    prompts.push(`--- ${def.name} ---\n${rendered}`)

    const files = generateLayerFiles(layer.id, input.siteConfig, layer.options)
    generatedFiles.push(...files)
  }

  return { layers: input.layers, generatedFiles, prompts }
}

function renderPrompt(template: string, options: Record<string, any>): string {
  let result = template
  for (const [key, value] of Object.entries(options)) {
    const conditionalPattern = new RegExp(`\\{${key}:([^}]+)\\|([^}]*)\\}`, 'g')
    result = result.replace(conditionalPattern, (_, ifTrue: string, ifFalse: string) => {
      return value ? ifTrue : ifFalse
    })
    const simplePattern = new RegExp(`\\{${key}\\}`, 'g')
    result = result.replace(simplePattern, String(value ?? ''))
  }
  result = result.replace(/\{[^}]+\}/g, '')
  return result
}

function generateLayerFiles(
  layerId: LayerId,
  siteConfig: SiteConfig,
  options: Record<string, any>,
): string[] {
  const files: string[] = []
  const prefix = `src/layers/${layerId}`

  switch (layerId) {
    case 'frontend-foundations':
      files.push(
        `${prefix}/layout.tsx`,
        `${prefix}/page.tsx`,
        `${prefix}/globals.css`,
        `${prefix}/tailwind.config.ts`,
      )
      break
    case 'apis-backend':
      files.push(
        `${prefix}/api/route.ts`,
        `${prefix}/api/[...slug]/route.ts`,
        `${prefix}/middleware.ts`,
      )
      break
    case 'database-storage':
      files.push(
        `${prefix}/schema.prisma`,
        `${prefix}/seed.ts`,
        `${prefix}/migrations/README.md`,
      )
      break
    case 'auth-permissions':
      files.push(
        `${prefix}/auth.ts`,
        `${prefix}/middleware.ts`,
        `${prefix}/roles.ts`,
        `${prefix}/components/AuthGuard.tsx`,
      )
      break
    case 'hosting-deployment':
      files.push(
        `${prefix}/vercel.json`,
        `${prefix}/Dockerfile`,
        `${prefix}/docker-compose.yml`,
        `${prefix}/.env.example`,
      )
      break
    case 'cloud-compute':
      if (options.functions) files.push(`${prefix}/functions/hello.ts`)
      if (options.containerized) files.push(`${prefix}/Dockerfile.cloud`)
      break
    case 'cicd-version-control':
      files.push(
        `${prefix}/.github/workflows/ci.yml`,
        `${prefix}/.github/workflows/deploy.yml`,
        `${prefix}/vitest.config.ts`,
        `${prefix}/.eslintrc.json`,
      )
      break
    case 'security-rls':
      files.push(
        `${prefix}/middleware.ts`,
        `${prefix}/security-headers.ts`,
        `${prefix}/rls-policies.sql`,
      )
      break
    case 'rate-limiting':
      files.push(
        `${prefix}/rate-limit.ts`,
        `${prefix}/middleware.ts`,
      )
      break
    case 'caching-cdn':
      files.push(
        `${prefix}/cache.ts`,
        `${prefix}/next.config.ts`,
      )
      break
    case 'load-balancing-scaling':
      files.push(
        `${prefix}/health.ts`,
        `${prefix}/scaling-config.ts`,
      )
      break
    case 'error-tracking-logs':
      files.push(
        `${prefix}/logger.ts`,
        `${prefix}/error-boundary.tsx`,
        `${prefix}/monitoring.ts`,
      )
      break
    case 'availability-recovery':
      files.push(
        `${prefix}/backup.ts`,
        `${prefix}/recovery.ts`,
        `${prefix}/uptime-check.ts`,
      )
      break
  }

  return files
}

export function createDefaultLayerConfigs(): LayerConfig[] {
  return layerDefinitions.map(def => ({
    id: def.id,
    name: def.name,
    description: def.description,
    icon: def.icon,
    status: def.required ? 'configured' as LayerStatus : 'skipped' as LayerStatus,
    enabled: def.required,
    options: { ...def.defaultOptions },
  }))
}
