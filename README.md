# AI Web Builder

**Open-source AI-powered website builder** — Generate production-ready websites from natural language prompts using local-first AI. Supports Ollama, llama.cpp, OpenAI GPT-4o, Anthropic Claude, Google Gemini, Groq, DeepSeek, Mistral AI, Together AI, and OpenRouter. Desktop app (Windows EXE, macOS DMG, Linux AppImage) and browser-based web app included. Local-first 13-layer architecture runs entirely offline with no API keys required for basic usage. Features website cloning from URLs, multi-source image generation (ComfyUI, SVG, stock APIs), Docker deployment, and Unraid Community Apps support.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)](https://www.typescriptlang.org/)
[![Version](https://img.shields.io/badge/version-0.2.0--beta-orange)](https://github.com/wildfirebill-gen-ai-web/ai-web-builder/releases)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![Electron](https://img.shields.io/badge/Electron-34-47848F)](https://www.electronjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)](https://tailwindcss.com/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen)](CONTRIBUTING.md)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Quick Start](#quick-start)
- [Build Instructions](#build-instructions)
  - [Windows](#windows-build)
  - [macOS](#macos-build)
  - [Linux](#linux-build)
- [AI Provider Setup](#ai-provider-setup)
- [13-Layer Architecture](#13-layer-architecture)
- [Templates](#templates)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)
- [License](#license)

---

## Overview

AI Web Builder is a **universal, open-source website generator** that transforms natural language descriptions into fully functional, production-grade websites. Built by synthesizing patterns from 46+ AI website builder projects, it combines the best features of each into a single unified platform.

**Key differentiators:**
- **Local-first** — Run entirely offline with Ollama or llama.cpp. No API keys required for basic usage.
- **13 production layers** — Every generated site includes configurable Frontend, API, Database, Auth, Deployment, CI/CD, Security, Rate Limiting, Caching, Load Balancing, Error Tracking, and Recovery layers.
- **Dual delivery** — Use it in your browser or as a native desktop application.
- **Provider-agnostic** — Switch between 10+ AI providers without changing your workflow.

---

## Features

### 🤖 AI-Powered Generation
Transform plain English descriptions into complete, working websites. Describe what you want — "a SaaS landing page with pricing tiers and a contact form" — and AI generates every file.

### 🏗️ 13-Layer Architecture
Every generated website includes all 13 production layers, fully configurable before generation. Toggle layers on/off, adjust settings per layer.

### 🔌 10+ AI Providers
- **Local:** Ollama, llama.cpp, ComfyUI (runs offline, zero cost)
- **Cloud:** OpenAI (GPT-4o), Anthropic (Claude), Google (Gemini), Groq, DeepSeek, Mistral AI, Together AI, OpenRouter
- **BYOK:** Bring your own API key for any provider

### 🌐 Website Cloning
Clone existing websites as structural reference for AI generation. Crawls pages (BFS), extracts layout/structure patterns, and feeds them as context to the AI prompt — no content copying, just architectural inspiration.

### 🖼️ Image Generation
- **Stock photos:** Pexels and Unsplash APIs with automatic fallback to styled placeholders
- **Cloud AI:** OpenAI DALL-E / GPT Image for AI-generated images
- **Local AI:** ComfyUI (SDXL, SD1.5) for fully offline image generation
- **SVG Generation:** 8 zero-dependency SVG generators (gradient, dots, geometric, waves, grid, crosshatch, abstract, hero) — no API key required

### 📦 10 Starter Templates
Pre-built templates for SaaS landing pages, e-commerce stores, creative portfolios, blogs, documentation sites, agency websites, local businesses, and more.

### ⚙️ Fully Customizable Settings
Eight categories of settings accessible from the settings panel:
- General, Providers, Generation, Layers, Assets, Editor, Export, Advanced

### 🖥️ Desktop + Web + Docker
- **Web app:** Next.js 15, accessible from any browser
- **Desktop app:** Electron (Next.js standalone output), with native file dialogs, system menus, and offline capability
- **Cross-platform:** Windows EXE (NSIS installer, 143 MB), macOS DMG, Linux AppImage
- **Docker:** Multi-stage Dockerfile, production docker-compose.yml (web + Ollama sidecar with GPU passthrough), dev docker-compose.dev.yml (hot reload)
- **Unraid:** Community Applications template with 20+ configurable environment fields

---

## Architecture

```
ai-web-builder/
├── apps/                          # Application entrypoints
│   ├── web/                       # Next.js 15 browser application
│   │   ├── src/
│   │   │   ├── app/               # App router pages
│   │   │   └── components/        # React components
│   │   └── package.json
│   └── desktop/                   # Electron desktop application
│       ├── electron/              # Main process & preload scripts
│       │   ├── main.js            # Electron main process
│       │   └── preload.js         # Context bridge for IPC
│       └── package.json
├── packages/                      # Shared libraries
│   ├── core/                      # Engine: providers, generator, layers, assets, settings
│   │   └── src/
│   │       ├── providers/         # 10 AI provider integrations
│   │       ├── generator/         # Prompt builder, code engine, templates
│   │       ├── layers/            # 13-layer definition & applier
│   │       ├── assets/            # Image generation (ComfyUI, SVG, stock APIs)
│   │       ├── clone/             # Website cloning (fetcher, parser, crawler)
│   │       ├── settings/          # Settings schema & defaults
│   │       └── templates/         # 10 starter template definitions
│   ├── ui/                        # Shared React UI components
│   └── config/                    # Shared configuration & constants
├── clones/                        # 46 reference implementation repos
├── scripts/
│   └── setup.ps1                  # PowerShell setup helper
├── package.json                   # Root workspace config
├── pnpm-workspace.yaml            # pnpm workspace definition
└── turbo.json                     # Turborepo pipeline
```

---

## Quick Start

### Prerequisites

- **Node.js** >= 24.0.0
- **pnpm** >= 10.0.0 (install via `npm install -g pnpm`)
- **Git** (for cloning)
- **Optional:** [Ollama](https://ollama.ai) for local AI inference

### Install & Run

```bash
# 1. Clone the repository
git clone https://github.com/wildfirebill-gen-ai-web/ai-web-builder.git
cd ai-web-builder

# 2. Install dependencies
pnpm install

# 3. Start the web app (opens at http://localhost:3000)
pnpm web

# 4. Or start the desktop app
pnpm desktop

# 5. Or run via Docker (web + Ollama)
docker compose up -d
```

- **Web app:** http://localhost:3000
- **Docker:** `docker compose up -d` (includes Ollama sidecar)
- For local AI providers, ensure Ollama is running (`ollama serve` or use Docker)

---

## Build Instructions

Build standalone executables for distribution on all platforms.

### Windows Build

Build a native Windows `.exe` installer (NSIS):

```bash
# Requirements: Windows 10+, Node.js 24+, pnpm

# Build the desktop EXE
pnpm desktop:build

# Or run the build script
.\scripts\setup.ps1 -BuildDesktop
```

**Output:** `apps/desktop/release/AI Web Builder Setup X.X.X.exe`

**Windows build flags:**
```bash
# 64-bit only (default)
pnpm --filter @awb/desktop build:win

# 32-bit
pnpm --filter @awb/desktop exec electron-builder --win --ia32

# Both architectures
pnpm --filter @awb/desktop exec electron-builder --win --x64 --ia32
```

**Portable version (no installer):**
```bash
pnpm --filter @awb/desktop exec electron-builder --win portable
```

### macOS Build

Build a native macOS `.dmg` or `.app` bundle:

```bash
# Requirements: macOS 12+, Node.js 24+, pnpm, Xcode CLI tools

# Build DMG installer
pnpm desktop:build

# Or specifically:
pnpm --filter @awb/desktop build:mac
```

**Output:** `apps/desktop/release/AI Web Builder-X.X.X.dmg`

**macOS build options:**
```bash
# DMG (default)
pnpm --filter @awb/desktop exec electron-builder --mac

# App bundle only (no DMG)
pnpm --filter @awb/desktop exec electron-builder --mac --config.mac.target=zip

# Apple Silicon + Intel universal binary
pnpm --filter @awb/desktop exec electron-builder --mac --universal

# Notarize for distribution (requires Apple Developer account)
# Set CSC_LINK and CSC_KEY_PASSWORD environment variables
pnpm --filter @awb/desktop exec electron-builder --mac --publish=always
```

### Linux Build

Build a native Linux `.AppImage` or `.deb` package:

```bash
# Requirements: Linux (Ubuntu 20.04+, Fedora 36+, etc.), Node.js 24+, pnpm

# Build AppImage (portable)
pnpm desktop:build

# Or specifically:
pnpm --filter @awb/desktop build:linux
```

**Output:** `apps/desktop/release/AI Web Builder-X.X.X.AppImage`

**Linux build options:**
```bash
# AppImage (portable, default)
pnpm --filter @awb/desktop exec electron-builder --linux

# Debian/Ubuntu package
pnpm --filter @awb/desktop exec electron-builder --linux deb

# Red Hat/Fedora package
pnpm --filter @awb/desktop exec electron-builder --linux rpm

# Snap package
pnpm --filter @awb/desktop exec electron-builder --linux snap

# All formats
pnpm --filter @awb/desktop exec electron-builder --linux AppImage deb rpm
```

**Linux dependencies for building:**
```bash
# Ubuntu/Debian
sudo apt-get install -y rpm fakeroot dpkg-dev

# Fedora
sudo dnf install -y rpm-build dpkg-dev

# Arch
sudo pacman -S rpm-tools dpkg
```

---

## Docker

Run the AI Web Builder web app and Ollama in containers. The desktop app (Electron) cannot run in Docker — use the web app via Docker instead.

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) 24+
- [Docker Compose](https://docs.docker.com/compose/install/) v2+
- **GPU support (optional):** [NVIDIA Container Toolkit](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html) for GPU-accelerated Ollama

### Production Stack

Starts the web app on `http://localhost:3000` with an Ollama sidecar.

```bash
docker compose up -d
```

After starting, pull a model into Ollama:

```bash
docker exec ollama ollama pull qwen2.5-coder
```

### Development Stack

Hot-reloading web app with Ollama sidecar. Source code is mounted from your host.

```bash
docker compose -f docker-compose.dev.yml up -d
```

### Web App Only (Standalone)

Run the web app without Ollama (use cloud providers instead):

```bash
docker build -t ai-web-builder .
docker run -p 3000:3000 \
  -e OPENAI_API_KEY=sk-... \
  ai-web-builder
```

### With Cloud Providers

Pass API keys via `.env` file or environment variables:

```bash
# Using .env file (auto-loaded by docker compose)
echo "OPENAI_API_KEY=sk-..." >> .env
docker compose up -d

# Or pass inline
OPENAI_API_KEY=sk-... docker compose up -d
```

### GPU Acceleration for Ollama

Enable GPU inference inside the container:

```yaml
# docker-compose.yml (already configured)
ollama:
  deploy:
    resources:
      reservations:
        devices:
          - driver: nvidia
            count: all
            capabilities: [gpu]
```

Requires [NVIDIA Container Toolkit](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html).

### Docker Compose Reference

| Command | Description |
|---------|-------------|
| `docker compose up -d` | Start production stack |
| `docker compose -f docker-compose.dev.yml up -d` | Start dev stack with hot reload |
| `docker compose down` | Stop all containers |
| `docker compose logs -f` | Follow logs |
| `docker exec ollama ollama pull <model>` | Pull a model into Ollama |
| `docker compose build --no-cache web` | Rebuild web image from scratch |

### Unraid Deployment

A Community Applications template is at `unraid/templates/ai-web-builder.xml`. The image is automatically built and pushed to `ghcr.io/wildfirebill-gen-ai-web/ai-web-builder` by CI — no manual build needed.

**Install:** Open the **Apps** tab in Unraid → search "AI Web Builder" → Install.

**Manual install:** Copy `unraid/templates/ai-web-builder.xml` to `/boot/config/plugins/dockerMan/templates-user/` on your Unraid server, then add the container from the Docker UI.

### Cross-Platform Build (CI)

Pre-configured GitHub Actions workflows in `.github/workflows/`:

| Workflow | Triggers | Output |
|----------|----------|--------|
| `ci.yml` | PRs and pushes to `main` | TypeScript typecheck + lint across all packages |
| `docker.yml` | PRs/main pushes and semver tags `v*` | Multi-arch Docker image on GHCR (latest, semver, date tags) |
| `build.yml` | Published releases or manual dispatch | Windows EXE (NSIS), macOS DMG, Linux AppImage uploaded as artifacts |

---

## AI Provider Setup

### Local Providers (No API Key Required)

| Provider | Setup | Default URL |
|----------|-------|-------------|
| **Ollama** | Install [Ollama](https://ollama.ai), pull a model (`ollama pull qwen2.5-coder`) | `http://localhost:11434` |
| **llama.cpp** | Build/install [llama.cpp](https://github.com/ggerganov/llama.cpp), start server (`./server`) | `http://localhost:8080` |

### Cloud Providers (API Key Required)

Set the corresponding environment variable:

| Provider | Env Variable | Models | Get Key |
|----------|-------------|--------|---------|
| **OpenAI** | `OPENAI_API_KEY` | GPT-4o, GPT-4o-mini, o3-mini | [platform.openai.com](https://platform.openai.com) |
| **Anthropic** | `ANTHROPIC_API_KEY` | Claude Sonnet 4, Claude 3.5 Sonnet, Haiku, Opus | [console.anthropic.com](https://console.anthropic.com) |
| **Google Gemini** | `GEMINI_API_KEY` | Gemini 2.5 Pro, 2.5 Flash, 1.5 Pro | [aistudio.google.com](https://aistudio.google.com) |
| **Groq** | `GROQ_API_KEY` | LLaMA 3.3, Mixtral, DeepSeek R1 | [console.groq.com](https://console.groq.com) |
| **DeepSeek** | `DEEPSEEK_API_KEY` | DeepSeek Chat, DeepSeek Reasoner | [platform.deepseek.com](https://platform.deepseek.com) |
| **Mistral AI** | `MISTRAL_API_KEY` | Mistral Large, Small, Codestral | [console.mistral.ai](https://console.mistral.ai) |
| **Together AI** | `TOGETHER_API_KEY` | LLaMA 3.3, DeepSeek V3, Mixtral | [together.ai](https://together.ai) |
| **OpenRouter** | `OPENROUTER_API_KEY` | 200+ models (unified API) | [openrouter.ai](https://openrouter.ai) |

### Image Provider Setup

| Provider | Env Variable | Get Key |
|----------|-------------|---------|
| **Pexels** | `PEXELS_API_KEY` | [pexels.com/api](https://www.pexels.com/api) |
| **Unsplash** | `UNSPLASH_ACCESS_KEY` | [unsplash.com/developers](https://unsplash.com/developers) |
| **OpenAI Images** | `OPENAI_API_KEY` | [platform.openai.com](https://platform.openai.com) |
| **ComfyUI** (local) | `COMFYUI_URL` (optional, default `http://localhost:8188`) | [github.com/comfyanonymous/ComfyUI](https://github.com/comfyanonymous/ComfyUI) |
| **SVG Generator** (local, zero-deps) | None required | Built-in (8 generators: gradient, dots, geometric, waves, grid, crosshatch, abstract, hero) |

All image providers fall back to styled SVG placeholders when no API key is configured.

---

## 13-Layer Architecture

Every website generated by AI Web Builder includes 13 configurable architecture layers. Each layer produces production-ready code files.

| # | Layer | Category | Description | Generated Files |
|---|-------|----------|-------------|-----------------|
| 1 | **Frontend Foundations** | Presentation | UI framework, styling, components, responsive design, accessibility | `layout.tsx`, `globals.css`, `tailwind.config.ts` |
| 2 | **APIs & Backend Logic** | Backend | API routes, server actions, business logic, webhooks | `api/route.ts`, `middleware.ts` |
| 3 | **Database & Storage** | Data | Schema, migrations, file storage, data seeding | `schema.prisma`, `seed.ts` |
| 4 | **Auth & Permissions** | Security | Authentication, RBAC, session management | `auth.ts`, `roles.ts`, `AuthGuard.tsx` |
| 5 | **Hosting & Deployment** | Operations | Hosting config, deployment scripts, domain setup | `vercel.json`, `Dockerfile`, `.env.example` |
| 6 | **Cloud & Compute** | Operations | Serverless functions, containers, GPU compute | `functions/`, `Dockerfile.cloud` |
| 7 | **CI/CD & Version Control** | Operations | Pipelines, testing, linting, automated releases | `.github/workflows/ci.yml`, `vitest.config.ts` |
| 8 | **Security & RLS** | Security | Security headers, CSP, row-level security, CSRF | `middleware.ts`, `security-headers.ts`, `rls-policies.sql` |
| 9 | **Rate Limiting** | Security | API throttling, abuse prevention | `rate-limit.ts`, `middleware.ts` |
| 10 | **Caching & CDN** | Performance | CDN config, cache strategy, image optimization | `cache.ts`, `next.config.ts` |
| 11 | **Load Balancing & Scaling** | Performance | Auto-scaling, health checks, sticky sessions | `health.ts`, `scaling-config.ts` |
| 12 | **Error Tracking & Logs** | Observability | Structured logging, error monitoring, metrics | `logger.ts`, `error-boundary.tsx` |
| 13 | **Availability & Recovery** | Operations | Backups, disaster recovery, uptime monitoring | `backup.ts`, `recovery.ts` |

---

## Templates

| Template | Type | Pages | Best For |
|----------|------|-------|----------|
| SaaS Landing Page | `landing-page` | home, features, pricing, faq | Marketing sites |
| SaaS Dashboard | `saas` | dashboard, analytics, users, billing | Web applications |
| E-Commerce Store | `ecommerce` | products, cart, checkout, orders | Online stores |
| Creative Portfolio | `portfolio` | projects, gallery, about, contact | Designers, artists |
| Blog / Magazine | `blog` | blog posts, categories, tags, search | Content sites |
| Web App (CRUD) | `webapp` | dashboard, items, settings | Data management |
| Documentation Site | `documentation` | guides, API reference, examples | Open-source projects |
| AI Product Landing | `landing-page` | demo, capabilities, pricing | AI/ML products |
| Agency Website | `multi-page` | services, case studies, team | Agencies |
| Local Business | `multi-page` | services, reviews, gallery, contact | Small businesses |

---

## Environment Variables

Create a `.env` file in any app directory:

```env
# === AI PROVIDERS ===
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GEMINI_API_KEY=...
GROQ_API_KEY=gsk_...
DEEPSEEK_API_KEY=sk-...
MISTRAL_API_KEY=...
TOGETHER_API_KEY=...
OPENROUTER_API_KEY=sk-or-...

# === IMAGE PROVIDERS ===
PEXELS_API_KEY=...
UNSPLASH_ACCESS_KEY=...

# === LOCAL PROVIDERS (optional overrides) ===
OLLAMA_URL=http://localhost:11434
LLAMACPP_URL=http://localhost:8080
COMFYUI_URL=http://localhost:8188

# === APP CONFIG ===
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `pnpm install` fails | Ensure Node.js >= 24 is installed. Run `node --version` to check. |
| `OllamaProvider` connection error | Start Ollama: `ollama serve`. Verify at `http://localhost:11434`. |
| Electron build fails on Windows | Install Visual Studio Build Tools with "Desktop development with C++" workload. |
| macOS "unidentified developer" warning | Run `xattr -dr com.apple.quarantine /path/to/AI\ Web\ Builder.app` |
| Linux AppImage not running | Install FUSE: `sudo apt install fuse libfuse2` |
| Port 3000 already in use | Set `PORT=3001 pnpm web` or modify in `apps/web/package.json` |
| TypeScript errors after pull | Run `pnpm install` to ensure dependencies are up to date. |
| Blank screen in desktop app | Open DevTools (View → Toggle DevTools) and check Console for errors. |

---

## License

MIT — See [LICENSE](LICENSE) for details.

Built from patterns across 46 open-source AI website builder projects.
