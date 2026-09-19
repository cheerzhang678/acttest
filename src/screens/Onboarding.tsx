import { useState } from 'react'
import type { ReactNode } from 'react'
import { Sparkles, CalendarDays, Clock, ArrowRight } from 'lucide-react'
import type { Onboarding } from '../lib/profile'
import { PrimaryButton } from '../components/ui'

// Screen 1 — low-friction start. We ask only what we need, all pre-filled, so
// the student can tap "Start" in seconds. The current→target gap is shown big
// and up front (not buried in the footer) — it's the whole reason they're here.
export default function OnboardingScreen({
  initial,
  onStart
}: {
  initial: Onboarding
  onStart: (o: Onboarding) => void
}) {
  const [target, setTarget] = useState(initial.target)
  const [weeks, setWeeks] = useState(initial.weeks)
  const [dailyMin, setDailyMin] = useState(initial.dailyMin)
  const gap = Math.max(0, target - initial.current)

  return (
    <div className="flex flex-col h-full px-6 pt-6 pb-8 animate-fade-up">
      <div className="flex items-center gap-2 text-accent font-bold text-[15px]">
        <Sparkles size={18} />
        Kira ACT
      </div>

      <div className="mt-8">
        <h1 className="text-[26px] leading-tight font-bold text-ink">
          Let's find your gaps,
          <br />
          then the fastest way to close them.
        </h1>
        <p className="mt-3 text-[15px] text-ink-muted leading-relaxed">
          No full mock test. A few adaptive questions is all it takes to see where you're strong,
          where you're not, and what to drill each day.
        </p>
      </div>

      {/* 2.1 — current vs target, front and center */}
      <div className="mt-7 rounded-3xl bg-ink text-white p-5 shadow-card">
        <div className="text-[13px] text-white/70 font-medium">Where you are → where you're going</div>
        <div className="mt-2 flex items-end gap-3">
          <div className="flex flex-col">
            <span className="text-[12px] text-white/60">now</span>
            <span className="text-[40px] leading-none font-bold tabular-nums text-white/60">{initial.current}</span>
          </div>
          <ArrowRight size={22} className="mb-2 text-white/40" />
          <div className="flex flex-col">
            <span className="text-[12px] text-accent-soft">goal</span>
            <span className="text-[40px] leading-none font-bold tabular-nums text-accent-soft">{target}</span>
          </div>
          <span className="mb-1.5 ml-auto text-[13px] font-semibold text-white/80">
            +{gap} to go
          </span>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        <Stepper
          icon={<CalendarDays size={18} />}
          label="Goal score"
          value={target}
          onDec={() => setTarget((v) => Math.max(1, v - 1))}
          onInc={() => setTarget((v) => Math.min(36, v + 1))}
        />
        <Stepper
          icon={<CalendarDays size={18} />}
          label="Weeks to test"
          value={weeks}
          onDec={() => setWeeks((v) => Math.max(1, v - 1))}
          onInc={() => setWeeks((v) => Math.min(52, v + 1))}
        />
        <Stepper
          icon={<Clock size={18} />}
          label="Minutes a day"
          value={dailyMin}
          onDec={() => setDailyMin((v) => Math.max(10, v - 5))}
          onInc={() => setDailyMin((v) => Math.min(180, v + 5))}
        />
      </div>

      <div className="flex-1 min-h-4" />

      <div className="space-y-3">
        <PrimaryButton onClick={() => onStart({ ...initial, target, weeks, dailyMin })}>
          Start diagnostic · ~5 min
        </PrimaryButton>
        <p className="text-center text-[12px] text-ink-muted">Bail anytime — you'll still get a plan.</p>
      </div>
    </div>
  )
}

function Stepper({
  icon,
  label,
  value,
  onDec,
  onInc
}: {
  icon: ReactNode
  label: string
  value: number
  onDec: () => void
  onInc: () => void
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-surface border border-border px-4 py-3 shadow-card">
      <div className="flex items-center gap-3">
        <span className="text-accent">{icon}</span>
        <span className="text-[15px] font-medium text-ink">{label}</span>
      </div>
      <div className="flex items-center gap-3">
        <RoundBtn onClick={onDec}>−</RoundBtn>
        <span className="w-10 text-center text-[16px] font-bold text-ink tabular-nums">{value}</span>
        <RoundBtn onClick={onInc}>+</RoundBtn>
      </div>
    </div>
  )
}

function RoundBtn({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="h-8 w-8 rounded-full bg-surface-2 text-ink text-[18px] leading-none font-semibold flex items-center justify-center active:scale-90 transition"
    >
      {children}
    </button>
  )
}
