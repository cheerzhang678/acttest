import { TrendingUp, Target, CheckCircle2, Clock, ArrowRight, CalendarClock, RefreshCw } from 'lucide-react'
import type { Domain, Skill } from '../types'
import { SKILL_LABEL, SKILL_DOMAIN } from '../types'
import type { Onboarding, Profile } from '../lib/profile'
import { Meter, Pill, PrimaryButton } from '../components/ui'

const DOMAINS: Domain[] = ['English', 'Math', 'Reading']

// Screen 3 — the personalized plan. It answers the implicit question: "where's
// my time going, and why these things?" Everything traces to the diagnostic:
// the gap, the ranked weak skills, today's concrete minutes. An exam-day
// countdown anchors urgency; a note makes clear the profile keeps calibrating.
export default function PlanScreen({
  onb,
  profile,
  onStartPractice
}: {
  onb: Onboarding
  profile: Profile
  onStartPractice: () => void
}) {
  const gap = Math.max(0, onb.target - profile.estComposite)
  const weakest = [...DOMAINS].sort((a, b) => profile.byDomain[a].estScore - profile.byDomain[b].estScore)[0]
  const days = onb.weeks * 7

  return (
    <div className="flex flex-col h-full px-6 pt-5 pb-6 animate-fade-up">
      <div className="flex items-center justify-between">
        <h1 className="text-[22px] font-bold text-ink">Your plan's ready</h1>
        <Pill tone="warn">
          <CalendarClock size={13} /> {days} days to test
        </Pill>
      </div>
      <p className="text-[14px] text-ink-muted mt-1">
        Built from the {profile.answered} questions you just answered.
      </p>

      {/* score gap — measurement layer, kept stable on purpose */}
      <div className="mt-5 rounded-3xl bg-ink text-white p-5 shadow-card">
        <div className="flex items-center gap-2 text-[13px] text-white/70 font-medium">
          <Target size={15} /> Estimated now → goal
        </div>
        <div className="mt-2 flex items-end gap-3">
          <span className="text-[44px] leading-none font-bold tabular-nums">{profile.estComposite}</span>
          <ArrowRight size={22} className="mb-2 text-white/50" />
          <span className="text-[44px] leading-none font-bold tabular-nums text-accent-soft">{onb.target}</span>
          <span className="mb-1.5 ml-auto text-[13px] text-white/70">+{gap} to go</span>
        </div>
      </div>

      {/* living-profile note (P1#6 + Student-Atlas framing) */}
      <div className="mt-3 flex items-start gap-2 text-[12px] text-ink-muted leading-relaxed">
        <RefreshCw size={13} className="mt-0.5 shrink-0 text-accent" />
        <span>This estimate updates itself as you practice — it won't jump around, it sharpens.</span>
      </div>

      {/* domain profile */}
      <div className="mt-5">
        <h2 className="text-[15px] font-bold text-ink mb-3">Strengths & gaps</h2>
        <div className="space-y-3">
          {DOMAINS.map((d) => (
            <div key={d}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[14px] font-medium text-ink flex items-center gap-2">
                  {d}
                  {d === weakest && <Pill tone="warn">focus here</Pill>}
                </span>
                <span className="text-[13px] font-semibold text-ink-muted tabular-nums">{profile.byDomain[d].estScore}</span>
              </div>
              <Meter
                value={(profile.byDomain[d].estScore / 36) * 100}
                tone={d === weakest ? 'warn' : 'accent'}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ranked weak skills */}
      <div className="mt-6">
        <h2 className="text-[15px] font-bold text-ink mb-3">Your 3 biggest levers</h2>
        <div className="space-y-2">
          {profile.weakSkills.map((sk, i) => (
            <WeakRow key={sk} skill={sk} estGain={gainFor(i, gap)} />
          ))}
        </div>
      </div>

      {/* today's minutes */}
      <div className="mt-6 rounded-3xl bg-accent-soft p-5">
        <div className="flex items-center gap-2 text-accent font-bold text-[15px]">
          <Clock size={17} /> Today · {onb.dailyMin} min
        </div>
        <ul className="mt-3 space-y-2.5">
          <TodoLine minutes={Math.round(onb.dailyMin * 0.6)} text={`${SKILL_LABEL[profile.focusSkill]} — drills + AI coaching`} lead />
          <TodoLine minutes={Math.round(onb.dailyMin * 0.25)} text="Mixed review of yesterday's misses" />
          <TodoLine minutes={onb.dailyMin - Math.round(onb.dailyMin * 0.6) - Math.round(onb.dailyMin * 0.25)} text="Timed mini-set to check your pace" />
        </ul>
      </div>

      <div className="flex-1 min-h-4" />

      <PrimaryButton onClick={onStartPractice}>
        Start today · {SKILL_LABEL[profile.focusSkill]}
      </PrimaryButton>
    </div>
  )
}

function WeakRow({ skill, estGain }: { skill: Skill; estGain: number }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-surface border border-border px-4 py-3 shadow-card">
      <div className="flex items-center gap-3">
        <TrendingUp size={17} className="text-accent" />
        <div>
          <div className="text-[14px] font-semibold text-ink">{SKILL_LABEL[skill]}</div>
          <div className="text-[12px] text-ink-muted">{SKILL_DOMAIN[skill]}</div>
        </div>
      </div>
      <Pill tone="success">~+{estGain} pts</Pill>
    </div>
  )
}

function TodoLine({ minutes, text, lead }: { minutes: number; text: string; lead?: boolean }) {
  return (
    <li className="flex items-start gap-2.5">
      <CheckCircle2 size={17} className={lead ? 'text-accent mt-0.5' : 'text-ink-muted/50 mt-0.5'} />
      <span className="text-[14px] text-ink leading-snug">
        <span className="font-semibold tabular-nums">{minutes}′</span> · {text}
      </span>
    </li>
  )
}

// Distribute the score gap across the top weak skills — biggest lever first.
function gainFor(rank: number, gap: number): number {
  const weights = [0.5, 0.3, 0.2]
  return Math.max(1, Math.round(gap * (weights[rank] ?? 0.2)))
}
