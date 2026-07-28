export type SvgStyle = 'gradient' | 'geometric' | 'dots' | 'waves' | 'grid' | 'crosshatch' | 'abstract' | 'hero'

export interface SvgOptions {
  width: number
  height: number
  primaryColor?: string
  secondaryColor?: string
  accentColor?: string
  backgroundColor?: string
  density?: number
}

const PALETTES: Record<string, string[]> = {
  indigo: ['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd'],
  emerald: ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0'],
  rose: ['#f43f5e', '#fb7185', '#fda4af', '#fecdd3'],
  amber: ['#f59e0b', '#fbbf24', '#fcd34d', '#fde68a'],
  cyan: ['#06b6d4', '#22d3ee', '#67e8f9', '#a5f3fc'],
  violet: ['#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe'],
  slate: ['#64748b', '#94a3b8', '#cbd5e1', '#e2e8f0'],
}

function getPalette(primary?: string): string[] {
  if (!primary) return PALETTES.indigo
  for (const [, colors] of Object.entries(PALETTES)) {
    if (colors[0] === primary) return colors
  }
  return PALETTES.indigo
}

function hexToRgb(hex: string): string {
  const c = hex.replace('#', '')
  return `${parseInt(c.substring(0, 2), 16)}, ${parseInt(c.substring(2, 4), 16)}, ${parseInt(c.substring(4, 6), 16)}`
}

