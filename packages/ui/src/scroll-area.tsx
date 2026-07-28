import React from 'react'
import { cn } from './utils'

export function ScrollArea({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('overflow-auto scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-600', className)} {...props}>
      {children}
    </div>
  )
}
