import { useState } from 'react'
import { Zap, Check, Gauge } from 'lucide-react'
import type { DiagItem, Domain } from '../types'
import type { Onboarding, Profile } from '../lib/profile'
import { DIAG_ITEMS } from '../data/items'
import { buildProfile, warmStartDifficulty, reportConfidence } from '../lib/profile'
import { AppShell, TwoCol, Card, Meter, Pill, PrimaryButton, GhostButton } from '../components/ui'

const FLOOR = 5 // enough signal for a usable plan — first checkpoint
const CAP = 10 // hard ceiling — never out-stay the student's patience

const ALL_DOMAINS: Domain[] = ['English', 'Math', 'Reading']

// Pick the next item: cover the least-tested domain first, then the item whose
// difficulty is closest to the current adaptive target.
function pickNext(answeredIds: Set<string>, targetDiff: number): DiagItem | null {
  const remaining = DIAG_ITEMS.filter((i) => !answeredIds.has(i.id))
  if (remaining.length === 0) return null
  const perDomain: Record<Domain, number> = { English: 0, Math: 0, Reading: 0 }
  for (const i of DIAG_ITEMS) if (answeredIds.has(i.id)) perDomain[i.domain] += 1
  return [...remaining].sort((a, b) => {
    const dom = perDomain[a.domain] - perDomain[b.domain]
    if (dom !== 0) return dom
    return Math.abs(a.difficulty - targetDiff) - Math.abs(b.difficulty - targetDiff)
  })[0]
}

function domainCounts(answeredIds: Set<string>): Record<Domain, number> {
  const c: Record<Domain, number> = { English: 0, Math: 0, Reading: 0 }
  for (const i of DIAG_ITEMS) if (answeredIds.has(i.id)) c[i.domain] += 1
  return c
}