function between(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomHex(): string {
  return `#${Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0')}`
}

export function generateSvgGradient(opts: SvgOptions): string {
  const [c1, c2, c3] = getPalette(opts.primaryColor)
  const angle = between(0, 360)
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${opts.width}" height="${opts.height}" viewBox="0 0 ${opts.width} ${opts.height}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${c1}" stop-opacity="0.15"/>
      <stop offset="50%" stop-color="${c2}" stop-opacity="0.1"/>
      <stop offset="100%" stop-color="${c3}" stop-opacity="0.05"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${c1}" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="${c1}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${opts.width}" height="${opts.height}" fill="${opts.backgroundColor || '#0f172a'}"/>
  <rect width="${opts.width}" height="${opts.height}" fill="url(#bg)"/>
  <ellipse cx="${opts.width * 0.2}" cy="${opts.height * 0.3}" rx="${opts.width * 0.4}" ry="${opts.height * 0.4}" fill="url(#glow)"/>
  <ellipse cx="${opts.width * 0.8}" cy="${opts.height * 0.7}" rx="${opts.width * 0.3}" ry="${opts.height * 0.3}" fill="url(#glow)" opacity="0.5"/>
</svg>`
}

export function generateSvgDots(opts: SvgOptions): string {
  const [c1, c2] = getPalette(opts.primaryColor)
  const density = opts.density || 20
  const spacing = Math.max(20, Math.min(opts.width, opts.height) / density)
  const r = Math.max(1, spacing / 8)
  let circles = ''
  for (let x = spacing / 2; x < opts.width; x += spacing) {
    for (let y = spacing / 2; y < opts.height; y += spacing) {
      const offset = Math.random() * spacing * 0.3
      const color = Math.random() > 0.5 ? c1 : c2
      circles += `  <circle cx="${x + offset}" cy="${y + offset}" r="${r}" fill="${color}" opacity="${0.15 + Math.random() * 0.25}"/>\n`
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${opts.width}" height="${opts.height}" viewBox="0 0 ${opts.width} ${opts.height}">
  <rect width="${opts.width}" height="${opts.height}" fill="${opts.backgroundColor || '#0f172a'}"/>
${circles}</svg>`
}

export function generateSvgGeometric(opts: SvgOptions): string {
  const [c1, c2, c3] = getPalette(opts.primaryColor)
  const density = opts.density || 15
  const count = density * 3
  let shapes = ''
  for (let i = 0; i < count; i++) {
    const x = between(0, opts.width)
    const y = between(0, opts.height)
    const size = between(20, 120)
    const color = [c1, c2, c3][i % 3]
    const opacity = (0.03 + Math.random() * 0.08).toFixed(2)
    const angle = between(0, 360)
    const shape = between(0, 2)
    if (shape === 0) {
      shapes += `  <circle cx="${x}" cy="${y}" r="${size / 2}" fill="${color}" opacity="${opacity}"/>\n`
    } else if (shape === 1) {
      shapes += `  <rect x="${x}" y="${y}" width="${size}" height="${size}" fill="${color}" opacity="${opacity}" transform="rotate(${angle} ${x + size / 2} ${y + size / 2})"/>\n`
    } else {
      const h = size * 0.866
      const points = `${x},${y - h / 2} ${x + size / 2},${y + h / 2} ${x - size / 2},${y + h / 2}`
      shapes += `  <polygon points="${points}" fill="${color}" opacity="${opacity}" transform="rotate(${angle} ${x} ${y})"/>\n`
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${opts.width}" height="${opts.height}" viewBox="0 0 ${opts.width} ${opts.height}">
  <rect width="${opts.width}" height="${opts.height}" fill="${opts.backgroundColor || '#0f172a'}"/>
${shapes}</svg>`
}

export function generateSvgWaves(opts: SvgOptions): string {
  const [c1, c2] = getPalette(opts.primaryColor)
  const count = opts.density || 4
  let paths = ''
  for (let i = 0; i < count; i++) {
    const y = (opts.height / (count + 1)) * (i + 1)
    const amp = between(10, 40)
    const freq = between(2, 6)
    const color = i % 2 === 0 ? c1 : c2
    const opacity = (0.08 + (i / count) * 0.12).toFixed(2)
    let d = `M 0 ${y}`
    const segments = Math.max(20, Math.floor(opts.width / 50))
    for (let s = 0; s <= segments; s++) {
      const x = (opts.width / segments) * s
      const yy = y + Math.sin((x / opts.width) * Math.PI * 2 * freq) * amp
      d += ` L ${x.toFixed(0)} ${yy.toFixed(0)}`
    }
    paths += `  <path d="${d}" fill="none" stroke="${color}" stroke-width="${between(1, 3)}" opacity="${opacity}"/>\n`
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${opts.width}" height="${opts.height}" viewBox="0 0 ${opts.width} ${opts.height}">
  <rect width="${opts.width}" height="${opts.height}" fill="${opts.backgroundColor || '#0f172a'}"/>
${paths}</svg>`
}

export function generateSvgGrid(opts: SvgOptions): string {
  const [c1] = getPalette(opts.primaryColor)
  const density = opts.density || 30
  const spacing = Math.max(10, Math.min(opts.width, opts.height) / density)
  let lines = ''
  for (let x = 0; x <= opts.width; x += spacing) {
    lines += `  <line x1="${x}" y1="0" x2="${x}" y2="${opts.height}" stroke="${c1}" stroke-width="1" opacity="0.05"/>\n`
  }
  for (let y = 0; y <= opts.height; y += spacing) {
    lines += `  <line x1="0" y1="${y}" x2="${opts.width}" y2="${y}" stroke="${c1}" stroke-width="1" opacity="0.05"/>\n`
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${opts.width}" height="${opts.height}" viewBox="0 0 ${opts.width} ${opts.height}">
  <rect width="${opts.width}" height="${opts.height}" fill="${opts.backgroundColor || '#0f172a'}"/>
${lines}</svg>`
}

export function generateSvgCrosshatch(opts: SvgOptions): string {
  const [c1, c2] = getPalette(opts.primaryColor)
  const density = opts.density || 20
  const spacing = Math.max(8, Math.min(opts.width, opts.height) / density)
  let lines = ''
  const angles = [0, 60, 120]
  for (const angle of angles) {
    const rad = (angle * Math.PI) / 180
    const dx = Math.cos(rad) * spacing
    const dy = Math.sin(rad) * spacing
    const diagonal = Math.sqrt(opts.width ** 2 + opts.height ** 2)
    for (let i = -diagonal / spacing; i < diagonal / spacing; i++) {
      const x1 = i * dx
      const y1 = i * dy
      const x2 = x1 + Math.cos(rad) * diagonal
      const y2 = y1 + Math.sin(rad) * diagonal
      lines += `  <line x1="${x1.toFixed(0)}" y1="${y1.toFixed(0)}" x2="${x2.toFixed(0)}" y2="${y2.toFixed(0)}" stroke="${angle === 0 ? c1 : c2}" stroke-width="1" opacity="0.04"/>\n`
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${opts.width}" height="${opts.height}" viewBox="0 0 ${opts.width} ${opts.height}">
  <rect width="${opts.width}" height="${opts.height}" fill="${opts.backgroundColor || '#0f172a'}"/>
${lines}</svg>`
}

export function generateSvgAbstract(opts: SvgOptions): string {
  const [c1, c2, c3, c4] = getPalette(opts.primaryColor)
  const pieces = between(6, 15)
  let shapes = ''
  for (let i = 0; i < pieces; i++) {
    const color = [c1, c2, c3, c4][i % 4]
    const opacity = (0.05 + Math.random() * 0.15).toFixed(2)
    const cx = between(0, opts.width)
    const cy = between(0, opts.height)
    const rx = between(40, 200)
    const ry = between(40, 200)
    const angle = between(0, 360)
    const type = between(0, 3)
    if (type === 0) {
      shapes += `  <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${color}" opacity="${opacity}" transform="rotate(${angle} ${cx} ${cy})"/>\n`
    } else if (type === 1) {
      const pts = `${cx},${cy - ry} ${cx + rx * 0.866},${cy + ry * 0.5} ${cx - rx * 0.866},${cy + ry * 0.5}`
      shapes += `  <polygon points="${pts}" fill="${color}" opacity="${opacity}" transform="rotate(${angle} ${cx} ${cy})"/>\n`
    } else if (type === 2) {
      const w = between(60, 300)
      const h = between(60, 300)
      shapes += `  <rect x="${cx - w / 2}" y="${cy - h / 2}" width="${w}" height="${h}" rx="${between(5, 30)}" fill="${color}" opacity="${opacity}" transform="rotate(${angle} ${cx} ${cy})"/>\n`
    } else {
      const n = between(5, 10)
      let pts = ''
      for (let p = 0; p < n; p++) {
        const a = (p / n) * Math.PI * 2
        const r = between(rx * 0.5, rx)
        pts += `${(cx + Math.cos(a) * r).toFixed(0)},${(cy + Math.sin(a) * r).toFixed(0)} `
      }
      shapes += `  <polygon points="${pts.trim()}" fill="${color}" opacity="${opacity}" transform="rotate(${angle} ${cx} ${cy})"/>\n`
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${opts.width}" height="${opts.height}" viewBox="0 0 ${opts.width} ${opts.height}">
  <rect width="${opts.width}" height="${opts.height}" fill="${opts.backgroundColor || '#0f172a'}"/>
${shapes}</svg>`
}

export function generateSvgHero(opts: SvgOptions): string {
  const [c1, c2] = getPalette(opts.primaryColor)
  const bg = opts.backgroundColor || '#0f172a'
  const textY = opts.height * 0.45
  const shapeY = opts.height * 0.65
  const shapes: string[] = [
    `<ellipse cx="${opts.width * 0.2}" cy="${shapeY}" rx="${opts.width * 0.25}" ry="${opts.height * 0.2}" fill="${c1}" opacity="0.12"/>`,
    `<ellipse cx="${opts.width * 0.8}" cy="${shapeY - 30}" rx="${opts.width * 0.15}" ry="${opts.height * 0.15}" fill="${c2}" opacity="0.1"/>`,
    `<circle cx="${opts.width * 0.5}" cy="${opts.height * 0.35}" r="${Math.min(opts.width, opts.height) * 0.3}" fill="${c1}" opacity="0.04"/>`,
    `<rect x="${opts.width * 0.12}" y="${textY + 20}" width="${opts.width * 0.35}" height="12" rx="6" fill="${c1}" opacity="0.15"/>`,
    `<rect x="${opts.width * 0.12}" y="${textY + 42}" width="${opts.width * 0.25}" height="12" rx="6" fill="${c1}" opacity="0.1"/>`,
    `<rect x="${opts.width * 0.12}" y="${textY + 64}" width="${opts.width * 0.3}" height="12" rx="6" fill="${c1}" opacity="0.08"/>`,
  ]
  if (opts.width > opts.height) {
    shapes.push(`<rect x="${opts.width * 0.6}" y="${textY + 10}" width="${opts.width * 0.3}" height="${opts.height * 0.35}" rx="12" fill="${c1}" opacity="0.08"/>`)
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${opts.width}" height="${opts.height}" viewBox="0 0 ${opts.width} ${opts.height}">
  <rect width="${opts.width}" height="${opts.height}" fill="${bg}"/>
  <rect width="${opts.width}" height="${opts.height}" fill="url(#bg-grad)" opacity="0.5"/>
  <defs>
    <linearGradient id="bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${c1}" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="${c2}" stop-opacity="0"/>
    </linearGradient>
  </defs>
${shapes.join('\n')}
</svg>`
}

export function generateSvgImage(params: {
  style: SvgStyle
  prompt?: string
  width: number
  height: number
  count: number
  primaryColor?: string
  secondaryColor?: string
  accentColor?: string
  backgroundColor?: string
  density?: number
}): { urls: string[]; provider: string } {
  const opts: SvgOptions = {
    width: params.width,
    height: params.height,
    primaryColor: params.primaryColor,
    secondaryColor: params.secondaryColor,
    accentColor: params.accentColor,
    backgroundColor: params.backgroundColor,
    density: params.density,
  }

  const urls: string[] = []
  for (let i = 0; i < params.count; i++) {
    if (i > 0) {
      opts.primaryColor = randomHex()
    }
    let svg: string
    switch (params.style) {
      case 'gradient':
        svg = generateSvgGradient(opts); break
      case 'dots':
        svg = generateSvgDots(opts); break
      case 'geometric':
        svg = generateSvgGeometric(opts); break
      case 'waves':
        svg = generateSvgWaves(opts); break
      case 'grid':
        svg = generateSvgGrid(opts); break
      case 'crosshatch':
        svg = generateSvgCrosshatch(opts); break
      case 'abstract':
        svg = generateSvgAbstract(opts); break
      case 'hero':
        svg = generateSvgHero(opts); break
      default:
        svg = generateSvgAbstract(opts)
    }
    urls.push(`data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`)
  }

  return { urls, provider: 'svg' }
}

export const SVG_STYLES: { id: SvgStyle; name: string; description: string }[] = [
  { id: 'gradient', name: 'Gradient', description: 'Smooth color gradients' },
  { id: 'geometric', name: 'Geometric', description: 'Random geometric shapes (circles, squares, triangles)' },
  { id: 'dots', name: 'Dots', description: 'Scattered dot patterns' },
  { id: 'waves', name: 'Waves', description: 'Flowing sine wave lines' },
  { id: 'grid', name: 'Grid', description: 'Subtle grid lines' },
  { id: 'crosshatch', name: 'Crosshatch', description: 'Multi-angle line hatching' },
  { id: 'abstract', name: 'Abstract', description: 'Abstract organic compositions' },
  { id: 'hero', name: 'Hero', description: 'Hero section layout with content blocks' },
]
