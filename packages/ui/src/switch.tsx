import React from 'react'
import { cn } from './utils'

interface SwitchProps {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  label?: string
  disabled?: boolean
}

export function Switch({ checked, onCheckedChange, label, disabled }: SwitchProps) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <button
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        className={cn(
          'relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
          checked ? 'bg-indigo-600' : 'bg-zinc-300 dark:bg-zinc-600',
          disabled && 'opacity-50 cursor-not-allowed',
        )}
        onClick={() => onCheckedChange?.(!checked)}
      >
        <span className={cn(
          'inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform',
          checked ? 'translate-x-4.5' : 'translate-x-1',
        )} />
      </button>
      {label && <span className="text-sm text-zinc-700 dark:text-zinc-300">{label}</span>}
    </label>
  )
}
