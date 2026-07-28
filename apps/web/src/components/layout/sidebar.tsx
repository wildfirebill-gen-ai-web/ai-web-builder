'use client'

import { cn } from '@awb/ui'

const icons: Record<string, string> = {
  layout: '◇', code: '▶', settings: '⚙', layers: '⊞', eye: '◎', copy: '⊕',
}

interface SidebarProps {
  nav: { id: string; label: string; icon: string }[]
  activeView: string
  onViewChange: (id: any) => void
}

export function BuilderSidebar({ nav, activeView, onViewChange }: SidebarProps) {
  return (
    <nav className="w-16 bg-zinc-900 border-r border-zinc-800 flex flex-col items-center py-4 gap-1">
      <div className="text-indigo-400 font-bold text-lg mb-4">A</div>
      {nav.map(item => (
        <button key={item.id} onClick={() => onViewChange(item.id)}
          className={cn(
            'w-10 h-10 flex items-center justify-center rounded-lg text-sm transition-all',
            activeView === item.id
              ? 'bg-indigo-600 text-white'
              : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800',
          )}
          title={item.label}>
          {icons[item.icon] || '•'}
        </button>
      ))}
    </nav>
  )
}
