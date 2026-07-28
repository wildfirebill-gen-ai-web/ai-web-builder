# AI Web Builder — Unraid

## Quick Install (Community Applications)

> **Note:** The container image must first be built or published to a registry (e.g., GitHub Container Registry). Once published, this template can be submitted to the Unraid Community Applications store.

1. Open the **Apps** tab in Unraid
2. Search for "AI Web Builder"
3. Click **Install**
4. Configure the template:
   - **Ollama URL** — Point to your Ollama instance (`http://192.168.1.100:11434`)
   - **App Data** — Storage path for generated projects
   - **API Keys** — Enter cloud provider keys if desired (optional, local-only works with Ollama)
5. Click **Apply**

## Manual Install

Copy the template and icon to your Unraid server:

```bash
# From your Unraid server flash drive
cp ai-web-builder.xml /boot/config/plugins/dockerMan/templates-user/
cp icons/ai-web-builder.svg /boot/config/plugins/dockerMan/templates-user/icons/
```

Then in the Unraid Docker UI, click **Add Container** → select the **AIWebBuilder** template.

## Configuration

### Required
| Variable | Description |
|----------|-------------|
| `OLLAMA_URL` | URL of your Ollama instance |

### Optional (local-only mode uses none of these)
| Variable | Provider |
|----------|----------|
| `OPENAI_API_KEY` | OpenAI (GPT-4o, GPT-4o-mini, o3-mini) |
| `ANTHROPIC_API_KEY` | Anthropic (Claude Sonnet 4, Haiku, Opus) |
| `GEMINI_API_KEY` | Google Gemini (2.5 Pro, 2.5 Flash) |
| `GROQ_API_KEY` | Groq (LLaMA 3.3, Mixtral, DeepSeek R1) |
| `DEEPSEEK_API_KEY` | DeepSeek Chat |
| `MISTRAL_API_KEY` | Mistral AI (Mistral Large, Codestral) |
| `OPENROUTER_API_KEY` | OpenRouter (200+ models) |
| `TOGETHER_API_KEY` | Together AI |

### Image Assets (optional)
| Variable | Service |
|----------|---------|
| `PEXELS_API_KEY` | Pexels stock photos |
| `UNSPLASH_ACCESS_KEY` | Unsplash stock photos |

### Advanced
| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | `production` | Environment mode |
| `LOG_LEVEL` | `info` | Log verbosity |
| `HOSTNAME` | `0.0.0.0` | Bind address |
| `MAX_TOKENS` | `8192` | Max generation tokens |
| `TEMPERATURE` | `0.7` | AI temperature (0.0–2.0) |

## Ollama Setup

### Option A — Existing Ollama (recommended)
If you already have Ollama running on Unraid (or another machine), just set `OLLAMA_URL` to its address:
- Running on Unraid host: `http://192.168.1.100:11434`
- Running in another container (same custom network): `http://ollama:11434`

### Option B — Run alongside in Docker
Deploy the official Ollama container alongside:

```bash
docker run -d \
  --name ollama \
  --network=bridge \
  -p 11434:11434 \
  -v ollama_data:/root/.ollama \
  ollama/ollama
```

Then set `OLLAMA_URL=http://<ollama-container-ip>:11434`.

## Architecture

```
┌──────────────────────────────────────────────┐
│  AI Web Builder (port 3000)                   │
│  ┌────────────────────────────────────────┐  │
│  │  Web UI (Next.js 15 + Tailwind v4)     │  │
│  │  - 5 views (Templates, Prompt, Config, │  │
│  │    Layers, Preview)                    │  │
│  │  - Settings panel (8 categories)       │  │
│  │  - Provider/model selector             │  │
│  └──────────────┬─────────────────────────┘  │
│                 │                             │
│  ┌──────────────▼─────────────────────────┐  │
│  │  Core Engine                            │  │
│  │  - 10 AI providers → Ollama / Cloud    │  │
│  │  - 13-layer architecture applier       │  │
│  │  - 10 starter templates                │  │
│  │  - Site generation pipeline            │  │
│  └────────────────────────────────────────┘  │
└──────────────────────┬───────────────────────┘
                       │
┌──────────────────────▼───────────────────────┐
│  Ollama (port 11434)                          │
│  Local AI inference                           │
│  Models: qwen2.5-coder, llama3, deepseek-coder│
└──────────────────────────────────────────────┘
```

## Support

- [GitHub Issues](https://github.com/wildfirebill-gen-ai-web/ai-web-builder/issues)
- [Project Repository](https://github.com/wildfirebill-gen-ai-web/ai-web-builder)
