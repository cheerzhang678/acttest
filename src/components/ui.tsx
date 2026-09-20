import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { BarChart3, BookOpen, BookText, Calculator, FlaskConical, GraduationCap, Home, PenTool, Sparkles } from 'lucide-react'
import type { Domain } from '../types'

// Kira app shell: a fixed dark violet icon rail on the left + a light lavender
// content area on the right. This mirrors the real product (teacher/student app)
// so the prototype reads as living *inside* Kira, not as a separate tool.
export function AppShell({ children, headerRight }: { children: ReactNode; headerRight?: ReactNode }) {
  return (
    <div className="min-h-screen w-full flex text-ink">
      <NavRail />
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-10 h-14 flex items-center justify-between px-6 lg:px-10 border-b border-border/70 bg-bg/70 backdrop-blur">
          <span className="inline-flex items-center gap-2 text-[13px] font-semibold text-ink-muted">
            <span className="sm:hidden font-display font-semibold text-ink">Kira ACT</span>
            <span className="hidden sm:inline">ACT Prep</span>
          </span>
          {headerRight ? <div className="flex items-center gap-2">{headerRight}</div> : <span />}
        </header>
        <main className="flex-1">
          <div className="mx-auto w-full max-w-5xl px-6 lg:px-10 py-8">{children}</div>
        </main>
      </div>
    </div>
  )
}

// The signature Kira rail — icon-only, dark violet. Nav is decorative in the
// prototype; "study" is the active surface.
function NavRail() {
  return (
    <aside className="hidden sm:flex w-16 shrink-0 flex-col items-center gap-1.5 bg-rail py-4 shadow-rail">
      <div className="mb-4 grid h-10 w-10 place-items-center rounded-2xl bg-accent text-white">
        <GraduationCap size={20} />
      </div>
      <RailIcon icon={Home} />
      <RailIcon icon={BookOpen} active />
      <RailIcon icon={Sparkles} />
      <RailIcon icon={BarChart3} />
      <RailIcon icon={PenTool} />
    </aside>
  )
}

function RailIcon({ icon: Icon, active = false }: { icon: LucideIcon; active?: boolean }) {
  return (
    <button
      aria-hidden
      tabIndex={-1}
      className={`grid h-10 w-10 place-items-center rounded-2xl transition ${
        active ? 'bg-white/15 text-white' : 'text-rail-icon hover:bg-white/10 hover:text-white'
      }`}
    >
      <Icon size={19} />
    </button>
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

// Tinted rounded-square icon chip — Kira's tool-card / activity-row icon style.
export type ChipTone = 'violet' | 'pink' | 'blue' | 'mint' | 'warn'
export function IconChip({
  icon: Icon,
  tone = 'violet',
  size = 40
}: {
  icon: LucideIcon
  tone?: ChipTone
  size?: number
}) {
  const map: Record<ChipTone, string> = {
    violet: 'bg-accent-soft text-accent',
    pink: 'bg-chip-pink text-chip-pink-ink',
    blue: 'bg-chip-blue text-chip-blue-ink',
    mint: 'bg-chip-mint text-chip-mint-ink',
    warn: 'bg-warn-soft text-warn'
  }
  return (
    <span
      className={`grid place-items-center rounded-2xl shrink-0 ${map[tone]}`}
      style={{ width: size, height: size }}
    >
      <Icon size={Math.round(size * 0.5)} />
    </span>
  )
}

// One consistent icon + tint per ACT domain — reused wherever a skill/domain is
// listed (Plan levers, Day-7 mastery rows) so the icon language stays unified.
export const DOMAIN_CHIP: Record<Domain, { icon: LucideIcon; tone: ChipTone }> = {
  English: { icon: BookOpen, tone: 'violet' },
  Math: { icon: Calculator, tone: 'blue' },
  Reading: { icon: BookText, tone: 'mint' },
  Science: { icon: FlaskConical, tone: 'pink' }
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
      className="w-full rounded-full bg-accent text-white font-semibold py-3.5 text-[15px] transition active:scale-[0.98] hover:bg-accent/90 disabled:opacity-40 disabled:active:scale-100"
    >
      {children}
    </button>
  )
}

export function GhostButton({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-full bg-transparent text-ink-muted font-medium py-2.5 text-[14px] transition active:scale-[0.98] hover:text-ink"
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
