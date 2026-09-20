import { useEffect, useMemo, useState } from 'react'
import { Lightbulb, Check, ChevronDown, ChevronRight, ArrowRight, ArrowLeft, TrendingUp, HelpCircle, ShieldQuestion, Timer } from 'lucide-react'
import type { DataTable, PracticeItem } from '../types'
import { PRACTICE_ITEMS } from '../data/items'
import type { Onboarding, Profile } from '../lib/profile'
import { PACE_SEC } from '../lib/profile'
import { AppShell, TwoCol, Card, PrimaryButton, Pill, Meter } from '../components/ui'

// Screen 4 — daily practice with layered AI feedback (key moment #2).
// The whole point is *when the AI talks and when it shuts up*:
//   • correct on the first try  → one short line, then quiet
//   • wrong once                → a hint that guides but does NOT reveal
//   • correct after the hint    → one transferable takeaway (student found it)
//   • wrong twice               → now the AI opens up: full rule + why
// Two refinements:
//   • mastery-aware: on a skill the student already nailed in the diagnostic, a
//     miss is treated as a slip (light nudge), not a re-teach (expertise reversal).
//   • rhetoric-aware: judgment questions get a goal-reflection prompt first, and
//     the AI stays restrained — reasoning from the passage + an uncertainty flag,
//     not a confident verdict.
// Desktop: left = the question, right = the AI coaching rail (progress, streak,
// layered feedback, nav) — feedback sits beside the question, not below it.
type Phase = 'answering' | 'hint' | 'resolved'

interface Rec {
  phase: Phase
  firstWrong: number | null
  lastPick: number | null
  correctOnFirst: boolean
  timeSec: number // seconds to first commit — the pace signal
}

