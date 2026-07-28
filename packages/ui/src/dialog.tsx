import React, { useEffect, useRef } from 'react'
import { cn } from './utils'

interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onOpenChange(false) }
    if (open) document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onOpenChange])

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={() => onOpenChange(false)} />
      <div ref={ref} className="relative z-50 w-full max-w-lg mx-4">
        {children}
      </div>
    </div>
  )
}

export const DialogTrigger = ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) =>
  <div onClick={onClick}>{children}</div>

export function DialogContent({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn('bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-700', className)}>
      {children}
    </div>
  )
}

export const DialogHeader = ({ className, children }: { className?: string; children: React.ReactNode }) =>
  <div className={cn('px-6 pt-6 pb-4', className)}>{children}</div>

export const DialogTitle = ({ className, children }: { className?: string; children: React.ReactNode }) =>
  <h2 className={cn('text-lg font-semibold', className)}>{children}</h2>

export const DialogDescription = ({ className, children }: { className?: string; children: React.ReactNode }) =>
  <p className={cn('text-sm text-zinc-500 dark:text-zinc-400 mt-1', className)}>{children}</p>
