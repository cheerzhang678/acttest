import { useMemo, useState } from 'react'
import { Lightbulb, Check, ChevronDown, ChevronRight, ArrowRight, ArrowLeft, TrendingUp, HelpCircle, ShieldQuestion } from 'lucide-react'
import type { PracticeItem } from '../types'
import { PRACTICE_ITEMS } from '../data/items'
import type { Profile } from '../lib/profile'
import { PrimaryButton, Pill, Meter } from '../components/ui'

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
type Phase = 'answering' | 'hint' | 'resolved'

interface Rec {
  phase: Phase
  firstWrong: number | null
  lastPick: number | null
  correctOnFirst: boolean
}

export default function PracticeScreen({
  profile,
  onDone
}: {
  profile: Profile
  onDone: () => void
}) {
  // Lead with the skill today's plan targeted, for continuity from the Plan screen.
  const items = useMemo<PracticeItem[]>(() => {
    const focus = PRACTICE_ITEMS.filter((p) => p.skill === profile.focusSkill)
    const rest = PRACTICE_ITEMS.filter((p) => p.skill !== profile.focusSkill)
    return [...focus, ...rest]
  }, [profile.focusSkill])

  const [idx, setIdx] = useState(0)
  const [records, setRecords] = useState<Record<number, Rec>>({})
  const [streak, setStreak] = useState(0)
  const [showRule, setShowRule] = useState(false)

  const item = items[idx]
  const rec = records[idx]
  const phase: Phase = rec?.phase ?? 'answering'
  const mastered = profile.strongSkills.includes(item.skill)
  const resolvedCorrect = phase === 'resolved' && rec?.lastPick === item.correct

  function setRec(next: Rec) {
    setRecords((r) => ({ ...r, [idx]: next }))
  }

  function pick(i: number) {
    if (phase === 'resolved') return
    const correct = i === item.correct
    if (phase === 'answering') {
      if (correct) {
        setStreak((s) => s + 1)
        setRec({ phase: 'resolved', firstWrong: null, lastPick: i, correctOnFirst: true })
      } else {
        setStreak(0)
        setRec({ phase: 'hint', firstWrong: i, lastPick: i, correctOnFirst: false })
      }
    } else if (phase === 'hint') {
      if (i === rec?.firstWrong) return
      setRec({ phase: 'resolved', firstWrong: rec?.firstWrong ?? null, lastPick: i, correctOnFirst: false })
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
    <div className="flex flex-col h-full px-6 pt-4 pb-6">
      {/* header — 2.3: total progress bar + "Question X of Y" */}
      <div className="shrink-0">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={back}
            disabled={idx === 0}
            className="inline-flex items-center gap-1 text-[13px] font-semibold text-ink-muted disabled:opacity-30 active:scale-95 transition"
          >
            <ArrowLeft size={15} /> Back
          </button>
          <span className="text-[13px] font-semibold text-ink-muted">
            Question {idx + 1} of {items.length} · {item.domain}
          </span>
        </div>
        <Meter value={((idx + (phase === 'resolved' ? 1 : 0)) / items.length) * 100} />
      </div>

      {/* question */}
      <div key={item.id} className="flex-1 mt-5 animate-fade-up overflow-y-auto no-scrollbar">
        {streak >= 2 && phase === 'answering' && (
          <div className="mb-3">
            <Pill tone="accent">
              <TrendingUp size={13} /> {streak} in a row · leveling you up
            </Pill>
          </div>
        )}

        {/* rhetoric: goal-reflection prompt shown BEFORE answering */}
        {item.kind === 'rhetoric' && item.goalQuestion && phase === 'answering' && (
          <div className="mb-3 rounded-2xl bg-accent-soft/60 border border-accent/20 p-3.5">
            <div className="flex items-center gap-2 text-accent font-bold text-[13px]">
              <HelpCircle size={15} /> First, think it through
            </div>
            <p className="mt-1.5 text-[13px] text-ink leading-relaxed">{item.goalQuestion}</p>
          </div>
        )}

        <div className="rounded-2xl bg-surface border border-border p-4 text-[15px] leading-relaxed text-ink shadow-card">
          <Passage text={item.passage} underline={item.underline} />
        </div>
        <p className="mt-4 text-[15px] font-semibold text-ink">{item.prompt}</p>

        <div className="mt-4 space-y-2.5">
          {item.choices.map((c, i) => (
            <Option key={c.label} label={c.label} text={c.text} state={optionState(i)} onClick={() => pick(i)} />
          ))}
        </div>

        {/* feedback zone */}
        {phase === 'hint' && (
          <div className="mt-4 rounded-2xl bg-warn-soft border border-warn/30 p-4 animate-pop">
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
          <div className="mt-4 rounded-2xl bg-success-soft border border-success/30 p-4 animate-pop">
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
          <div className="mt-4 rounded-2xl bg-success-soft border border-success/30 p-4 animate-pop">
            <div className="flex items-center gap-2 text-success font-bold text-[14px]">
              <Check size={16} /> Got there yourself 👏
            </div>
            <p className="mt-2 text-[14px] text-ink leading-relaxed">{item.takeaway}</p>
          </div>
        )}

        {phase === 'resolved' && !resolvedCorrect && (
          <div className="mt-4 rounded-2xl bg-surface border border-border p-4 shadow-card animate-pop">
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
      </div>

      {/* nav */}
      {phase === 'resolved' && (
        <div className="shrink-0 pt-3 animate-fade-up">
          <PrimaryButton onClick={next}>
            {idx + 1 >= items.length ? `Finish (${answeredSoFar} done)` : 'Next'}
            <ArrowRight size={16} className="inline ml-1 -mt-0.5" />
          </PrimaryButton>
        </div>
      )}
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
            : 'border-border bg-surface active:scale-[0.99]'
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
