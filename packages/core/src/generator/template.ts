import { type SiteConfig, type SiteType } from './types'

export const siteTypeDescriptions: Record<SiteType, string> = {
  'landing-page': 'Single-page marketing landing page with hero, features, pricing, FAQ, and footer sections',
  'multi-page': 'Multi-page marketing website with home, about, services, contact, and blog pages',
  'saas': 'Full SaaS application with dashboard, authentication, billing, and user management',
  'ecommerce': 'E-commerce store with product listings, cart, checkout, and order management',
  'blog': 'Blog with article listing, categories, tags, RSS feed, and search',
  'portfolio': 'Personal portfolio with projects, skills, experience, and contact form',
  'webapp': 'Full-stack web application with CRUD operations and real-time features',
  'documentation': 'Documentation site with sidebar navigation, search, and code examples',
}

export const defaultPageGuides: Record<SiteType, string[]> = {
  'landing-page': ['home', 'features', 'pricing', 'faq', 'contact'],
  'multi-page': ['home', 'about', 'services', 'blog', 'contact'],
  'saas': ['dashboard', 'settings', 'team', 'billing', 'integrations'],
  'ecommerce': ['products', 'product/[id]', 'cart', 'checkout', 'orders'],
  'blog': ['/', '/blog', '/blog/[slug]', '/categories', '/about'],
  'portfolio': ['/', '/projects', '/project/[id]', '/about', '/contact'],
  'webapp': ['/', '/dashboard', '/settings', '/profile', '/[id]'],
  'documentation': ['/', '/getting-started', '/guides', '/api', '/changelog'],
}

export function getSiteDefaults(type: SiteType): Partial<SiteConfig> {
  return {
    type,
    pages: [...defaultPageGuides[type]],
    framework: 'nextjs',
    styling: 'tailwind',
    colorScheme: 'blue',
    typography: 'inter',
    language: 'typescript',
    locale: 'en',
    seo: true,
    analytics: false,
    forms: type === 'landing-page' || type === 'multi-page' || type === 'portfolio',
    blog: type === 'blog' || type === 'multi-page',
    darkMode: true,
    multilingual: false,
    description: siteTypeDescriptions[type],
  }
}
