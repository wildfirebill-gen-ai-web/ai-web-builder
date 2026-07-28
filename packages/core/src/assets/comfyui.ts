const DEFAULT_COMFY_URL = 'http://127.0.0.1:8188'
const POLL_INTERVAL = 1000
const MAX_POLL_TIME = 120000

export class ComfyUIClient {
  private baseUrl: string

  constructor(baseUrl?: string) {
    this.baseUrl = (baseUrl || process.env.COMFYUI_URL || DEFAULT_COMFY_URL).replace(/\/$/, '')
  }

  async isRunning(): Promise<boolean> {
    try {
      const res = await fetch(`${this.baseUrl}/system_stats`, { signal: AbortSignal.timeout(3000) })
      return res.ok
    } catch {
      return false
    }
  }

  async queuePrompt(workflow: Record<string, any>): Promise<string> {
    const res = await fetch(`${this.baseUrl}/prompt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: workflow }),
    })
    if (!res.ok) {
      const text = await res.text()
      throw new Error(`ComfyUI prompt error (${res.status}): ${text}`)
    }
    const data = await res.json()
    return data.prompt_id as string
  }

  async pollResult(promptId: string, timeout = MAX_POLL_TIME): Promise<{ filename: string; subfolder: string; type: string }[]> {
    const start = Date.now()
    while (Date.now() - start < timeout) {
      const res = await fetch(`${this.baseUrl}/history/${promptId}`)
      if (res.ok) {
        const data = await res.json()
        const entry = data[promptId]
        if (entry?.status?.completed) {
          const outputs: { filename: string; subfolder: string; type: string }[] = []
          for (const nodeId of Object.keys(entry.outputs || {})) {
            const node = entry.outputs[nodeId]
            for (const img of node?.images || []) {
              outputs.push({ filename: img.filename, subfolder: img.subfolder, type: img.type })
            }
          }
          return outputs
        }
      }
      await new Promise(r => setTimeout(r, POLL_INTERVAL))
    }
    throw new Error(`ComfyUI timeout after ${timeout}ms`)
  }

  imageUrl(filename: string, subfolder = '', type = 'output'): string {
    const params = new URLSearchParams({ filename, subfolder, type })
    return `${this.baseUrl}/view?${params}`
  }

  buildSDXLWorkflow(params: {
    prompt: string
    negativePrompt?: string
    width?: number
    height?: number
    steps?: number
    cfg?: number
    sampler?: string
    scheduler?: string
    model?: string
  }): Record<string, any> {
    const w = params.width || 1024
    const h = params.height || 1024
    const steps = params.steps || 20
    const cfg = params.cfg || 7
    const sampler = params.sampler || 'euler'
    const scheduler = params.scheduler || 'normal'
    const model = params.model || ''

    const workflow: Record<string, any> = {
      "3": {
        class_type: "KSampler",
        inputs: {
          seed: Math.floor(Math.random() * 2 ** 32),
          steps,
          cfg,
          sampler_name: sampler,
          scheduler,
          denoise: 1,
          model: ["4", 0],
          positive: ["6", 0],
          negative: ["7", 0],
          latent_image: ["5", 0],
        },
      },
      "4": {
        class_type: "CheckpointLoaderSimple",
        inputs: { ckpt_name: model || undefined },
      },
      "5": {
        class_type: "EmptyLatentImage",
        inputs: { width: w, height: h, batch_size: 1 },
      },
      "6": {
        class_type: "CLIPTextEncode",
        inputs: { text: params.prompt, clip: ["4", 1] },
      },
      "7": {
        class_type: "CLIPTextEncode",
        inputs: { text: params.negativePrompt || 'text, watermark, ugly, blurry', clip: ["4", 1] },
      },
      "8": {
        class_type: "VAEDecode",
        inputs: { samples: ["3", 0], vae: ["4", 2] },
      },
      "9": {
        class_type: "SaveImage",
        inputs: { filename_prefix: "aiwb_", images: ["8", 0] },
      },
    }

    return workflow
  }

  buildSD15Workflow(params: {
    prompt: string
    negativePrompt?: string
    width?: number
    height?: number
    steps?: number
    cfg?: number
    sampler?: string
    scheduler?: string
    model?: string
  }): Record<string, any> {
    const w = params.width || 512
    const h = params.height || 512
    const workflow = this.buildSDXLWorkflow({ ...params, width: w, height: h })
    return workflow
  }
}

export async function generateComfyUIImage(params: {
  prompt: string
  style: string
  width: number
  height: number
  count: number
  baseUrl?: string
}): Promise<{ urls: string[]; provider: string }> {
  const client = new ComfyUIClient(params.baseUrl)
  const running = await client.isRunning()
  if (!running) {
    return { urls: [], provider: 'comfyui-offline' }
  }

  const workflow = client.buildSDXLWorkflow({
    prompt: `${params.style} style: ${params.prompt}`,
    width: params.width,
    height: params.height,
  })

  try {
    const promptId = await client.queuePrompt(workflow)
    const images = await client.pollResult(promptId)
    const urls = images.map(img => client.imageUrl(img.filename, img.subfolder, img.type))
    return { urls, provider: 'comfyui' }
  } catch (err) {
    return { urls: [], provider: 'comfyui-error' }
  }
}
