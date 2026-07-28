import { type LayerDefinition } from './types'

export const layerDefinitions: LayerDefinition[] = [
  {
    id: 'frontend-foundations',
    name: 'Frontend Foundations',
    description: 'UI framework, styling, components, responsive design, and accessibility',
    icon: '🎨',
    category: 'presentation',
    order: 0,
    required: true,
    defaultOptions: {
      framework: 'react',
      variant: 'nextjs',
      styling: 'tailwind',
      components: 'shadcn',
      responsive: true,
      accessibility: true,
      animations: 'motion',
      icont: 'lucide',
    },
    promptTemplate: `Build the frontend using {framework} ({variant}) with {styling} for styling.
Use {components} for UI components. Ensure responsive design and WCAG 2.2 accessibility.
Use {animations} for animations and {icont} for icons.`,
  },
  {
    id: 'apis-backend',
    name: 'APIs & Backend Logic',
    description: 'API routes, server actions, backend business logic, and webhooks',
    icon: '🔌',
    category: 'backend',
    order: 1,
    required: true,
    defaultOptions: {
      type: 'rest',
      orm: 'prisma',
      validation: 'zod',
      authentication: false,
      realtime: false,
      fileUpload: false,
      webhooks: false,
      rateLimiting: false,
    },
    promptTemplate: `Build {type} APIs. Use {orm} for database access and {validation} for input validation.
{authentication:Implement authentication middleware|Skip auth middleware}
{realtime:Add WebSocket/SSE for realtime updates|}
{fileUpload:Add file upload endpoints|}
{webhooks:Add webhook receiver endpoints|}
{rateLimiting:Add rate limiting to API routes|}`,
  },
  {
    id: 'database-storage',
    name: 'Database & Storage',
    description: 'Database schema, migrations, file storage, and data seeding',
    icon: '🗄️',
    category: 'data',
    order: 2,
    required: true,
    defaultOptions: {
      database: 'postgresql',
      orm: 'prisma',
      fileStorage: 'local',
      cache: 'memory',
      backups: false,
      migrations: true,
      seeding: true,
    },
    promptTemplate: `Set up {database} with {orm} for schema management.
Use {fileStorage} for file uploads and {cache} for caching.
{migrations:Include migration scripts|}
{seeding:Include seed data scripts|}
{backups:Add backup configuration|}`,
  },
  {
    id: 'auth-permissions',
    name: 'Auth & Permissions',
    description: 'Authentication, authorization, RBAC, and session management',
    icon: '🔐',
    category: 'security',
    order: 3,
    required: true,
    defaultOptions: {
      provider: 'authjs',
      social: true,
      rbac: true,
      mfa: false,
      session: 'jwt',
      passwordless: false,
      sso: false,
    },
    promptTemplate: `Implement authentication using {provider} with {session} sessions.
{social:Include social login (Google, GitHub)|}
{rbac:Add RBAC with roles and permissions|}
{mfa:Add multi-factor authentication|}
{passwordless:Add passwordless login (magic links)|}
{sso:Add SSO support|}`,
  },
  {
    id: 'hosting-deployment',
    name: 'Hosting & Deployment',
    description: 'Hosting configuration, deployment scripts, and domain setup',
    icon: '🚀',
    category: 'ops',
    order: 4,
    required: true,
    defaultOptions: {
      platform: 'vercel',
      domain: null,
      region: 'auto',
      autoDeploy: true,
      previewDeploy: true,
      environmentVariables: true,
      dockerfile: false,
    },
    promptTemplate: `Configure deployment for {platform} in region {region}.
{autoDeploy:Set up auto-deploy from main branch|}
{previewDeploy:Set up preview deployments for PRs|}
{environmentVariables:Configure environment variable management|}
{dockerfile:Generate Dockerfile for containerized deployment|}`,
  },
  {
    id: 'cloud-compute',
    name: 'Cloud & Compute',
    description: 'Cloud infrastructure, serverless functions, and compute resources',
    icon: '☁️',
    category: 'ops',
    order: 5,
    required: false,
    defaultOptions: {
      provider: 'aws',
      functions: false,
      containerized: false,
      region: 'us-east-1',
      gpu: false,
      edge: false,
    },
    promptTemplate: `Set up cloud infrastructure on {provider} in {region}.
{functions:Add serverless function configuration|}
{containerized:Containerize with Docker|}
{gpu:Add GPU compute configuration|}
{edge:Add edge compute configuration|}`,
  },
  {
    id: 'cicd-version-control',
    name: 'CI/CD & Version Control',
    description: 'CI/CD pipelines, automated testing, and version control workflows',
    icon: '🔄',
    category: 'ops',
    order: 6,
    required: false,
    defaultOptions: {
      platform: 'github',
      ci: true,
      test: true,
      lint: true,
      typeCheck: true,
      autoRelease: false,
      semanticVersion: false,
    },
    promptTemplate: `Set up CI/CD with {platform}.
{ci:Configure CI pipeline|}
{test:Add test runner configuration (vitest)|}
{lint:Add linter configuration (ESLint)|}
{typeCheck:Add type checking|}
{autoRelease:Add automated release workflow|}
{semanticVersion:Add semantic versioning|}`,
  },
  {
    id: 'security-rls',
    name: 'Security & Row-Level Security',
    description: 'Security headers, CSP, RLS policies, and vulnerability prevention',
    icon: '🛡️',
    category: 'security',
    order: 7,
    required: true,
    defaultOptions: {
      helmet: true,
      cors: true,
      rls: false,
      csp: true,
      csrf: true,
      xss: true,
      sqlInjection: true,
      helmetConfig: {},
      corsOrigins: ['*'],
    },
    promptTemplate: `Apply security hardening:
{helmet:Add Helmet middleware with strict headers|}
{cors:Configure CORS for origins: {corsOrigins}|}
{rls:Add row-level security policies|}
{csp:Add Content Security Policy headers|}
{csrf:Add CSRF protection|}
{xss:Add XSS protection headers|}`,
  },
  {
    id: 'rate-limiting',
    name: 'Rate Limiting',
    description: 'API rate limiting, throttling, and abuse prevention',
    icon: '⏱️',
    category: 'security',
    order: 8,
    required: false,
    defaultOptions: {
      enabled: true,
      maxRequests: 100,
      windowMs: 60000,
      strategy: 'memory',
      byEndpoint: true,
      byUser: false,
      ipBased: true,
    },
    promptTemplate: `Implement rate limiting with {strategy} storage.
Max {maxRequests} requests per {windowMs}ms window.
{byEndpoint:Apply per-endpoint limits|}
{byUser:Apply per-user limits|}
{ipBased:Apply per-IP limits|}`,
  },
  {
    id: 'caching-cdn',
    name: 'Caching & CDN',
    description: 'Caching strategy, CDN configuration, and cache invalidation',
    icon: '⚡',
    category: 'performance',
    order: 9,
    required: false,
    defaultOptions: {
      cdn: 'cloudflare',
      cacheStrategy: 'stale-while-revalidate',
      swr: 60,
      maxAge: 3600,
      imageOptimization: true,
      compression: true,
      redis: false,
    },
    promptTemplate: `Configure caching with {cdn} CDN.
Strategy: {cacheStrategy} with SWR={swr}s, max-age={maxAge}s.
{imageOptimization:Enable image optimization|}
{compression:Enable Brotli compression|}
{redis:Add Redis for distributed caching|}`,
  },
  {
    id: 'load-balancing-scaling',
    name: 'Load Balancing & Scaling',
    description: 'Load balancing, auto-scaling, and horizontal scaling configuration',
    icon: '⚖️',
    category: 'performance',
    order: 10,
    required: false,
    defaultOptions: {
      strategy: 'round-robin',
      autoScaling: false,
      minInstances: 1,
      maxInstances: 10,
      healthChecks: true,
      stickySessions: false,
    },
    promptTemplate: `Configure load balancing with {strategy} strategy.
{autoScaling:Set up auto-scaling ({minInstances}–{maxInstances} instances)|}
{healthChecks:Add health check endpoints|}
{stickySessions:Enable sticky sessions|}`,
  },
  {
    id: 'error-tracking-logs',
    name: 'Error Tracking & Logs',
    description: 'Error monitoring, structured logging, and observability',
    icon: '📊',
    category: 'observability',
    order: 11,
    required: false,
    defaultOptions: {
      logging: 'pino',
      logLevel: 'info',
      errorTracking: 'sentry',
      metrics: false,
      structuredLogs: true,
      logRetention: '7d',
    },
    promptTemplate: `Set up logging with {logging} at level {logLevel}.
{errorTracking:Add {errorTracking} for error tracking|}
{metrics:Add metrics collection|}
{structuredLogs:Use structured JSON logging|}
Log retention: {logRetention}`,
  },
  {
    id: 'availability-recovery',
    name: 'Availability & Recovery',
    description: 'High availability, disaster recovery, and backup strategies',
    icon: '🔄',
    category: 'ops',
    order: 12,
    required: false,
    defaultOptions: {
      backups: true,
      backupSchedule: 'daily',
      retention: '30d',
      multiRegion: false,
      drPlan: false,
      monitoring: true,
      uptimeChecks: true,
      sla: '99.9',
    },
    promptTemplate: `Configure availability with SLA target {sla}%.
{backups:Schedule {backupSchedule} backups with {retention} retention|}
{multiRegion:Set up multi-region failover|}
{drPlan:Create disaster recovery plan|}
{monitoring:Add uptime monitoring|}
{uptimeChecks:Add external uptime checks|}`,
  },
]

export function getLayerDefinition(id: string): LayerDefinition | undefined {
  return layerDefinitions.find(l => l.id === id)
}

export function getLayerDefinitionsByCategory(): Record<string, LayerDefinition[]> {
  const grouped: Record<string, LayerDefinition[]> = {}
  for (const def of layerDefinitions) {
    if (!grouped[def.category]) grouped[def.category] = []
    grouped[def.category].push(def)
  }
  return grouped
}
