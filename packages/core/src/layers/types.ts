import { z } from 'zod'

export const LayerId = z.enum([
  'frontend-foundations',
  'apis-backend',
  'database-storage',
  'auth-permissions',
  'hosting-deployment',
  'cloud-compute',
  'cicd-version-control',
  'security-rls',
  'rate-limiting',
  'caching-cdn',
  'load-balancing-scaling',
  'error-tracking-logs',
  'availability-recovery',
])

export type LayerId = z.infer<typeof LayerId>

export const LayerStatus = z.enum(['configured', 'skipped', 'error'])
export type LayerStatus = z.infer<typeof LayerStatus>

export interface LayerConfig {
  id: LayerId
  name: string
  description: string
  icon: string
  status: LayerStatus
  enabled: boolean
  options: Record<string, any>
  generated?: {
    files: string[]
    code: string
  }
}

export interface LayerDefinition {
  id: LayerId
  name: string
  description: string
  icon: string
  category: string
  order: number
  required: boolean
  defaultOptions: Record<string, any>
  promptTemplate: string
}

export const ALL_LAYER_IDS: LayerId[] = [
  'frontend-foundations',
  'apis-backend',
  'database-storage',
  'auth-permissions',
  'hosting-deployment',
  'cloud-compute',
  'cicd-version-control',
  'security-rls',
  'rate-limiting',
  'caching-cdn',
  'load-balancing-scaling',
  'error-tracking-logs',
  'availability-recovery',
]
