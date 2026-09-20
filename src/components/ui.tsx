import type { ReactNode } from 'react'
import { Sparkles } from 'lucide-react'

// Desktop / Chromebook-first web shell. Kira ships as district Chromebook web,
// so the prototype is a real responsive web app — not a phone frame. It reads
// for wide screens (two-column screens below) and gracefully stacks on narrow.
export function AppShell({ children, headerRight }: { children: ReactNode; headerRight?: ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-bg text-ink flex flex-col">
      <header className="sticky top-0 z-10 border-b border-border bg-bg/80 backdrop-blur">
        <div className="mx-auto w-full max-w-5xl px-6 h-14 flex items-center justify-between">
          <span className="inline-flex items-center gap-2 font-bold text-[15px] text-accent">
            <Sparkles size={18} /> Kira ACT
          </span>
          {headerRight && <div className="flex items-center gap-2">{headerRight}</div>}
        </div>
      </header>
      <main className="flex-1 w-full">
        <div className="mx-auto w-full max-w-5xl px-6 py-8">{children}</div>
      </main>
    </div>
  )
}

// Two-column layout: primary content left, contextual panel right. Stacks below lg.
export function TwoCol({
  left,
  right,
  stickyRight = true
}: {
  left: ReactNode
  right: ReactNode
  stickyRight?: boolean
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px] items-start">
      <div className="min-w-0 animate-fade-up">{left}</div>
      <div className={stickyRight ? 'lg:sticky lg:top-20' : ''}>{right}</div>
    </div>
  )
}

// Light card wrapper reused across screens.
export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-3xl bg-surface border border-border p-5 shadow-card ${className}`}>
      {children}
    </div>
  )
}

export function PrimaryButton({
  children,
  onClick,
  disabled
}: {
  children: ReactNode
  onClick?: () => void
  disabled?: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full rounded-2xl bg-accent text-white font-semibold py-3.5 text-[15px] transition active:scale-[0.98] hover:bg-accent/90 disabled:opacity-40 disabled:active:scale-100"
    >
      {children}
    </button>
  )
}

export function GhostButton({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-2xl bg-transparent text-ink-muted font-medium py-2.5 text-[14px] transition active:scale-[0.98] hover:text-ink"
    >
      {children}
    </button>
  )
}

// A thin progress meter used in the diagnostic + mastery bars.
export function Meter({ value, tone = 'accent' }: { value: number; tone?: 'accent' | 'success' | 'warn' }) {
  const bar = tone === 'success' ? 'bg-success' : tone === 'warn' ? 'bg-warn' : 'bg-accent'
  return (
    <div className="h-2 w-full rounded-full bg-surface-2 overflow-hidden">
      <div
        className={`h-full rounded-full ${bar} transition-all duration-500`}
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  )
}

export function Pill({ children, tone = 'muted' }: { children: ReactNode; tone?: 'muted' | 'accent' | 'success' | 'warn' | 'danger' }) {
  const map: Record<string, string> = {
    muted: 'bg-surface-2 text-ink-muted',
    accent: 'bg-accent-soft text-accent',
    success: 'bg-success-soft text-success',
    warn: 'bg-warn-soft text-warn',
    danger: 'bg-danger-soft text-danger'
  }
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[12px] font-semibold ${map[tone]}`}>
      {children}
    </span>
  )
}