export default function PracticeScreen({
  onb,
  profile,
  day,
  onDone,
  onViewReport
}: {
  onb: Onboarding
  profile: Profile
  day?: number
  onDone: () => void
  onViewReport?: () => void
}) {
  // Lead with the skill today's plan targeted, for continuity from the Plan screen.
  // Science is an optional section — only include its data-passage items if the
  // student opted into Science at onboarding (otherwise it's off their plan).
  const items = useMemo<PracticeItem[]>(() => {
    const pool = onb.takingScience
      ? PRACTICE_ITEMS
      : PRACTICE_ITEMS.filter((p) => p.domain !== 'Science')
    const focus = pool.filter((p) => p.skill === profile.focusSkill)
    const rest = pool.filter((p) => p.skill !== profile.focusSkill)
    return [...focus, ...rest]
  }, [profile.focusSkill, onb.takingScience])

  const [idx, setIdx] = useState(0)
  const [records, setRecords] = useState<Record<number, Rec>>({})
  const [streak, setStreak] = useState(0)
  const [showRule, setShowRule] = useState(false)

  const item = items[idx]
  const rec = records[idx]
  const phase: Phase = rec?.phase ?? 'answering'
  const mastered = profile.strongSkills.includes(item.skill)
  const resolvedCorrect = phase === 'resolved' && rec?.lastPick === item.correct

  // ---- Pace clock: ACT is time-pressured, so practice trains the clock too ----
  const paceTarget = PACE_SEC[item.domain]
  const [startTs, setStartTs] = useState(() => Date.now())
  const [nowTs, setNowTs] = useState(() => Date.now())

  // Reset the clock when a fresh (unanswered) question comes up.
  useEffect(() => {
    if (!records[idx]) setStartTs(Date.now())
    setNowTs(Date.now())
  }, [idx]) // eslint-disable-line react-hooks/exhaustive-deps

  // Tick only while the student is still deciding — freeze once committed.
  useEffect(() => {
    if (phase !== 'answering') return
    const t = window.setInterval(() => setNowTs(Date.now()), 500)
    return () => window.clearInterval(t)
  }, [phase, idx])

  const liveSec = phase === 'answering' ? Math.floor((nowTs - startTs) / 1000) : rec?.timeSec ?? 0
  const onPace = liveSec <= paceTarget

  function setRec(next: Rec) {
    setRecords((r) => ({ ...r, [idx]: next }))
  }

  function pick(i: number) {
    if (phase === 'resolved') return
    const correct = i === item.correct
    if (phase === 'answering') {
      // Capture time-to-first-commit — the pace signal we coach on.
      const timeSec = Math.floor((Date.now() - startTs) / 1000)
      if (correct) {
        setStreak((s) => s + 1)
        setRec({ phase: 'resolved', firstWrong: null, lastPick: i, correctOnFirst: true, timeSec })
      } else {
        setStreak(0)
        setRec({ phase: 'hint', firstWrong: i, lastPick: i, correctOnFirst: false, timeSec })
      }
    } else if (phase === 'hint') {
      if (i === rec?.firstWrong) return
      setRec({ phase: 'resolved', firstWrong: rec?.firstWrong ?? null, lastPick: i, correctOnFirst: false, timeSec: rec?.timeSec ?? 0 })
    }
  }

  function next() {
    if (idx + 1 >= items.length) return onDone()
    setIdx(idx + 1)
    setShowRule(false)
  }

  function back() {
    if (idx === 0) return
    setIdx(idx - 1)
    setShowRule(false)
  }

  function optionState(i: number): 'idle' | 'correct' | 'wrong' | 'dim' | 'disabled' {
    if (phase === 'answering') return 'idle'
    if (phase === 'hint') return i === rec?.firstWrong ? 'disabled' : 'idle'
    if (i === item.correct) return 'correct'
    if (i === rec?.lastPick) return 'wrong'
    return 'dim'
  }

  const answeredSoFar = Object.keys(records).length

  return (
    <AppShell
      headerRight={
        <span className="inline-flex items-center gap-2 text-[13px] font-semibold text-ink-muted">
          {day ? `Day ${day}` : 'Today'} · {item.domain}
        </span>
      }
    >
      <TwoCol
        left={
          <div key={item.id} className="animate-fade-up">
            {/* escape hatch back to the diagnostic report / plan — the practice
                set is built from it, so let the student re-check it anytime,
                especially before the very first question */}
            {onViewReport && (
              <button
                onClick={onViewReport}
                className="mb-3 inline-flex items-center gap-1 text-[13px] font-semibold text-ink-muted hover:text-accent active:scale-95 transition"
              >
                <ArrowLeft size={15} /> Your plan &amp; report
              </button>
            )}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[13px] font-semibold text-ink-muted">Question {idx + 1} of {items.length}</span>
              <Pill tone="accent">{item.domain}</Pill>
            </div>

            <Card className="text-[16px] leading-relaxed">
              <Passage text={item.passage} underline={item.underline} />
              {item.table && <DataTableView table={item.table} />}
            </Card>
            <p className="mt-4 text-[16px] font-semibold text-ink">{item.prompt}</p>

            <div className="mt-4 space-y-2.5">
              {item.choices.map((c, i) => (
                <Option key={c.label} label={c.label} text={c.text} state={optionState(i)} onClick={() => pick(i)} />
              ))}
            </div>
          </div>
        }
        right={
          <div className="space-y-4">
            <Card>
              <div className="text-[13px] font-semibold text-ink-muted mb-2">Progress</div>
              <Meter value={((idx + (phase === 'resolved' ? 1 : 0)) / items.length) * 100} />
              <div className="mt-2 text-[12px] text-ink-muted">
                {idx + 1} of {items.length} · focus: {item.domain}
              </div>
              {streak >= 2 && (
                <div className="mt-3">
                  <Pill tone="accent">
                    <TrendingUp size={13} /> {streak} in a row · leveling you up
                  </Pill>
                </div>
              )}
            </Card>

            {/* pace clock — trains the timing that decides test day */}
            <Card>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[13px] font-semibold text-ink-muted">
                  <Timer size={15} /> Pace
                </div>
                <span className={`text-[14px] font-bold tabular-nums ${
                  phase === 'answering'
                    ? onPace ? 'text-ink' : 'text-warn'
                    : onPace ? 'text-success' : 'text-warn'
                }`}>
                  {fmt(liveSec)} <span className="text-ink-muted font-medium">/ {fmt(paceTarget)}</span>
                </span>
              </div>
              <div className="mt-2">
                <Meter value={(liveSec / paceTarget) * 100} tone={onPace ? 'accent' : 'warn'} />
              </div>
              <p className="mt-2 text-[12px] text-ink-muted leading-relaxed">
                {phase === 'answering'
                  ? `${item.domain} runs ~${fmt(paceTarget)} per question on test day.`
                  : onPace
                    ? `On pace — ${fmt(liveSec)} vs the ~${fmt(paceTarget)} you get on test day.`
                    : `Took ${fmt(liveSec)} — over the ~${fmt(paceTarget)} test-day budget. Right answer, but this pace runs you out of time.`}
              </p>
            </Card>

            {/* AI coaching rail — restrained by default, opens up only when useful */}
            {/* rhetoric: goal-reflection prompt shown BEFORE answering */}
            {phase === 'answering' && item.kind === 'rhetoric' && item.goalQuestion && (
              <div className="rounded-2xl bg-accent-soft/60 border border-accent/20 p-4">
                <div className="flex items-center gap-2 text-accent font-bold text-[13px]">
                  <HelpCircle size={15} /> First, think it through
                </div>
                <p className="mt-1.5 text-[13px] text-ink leading-relaxed">{item.goalQuestion}</p>
              </div>
            )}

            {phase === 'answering' && !(item.kind === 'rhetoric' && item.goalQuestion) && (
              <p className="text-[13px] text-ink-muted leading-relaxed px-1">
                Pick the answer you think is best — I'll only jump in if it helps.
              </p>
            )}

            {phase === 'hint' && (
              <div className="rounded-2xl bg-warn-soft border border-warn/30 p-4 animate-pop">
                <div className="flex items-center gap-2 text-warn font-bold text-[14px]">
                  <Lightbulb size={16} /> {mastered ? 'Probably just a slip' : 'Hang on — one hint'}
                </div>
                <p className="mt-2 text-[14px] text-ink leading-relaxed">
                  {mastered ? "You've nailed this one before. Take another look — you've got it." : item.hint}
                </p>
                <p className="mt-2 text-[12px] text-ink-muted">Pick again — finding it yourself makes it stick.</p>
              </div>
            )}

            {phase === 'resolved' && resolvedCorrect && rec?.correctOnFirst && (
              <div className="rounded-2xl bg-success-soft border border-success/30 p-4 animate-pop">
                <div className="flex items-center gap-2 text-success font-bold text-[14px]">
                  <Check size={16} /> {item.confirm}
                </div>
                <button
                  onClick={() => setShowRule((v) => !v)}
                  className="mt-2 flex items-center gap-1 text-[13px] font-medium text-ink-muted"
                >
                  {showRule ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
                  Why (only if you want it)
                </button>
                {showRule && (
                  <p className="mt-1.5 text-[13px] text-ink leading-relaxed animate-fade-up">{item.takeaway}</p>
                )}
              </div>
            )}

            {phase === 'resolved' && resolvedCorrect && !rec?.correctOnFirst && (
              <div className="rounded-2xl bg-success-soft border border-success/30 p-4 animate-pop">
                <div className="flex items-center gap-2 text-success font-bold text-[14px]">
                  <Check size={16} /> Got there yourself 👏
                </div>
                <p className="mt-2 text-[14px] text-ink leading-relaxed">{item.takeaway}</p>
              </div>
            )}

            {phase === 'resolved' && !resolvedCorrect && (
              <div className="rounded-2xl bg-surface border border-border p-4 shadow-card animate-pop">
                <div className="flex items-center gap-2 text-ink font-bold text-[14px]">
                  <span className="text-accent">{item.ruleTitle}</span>
                </div>
                {/* rhetoric: lead with the AI's uncertainty flag — restrained, not a verdict */}
                {item.kind === 'rhetoric' && item.aiCaveat && (
                  <div className="mt-2 flex items-start gap-2 rounded-xl bg-warn-soft/60 px-3 py-2 text-[12px] text-ink leading-relaxed">
                    <ShieldQuestion size={14} className="mt-0.5 shrink-0 text-warn" />
                    <span>{item.aiCaveat}</span>
                  </div>
                )}
                <p className="mt-2 text-[14px] text-ink leading-relaxed">
                  {mastered ? item.takeaway : item.explanation}
                </p>
                {!mastered && (
                  <div className="mt-3 rounded-xl bg-accent-soft px-3 py-2 text-[13px] text-accent font-medium leading-relaxed">
                    💡 {item.takeaway}
                  </div>
                )}
              </div>
            )}

            {/* nav */}
            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={back}
                disabled={idx === 0}
                className="inline-flex items-center gap-1 text-[13px] font-semibold text-ink-muted disabled:opacity-30 active:scale-95 transition"
              >
                <ArrowLeft size={15} /> Back
              </button>
              <div className="flex-1">
                {phase === 'resolved' && (
                  <div className="animate-fade-up">
                    <PrimaryButton onClick={next}>
                      {idx + 1 >= items.length ? `Finish (${answeredSoFar} done)` : 'Next'}
                      <ArrowRight size={16} className="inline ml-1 -mt-0.5" />
                    </PrimaryButton>
                  </div>
                )}
              </div>
            </div>
          </div>
        }
      />
    </AppShell>
  )
}

// mm:ss for the pace clock.
function fmt(sec: number): string {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

function Option({
  label,
  text,
  state,
  onClick
}: {
  label: string
  text: string
  state: 'idle' | 'correct' | 'wrong' | 'dim' | 'disabled'
  onClick: () => void
}) {
  const cls =
    state === 'correct'
      ? 'border-success bg-success-soft'
      : state === 'wrong'
        ? 'border-danger bg-danger-soft'
        : state === 'dim'
          ? 'border-border bg-surface opacity-50'
          : state === 'disabled'
            ? 'border-danger/40 bg-danger-soft/40 opacity-60'
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

// A compact, readable data table — the "figure" a Science item reads from.
function DataTableView({ table }: { table: DataTable }) {
  return (
    <div className="mt-4 overflow-hidden rounded-2xl border border-border">
      {table.caption && (
        <div className="bg-surface-2 px-4 py-2 text-[12px] font-semibold text-ink-muted">{table.caption}</div>
      )}
      <table className="w-full text-[14px]">
        <thead>
          <tr className="bg-surface-2 text-ink-muted">
            {table.headers.map((h) => (
              <th key={h} className="px-4 py-2 text-left font-semibold">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, ri) => (
            <tr key={ri} className="border-t border-border">
              {row.map((cell, ci) => (
                <td key={ci} className="px-4 py-2 tabular-nums text-ink">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Passage({ text, underline }: { text: string; underline?: string }) {
  if (!underline) return <p>{text}</p>
  const i = text.indexOf(underline)
  if (i < 0) return <p>{text}</p>
  return (
    <p>
      {text.slice(0, i)}
      <span className="underline decoration-accent decoration-2 underline-offset-4 font-semibold text-accent">
        {text.slice(i, i + underline.length)}
      </span>
      {text.slice(i + underline.length)}
    </p>
  )
}
