'use client'

import { ScrollArea } from '@awb/ui'
import { cn } from '@awb/ui'

interface FileExplorerProps {
  files: { path: string; content: string }[]
  selectedFile?: string
  onSelect: (file: { path: string; content: string }) => void
}

export function FileExplorer({ files, selectedFile, onSelect }: FileExplorerProps) {
  const grouped = files.reduce<Record<string, { path: string; content: string }[]>>((acc, f) => {
    const dir = f.path.includes('/') ? f.path.split('/').slice(0, -1).join('/') : '/'
    if (!acc[dir]) acc[dir] = []
    acc[dir].push(f)
    return acc
  }, {})

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden h-full">
      <div className="px-4 py-2 border-b border-zinc-800">
        <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Files ({files.length})</h3>
      </div>
      <ScrollArea className="p-2 h-[calc(100%-40px)]">
        {Object.entries(grouped).map(([dir, dirFiles]) => (
          <div key={dir}>
            <div className="text-xs text-zinc-500 px-2 py-1 font-mono">{dir || '/'}</div>
            {dirFiles.map(f => (
              <button key={f.path} onClick={() => onSelect(f)}
                className={cn(
                  'w-full text-left px-3 py-1.5 rounded text-xs font-mono transition-colors',
                  selectedFile === f.path
                    ? 'bg-indigo-600/20 text-indigo-300'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800',
                )}>
                {f.path.split('/').pop()}
              </button>
            ))}
          </div>
        ))}
      </ScrollArea>
    </div>
  )
}
