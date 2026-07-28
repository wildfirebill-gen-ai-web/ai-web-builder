import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI Web Builder — Open-Source AI Website Generator | Desktop + Web',
  description: 'Open-source AI-powered website builder. Generate production-ready websites from natural language with local-first AI (Ollama, llama.cpp), 13-layer architecture, 10+ AI providers, website cloning, SVG generation, desktop app & Docker deployment.',
  keywords: ['AI website builder', 'website generator', 'open source', 'Ollama', 'Next.js', 'Electron', 'local AI', 'LLM', 'website cloning', 'ComfyUI', 'desktop app', 'Docker', 'Unraid', 'TypeScript'],
  openGraph: {
    title: 'AI Web Builder — Open-Source AI Website Generator',
    description: 'Generate production-ready websites from natural language prompts. Local-first AI, 13-layer architecture, 10+ providers, desktop + web + Docker.',
    url: 'https://github.com/wildfirebill-gen-ai-web/ai-web-builder',
    siteName: 'AI Web Builder',
    images: [{ url: '/og-image.svg', width: 1280, height: 640 }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Web Builder — Open-Source AI Website Generator',
    description: 'Generate production-ready websites from natural language. Local-first AI, 13-layer architecture, 10+ providers.',
    images: ['/og-image.svg'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  )
}
