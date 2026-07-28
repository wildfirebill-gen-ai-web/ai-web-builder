import { type SiteConfig } from './types'
import { type LayerConfig } from '../layers/types'
import { getLayerDefinition } from '../layers/definitions'

export function buildSystemPrompt(): string {
  return `You are an expert full-stack web development AI. You generate complete, production-ready websites.

RULES:
- Generate REAL, working code — no placeholders, no pseudocode
- Every file must be complete and functional
- Use modern best practices, TypeScript, and proper error handling
- Generate ALL files needed for the project to run
- Use Tailwind CSS for styling
- Make everything responsive and accessible (WCAG 2.2)
- Include proper types, validation, and error states
- Production-grade code only`
}

export function buildGenerationPrompt(
  siteConfig: SiteConfig,
  layers: LayerConfig[],
  userPrompt: string,
  clonedContext?: string,
): string {
  const sections: string[] = []

  sections.push(`# Website Generation Request

## User Prompt
${userPrompt}

## Project Info
- Name: ${siteConfig.name}
- Description: ${siteConfig.description}
- Type: ${siteConfig.type}
- Framework: ${siteConfig.framework} with ${siteConfig.styling}
- Language: ${siteConfig.language} (${siteConfig.locale})
- Color Scheme: ${siteConfig.colorScheme}
- Typography: ${siteConfig.typography}
`)

  if (siteConfig.darkMode) sections.push('- Dark mode: Yes')
  if (siteConfig.seo) sections.push('- SEO: Yes')
  if (siteConfig.analytics) sections.push('- Analytics: Yes')
  if (siteConfig.multilingual) sections.push('- Multilingual: Yes')
  if (siteConfig.blog) sections.push('- Blog: Yes')
  if (siteConfig.forms) sections.push('- Contact forms: Yes')

  sections.push(`
## Pages
${siteConfig.pages.map(p => `- ${p}`).join('\n')}

## Features
${siteConfig.features.map(f => `- ${f}`).join('\n')}
`)

  sections.push(`## Architecture Layers
${layers
  .filter(l => l.enabled)
  .map(l => {
    const def = getLayerDefinition(l.id)
    return `### ${def?.name || l.id}
${def?.description || ''}
${Object.entries(l.options)
  .filter(([_, v]) => v)
  .map(([k, v]) => `- ${k}: ${v}`)
  .join('\n')}`
  })
  .join('\n\n')}
`)

  if (clonedContext) {
    sections.push(`## Cloned Reference Website
The user wants to replicate the look and feel of this existing site.
Study its structure, headings, content, and layout carefully:

${clonedContext}

IMPORTANT: Do NOT copy the exact content word-for-word. Use it as inspiration for structure, layout, and design patterns. Generate original content tailored to the user's project.`)
  }

  sections.push(`## Output Format
Generate the complete project as individual files.

For each file, use:
\`\`\`file:<path>
<file content>
\`\`\`

Start with the project structure, then generate every file needed.`)

  return sections.join('\n')
}
