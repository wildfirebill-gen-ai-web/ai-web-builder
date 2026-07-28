'use client'

import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent, ScrollArea } from '@awb/ui'

interface PreviewPaneProps {
  files: { path: string; content: string }[]
}

export function PreviewPane({ files }: PreviewPaneProps) {
  const [activeFile, setActiveFile] = useState(files[0]?.path || '')

  const currentFile = files.find(f => f.path === activeFile)
  const htmlFile = files.find(f => f.path.endsWith('.html') || f.path.endsWith('.tsx'))

  return (
    <div className="h-full flex flex-col rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
      <div className="flex items-center border-b border-zinc-800 overflow-x-auto">
        <Tabs value={activeFile} defaultValue={files[0]?.path || ''} onValueChange={setActiveFile}>
          <TabsList className="bg-transparent p-0">
            {files.slice(0, 20).map(f => (
              <TabsTrigger key={f.path} value={f.path}
                className="text-xs px-3 py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-indigo-500">
                {f.path.split('/').pop()}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
      <ScrollArea className="flex-1 p-0">
        {currentFile && (
          <pre className="p-4 text-xs font-mono text-zinc-300 leading-relaxed overflow-x-auto">
            <code>{currentFile.content}</code>
          </pre>
        )}
      </ScrollArea>
    </div>
  )
}
