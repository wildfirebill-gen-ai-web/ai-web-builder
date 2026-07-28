import { type SiteType } from '../generator/types'

export interface StarterTemplate {
  id: string
  name: string
  description: string
  type: SiteType
  thumbnail?: string
  features: string[]
  pages: string[]
  colorScheme: string
  typography: string
}

export const starterTemplates: StarterTemplate[] = [
  {
    id: 'saas-landing',
    name: 'SaaS Landing Page',
    description: 'Modern SaaS landing page with hero, features, pricing, testimonials, and FAQ',
    type: 'landing-page',
    features: ['hero section', 'feature grid', 'pricing table', 'testimonials', 'FAQ', 'contact form'],
    pages: ['home', 'features', 'pricing', 'faq'],
    colorScheme: 'indigo',
    typography: 'inter',
  },
  {
    id: 'saas-dashboard',
    name: 'SaaS Dashboard',
    description: 'Full SaaS dashboard with analytics, user management, billing, and settings',
    type: 'saas',
    features: ['analytics dashboard', 'user management', 'billing portal', 'API keys', 'team management'],
    pages: ['dashboard', 'analytics', 'users', 'billing', 'settings', 'team'],
    colorScheme: 'emerald',
    typography: 'inter',
  },
  {
    id: 'ecommerce-store',
    name: 'E-Commerce Store',
    description: 'Online store with product catalog, cart, checkout, and order tracking',
    type: 'ecommerce',
    features: ['product catalog', 'shopping cart', 'checkout', 'order tracking', 'search', 'categories'],
    pages: ['products', 'product/[id]', 'cart', 'checkout', 'orders', 'categories/[slug]'],
    colorScheme: 'amber',
    typography: 'inter',
  },
  {
    id: 'portfolio-creative',
    name: 'Creative Portfolio',
    description: 'Portfolio for designers, photographers, and creative professionals',
    type: 'portfolio',
    features: ['project gallery', 'lightbox', 'about', 'contact form', 'testimonials'],
    pages: ['home', 'projects', 'project/[id]', 'about', 'contact'],
    colorScheme: 'rose',
    typography: 'plus-jakarta-sans',
  },
  {
    id: 'blog-magazine',
    name: 'Blog / Magazine',
    description: 'Content-focused blog with categories, search, and newsletter',
    type: 'blog',
    features: ['blog posts', 'categories', 'tags', 'search', 'newsletter signup', 'RSS feed'],
    pages: ['blog', 'blog/[slug]', 'categories/[slug]', 'tags/[slug]', 'about'],
    colorScheme: 'slate',
    typography: 'literata',
  },
  {
    id: 'webapp-crud',
    name: 'Web App (CRUD)',
    description: 'Full-stack web application with data management and real-time updates',
    type: 'webapp',
    features: ['data table', 'CRUD operations', 'search/filter', 'real-time updates', 'export'],
    pages: ['dashboard', 'items', 'items/[id]', 'items/new', 'settings'],
    colorScheme: 'cyan',
    typography: 'inter',
  },
  {
    id: 'documentation-site',
    name: 'Documentation Site',
    description: 'Technical documentation with sidebar, search, and code examples',
    type: 'documentation',
    features: ['sidebar navigation', 'full-text search', 'code blocks', 'version selector', 'edit on GitHub'],
    pages: ['getting-started', 'guides', 'api-reference', 'examples', 'changelog'],
    colorScheme: 'blue',
    typography: 'inter',
  },
  {
    id: 'ai-landing',
    name: 'AI Product Landing',
    description: 'Landing page optimized for AI/ML products with demo showcase',
    type: 'landing-page',
    features: ['hero with demo', 'capabilities grid', 'integration list', 'pricing', 'waitlist'],
    pages: ['home', 'capabilities', 'integrations', 'pricing'],
    colorScheme: 'violet',
    typography: 'satoshi',
  },
  {
    id: 'agency-website',
    name: 'Agency Website',
    description: 'Multi-page agency site with services, case studies, and team',
    type: 'multi-page',
    features: ['services', 'case studies', 'team', 'process', 'contact'],
    pages: ['home', 'services', 'case-studies', 'case-studies/[slug]', 'team', 'contact'],
    colorScheme: 'orange',
    typography: 'inter',
  },
  {
    id: 'local-business',
    name: 'Local Business',
    description: 'Small business site with location, hours, reviews, and contact',
    type: 'multi-page',
    features: ['business info', 'Google Maps', 'reviews', 'services', 'booking'],
    pages: ['home', 'services', 'reviews', 'gallery', 'contact'],
    colorScheme: 'green',
    typography: 'inter',
  },
]

export function getTemplate(id: string): StarterTemplate | undefined {
  return starterTemplates.find(t => t.id === id)
}

export function getTemplatesByType(type: SiteType): StarterTemplate[] {
  return starterTemplates.filter(t => t.type === type)
}