// Screen 2 — the adaptive diagnostic (key moment #1).
// Get enough profiling signal BEFORE the student loses patience. Levers, all
// visible in the right rail: a short adaptive set warm-started from their score,
// a "N more to unlock" hook, per-domain confirmation chips, and — at the floor —
// an honest checkpoint showing the accuracy tradeoff so THEY decide to go on.
export default function DiagnosticScreen({
  onb,
  onDone
}: {
  onb: Onboarding
  onDone: (p: Profile) => void
}) {
  const warm = warmStartDifficulty(onb.current)
  const [answers, setAnswers] = useState<Record<string, boolean>>({})
  const [targetDiff, setTargetDiff] = useState<number>(warm)
  const [current, setCurrent] = useState<DiagItem>(() => pickNext(new Set(), warm)!)
  const [picked, setPicked] = useState<number | null>(null)
  const [paused, setPaused] = useState(false)

  const answeredCount = Object.keys(answers).length
  const untilPlan = Math.max(0, FLOOR - answeredCount)
  const counts = domainCounts(new Set(Object.keys(answers)))

  function finish(a: Record<string, boolean>) {
    onDone(buildProfile(onb, a))
  }

  function advance(a: Record<string, boolean>, diff: number) {
    const nxt = pickNext(new Set(Object.keys(a)), diff)
    if (!nxt) return finish(a)
    setAnswers(a)
    setTargetDiff(diff)
    setCurrent(nxt)
    setPicked(null)
  }

  function select(idx: number) {
    if (picked !== null || paused) return
    setPicked(idx)
    const correct = idx === current.correct
    window.setTimeout(() => {
      const nextAnswers = { ...answers, [current.id]: correct }
      const nextDiff = Math.max(1, Math.min(3, targetDiff + (correct ? 1 : -1)))
      const n = Object.keys(nextAnswers).length
      if (n >= CAP) return finish(nextAnswers)
      if (n >= FLOOR) {
        setAnswers(nextAnswers)
        setTargetDiff(nextDiff)
        setPicked(null)
        setPaused(true)
        return
      }
      advance(nextAnswers, nextDiff)
    }, 520)
  }

  // ---- Checkpoint (2.2): show the accuracy tradeoff, let the student decide ----
  if (paused) {
    const confNow = reportConfidence(answeredCount)
    const confMax = reportConfidence(CAP)
    const more = CAP - answeredCount
    return (
      <AppShell headerRight={<Pill tone="success"><Check size={13} /> Plan ready</Pill>}>
        <div className="mx-auto max-w-xl animate-fade-up">
          <div className="flex items-center gap-2 text-success font-bold text-[15px]">
            <Check size={18} /> Enough for a solid plan
          </div>
          <h1 className="mt-3 text-[26px] font-bold text-ink leading-tight">
            You've answered {answeredCount}. I can build your plan now.
          </h1>

          <div className="mt-5 flex flex-wrap gap-2">
            {ALL_DOMAINS.map((d) => (
              <span
                key={d}
                className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[13px] font-semibold ${
                  counts[d] > 0 ? 'bg-success-soft text-success' : 'bg-surface-2 text-ink-muted'
                }`}
              >
                {counts[d] > 0 && <Check size={13} />} {d} {counts[d] > 0 ? 'read' : 'light'}
              </span>
            ))}
          </div>

          <Card className="mt-6">
            <div className="flex items-center gap-2 text-[13px] font-semibold text-ink-muted">
              <Gauge size={15} /> How dialed-in your report is
            </div>
            <div className="mt-3 space-y-3">
              <ConfRow label={`Stop now (${answeredCount} questions)`} value={confNow} tone="accent" />
              <ConfRow label={`Answer ${more} more (${CAP} total)`} value={confMax} tone="success" />
            </div>
            <p className="mt-3 text-[13px] text-ink-muted leading-relaxed">
              Either way your plan updates itself as you practice — day-1 doesn't have to be perfect.
            </p>
          </Card>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <div className="sm:flex-1">
              <PrimaryButton onClick={() => finish(answers)}>Build my plan now</PrimaryButton>
            </div>
            <div className="sm:flex-1">
              <GhostButton onClick={() => { setPaused(false); advance(answers, targetDiff) }}>
                Answer {more} more for a sharper read →
              </GhostButton>
            </div>
          </div>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell
      headerRight={
        <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-accent">
          <Zap size={14} />
          {untilPlan > 0 ? `${untilPlan} more to unlock your plan` : 'Plan ready'}
        </span>
      }
    >
      <TwoCol
        left={
          <div key={current.id} className="animate-fade-up">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[13px] font-semibold text-ink-muted">Question {answeredCount + 1}</span>
              <Pill tone="accent">{current.domain}</Pill>
            </div>
            {current.passage && (
              <Card className="text-[16px] leading-relaxed">
                <Passage text={current.passage} underline={current.underline} />
              </Card>
            )}
            <p className="mt-4 text-[16px] font-semibold text-ink">{current.prompt}</p>
            <div className="mt-4 space-y-2.5">
              {current.choices.map((c, i) => (
                <Option
                  key={c.label}
                  label={c.label}
                  text={c.text}
                  state={
                    picked === null
                      ? 'idle'
                      : i === current.correct
                        ? 'correct'
                        : i === picked
                          ? 'wrong'
                          : 'dim'
                  }
                  onClick={() => select(i)}
                />
              ))}
            </div>
          </div>
        }
        right={
          <Card>
            <div className="text-[13px] font-semibold text-ink-muted mb-2">Progress to your plan</div>
            <Meter value={(Math.min(answeredCount, FLOOR) / FLOOR) * 100} />
            <div className="mt-2 text-[12px] text-ink-muted">
              {untilPlan > 0 ? `${untilPlan} more to unlock` : 'Ready — keep going for a sharper read'}
            </div>

            <div className="mt-5 text-[13px] font-semibold text-ink-muted mb-2">Domains covered</div>
            <div className="flex flex-wrap gap-1.5">
              {ALL_DOMAINS.map((d) => (
                <span
                  key={d}
                  className={`text-[12px] font-semibold px-2.5 py-1 rounded-full ${
                    counts[d] > 0 ? 'bg-success-soft text-success' : 'bg-surface-2 text-ink-muted'
                  }`}
                >
                  {counts[d] > 0 ? '✓ ' : ''}{d}
                </span>
              ))}
            </div>

            <div className="mt-5 text-[13px] font-semibold text-ink-muted mb-1">This question</div>
            <div className="text-[13px] text-accent font-semibold">
              difficulty {'●'.repeat(current.difficulty)}{'○'.repeat(3 - current.difficulty)}
            </div>
            <p className="mt-3 text-[12px] text-ink-muted leading-relaxed">
              Questions get harder or easier based on your answers.
            </p>
          </Card>
        }
      />
    </AppShell>
  )
}

function ConfRow({ label, value, tone }: { label: string; value: number; tone: 'accent' | 'success' }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[13px] font-medium text-ink">{label}</span>
        <span className="text-[13px] font-bold tabular-nums text-ink">~{value}%</span>
      </div>
      <Meter value={value} tone={tone} />
    </div>
  )
}

function Option({
  label,
  text,
  state,
  onClick
}: {
  label: string
  text: string
  state: 'idle' | 'correct' | 'wrong' | 'dim'
  onClick: () => void
}) {
  const cls =
    state === 'correct'
      ? 'border-success bg-success-soft'
      : state === 'wrong'
        ? 'border-danger bg-danger-soft'
        : state === 'dim'
          ? 'border-border bg-surface opacity-50'
          : 'border-border bg-surface hover:border-accent/40 active:scale-[0.99]'
  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-2xl border px-4 py-3 flex items-start gap-3 shadow-card transition ${cls}`}
    >
      <span className="mt-0.5 h-6 w-6 shrink-0 rounded-full bg-surface-2 text-[13px] font-bold text-ink flex items-center justify-center">
        {label}
      </span>
      <span className="text-[15px] text-ink leading-snug">{text}</span>
    </button>
  )
}

function Passage({ text, underline }: { text: string; underline?: string }) {
  if (!underline) return <p>{text}</p>
  const idx = text.indexOf(underline)
  if (idx < 0) return <p>{text}</p>
  return (
    <p>
      {text.slice(0, idx)}
      <span className="underline decoration-accent decoration-2 underline-offset-4 font-semibold text-accent">
        {text.slice(idx, idx + underline.length)}
      </span>
      {text.slice(idx + underline.length)}
    </p>
  )
}
