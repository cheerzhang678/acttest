import type { ReactNode } from 'react'
import { Signal, Wifi, BatteryFull } from 'lucide-react'

// A centered iPhone-style frame so the mobile-first prototype reads as an app
// on desktop too. On small screens it fills the viewport.
export function PhoneShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-0 sm:p-6">
      <div className="relative w-full sm:w-[402px] h-[100dvh] sm:h-[844px] bg-bg sm:rounded-[44px] sm:shadow-phone overflow-hidden sm:border-[10px] sm:border-black flex flex-col">
        <StatusBar />
        <div className="flex-1 overflow-y-auto no-scrollbar">{children}</div>
      </div>
    </div>
  )
}

function StatusBar() {
  return (
    <div className="flex items-center justify-between px-6 pt-3 pb-1 text-ink text-[13px] font-semibold shrink-0 bg-bg">
      <span>9:41</span>
      <div className="flex items-center gap-1.5">
        <Signal size={15} strokeWidth={2.5} />
        <Wifi size={15} strokeWidth={2.5} />
        <BatteryFull size={18} strokeWidth={2} />
      </div>
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
      className="w-full rounded-2xl bg-accent text-white font-semibold py-3.5 text-[15px] transition active:scale-[0.98] disabled:opacity-40 disabled:active:scale-100"
    >
      {children}
    </button>
  )
}

export function GhostButton({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-2xl bg-transparent text-ink-muted font-medium py-2.5 text-[14px] transition active:scale-[0.98]"
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
