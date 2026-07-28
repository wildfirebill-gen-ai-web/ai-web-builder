import React from 'react'
import { cn } from './utils'

interface SeparatorProps {
  className?: string
  orientation?: 'horizontal' | 'vertical'
}

export function Separator({ className, orientation = 'horizontal' }: SeparatorProps) {
  return (
    <div className={cn(
      'shrink-0 bg-zinc-200 dark:bg-zinc-700',
      orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
      className,
    )} />
  )
}
