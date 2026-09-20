import { useState } from 'react'
import type { ReactNode } from 'react'
import { CalendarDays, Clock, ArrowRight, Target, FlaskConical, PenLine } from 'lucide-react'
import type { Onboarding } from '../lib/profile'
import { AppShell, Card, PrimaryButton } from '../components/ui'

// Screen 1 — low-friction start. Desktop reads like a landing page: value prop
// + current→target gap on the left, the short form on the right. The gap is big
// and up front (not buried) — it's the whole reason they're here.
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
  const [takingScience, setTakingScience] = useState(initial.takingScience)
  const [takingWriting, setTakingWriting] = useState(initial.takingWriting)
  const gap = Math.max(0, target - initial.current)

  return (
    <AppShell>
      <div className="grid gap-8 lg:grid-cols-2 items-center lg:min-h-[70vh] animate-fade-up">
        {/* left — hero + the gap */}
        <div>
          <h1 className="text-[32px] lg:text-[40px] leading-tight font-display font-semibold text-ink">
            Let's find your gaps,
            <br />
            then the fastest way to close them.
          </h1>
          <p className="mt-4 text-[16px] text-ink-muted leading-relaxed max-w-md">
            No full mock test. A few adaptive questions — then a daily plan, right in your browser.
          </p>

          <div className="mt-7 rounded-3xl bg-ink text-white p-6 shadow-card max-w-md">
            <div className="flex items-center gap-2 text-[13px] text-white/70 font-medium">
              <Target size={15} /> Where you are → where you're going
            </div>
            <div className="mt-3 flex items-end gap-4">
              <div className="flex flex-col">
                <span className="text-[12px] text-white/60">now</span>
                <span className="text-[46px] leading-none font-bold tabular-nums text-white/60">{initial.current}</span>
              </div>
              <ArrowRight size={24} className="mb-2 text-white/40" />
              <div className="flex flex-col">
                <span className="text-[12px] text-accent-soft">goal</span>
                <span className="text-[46px] leading-none font-bold tabular-nums text-accent-soft">{target}</span>
              </div>
              <span className="mb-2 ml-auto text-[14px] font-semibold text-white/80">+{gap} to go</span>
            </div>
          </div>
        </div>

        {/* right — the form */}
        <Card className="lg:p-6 max-w-md w-full lg:justify-self-end">
          <h2 className="text-[16px] font-bold text-ink">Set your goal</h2>
          <p className="text-[13px] text-ink-muted mt-1">Prefilled — tweak if you want, then start.</p>
          <div className="mt-5 space-y-3">
            <Stepper
              icon={<Target size={18} />}
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

          {/* optional sections — Composite is English + Math + Reading only, so
              these are opt-in based on what the student's target colleges need */}
          <div className="mt-5">
            <div className="text-[13px] font-semibold text-ink">Optional sections</div>
            <p className="text-[12px] text-ink-muted mt-0.5">
              Only if your colleges require them. Won't change your Composite.
            </p>
            <div className="mt-3 space-y-2">
              <Toggle
                icon={<FlaskConical size={17} />}
                label="Science"
                hint="Graphs & data · separate score"
                on={takingScience}
                onToggle={() => setTakingScience((v) => !v)}
              />
              <Toggle
                icon={<PenLine size={17} />}
                label="Writing"
                hint="1 timed essay"
                on={takingWriting}
                onToggle={() => setTakingWriting((v) => !v)}
              />
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <PrimaryButton onClick={() => onStart({ ...initial, target, weeks, dailyMin, takingScience, takingWriting })}>
              Start diagnostic · ~5 min
            </PrimaryButton>
            <p className="text-center text-[12px] text-ink-muted">Bail anytime — you'll still get a plan.</p>
          </div>
        </Card>
      </div>
    </AppShell>
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
    <div className="flex items-center justify-between rounded-2xl bg-surface-2 px-4 py-3">
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
      className="h-8 w-8 rounded-full bg-surface text-ink text-[18px] leading-none font-semibold flex items-center justify-center active:scale-90 hover:bg-white transition border border-border"
    >
      {children}
    </button>
  )
}

function Toggle({
  icon,
  label,
  hint,
  on,
  onToggle
}: {
  icon: ReactNode
  label: string
  hint: string
  on: boolean
  onToggle: () => void
}) {
  return (
    <button
      onClick={onToggle}
      className={`w-full flex items-center justify-between rounded-2xl border px-4 py-3 transition text-left ${
        on ? 'border-accent bg-accent-soft' : 'border-border bg-surface-2 hover:border-accent/40'
      }`}
    >
      <div className="flex items-center gap-3">
        <span className={on ? 'text-accent' : 'text-ink-muted'}>{icon}</span>
        <div>
          <div className="text-[15px] font-medium text-ink">{label}</div>
          <div className="text-[12px] text-ink-muted">{hint}</div>
        </div>
      </div>
      <span
        className={`relative h-6 w-10 shrink-0 rounded-full transition ${on ? 'bg-accent' : 'bg-border'}`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
            on ? 'left-[18px]' : 'left-0.5'
          }`}
        />
      </span>
    </button>
  )
}
